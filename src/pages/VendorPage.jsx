import { useEffect, useState } from "react";
import {
  getAllVendors,
  createVendor,
  updateVendor,
  deleteVendor,
} from "../api/vendorApi";

export default function VendorPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await getAllVendors();
      setVendors(res.data.data || []);
    } catch (err) {
      setError("Failed to load vendors. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ name: "", contactPerson: "", phone: "", email: "", address: "" });
    setEditingVendor(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVendor) {
        await updateVendor(editingVendor.id, formData);
        alert("Vendor updated successfully!");
      } else {
        await createVendor(formData);
        alert("Vendor created successfully!");
      }
      resetForm();
      fetchVendors();
    } catch (err) {
      alert("Something went wrong. Check the console.");
      console.error(err);
    }
  };

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      contactPerson: vendor.contactPerson,
      phone: vendor.phone,
      email: vendor.email,
      address: vendor.address,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;
    try {
      await deleteVendor(id);
      alert("Vendor deleted successfully!");
      fetchVendors();
    } catch (err) {
      alert("Failed to delete vendor.");
    }
  };

  return (
    <div style={styles.pageBackground}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Vendor Management</h1>
            <p style={styles.subtitle}>Manage your vehicle parts suppliers and contacts</p>
          </div>
          <button
            style={styles.addBtn}
            onClick={() => { resetForm(); setShowForm(true); }}
          >
            + Add New Vendor
          </button>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        {showForm && (
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>
                {editingVendor ? "Edit Vendor Details" : "Register New Vendor"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} style={styles.formPadding}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Vendor Name</label>
                  <input
                    style={styles.input}
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="AutoParts Nepal"
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Primary Contact</label>
                  <input
                    style={styles.input}
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    placeholder="Contact person name"
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone Number</label>
                  <input
                    style={styles.input}
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+977-XXXXXXXXXX"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input
                    style={styles.input}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="vendor@company.com"
                  />
                </div>
                <div style={{ ...styles.formGroup, gridColumn: "1 / -1" }}>
                  <label style={styles.label}>Business Address</label>
                  <input
                    style={styles.input}
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Full street address"
                  />
                </div>
              </div>
              <div style={styles.formActions}>
                <button type="submit" style={styles.saveBtn}>
                  {editingVendor ? "Save Changes" : "Create Vendor"}
                </button>
                <button type="button" style={styles.cancelBtn} onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={styles.tableCard}>
          {loading ? (
            <p style={styles.loadingText}>Synchronizing data...</p>
          ) : vendors.length === 0 ? (
            <div style={styles.emptyBox}>
              <p>Your supplier list is empty.</p>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHead}>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Company Name</th>
                    <th style={styles.th}>Contact Person</th>
                    <th style={styles.th}>Contact Info</th>
                    <th style={styles.th}>Address</th>
                    <th style={styles.thAction}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((vendor, index) => (
                    <tr key={vendor.id} style={styles.tableRow}>
                      <td style={styles.tdId}>#{vendor.id}</td>
                      <td style={styles.tdName}>{vendor.name}</td>
                      <td style={styles.td}>{vendor.contactPerson}</td>
                      <td style={styles.td}>
                        <div style={styles.contactCell}>
                          <span style={styles.phoneText}>{vendor.phone}</span>
                          <span style={styles.emailText}>{vendor.email}</span>
                        </div>
                      </td>
                      <td style={styles.td}>{vendor.address}</td>
                      <td style={styles.td}>
                        <div style={styles.btnGroup}>
                          <button
                            style={styles.editBtn}
                            onClick={() => handleEdit(vendor)}
                          >
                            Edit
                          </button>
                          <button
                            style={styles.deleteBtn}
                            onClick={() => handleDelete(vendor.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageBackground: {
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    width: "100%",
  },
  container: {
    maxWidth: "1250px",
    margin: "0 auto",
    padding: "40px 20px",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "32px",
  },
  title: {
    fontSize: "30px",
    fontWeight: "800",
    color: "#0f172a",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  subtitle: {
    color: "#64748b",
    marginTop: "4px",
    fontSize: "15px",
  },
  addBtn: {
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "10px",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: "600",
    boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.2)",
    transition: "transform 0.2s",
  },
  errorBox: {
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #fecaca",
    marginBottom: "20px",
    fontSize: "14px",
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    marginBottom: "32px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },
  formHeader: {
    padding: "20px 24px",
    borderBottom: "1px solid #f1f5f9",
    backgroundColor: "#fcfcfd",
  },
  formTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#334155",
    margin: 0,
  },
  formPadding: {
    padding: "24px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#475569",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  input: {
    padding: "12px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    color: "#1e293b",
    backgroundColor: "#f8fafc",
    transition: "border-color 0.2s",
  },
  formActions: {
    display: "flex",
    gap: "12px",
    marginTop: "28px",
    paddingTop: "20px",
    borderTop: "1px solid #f1f5f9",
  },
  saveBtn: {
    backgroundColor: "#10b981",
    color: "#fff",
    border: "none",
    padding: "12px 28px",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: "600",
  },
  cancelBtn: {
    backgroundColor: "transparent",
    color: "#64748b",
    border: "1px solid #e2e8f0",
    padding: "12px 28px",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: "600",
  },
  tableCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  tableHead: {
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
  },
  th: {
    padding: "16px 24px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
  },
  thAction: {
    padding: "16px 24px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    textAlign: "right",
  },
  tableRow: {
    borderBottom: "1px solid #f1f5f9",
  },
  tdId: {
    padding: "20px 24px",
    fontSize: "13px",
    color: "#94a3b8",
    fontWeight: "500",
  },
  tdName: {
    padding: "20px 24px",
    fontSize: "15px",
    color: "#0f172a",
    fontWeight: "700",
  },
  td: {
    padding: "20px 24px",
    fontSize: "14px",
    color: "#475569",
  },
  contactCell: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  phoneText: {
    fontWeight: "600",
    color: "#334155",
  },
  emailText: {
    fontSize: "12px",
    color: "#94a3b8",
  },
  btnGroup: {
    display: "flex",
    gap: "8px",
    justifyContent: "flex-end",
  },
  editBtn: {
    backgroundColor: "#fffbeb",
    color: "#d97706",
    border: "1px solid #fde68a",
    padding: "6px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
  },
  deleteBtn: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    padding: "6px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
  },
  loadingText: {
    textAlign: "center",
    color: "#64748b",
    padding: "60px",
    fontSize: "15px",
  },
  emptyBox: {
    textAlign: "center",
    color: "#94a3b8",
    padding: "80px",
  },
};