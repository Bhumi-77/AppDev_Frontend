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

  // Load all vendors on page load
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
      <div style={styles.contentPadding}>
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.title}>Vendor Management</h1>
            <p style={styles.subtitle}>Add new vendors, update supplier details, and manage records.</p>
          </div>
        </div>

        {/* Error message */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Form to add vendor */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            {editingVendor ? "Edit Vendor" : "Add Vendor"}
          </h3>
          <p style={styles.cardSubtitle}>Register/Update supplier</p>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Vendor Name *</label>
                <input
                  style={styles.input}
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Vendor name"
                  required
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
              <div style={styles.formGroup}>
                <label style={styles.label}>Contact Person *</label>
                <input
                  style={styles.input}
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  placeholder="Person Name"
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
                  placeholder="98********"
                />
              </div>
            </div>
            <div style={styles.formActions}>
              <button type="submit" style={styles.submitBtn}>
                {editingVendor ? "Update Vendor" : "Add Vendor"}
              </button>
              {editingVendor && (
                <button type="button" style={styles.cancelBtn} onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table */}
        <div style={styles.card}>
          <div style={styles.tableHeader}>
            <h3 style={styles.cardTitle}>Vendor List</h3>
            <span style={styles.badge}>{vendors.length} Vendors</span>
          </div>

          {loading ? (
            <p style={styles.loadingText}>Synchronizing data...</p>
          ) : vendors.length === 0 ? (
            <div style={styles.emptyBox}>
              <p>No vendors found. Add your first vendor!</p>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHead}>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Company Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Contact Person</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((vendor) => (
                    <tr key={vendor.id} style={styles.tr}>
                      <td style={styles.td}>#{vendor.id}</td>
                      <td style={styles.tdBold}>{vendor.name}</td>
                      <td style={styles.td}>{vendor.email}</td>
                      <td style={styles.td}>{vendor.contactPerson}</td>
                      <td style={styles.td}>
                        <span style={styles.statusActive}>Active</span>
                      </td>
                      <td style={styles.td}>
                        <button
                          style={styles.editLink}
                          onClick={() => handleEdit(vendor)}
                        >
                          Edit
                        </button>
                        <button
                          style={styles.deleteLink}
                          onClick={() => handleDelete(vendor.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
  );
}

const styles = {
  contentPadding: {
    padding: "10px",
  },
  pageHeader: {
    marginBottom: "30px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#111827",
    margin: 0,
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "14px",
    marginTop: "4px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    marginBottom: "30px",
    border: "1px solid #e5e7eb",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 4px 0",
  },
  cardSubtitle: {
    fontSize: "13px",
    color: "#6b7280",
    margin: "0 0 20px 0",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
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
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    backgroundColor: "#f9fafb",
    outline: "none",
  },
  formActions: {
    marginTop: "20px",
    display: "flex",
    gap: "10px",
  },
  submitBtn: {
    backgroundColor: "#14b8a6",
    color: "#fff",
    border: "none",
    padding: "10px 24px",
    borderRadius: "8px",
    fontWeight: "700",
    cursor: "pointer",
  },
  cancelBtn: {
    backgroundColor: "#f3f4f6",
    color: "#4b5563",
    border: "1px solid #d1d5db",
    padding: "10px 24px",
    borderRadius: "8px",
    fontWeight: "700",
    cursor: "pointer",
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  badge: {
    backgroundColor: "#f0fdfa",
    color: "#0d9488",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    border: "1px solid #ccfbf1",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHead: {
    borderBottom: "2px solid #f3f4f6",
  },
  th: {
    textAlign: "left",
    padding: "12px 0",
    fontSize: "13px",
    fontWeight: "600",
    color: "#6b7280",
  },
  tr: {
    borderBottom: "1px solid #f3f4f6",
  },
  td: {
    padding: "16px 0",
    fontSize: "14px",
    color: "#374151",
  },
  tdBold: {
    padding: "16px 0",
    fontSize: "14px",
    fontWeight: "700",
    color: "#111827",
  },
  statusActive: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
  },
  editLink: {
    background: "none",
    border: "none",
    color: "#14b8a6",
    fontWeight: "600",
    cursor: "pointer",
    marginRight: "12px",
  },
  deleteLink: {
    background: "none",
    border: "none",
    color: "#ef4444",
    fontWeight: "600",
    cursor: "pointer",
  },
  errorBox: {
    padding: "15px",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  loadingText: {
    textAlign: "center",
    color: "#64748b",
    fontSize: "16px",
    padding: "40px",
  },
  emptyBox: {
    textAlign: "center",
    color: "#94a3b8",
    padding: "40px",
  },
};