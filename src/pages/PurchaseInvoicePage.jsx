import { useEffect, useState } from "react";
import { getAllInvoices, createInvoice } from "../api/purchaseInvoiceApi";
import { getAllVendors } from "../api/vendorApi";
import { getAllParts } from "../api/partApi";

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

    // Autofill cost price from parts list when part a is selected
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
    <div style={styles.pageBackground}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Purchase Invoices</h1>
            <p style={styles.subtitle}>Record stock purchases from vendors </p>
          </div>
          <button style={styles.addBtn} onClick={() => { resetForm(); setShowForm(true); }}>
            + Add New Purchase Invoice
          </button>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Form */}
        {showForm && (
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Create Purchase Invoice</h2>
            </div>
            <form onSubmit={handleSubmit} style={styles.formPadding}>

              {/* Invoice Header Fields */}
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Vendor</label>
                  <select style={styles.input} name="vendorId" value={formData.vendorId} onChange={handleFormChange} required>
                    <option value="">-- Select Vendor --</option>
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Purchase Date</label>
                  <input style={styles.input} type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleFormChange} required />
                </div>
                <div style={{ ...styles.formGroup, gridColumn: "1 / -1" }}>
                  <label style={styles.label}>Notes (optional)</label>
                  <input style={styles.input} name="notes" value={formData.notes} onChange={handleFormChange} placeholder="e.g. Monthly orders restocks" />
                </div>
              </div>

              {/* Line Items */}
              <div style={styles.itemsSection}>
                <div style={styles.itemsHeader}>
                  <h3 style={styles.itemsTitle}>Parts Ordered</h3>
                  <button type="button" style={styles.addItemBtn} onClick={addItem}>+ Add Row</button>
                </div>

                {/* Items Table Header */}
                <div style={styles.itemRow}>
                  <span style={{ ...styles.itemCell, flex: 3, fontWeight: "700", color: "#64748b", fontSize: "12px", textTransform: "uppercase" }}>Part</span>
                  <span style={{ ...styles.itemCell, flex: 1, fontWeight: "700", color: "#64748b", fontSize: "12px", textTransform: "uppercase" }}>Qty</span>
                  <span style={{ ...styles.itemCell, flex: 1, fontWeight: "700", color: "#64748b", fontSize: "12px", textTransform: "uppercase" }}>Cost Price</span>
                  <span style={{ ...styles.itemCell, flex: 1, fontWeight: "700", color: "#64748b", fontSize: "12px", textTransform: "uppercase" }}>Line Total</span>
                  <span style={{ width: "36px" }}></span>
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
                            {p.name} (Stock: {p.stockQuantity})
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
                        placeholder="0.00"
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

                {/* Total */}
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Total Amount</span>
                  <span style={styles.totalAmount}>Rs. {calcTotal()}</span>
                </div>
              </div>

              <div style={styles.formActions}>
                <button type="submit" style={styles.saveBtn}>Create Invoice & Update Stock</button>
                <button type="button" style={styles.cancelBtn} onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Invoice Detail Panel */}
        {selectedInvoice && (
          <div style={styles.detailCard}>
            <div style={styles.detailHeader}>
              <h3 style={styles.detailTitle}>Invoice #{selectedInvoice.invoiceNumber}</h3>
              <button style={styles.closePanelBtn} onClick={() => setSelectedInvoice(null)}>X Close</button>
            </div>
            <div style={styles.detailBody}>
              <div style={styles.detailGrid}>
                <div><span style={styles.detailLabel}>Vendor</span><p style={styles.detailValue}>{selectedInvoice.vendorName}</p></div>
                <div><span style={styles.detailLabel}>Date</span><p style={styles.detailValue}>{new Date(selectedInvoice.purchaseDate).toLocaleDateString()}</p></div>
                <div><span style={styles.detailLabel}>Total</span><p style={{ ...styles.detailValue, color: "#0f172a", fontWeight: "800", fontSize: "18px" }}>Rs. {Number(selectedInvoice.totalAmount).toFixed(2)}</p></div>
                <div><span style={styles.detailLabel}>Notes</span><p style={styles.detailValue}>{selectedInvoice.notes || "—"}</p></div>
              </div>
              <table style={{ ...styles.table, marginTop: "16px" }}>
                <thead>
                  <tr style={styles.tableHead}>
                    <th style={styles.th}>Part</th>
                    <th style={styles.th}>Quantity</th>
                    <th style={styles.th}>Cost Price</th>
                    <th style={styles.th}>Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items.map((item) => (
                    <tr key={item.id} style={styles.tableRow}>
                      <td style={styles.td}>{item.partName}</td>
                      <td style={styles.td}>{item.quantity}</td>
                      <td style={styles.td}>Rs. {Number(item.costPrice).toFixed(2)}</td>
                      <td style={styles.td}>Rs. {Number(item.lineTotal).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Invoices Table */}
        <div style={styles.tableCard}>
          {loading ? (
            <p style={styles.loadingText}>Synchronizing data...</p>
          ) : invoices.length === 0 ? (
            <div style={styles.emptyBox}><p>No purchase invoices yet. Create your purchase invoice now!</p></div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHead}>
                    <th style={styles.th}>Invoice No.</th>
                    <th style={styles.th}>Vendor</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Items</th>
                    <th style={styles.th}>Total Amount</th>
                    <th style={styles.th}>Notes</th>
                    <th style={styles.thAction}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} style={styles.tableRow}>
                      <td style={styles.tdId}>{inv.invoiceNumber}</td>
                      <td style={styles.tdName}>{inv.vendorName}</td>
                      <td style={styles.td}>{new Date(inv.purchaseDate).toLocaleDateString()}</td>
                      <td style={styles.td}>
                        <span style={styles.categoryBadge}>{inv.items.length} part{inv.items.length !== 1 ? "s" : ""}</span>
                      </td>
                      <td style={{ ...styles.td, fontWeight: "700", color: "#0f172a" }}>
                        Rs. {Number(inv.totalAmount).toFixed(2)}
                      </td>
                      <td style={{ ...styles.td, color: "#94a3b8" }}>{inv.notes || "—"}</td>
                      <td style={styles.td}>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <button style={styles.editBtn} onClick={() => setSelectedInvoice(inv)}>
                            View
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
  addBtn: {
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "10px",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: "600",
    boxShadow: "0 4px 6px -1px rgba(79,70,229,0.2)",
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
    backgroundColor: "#fff",
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
    marginBottom: "24px",
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
  itemsSection: {
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "24px",
    border: "1px solid #e2e8f0",
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
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    border: "1px solid #bfdbfe",
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
    marginBottom: "10px",
  },
  itemCell: {
    display: "flex",
  },
  lineTotal: {
    padding: "12px 16px",
    backgroundColor: "#f1f5f9",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#0f172a",
    whiteSpace: "nowrap",
  },
  removeBtn: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    width: "32px",
    height: "32px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "700",
    flexShrink: 0,
  },
  totalRow: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "16px",
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "2px solid #e2e8f0",
  },
  totalLabel: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
  },
  totalAmount: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#0f172a",
  },
  formActions: {
    display: "flex",
    gap: "12px",
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
  detailCard: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    marginBottom: "24px",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
  },
  detailHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    borderBottom: "1px solid #f1f5f9",
    backgroundColor: "#fcfcfd",
  },
  detailTitle: {
    margin: 0,
    fontSize: "15px",
    fontWeight: "700",
    color: "#334155",
  },
  closePanelBtn: {
    background: "none",
    border: "1px solid #e2e8f0",
    color: "#64748b",
    padding: "4px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },
  detailBody: {
    padding: "20px 24px",
  },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "16px",
    marginBottom: "16px",
  },
  detailLabel: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
  },
  detailValue: {
    margin: "4px 0 0 0",
    fontSize: "14px",
    color: "#475569",
  },
  tableCard: {
    backgroundColor: "#fff",
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
    fontWeight: "600",
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
  categoryBadge: {
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    border: "1px solid #bfdbfe",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  editBtn: {
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    border: "1px solid #bfdbfe",
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