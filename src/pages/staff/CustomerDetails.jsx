import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";

const styles = {
  wrapper: { padding: "0.5rem 0 2rem", fontFamily: "sans-serif" },

  // Header
  pageHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" },
  title: { margin: 0, fontSize: 22, fontWeight: 500 },
  subtitle: { margin: "4px 0 0", fontSize: 14, color: "#888" },

  // Customer card
  customerCard: { background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 12, padding: "1.25rem 1.5rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: 14 },
  avatar: { width: 52, height: 52, borderRadius: "50%", background: "#0f1b2d", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 16, color: "#14b89a", flexShrink: 0 },
  custName: { margin: 0, fontSize: 16, fontWeight: 500 },
  custPhone: { margin: "3px 0 0", fontSize: 13, color: "#888" },
  headerActions: { display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" },

  // Stats
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: "1.5rem" },
  statCard: { background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 12, padding: "1rem 1.25rem", textAlign: "center" },
  statLabel: { fontSize: 11, fontWeight: 500, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px" },
  statValue: { fontSize: 24, fontWeight: 500, margin: 0, color: "#0f1b2d" },

  // Tabs
  tabs: { display: "flex", gap: 6, marginBottom: "1.25rem" },
  tabBtn: { padding: "7px 16px", fontSize: 14, border: "0.5px solid #ddd", background: "#fff", borderRadius: 8, cursor: "pointer", color: "#666", fontWeight: 400 },
  tabActive: { background: "#14b89a", color: "#fff", borderColor: "transparent", fontWeight: 500 },

  // Card + rows
  card: { background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "1rem" },
  itemRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "0.5px solid #f0f0f0" },
  itemTitle: { fontWeight: 500, fontSize: 14 },
  itemSub: { color: "#888", fontSize: 13 },
  sectionTitle: { fontSize: 11, fontWeight: 500, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 12px" },

  // Inputs & buttons
  input: { fontSize: 14, padding: "8px 12px", border: "0.5px solid #ddd", borderRadius: 8, width: "100%", boxSizing: "border-box", outline: "none" },
  primaryBtn: { background: "#14b89a", color: "#fff", border: "none", padding: "8px 20px", borderRadius: 8, fontSize: 14, cursor: "pointer", fontWeight: 500 },
  secondaryBtn: { background: "#fff", color: "#444", border: "0.5px solid #ddd", padding: "7px 16px", borderRadius: 8, fontSize: 14, cursor: "pointer" },
  editBtn: { background: "#f5f5f5", color: "#333", border: "0.5px solid #ddd", padding: "6px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer" },
  dangerBtn: { background: "#FCEBEB", color: "#A32D2D", border: "none", padding: "6px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer" },

  // Badges
  badgeBlue: { display: "inline-block", fontSize: 11, fontWeight: 500, padding: "2px 10px", borderRadius: 99, background: "#E6F1FB", color: "#0C447C" },
  badgeGreen: { display: "inline-block", fontSize: 11, fontWeight: 500, padding: "2px 10px", borderRadius: 99, background: "#EAF3DE", color: "#27500A" },
  badgeAmber: { display: "inline-block", fontSize: 11, fontWeight: 500, padding: "2px 10px", borderRadius: 99, background: "#FAEEDA", color: "#633806" },
  badgeTeal: { display: "inline-block", fontSize: 11, fontWeight: 500, padding: "2px 10px", borderRadius: 99, background: "#d0f5ee", color: "#0a6b56" },

  empty: { color: "#aaa", fontSize: 14, textAlign: "center", padding: "2rem 0" },
};

export default function CustomerDetails() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [sendingInvoiceId, setSendingInvoiceId] = useState(null);
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
    return invoices.reduce((sum, i) => sum + (i.totalAmount || 0), 0).toLocaleString();
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

  function sendInvoice(invoiceId) {
    if (!invoiceId) return;
    setSendingInvoiceId(invoiceId);
    axios
      .post(`/invoices/${invoiceId}/send`)
      .then(() => alert("Invoice sent to customer email."))
      .catch(() => alert("Failed to send invoice. Ensure backend/mail service is running."))
      .finally(() => setSendingInvoiceId(null));
  }

  if (loading) return <p className="text-gray-500 text-sm text-center py-6">Loading...</p>;
  if (error) return <p className="text-red-600 text-sm text-center py-6">{error}</p>;
  if (!customer) return null;

  return (
    <div style={styles.wrapper}>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Customer Details</h1>
          <p style={styles.subtitle}>View and manage customer information.</p>
        </div>
      </div>

      <div style={styles.customerCard}>
        <div style={styles.avatar}>{getInitials(customer.name)}</div>
        <div style={{ flex: 1 }}>
          <p style={styles.custName}>{customer.name}</p>
          <p style={styles.custPhone}>{customer.phone}</p>
        </div>
        <div style={styles.headerActions}>
          <span style={styles.badgeGreen}>Active</span>
          <button style={styles.editBtn} onClick={() => { setEditName(customer.name); setEditPhone(customer.phone); setEditMode(true); }}>Edit</button>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Vehicles</p>
          <p style={styles.statValue}>{vehicles.length}</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Invoices</p>
          <p style={styles.statValue}>{invoices.length}</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total spent</p>
          <p style={styles.statValue}>Rs. {totalSpent()}</p>
        </div>
      </div>

      <div style={styles.tabs}>
        {['vehicles', 'invoices', 'add'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ ...styles.tabBtn, ...(activeTab === tab ? styles.tabActive : {}) }}
          >
            {tab === 'add' ? '+ Add Vehicle' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'vehicles' && (
        <div style={styles.card}>
          {vehicles.length === 0 ? (
            <p style={styles.empty}>No vehicles registered.</p>
          ) : (
            vehicles.map((v) => (
              <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '0.5px solid #f0f0f0' }}>
                <div>
                  <div style={styles.itemTitle}>{v.vehicleNumber}</div>
                  <div style={styles.itemSub}>{v.make} · {v.year}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={styles.badgeTeal}>Vehicle</span>
                  <button style={styles.dangerBtn} onClick={() => removeVehicle(v.id)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'invoices' && (
        <div style={styles.card}>
          {invoices.length === 0 ? (
            <p style={styles.empty}>No invoices found.</p>
          ) : (
            invoices.map((i) => (
              <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '0.5px solid #f0f0f0' }}>
                <div>
                  <div style={styles.itemTitle}>Invoice #{i.id}</div>
                  <div style={styles.itemSub}>{i.date}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={i.status === 'Paid' ? styles.badgeGreen : styles.badgeAmber}>{i.status}</span>
                  <div style={styles.itemTitle}>Rs. {i.totalAmount?.toLocaleString()}</div>
                  <button
                    style={styles.primaryBtn}
                    onClick={() => sendInvoice(i.id)}
                    disabled={sendingInvoiceId === i.id}
                  >
                    {sendingInvoiceId === i.id ? 'Sending...' : 'Send Email'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'add' && (
        <div style={styles.card}>
          <p style={styles.sectionTitle}>Add vehicle</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
            <input style={styles.input} placeholder="Plate number" value={newPlate} onChange={(e) => setNewPlate(e.target.value)} />
            <input style={styles.input} placeholder="Make & model" value={newMake} onChange={(e) => setNewMake(e.target.value)} />
          </div>
          <input style={{ ...styles.input, marginBottom: 14 }} placeholder="Year" value={newYear} onChange={(e) => setNewYear(e.target.value)} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={styles.primaryBtn} onClick={addVehicle}>Add vehicle</button>
            <button style={styles.secondaryBtn} onClick={() => setActiveTab('vehicles')}>Cancel</button>
          </div>
        </div>
      )}

      {editMode && (
        <div style={styles.card}>
          <p style={styles.sectionTitle}>Edit customer</p>
          <div style={{ display: 'grid', gap: 10, marginBottom: 14 }}>
            <input style={styles.input} value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Full name" />
            <input style={styles.input} value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="Phone number" />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={styles.primaryBtn} onClick={saveEdit}>Save</button>
            <button style={styles.secondaryBtn} onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
