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
      name: "", category: "", description: "",
      sellingPrice: "", costPrice: "", stockQuantity: "",
      lowStockThreshold: 10, vendorId: "",
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
      alert("Error saving part.");
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
    if (!window.confirm("Delete this part?")) return;
    try {
      await deletePart(id);
      fetchParts();
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const getStockStatus = (qty, threshold) => {
    if (qty <= threshold) return { label: "Low Stock", style: styles.statusLow };
    return { label: "In Stock", style: styles.statusActive };
  };

  return (
      <div style={styles.contentPadding}>
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.title}>Parts Management</h1>
            <p style={styles.subtitle}>Manage vehicle parts inventory, pricing, and stock thresholds.</p>
          </div>
          <div style={styles.headerBtns}>
             <button style={styles.lowStockBtn} onClick={fetchLowStock}>⚠ Alerts</button>
             <button style={styles.submitBtn} onClick={() => { resetForm(); setShowForm(true); }}>+ Add Part</button>
          </div>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Form Card */}
        {showForm && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>{editingPart ? "Edit Part" : "Add Part"}</h3>
            <p style={styles.cardSubtitle}>Enter part specifications and link to a supplier.</p>
            <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <input style={styles.input} name="name" value={formData.name} onChange={handleInputChange} placeholder="Part Name" required />
              <input style={styles.input} name="category" value={formData.category} onChange={handleInputChange} placeholder="Category" required />
              <input style={styles.input} name="costPrice" type="number" value={formData.costPrice} onChange={handleInputChange} placeholder="Cost Price" required />
              <input style={styles.input} name="sellingPrice" type="number" value={formData.sellingPrice} onChange={handleInputChange} placeholder="Selling Price" required />
              <input style={styles.input} name="stockQuantity" type="number" value={formData.stockQuantity} onChange={handleInputChange} placeholder="Initial Stock" required />
              
              <select style={styles.input} name="vendorId" value={formData.vendorId} onChange={handleInputChange} required>
                <option value="">Select Vendor</option>
                {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
              
              <input style={styles.input} name="lowStockThreshold" type="number" value={formData.lowStockThreshold} onChange={handleInputChange} placeholder="Low Stock Alert Level" />
            </div>
              <div style={styles.formActions}>
                <button type="submit" style={styles.submitBtn}>Save Part</button>
                <button type="button" style={styles.cancelBtn} onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Table Card */}
        <div style={styles.card}>
          <div style={styles.tableHeader}>
            <h3 style={styles.cardTitle}>Parts Inventory</h3>
            <span style={styles.badge}>{parts.length} Items Total</span>
          </div>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHead}>
                  <th style={styles.th}>Part Name</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Stock</th>
                  <th style={styles.th}>Vendor</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {parts.map((p) => {
                  const status = getStockStatus(p.stockQuantity, p.lowStockThreshold);
                  return (
                    <tr key={p.id} style={styles.tr}>
                      <td style={styles.tdBold}>{p.name}</td>
                      <td style={styles.td}>{p.category}</td>
                      <td style={styles.td}>Rs. {p.sellingPrice}</td>
                      <td style={styles.td}>
                         <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                            {p.stockQuantity} 
                            <span style={status.style}>{status.label}</span>
                         </div>
                      </td>
                      <td style={styles.td}>{p.vendorName}</td>
                      <td style={styles.td}>
                        <button style={styles.editLink} onClick={() => handleEdit(p)}>Edit</button>
                        <button style={styles.deleteLink} onClick={() => handleDelete(p.id)}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
}

const styles = {
  contentPadding: {
    padding: "40px"
  },
  pageHeader: {
    marginBottom: "30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerBtns: {
    display: "flex",
    gap: "10px"
  },
  title: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#111827",
    margin: 0
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "14px",
    marginTop: "4px"
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    marginBottom: "30px",
    border: "1px solid #e5e7eb"
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 4px 0"
  },
  cardSubtitle: {
    fontSize: "13px",
    color: "#6b7280",
    margin: "0 0 20px 0"
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px"
  },
  input: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    backgroundColor: "#f9fafb",
    outline: "none"
  },
  formActions: {
    marginTop: "20px",
    display: "flex",
    gap: "10px"
  },
  submitBtn: {
    backgroundColor: "#14b8a6",
    color: "#ffffff",
    border: "none",
    padding: "10px 24px",
    borderRadius: "8px",
    fontWeight: "700",
    cursor: "pointer"
  },
  lowStockBtn: {
    backgroundColor: "#ffffff",
    color: "#d97706",
    border: "1px solid #fde68a",
    padding: "10px 24px",
    borderRadius: "8px",
    fontWeight: "700",
    cursor: "pointer"
  },
  cancelBtn: {
    backgroundColor: "#f3f4f6",
    color: "#4b5563",
    border: "1px solid #d1d5db",
    padding: "10px 24px",
    borderRadius: "8px",
    fontWeight: "700",
    cursor: "pointer"
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },
  badge: {
    backgroundColor: "#f0fdfa",
    color: "#0d9488",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    border: "1px solid #ccfbf1"
  },
  tableWrapper: {
    overflowX: "auto"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  tableHead: {
    borderBottom: "2px solid #f3f4f6"
  },
  th: {
    textAlign: "left",
    padding: "12px 0",
    fontSize: "13px",
    fontWeight: "600",
    color: "#6b7280"
  },
  tr: {
    borderBottom: "1px solid #f3f4f6"
  },
  td: {
    padding: "16px 0",
    fontSize: "14px",
    color: "#374151"
  },
  tdBold: {
    padding: "16px 0",
    fontSize: "14px",
    fontWeight: "700",
    color: "#111827"
  },
  statusActive: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
    padding: "2px 8px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "600"
  },
  statusLow: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "2px 8px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "600"
  },
  editLink: {
    background: "none",
    border: "none",
    color: "#14b8a6",
    fontWeight: "600",
    cursor: "pointer",
    marginRight: "12px"
  },
  deleteLink: {
    background: "none",
    border: "none",
    color: "#ef4444",
    fontWeight: "600",
    cursor: "pointer"
  },
  errorBox: {
    padding: "15px",
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    borderRadius: "8px",
    marginBottom: "20px"
  },
  loadingText: {
    textAlign: "center",
    color: "#64748b",
    fontSize: "16px",
    padding: "40px"
  },
  emptyBox: {
    textAlign: "center",
    color: "#94a3b8",
    padding: "40px"
  }
};