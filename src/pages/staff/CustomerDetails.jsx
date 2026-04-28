import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useParams } from "react-router-dom";

export default function CustomerDetails() {
  const { id } = useParams(); {
  const [customer, setCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [activeTab, setActiveTab] = useState("vehicles");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const [newPlate, setNewPlate] = useState("");
  const [newMake, setNewMake] = useState("");
  const [newYear, setNewYear] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/customers/${id}`)
      .then((res) => {
        setCustomer(res.data);
        setVehicles(res.data.vehicles ?? []);
        setInvoices(res.data.invoices ?? []);
      })
      .catch(() => setError("Failed to load customer data."))
      .finally(() => setLoading(false));
  }, [id]);

  function getInitials(name) {
    return name?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) ?? "?";
  }

  function totalSpent() {
    return invoices.reduce((sum, i) => sum + i.totalAmount, 0).toLocaleString();
  }

  function saveEdit() {
    axios
      .put(`/customers/${id}`, { name: editName, phone: editPhone })
      .then(() => {
        setCustomer((prev) => ({ ...prev, name: editName, phone: editPhone }));
        setEditMode(false);
      })
      .catch(() => alert("Failed to update customer."));
  }

  function addVehicle() {
    if (!newPlate || !newMake) return;
    axios
      .post(`/customers/${id}/vehicles`, {
        vehicleNumber: newPlate,
        make: newMake,
        year: parseInt(newYear) || new Date().getFullYear(),
      })
      .then((res) => {
        setVehicles((prev) => [...prev, res.data]);
        setNewPlate("");
        setNewMake("");
        setNewYear("");
        setActiveTab("vehicles");
      })
      .catch(() => alert("Failed to add vehicle."));
  }

  function removeVehicle(vehicleId) {
    axios
      .delete(`/vehicles/${vehicleId}`)
      .then(() => setVehicles((prev) => prev.filter((v) => v.id !== vehicleId)))
      .catch(() => alert("Failed to remove vehicle."));
  }

  if (loading) return <p style={styles.empty}>Loading...</p>;
  if (error) return <p style={{ ...styles.empty, color: "var(--color-text-danger)" }}>{error}</p>;
  if (!customer) return null;

  return (
    <div style={styles.wrapper}>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.avatar}>{getInitials(customer.name)}</div>
        <div style={{ flex: 1 }}>
          <p style={styles.custName}>{customer.name}</p>
          <p style={styles.custPhone}>{customer.phone}</p>
        </div>
        <span style={styles.badgeGreen}>Active</span>
        <button style={styles.tabBtn} onClick={() => { setEditName(customer.name); setEditPhone(customer.phone); setEditMode(true); }}>
          Edit
        </button>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}><p style={styles.statLabel}>Vehicles</p><p style={styles.statValue}>{vehicles.length}</p></div>
        <div style={styles.statCard}><p style={styles.statLabel}>Invoices</p><p style={styles.statValue}>{invoices.length}</p></div>
        <div style={styles.statCard}><p style={styles.statLabel}>Total spent</p><p style={styles.statValue}>${totalSpent()}</p></div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {["vehicles", "invoices", "add"].map((tab) => (
          <button
            key={tab}
            style={{ ...styles.tabBtn, ...(activeTab === tab ? styles.tabActive : {}) }}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "add" ? "+ Add Vehicle" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Vehicles Tab */}
      {activeTab === "vehicles" && (
        <div style={styles.card}>
          {vehicles.length === 0 ? (
            <p style={styles.empty}>No vehicles registered.</p>
          ) : (
            vehicles.map((v) => (
              <div key={v.id} style={styles.itemRow}>
                <div>
                  <span style={styles.itemTitle}>{v.vehicleNumber}</span>
                  <span style={styles.itemSub}> · {v.make} · {v.year}</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={styles.badgeBlue}>Vehicle</span>
                  <button style={styles.dangerBtn} onClick={() => removeVehicle(v.id)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === "invoices" && (
        <div style={styles.card}>
          {invoices.length === 0 ? (
            <p style={styles.empty}>No invoices found.</p>
          ) : (
            invoices.map((i) => (
              <div key={i.id} style={styles.itemRow}>
                <div>
                  <span style={styles.itemTitle}>Invoice #{i.id}</span>
                  <span style={styles.itemSub}> · {i.date}</span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={i.status === "Paid" ? styles.badgeGreen : styles.badgeAmber}>{i.status}</span>
                  <span style={styles.itemTitle}>${i.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Vehicle Tab */}
      {activeTab === "add" && (
        <div style={styles.card}>
          <p style={styles.sectionTitle}>Add vehicle</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <input style={styles.input} placeholder="Plate number" value={newPlate} onChange={(e) => setNewPlate(e.target.value)} />
            <input style={styles.input} placeholder="Make & model" value={newMake} onChange={(e) => setNewMake(e.target.value)} />
          </div>
          <input style={{ ...styles.input, marginBottom: 12 }} placeholder="Year" value={newYear} onChange={(e) => setNewYear(e.target.value)} />
          <button style={styles.primaryBtn} onClick={addVehicle}>Add vehicle</button>
        </div>
      )}

      {/* Edit Modal */}
      {editMode && (
        <div style={styles.card}>
          <p style={styles.sectionTitle}>Edit customer</p>
          <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
            <input style={styles.input} value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Full name" />
            <input style={styles.input} value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="Phone number" />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={styles.primaryBtn} onClick={saveEdit}>Save</button>
            <button style={styles.tabBtn} onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: { padding: "1rem 0", fontFamily: "sans-serif" },
  header: { display: "flex", gap: 12, alignItems: "center", marginBottom: "1.5rem" },
  avatar: { width: 48, height: 48, borderRadius: "50%", background: "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500, fontSize: 15, color: "#0C447C", flexShrink: 0 },
  custName: { margin: 0, fontSize: 18, fontWeight: 500 },
  custPhone: { margin: "2px 0 0", fontSize: 13, color: "#888" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: "1.5rem" },
  statCard: { background: "#f5f5f5", borderRadius: 8, padding: "12px 16px", textAlign: "center" },
  statLabel: { fontSize: 12, color: "#888", margin: "0 0 4px" },
  statValue: { fontSize: 22, fontWeight: 500, margin: 0 },
  tabs: { display: "flex", gap: 8, marginBottom: "1.25rem" },
  tabBtn: { padding: "6px 16px", fontSize: 14, border: "0.5px solid #ccc", background: "transparent", borderRadius: 8, cursor: "pointer", color: "#555" },
  tabActive: { background: "#E6F1FB", color: "#0C447C", borderColor: "transparent" },
  card: { background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "1rem" },
  itemRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "0.5px solid #eee" },
  itemTitle: { fontWeight: 500, fontSize: 14 },
  itemSub: { color: "#888", fontSize: 13 },
  sectionTitle: { fontSize: 13, fontWeight: 500, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 10px" },
  input: { fontSize: 14, padding: "7px 12px", border: "0.5px solid #ccc", borderRadius: 8, width: "100%", boxSizing: "border-box" },
  primaryBtn: { background: "#E6F1FB", color: "#0C447C", border: "none", padding: "8px 20px", borderRadius: 8, fontSize: 14, cursor: "pointer", fontWeight: 500 },
  dangerBtn: { background: "#FCEBEB", color: "#A32D2D", border: "none", padding: "6px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer" },
  badgeBlue: { display: "inline-block", fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 99, background: "#E6F1FB", color: "#0C447C" },
  badgeGreen: { display: "inline-block", fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 99, background: "#EAF3DE", color: "#27500A" },
  badgeAmber: { display: "inline-block", fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 99, background: "#FAEEDA", color: "#633806" },
  empty: { color: "#888", fontSize: 14, textAlign: "center", padding: "1.5rem 0" },
};
}