import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "../../api/axios";

const styles = {
  wrapper: { padding: "0.5rem 0 2rem" },
  pageHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" },
  title: { margin: 0, fontSize: 22, fontWeight: 500 },
  subtitle: { margin: "4px 0 0", fontSize: 14, color: "#888" },
  printBtn: { display: "flex", alignItems: "center", gap: 8, background: "#0f1b2d", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 14, fontWeight: 500, cursor: "pointer" },
  card: { background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 12, padding: "1.5rem 1.75rem" },
  brandRow: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem" },
  brandIcon: { width: 32, height: 32, background: "#0f1b2d", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, marginRight: 10 },
  brandName: { fontSize: 15, fontWeight: 500, margin: 0 },
  brandSub: { fontSize: 13, color: "#888", margin: "2px 0 0" },
  invoiceId: { fontSize: 18, fontWeight: 500, margin: "0 0 4px", textAlign: "right" },
  badgePaid: { display: "inline-block", fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 99, background: "#EAF3DE", color: "#27500A" },
  badgePending: { display: "inline-block", fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 99, background: "#FAEEDA", color: "#633806" },
  metaGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "1rem 0", borderTop: "0.5px solid #eee", borderBottom: "0.5px solid #eee", marginBottom: "1.25rem" },
  metaLabel: { fontSize: 11, fontWeight: 500, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 2px" },
  metaValue: { fontSize: 14, fontWeight: 500, margin: 0 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: { fontSize: 11, fontWeight: 500, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", padding: "8px 0", borderBottom: "0.5px solid #eee", textAlign: "left" },
  td: { padding: "10px 0", borderBottom: "0.5px solid #f0f0f0" },
  summaryBlock: { marginTop: "1rem", paddingTop: "1rem", borderTop: "0.5px solid #eee" },
  summaryRow: { display: "flex", justifyContent: "space-between", fontSize: 13, color: "#888", marginBottom: 4 },
  summaryVal: { color: "#111", fontWeight: 500 },
  totalRow: { display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 500, marginTop: 10, paddingTop: 10, borderTop: "0.5px solid #eee" },
  empty: { color: "#aaa", fontSize: 14, textAlign: "center", padding: "2rem 0" },
};

const PRINT_STYLES = `
  @media print {
    body > * { display: none !important; }
    #invoice-printable { display: block !important; position: fixed; top: 0; left: 0; width: 100%; padding: 2rem; box-sizing: border-box; }
  }
`;

export default function InvoicePage() {
  const { id } = useParams();
  const location = useLocation();

  const [inv, setInv] = useState(location.state?.invoice ?? null);
  const [loading, setLoading] = useState(!inv);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (inv) return;

    if (!id) {
      setError("No invoice to display. Please complete a sale first.");
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`/invoices/${id}`)
      .then(res => setInv(res.data))
      .catch(() => setError("Failed to load invoice."))
      .finally(() => setLoading(false));
  }, [id]);

  function handlePrint() {
    const styleTag = document.createElement("style");
    styleTag.id = "__invoice_print_styles__";
    styleTag.innerHTML = PRINT_STYLES;
    document.head.appendChild(styleTag);
    window.print();
    window.addEventListener("afterprint", () => {
      document.getElementById("__invoice_print_styles__")?.remove();
    }, { once: true });
  }

  if (loading) return <p style={styles.empty}>Loading...</p>;
  if (error)   return <p style={{ ...styles.empty, color: "#A32D2D" }}>{error}</p>;
  if (!inv)    return <p style={styles.empty}>No invoice found.</p>;

  const subtotal = inv.items?.reduce((s, i) => s + (i.unitPrice ?? i.price ?? 0) * (i.qty ?? i.quantity ?? 0), 0) ?? inv.totalAmount ?? 0;
  const discount = inv.discount ?? 0;
  const total    = subtotal - discount;

  const InvoiceBody = () => (
    <>
      <div style={styles.brandRow}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={styles.brandIcon}>⚙️</div>
          <div>
            <p style={styles.brandName}>AutoPart Admin Panel</p>
            <p style={styles.brandSub}>Vehicle Parts Selling System</p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={styles.invoiceId}>#{inv.id}</p>
          <span style={inv.status === "Paid" ? styles.badgePaid : styles.badgePending}>
            {inv.status ?? "Pending"}
          </span>
        </div>
      </div>

      <div style={styles.metaGrid}>
        <div>
          <p style={styles.metaLabel}>Customer</p>
          <p style={styles.metaValue}>{inv.customerName ?? inv.customer ?? "—"}</p>
        </div>
        <div>
          <p style={styles.metaLabel}>Vehicle</p>
          <p style={styles.metaValue}>{inv.vehicleNumber ?? "—"}</p>
        </div>
        <div>
          <p style={styles.metaLabel}>Date</p>
          <p style={styles.metaValue}>{inv.date ?? new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Part</th>
            <th style={{ ...styles.th, textAlign: "right" }}>Qty</th>
            <th style={{ ...styles.th, textAlign: "right" }}>Unit price</th>
            <th style={{ ...styles.th, textAlign: "right" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {inv.items?.map((item, i) => {
            const unit = item.unitPrice ?? item.price ?? 0;
            const qty  = item.qty ?? item.quantity ?? 0;
            return (
              <tr key={i}>
                <td style={styles.td}>{item.name ?? item.partName}</td>
                <td style={{ ...styles.td, textAlign: "right" }}>{qty}</td>
                <td style={{ ...styles.td, textAlign: "right" }}>Rs. {unit.toLocaleString()}</td>
                <td style={{ ...styles.td, textAlign: "right" }}>Rs. {(unit * qty).toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={styles.summaryBlock}>
        <div style={styles.summaryRow}>
          <span>Subtotal</span>
          <span style={styles.summaryVal}>Rs. {subtotal.toLocaleString()}</span>
        </div>
        <div style={styles.summaryRow}>
          <span>Discount</span>
          <span style={styles.summaryVal}>Rs. {discount.toLocaleString()}</span>
        </div>
        <div style={styles.totalRow}>
          <span>Total</span>
          <span>Rs. {total.toLocaleString()}</span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Print-only clone — hidden on screen, visible only during print */}
      <div id="invoice-printable" style={{ display: "none" }}>
        <InvoiceBody />
      </div>

      <div style={styles.wrapper}>
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.title}>Invoice</h1>
            <p style={styles.subtitle}>Review and print the sale receipt.</p>
          </div>
          <button style={styles.printBtn} onClick={handlePrint}>
            🖨 Print invoice
          </button>
        </div>

        <div style={styles.card}>
          <InvoiceBody />
        </div>
      </div>
    </>
  );
}