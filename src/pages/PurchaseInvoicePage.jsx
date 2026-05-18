import { useEffect, useState } from "react";
import { getAllInvoices, createInvoice } from "../api/purchaseInvoiceApi";
import { getAllVendors } from "../api/vendorApi";
import { getAllParts } from "../api/partApi";
// SideBar Layout
import AdminLayout from "../components/AdminLayout";

export default function PurchaseInvoicePage() {
  const [invoices, setInvoices] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [formData, setFormData] = useState({
    vendorId: "",
    adminId: 1,
    purchaseDate: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [items, setItems] = useState([{ partId: "", quantity: "", costPrice: "" }]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [invRes, vendorRes, partRes] = await Promise.all([
        getAllInvoices(),
        getAllVendors(),
        getAllParts(),
      ]);
      setInvoices(invRes.data.data || []);
      setVendors(vendorRes.data.data || []);
      setParts(partRes.data.data || []);
    } catch (err) {
      setError("Failed to load data. Check your backend is it running or not?");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    // Autofill cost price from parts list when a part is selected
    if (field === "partId") {
      const selectedPart = parts.find((p) => p.id === parseInt(value));
      if (selectedPart) updated[index].costPrice = selectedPart.costPrice;
    }
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { partId: "", quantity: "", costPrice: "" }]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const calcLineTotal = (item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.costPrice) || 0;
    return (qty * price).toFixed(2);
  };

  const calcTotal = () => {
    return items.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.costPrice) || 0);
    }, 0).toFixed(2);
  };

  const resetForm = () => {
    setFormData({ vendorId: "", adminId: 1, purchaseDate: new Date().toISOString().split("T")[0], notes: "" });
    setItems([{ partId: "", quantity: "", costPrice: "" }]);
    setShowForm(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      vendorId: parseInt(formData.vendorId),
      adminId: parseInt(formData.adminId),
      purchaseDate: new Date(formData.purchaseDate).toISOString(),
      notes: formData.notes,
      items: items.map((item) => ({
        partId: parseInt(item.partId),
        quantity: parseInt(item.quantity),
        costPrice: parseFloat(item.costPrice),
      })),
    };
    try {
      await createInvoice(payload);
      alert("Purchase invoice created! Stock has been updated automatically.");
      resetForm();
      fetchAll();
    } catch (err) {
      alert("Failed to create invoice. Check all fields.");
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div style={styles.contentPadding}>
        {/* Header */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.title}>Purchase Invoices</h1>
            <p style={styles.subtitle}>Record stock purchases from vendors and update inventory.</p>
          </div>
          <button style={styles.submitBtn} onClick={() => { resetForm(); setShowForm(true); }}>
            + Create New Invoice
          </button>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Create Invoice Form Card */}
        {showForm && (
          <div style={styles.card}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>New Purchase Record</h2>
            </div>
            <form onSubmit={handleSubmit} style={styles.formPadding}>
              {/* Invoice Header Fields */}
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Supplier / Vendor</label>
                  <select style={styles.input} name="vendorId" value={formData.vendorId} onChange={handleFormChange} required>
                    <option value="">-- Select Vendor --</option>
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Transaction Date</label>
                  <input style={styles.input} type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleFormChange} required />
                </div>
                <div style={{ ...styles.formGroup, gridColumn: "1 / -1" }}>
                  <label style={styles.label}>Purchase Notes</label>
                  <input style={styles.input} name="notes" value={formData.notes} onChange={handleFormChange} placeholder="e.g. Bulk restock for part..." />
                </div>
              </div>

              {/* Line Items Section */}
              <div style={styles.itemsSection}>
                <div style={styles.itemsHeader}>
                  <h3 style={styles.itemsTitle}>Order Items</h3>
                  <button type="button" style={styles.addItemBtn} onClick={addItem}>+ Add Item</button>
                </div>

                {items.map((item, index) => (
                  <div key={index} style={styles.itemRow}>
                    <div style={{ ...styles.itemCell, flex: 3 }}>
                      <select
                        style={styles.input}
                        value={item.partId}
                        onChange={(e) => handleItemChange(index, "partId", e.target.value)}
                        required
                      >
                        <option value="">-- Select Part --</option>
                        {parts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (Current Stock: {p.stockQuantity})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={{ ...styles.itemCell, flex: 1 }}>
                      <input
                        style={styles.input}
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                        required
                      />
                    </div>
                    <div style={{ ...styles.itemCell, flex: 1 }}>
                      <input
                        style={styles.input}
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        value={item.costPrice}
                        onChange={(e) => handleItemChange(index, "costPrice", e.target.value)}
                        required
                      />
                    </div>
                    <div style={{ ...styles.itemCell, flex: 1 }}>
                      <span style={styles.lineTotal}>Rs. {calcLineTotal(item)}</span>
                    </div>
                    <button type="button" style={styles.removeBtn} onClick={() => removeItem(index)}>✕</button>
                  </div>
                ))}

                {/* Calculation Summary */}
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Grand Total</span>
                  <span style={styles.totalAmount}>Rs. {calcTotal()}</span>
                </div>
              </div>

              <div style={styles.formActions}>
                <button type="submit" style={styles.submitBtn}>Confirm & Update Stock</button>
                <button type="button" style={styles.cancelBtn} onClick={resetForm}>Discard</button>
              </div>
            </form>
          </div>
        )}

        {/* Invoice Detail Card */}
        {selectedInvoice && (
          <div style={styles.card}>
            <div style={styles.detailHeader}>
              <h3 style={styles.detailTitle}>Details: {selectedInvoice.invoiceNumber}</h3>
              <button style={styles.cancelBtn} onClick={() => setSelectedInvoice(null)}>Close</button>
            </div>
            <div style={styles.formPadding}>
              <div style={styles.detailGrid}>
                <div>
                    <span style={styles.label}>Vendor</span>
                    <p style={styles.tdBold}>{selectedInvoice.vendorName}</p>
                </div>
                <div>
                    <span style={styles.label}>Date</span>
                    <p style={styles.td}>{new Date(selectedInvoice.purchaseDate).toLocaleDateString()}</p>
                </div>
                <div>
                    <span style={styles.label}>Grand Total</span>
                    <p style={{ ...styles.tdBold, color: "#14b8a6" }}>Rs. {Number(selectedInvoice.totalAmount).toFixed(2)}</p>
                </div>
              </div>
              
              <table style={{ ...styles.table, marginTop: "20px" }}>
                <thead>
                  <tr style={styles.tableHead}>
                    <th style={styles.th}>Part Name</th>
                    <th style={styles.th}>Quantity</th>
                    <th style={styles.th}>Unit Cost</th>
                    <th style={styles.th}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items.map((item) => (
                    <tr key={item.id} style={styles.tr}>
                      <td style={styles.td}>{item.partName}</td>
                      <td style={styles.td}>{item.quantity}</td>
                      <td style={styles.td}>Rs. {Number(item.costPrice).toFixed(2)}</td>
                      <td style={styles.tdBold}>Rs. {Number(item.lineTotal).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Invoices List Card */}
        <div style={styles.card}>
          <div style={styles.tableHeader}>
            <h3 style={styles.cardTitle}>Purchase History</h3>
            <span style={styles.badge}>{invoices.length} Records</span>
          </div>

          {loading ? (
            <p style={styles.loadingText}>Synchronizing inventory data...</p>
          ) : invoices.length === 0 ? (
            <div style={styles.emptyBox}>
              <p>No purchase records found.</p>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHead}>
                    <th style={styles.th}>Invoice ID</th>
                    <th style={styles.th}>Vendor</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Total Amount</th>
                    <th style={styles.thAction}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} style={styles.tr}>
                      <td style={styles.tdId}>{inv.invoiceNumber}</td>
                      <td style={styles.tdBold}>{inv.vendorName}</td>
                      <td style={styles.td}>{new Date(inv.purchaseDate).toLocaleDateString()}</td>
                      <td style={{ ...styles.tdBold, color: "#111827" }}>
                        Rs. {Number(inv.totalAmount).toFixed(2)}
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <button style={styles.editLink} onClick={() => setSelectedInvoice(inv)}>
                            View Details
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
    </AdminLayout>
  );
}

const styles = {
  contentPadding: {
    padding: "40px",
  },
  pageHeader: {
    marginBottom: "30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
  formHeader: {
    borderBottom: "1px solid #f1f5f9",
    paddingBottom: "15px",
    marginBottom: "20px",
  },
  formTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
  },
  formPadding: {
    padding: "0",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "30px",
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
  itemsSection: {
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "24px",
    border: "1px solid #e5e7eb",
  },
  itemsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  itemsTitle: {
    margin: 0,
    fontSize: "15px",
    fontWeight: "700",
    color: "#334155",
  },
  addItemBtn: {
    backgroundColor: "#ffffff",
    color: "#14b8a6",
    border: "1px solid #14b8a6",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },
  itemRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  },
  itemCell: {
    display: "flex",
  },
  lineTotal: {
    padding: "12px 10px",
    fontSize: "14px",
    fontWeight: "700",
    color: "#111827",
  },
  removeBtn: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    border: "none",
    width: "32px",
    height: "32px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "700",
  },
  totalRow: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "16px",
    marginTop: "20px",
    paddingTop: "15px",
    borderTop: "2px solid #e5e7eb",
  },
  totalLabel: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
  },
  totalAmount: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#14b8a6",
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
  detailHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    borderBottom: "1px solid #f1f5f9",
    paddingBottom: "15px",
  },
  detailTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "800",
    color: "#111827",
  },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "20px",
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
  tdId: {
    padding: "16px 0",
    fontSize: "13px",
    fontWeight: "600",
    color: "#94a3b8",
  },
  tdBold: {
    padding: "16px 0",
    fontSize: "14px",
    fontWeight: "700",
    color: "#111827",
  },
  categoryBadge: {
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    padding: "2px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "600",
  },
  editLink: {
    background: "none",
    border: "none",
    color: "#14b8a6",
    fontWeight: "600",
    cursor: "pointer",
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