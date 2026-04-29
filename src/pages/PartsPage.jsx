import { useEffect, useState } from "react";
import {
  getAllParts,
  createPart,
  updatePart,
  deletePart,
  getLowStockParts,
} from "../api/partApi";
import { getAllVendors } from "../api/vendorApi";

export default function PartsPage() {
  const [parts, setParts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [showLowStock, setShowLowStock] = useState(false);
  const [lowStockParts, setLowStockParts] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    sellingPrice: "",
    costPrice: "",
    stockQuantity: "",
    lowStockThreshold: 10,
    vendorId: "",
  });

  useEffect(() => {
    fetchParts();
    fetchVendors();
  }, []);

  const fetchParts = async () => {
    try {
      setLoading(true);
      const res = await getAllParts();
      setParts(res.data.data || []);
    } catch (err) {
      setError("Failed to load parts. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    try {
      const res = await getAllVendors();
      setVendors(res.data.data || []);
    } catch (err) {
      console.error("Could not load vendors for dropdown");
    }
  };

  const fetchLowStock = async () => {
    try {
      const res = await getLowStockParts();
      setLowStockParts(res.data.data || []);
      setShowLowStock(true);
    } catch (err) {
      alert("Failed to load low stock parts.");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      sellingPrice: "",
      costPrice: "",
      stockQuantity: "",
      lowStockThreshold: 10,
      vendorId: "",
    });
    setEditingPart(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      sellingPrice: parseFloat(formData.sellingPrice),
      costPrice: parseFloat(formData.costPrice),
      stockQuantity: parseInt(formData.stockQuantity),
      lowStockThreshold: parseInt(formData.lowStockThreshold),
      vendorId: parseInt(formData.vendorId),
    };
    try {
      if (editingPart) {
        await updatePart(editingPart.id, payload);
        alert("Part updated successfully!");
      } else {
        await createPart(payload);
        alert("Part created successfully!");
      }
      resetForm();
      fetchParts();
    } catch (err) {
      alert("Something went wrong. Check the console.");
      console.error(err);
    }
  };

  const handleEdit = (part) => {
    setEditingPart(part);
    setFormData({
      name: part.name,
      category: part.category,
      description: part.description,
      sellingPrice: part.sellingPrice,
      costPrice: part.costPrice,
      stockQuantity: part.stockQuantity,
      lowStockThreshold: part.lowStockThreshold,
      vendorId: part.vendorId,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this part?")) return;
    try {
      await deletePart(id);
      alert("Part deleted successfully!");
      fetchParts();
    } catch (err) {
      alert("Failed to delete part.");
    }
  };

  const getStockBadge = (qty, threshold) => {
    if (qty < threshold) return { label: "Low Stock", color: "#dc2626", bg: "#fef2f2", border: "#fecaca" };
    if (qty < threshold * 2) return { label: "Limited", color: "#d97706", bg: "#fffbeb", border: "#fde68a" };
    return { label: "In Stock", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" };
  };

  return (
    <div style={styles.pageBackground}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Parts Management</h1>
            <p style={styles.subtitle}>Manage vehicle parts inventory and stock levels</p>
          </div>
          <div style={styles.headerBtns}>
            <button style={styles.lowStockBtn} onClick={fetchLowStock}>
              ⚠ Low Stock Alert
            </button>
            <button
              style={styles.addBtn}
              onClick={() => { resetForm(); setShowForm(true); }}
            >
              + Add New Part
            </button>
          </div>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Low Stock Panel */}
        {showLowStock && (
          <div style={styles.lowStockPanel}>
            <div style={styles.lowStockPanelHeader}>
              <h3 style={styles.lowStockPanelTitle}>
                ⚠ Low Stock Parts ({lowStockParts.length})
              </h3>
              <button
                style={styles.closePanelBtn}
                onClick={() => setShowLowStock(false)}
              >
                ✕ Close
              </button>
            </div>
            {lowStockParts.length === 0 ? (
              <p style={{ padding: "16px", color: "#16a34a", fontWeight: "600" }}>
                ✅ All parts are sufficiently stocked!
              </p>
            ) : (
              <div style={styles.lowStockList}>
                {lowStockParts.map((p) => (
                  <div key={p.id} style={styles.lowStockItem}>
                    <span style={styles.lowStockName}>{p.name}</span>
                    <span style={styles.lowStockCategory}>{p.category}</span>
                    <span style={styles.lowStockQty}>
                      Stock: <strong>{p.stockQuantity}</strong> / Min: {p.lowStockThreshold}
                    </span>
                    <span style={styles.lowStockVendor}>{p.vendorName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add / Edit Form */}
        {showForm && (
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>
                {editingPart ? "Edit Part Details" : "Register New Part"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} style={styles.formPadding}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Part Name</label>
                  <input
                    style={styles.input}
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Brake Pad Set"
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Category</label>
                  <input
                    style={styles.input}
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g. Brakes, Engine, Suspension"
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Selling Price (Rs.)</label>
                  <input
                    style={styles.input}
                    name="sellingPrice"
                    type="number"
                    step="0.01"
                    value={formData.sellingPrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Cost Price (Rs.)</label>
                  <input
                    style={styles.input}
                    name="costPrice"
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Stock Quantity</label>
                  <input
                    style={styles.input}
                    name="stockQuantity"
                    type="number"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    placeholder="0"
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Low Stock Threshold</label>
                  <input
                    style={styles.input}
                    name="lowStockThreshold"
                    type="number"
                    value={formData.lowStockThreshold}
                    onChange={handleInputChange}
                    placeholder="10"
                    required
                  />
                </div>
                <div style={{ ...styles.formGroup, gridColumn: "1 / -1" }}>
                  <label style={styles.label}>Supplier / Vendor</label>
                  <select
                    style={styles.input}
                    name="vendorId"
                    value={formData.vendorId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">-- Select a Vendor --</option>
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} — {v.contactPerson}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ ...styles.formGroup, gridColumn: "1 / -1" }}>
                  <label style={styles.label}>Description</label>
                  <input
                    style={styles.input}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Brief description of the part"
                  />
                </div>
              </div>
              <div style={styles.formActions}>
                <button type="submit" style={styles.saveBtn}>
                  {editingPart ? "Save Changes" : "Create Part"}
                </button>
                <button type="button" style={styles.cancelBtn} onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div style={styles.tableCard}>
          {loading ? (
            <p style={styles.loadingText}>Synchronizing data...</p>
          ) : parts.length === 0 ? (
            <div style={styles.emptyBox}>
              <p>No parts found. Add your first part!</p>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHead}>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Part Name</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Pricing</th>
                    <th style={styles.th}>Stock</th>
                    <th style={styles.th}>Vendor</th>
                    <th style={styles.thAction}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {parts.map((part) => {
                    const badge = getStockBadge(part.stockQuantity, part.lowStockThreshold);
                    return (
                      <tr key={part.id} style={styles.tableRow}>
                        <td style={styles.tdId}>#{part.id}</td>
                        <td style={styles.tdName}>
                          <div>{part.name}</div>
                          <div style={styles.descText}>{part.description}</div>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.categoryBadge}>{part.category}</span>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.priceCell}>
                            <span style={styles.sellingPrice}>Rs. {Number(part.sellingPrice).toFixed(2)}</span>
                            <span style={styles.costPrice}>Cost: Rs. {Number(part.costPrice).toFixed(2)}</span>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.stockCell}>
                            <span style={styles.stockQty}>{part.stockQuantity}</span>
                            <span
                              style={{
                                ...styles.stockBadge,
                                color: badge.color,
                                backgroundColor: badge.bg,
                                border: `1px solid ${badge.border}`,
                              }}
                            >
                              {badge.label}
                            </span>
                          </div>
                        </td>
                        <td style={styles.td}>{part.vendorName}</td>
                        <td style={styles.td}>
                          <div style={styles.btnGroup}>
                            <button style={styles.editBtn} onClick={() => handleEdit(part)}>
                              Edit
                            </button>
                            <button style={styles.deleteBtn} onClick={() => handleDelete(part.id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
    maxWidth: "1350px",
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
  headerBtns: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  lowStockBtn: {
    backgroundColor: "#fffbeb",
    color: "#d97706",
    border: "1px solid #fde68a",
    padding: "12px 20px",
    borderRadius: "10px",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: "600",
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
  lowStockPanel: {
    backgroundColor: "#fff",
    border: "1px solid #fde68a",
    borderRadius: "12px",
    marginBottom: "24px",
    overflow: "hidden",
  },
  lowStockPanelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    backgroundColor: "#fffbeb",
    borderBottom: "1px solid #fde68a",
  },
  lowStockPanelTitle: {
    margin: 0,
    color: "#92400e",
    fontSize: "15px",
    fontWeight: "700",
  },
  closePanelBtn: {
    background: "none",
    border: "1px solid #fde68a",
    color: "#d97706",
    padding: "4px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },
  lowStockList: {
    display: "flex",
    flexDirection: "column",
  },
  lowStockItem: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "14px 20px",
    borderBottom: "1px solid #fef9c3",
  },
  lowStockName: {
    fontWeight: "700",
    color: "#0f172a",
    fontSize: "14px",
    minWidth: "160px",
  },
  lowStockCategory: {
    color: "#64748b",
    fontSize: "13px",
    minWidth: "100px",
  },
  lowStockQty: {
    color: "#dc2626",
    fontSize: "13px",
    minWidth: "160px",
  },
  lowStockVendor: {
    color: "#94a3b8",
    fontSize: "13px",
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    marginBottom: "32px",
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
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
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
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
    padding: "16px 20px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
  },
  thAction: {
    padding: "16px 20px",
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
    padding: "18px 20px",
    fontSize: "13px",
    color: "#94a3b8",
    fontWeight: "500",
  },
  tdName: {
    padding: "18px 20px",
    fontSize: "14px",
    color: "#0f172a",
    fontWeight: "700",
  },
  td: {
    padding: "18px 20px",
    fontSize: "14px",
    color: "#475569",
  },
  descText: {
    fontSize: "12px",
    color: "#94a3b8",
    fontWeight: "400",
    marginTop: "2px",
  },
  categoryBadge: {
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    border: "1px solid #bfdbfe",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  priceCell: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  sellingPrice: {
    fontWeight: "700",
    color: "#0f172a",
    fontSize: "14px",
  },
  costPrice: {
    fontSize: "12px",
    color: "#94a3b8",
  },
  stockCell: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  stockQty: {
    fontWeight: "700",
    color: "#0f172a",
    fontSize: "16px",
  },
  stockBadge: {
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
    display: "inline-block",
    width: "fit-content",
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