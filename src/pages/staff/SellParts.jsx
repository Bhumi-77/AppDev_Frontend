import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const styles = {
  wrapper: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #e0f7f4 0%, #f5f7fa 50%, #dff6ff 100%)",
    padding: "2rem",
    boxSizing: "border-box",
  },

  container: {
    maxWidth: 1300,
    margin: "0 auto",
  },

  header: {
    marginBottom: "2rem",
    textAlign: "center",
  },

  title: {
    margin: 0,
    fontSize: 34,
    fontWeight: 700,
    color: "#222",
  },

  subtitle: {
    margin: "10px 0 0",
    fontSize: 16,
    color: "#666",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 24,
    alignItems: "start",
  },

  leftPanel: {
    background: "#fff",
    borderRadius: 24,
    padding: "2rem",
    boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
  },

  rightPanel: {
    background: "#fff",
    borderRadius: 24,
    padding: "2rem",
    boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
    position: "sticky",
    top: 20,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 18,
    color: "#14b89a",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  card: {
    background: "#fafafa",
    border: "1px solid #eee",
    borderRadius: 18,
    padding: "1.25rem",
    marginBottom: 18,
  },

  fieldLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "#555",
    display: "block",
    marginBottom: 8,
  },

  select: {
    width: "100%",
    padding: "13px 14px",
    borderRadius: 12,
    border: "1px solid #ddd",
    fontSize: 14,
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
  },

  input: {
    width: "100%",
    padding: "13px 14px",
    borderRadius: 12,
    border: "1px solid #ddd",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  },

  itemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  itemLabel: {
    fontSize: 15,
    fontWeight: 600,
    color: "#333",
  },

  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 120px",
    gap: 14,
  },

  removeBtn: {
    background: "#ffe8e8",
    color: "#c62828",
    border: "none",
    borderRadius: 10,
    padding: "8px 14px",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
  },

  buttonRow: {
    display: "flex",
    gap: 12,
    marginTop: 20,
    flexWrap: "wrap",
  },

  addBtn: {
    flex: 1,
    background: "#14b89a",
    color: "#fff",
    border: "none",
    borderRadius: 14,
    padding: "14px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(20,184,154,0.2)",
  },

  secondaryBtn: {
    flex: 1,
    background: "#f3f4f6",
    color: "#333",
    border: "1px solid #ddd",
    borderRadius: 14,
    padding: "14px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },

  summaryTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: "#222",
    marginBottom: 20,
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #eee",
    fontSize: 14,
  },

  totalBox: {
    marginTop: 20,
    paddingTop: 20,
    borderTop: "2px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 22,
    fontWeight: 700,
    color: "#111",
  },

  submitBtn: {
    width: "100%",
    marginTop: 24,
    background:
      "linear-gradient(135deg, #14b89a 0%, #0d8f78 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 16,
    padding: "16px",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(20,184,154,0.25)",
  },

  emptyText: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    padding: "20px 0",
  },
};

export default function SellParts() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [parts, setParts] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([
    { partId: "", quantity: 1 },
  ]);

  useEffect(() => {
    axios
      .get("/customers")
      .then((res) => setCustomers(res.data))
      .catch(console.error);

    axios
      .get("/parts")
      .then((res) => setParts(res.data))
      .catch(console.error);
  }, []);

  const addItem = () => {
    setItems([...items, { partId: "", quantity: 1 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const getPartById = (id) => {
    return parts.find(
      (p) => String(p.id) === String(id)
    );
  };

  const orderTotal = items.reduce((sum, item) => {
    const part = getPartById(item.partId);

    return (
      sum +
      (part
        ? part.price *
          (parseInt(item.quantity) || 0)
        : 0)
    );
  }, 0);

  function handleSubmit() {
    if (!customerId) {
      return alert("Please select a customer.");
    }

    if (items.some((i) => !i.partId)) {
      return alert(
        "Please select a part for each item."
      );
    }

    axios
      .post("/sales", { customerId, items })
      .then((res) =>
        navigate("/invoice", {
          state: { invoice: res.data },
        })
      )
      .catch(() =>
        alert("Error while selling.")
      );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        
        <div style={styles.header}>
          <h1 style={styles.title}>Sell Parts</h1>

          <p style={styles.subtitle}>
            Create a new sale and generate a professional invoice.
          </p>
        </div>

        <div style={styles.layout}>
          
          {/* LEFT SIDE */}
          <div style={styles.leftPanel}>
            
            <div style={styles.sectionTitle}>
              Customer Information
            </div>

            <div style={styles.card}>
              <label style={styles.fieldLabel}>
                Select Customer
              </label>

              <select
                style={styles.select}
                value={customerId}
                onChange={(e) =>
                  setCustomerId(e.target.value)
                }
              >
                <option value="">
                  Choose customer
                </option>

                {customers.map((c) => (
                  <option
                    key={c.id}
                    value={c.id}
                  >
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.sectionTitle}>
              Parts List
            </div>

            {items.map((item, index) => (
              <div
                key={index}
                style={styles.card}
              >
                <div style={styles.itemHeader}>
                  <span style={styles.itemLabel}>
                    Item {index + 1}
                  </span>

                  {items.length > 1 && (
                    <button
                      style={styles.removeBtn}
                      onClick={() =>
                        removeItem(index)
                      }
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div style={styles.twoCol}>
                  
                  <div>
                    <label
                      style={styles.fieldLabel}
                    >
                      Select Part
                    </label>

                    <select
                      style={styles.select}
                      value={item.partId}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "partId",
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        Choose part
                      </option>

                      {parts.map((p) => (
                        <option
                          key={p.id}
                          value={p.id}
                        >
                          {p.name} — Rs. {p.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      style={styles.fieldLabel}
                    >
                      Quantity
                    </label>

                    <input
                      type="number"
                      min="1"
                      style={styles.input}
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "quantity",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}

            <div style={styles.buttonRow}>
              
              <button
                style={styles.secondaryBtn}
                onClick={addItem}
              >
                + Add Item
              </button>

              <button
                style={styles.addBtn}
                onClick={() =>
                  navigate("/add-part")
                }
              >
                + Add New Part
              </button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div style={styles.rightPanel}>
            
            <h2 style={styles.summaryTitle}>
              Order Summary
            </h2>

            {items.every((i) => !i.partId) ? (
              <div style={styles.emptyText}>
                No parts selected yet.
              </div>
            ) : (
              items.map((item, i) => {
                const part = getPartById(
                  item.partId
                );

                if (!part) return null;

                return (
                  <div
                    key={i}
                    style={styles.summaryRow}
                  >
                    <span>
                      {part.name} ×{" "}
                      {item.quantity}
                    </span>

                    <span>
                      Rs.{" "}
                      {(
                        part.price *
                        (parseInt(
                          item.quantity
                        ) || 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                );
              })
            )}

            <div style={styles.totalBox}>
              <span>Total</span>

              <span>
                Rs.{" "}
                {orderTotal.toLocaleString()}
              </span>
            </div>

            <button
              style={styles.submitBtn}
              onClick={handleSubmit}
            >
              Complete Sale
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}