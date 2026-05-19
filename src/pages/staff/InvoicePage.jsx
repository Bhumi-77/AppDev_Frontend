import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "../../api/axios";

const styles = {
  wrapper: { padding: "0.5rem 0 2rem" },

  pageHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
  },

  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 500,
  },

  subtitle: {
    margin: "4px 0 0",
    fontSize: 14,
    color: "#888",
  },

  printBtn: {
    background: "#14b89a",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: 500,
  },

  card: {
    background: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: 12,
    padding: "1.5rem",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  label: {
    color: "#666",
    fontSize: 13,
  },

  value: {
    fontWeight: 500,
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 20,
  },

  th: {
    textAlign: "left",
    padding: "10px 0",
    borderBottom: "1px solid #ddd",
    fontSize: 13,
    color: "#777",
  },

  td: {
    padding: "12px 0",
    borderBottom: "1px solid #f0f0f0",
    fontSize: 14,
  },

  totalSection: {
    marginTop: 20,
    borderTop: "1px solid #eee",
    paddingTop: 20,
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  totalText: {
    fontSize: 16,
    fontWeight: 600,
  },

  empty: {
    textAlign: "center",
    color: "#999",
    padding: "3rem",
  },
};

export default function InvoicePage() {
  const { id } = useParams();
  const location = useLocation();

  const [invoice, setInvoice] = useState(
    location.state?.invoice || null
  );

  const [loading, setLoading] = useState(!invoice);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadInvoice() {
      try {
        if (!id) {
          setError("Invoice ID not found.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`/invoices/${id}`);

        setInvoice(res.data);
      } catch (err) {
        console.log(err);
        setError("Failed to load invoice.");
      } finally {
        setLoading(false);
      }
    }

    if (!invoice) {
      loadInvoice();
    }
  }, [id]);

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return <p style={styles.empty}>Loading invoice...</p>;
  }

  if (error) {
    return (
      <p style={{ ...styles.empty, color: "red" }}>
        {error}
      </p>
    );
  }

  if (!invoice) {
    return (
      <p style={styles.empty}>
        No invoice found.
      </p>
    );
  }

  const items =
    invoice.items ||
    invoice.invoiceItems ||
    [];

  const subtotal = items.reduce((sum, item) => {
    const qty =
      item.quantity ||
      item.qty ||
      0;

    const price =
      item.price ||
      item.unitPrice ||
      0;

    return sum + qty * price;
  }, 0);

  const discount =
    invoice.discountAmount || 0;

  const finalTotal =
    invoice.finalAmount ||
    subtotal - discount;

  return (
    <div style={styles.wrapper}>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>
            Invoice #{invoice.id}
          </h1>

          <p style={styles.subtitle}>
            View and print invoice details
          </p>
        </div>

        <button
          style={styles.printBtn}
          onClick={handlePrint}
        >
          Print Invoice
        </button>
      </div>

      <div style={styles.card}>
        <div style={styles.row}>
          <span style={styles.label}>
            Customer
          </span>

          <span style={styles.value}>
            {invoice.customer?.name ||
              invoice.customerName ||
              "N/A"}
          </span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>
            Invoice Date
          </span>

          <span style={styles.value}>
            {invoice.invoiceDate
              ? new Date(
                  invoice.invoiceDate
                ).toLocaleString()
              : "N/A"}
          </span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>
            Payment Status
          </span>

          <span style={styles.value}>
            {invoice.paymentStatus ||
              "Pending"}
          </span>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>
                Part
              </th>

              <th style={styles.th}>
                Quantity
              </th>

              <th style={styles.th}>
                Price
              </th>

              <th style={styles.th}>
                Total
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => {
              const qty =
                item.quantity ||
                item.qty ||
                0;

              const price =
                item.price ||
                item.unitPrice ||
                0;

              return (
                <tr key={index}>
                  <td style={styles.td}>
                    {item.partName ||
                      item.name ||
                      `Part #${item.partId}`}
                  </td>

                  <td style={styles.td}>
                    {qty}
                  </td>

                  <td style={styles.td}>
                    Rs.{" "}
                    {price.toLocaleString()}
                  </td>

                  <td style={styles.td}>
                    Rs.{" "}
                    {(qty * price).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={styles.totalSection}>
          <div style={styles.totalRow}>
            <span>Subtotal</span>

            <span>
              Rs.{" "}
              {subtotal.toLocaleString()}
            </span>
          </div>

          <div style={styles.totalRow}>
            <span>Discount</span>

            <span>
              Rs.{" "}
              {discount.toLocaleString()}
            </span>
          </div>

          <div style={styles.totalRow}>
            <span style={styles.totalText}>
              Final Total
            </span>

            <span style={styles.totalText}>
              Rs.{" "}
              {finalTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}