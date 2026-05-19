import { useEffect, useState } from "react";
import axios from "../../api/axios";

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg, #e0f7f4 0%, #f5f7fa 50%, #dff6ff 100%)",
    padding: "2rem",
    boxSizing: "border-box",
  },

  container: {
    width: "100%",
    maxWidth: 950,
    display: "flex",
    background: "#fff",
    borderRadius: 24,
    overflow: "hidden",
    boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
  },

  leftSection: {
    flex: 1,
    background:
      "linear-gradient(160deg, #14b89a 0%, #0d8f78 100%)",
    color: "#fff",
    padding: "3rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  brandTitle: {
    fontSize: 38,
    fontWeight: 700,
    marginBottom: 16,
    lineHeight: 1.2,
  },

  brandText: {
    fontSize: 16,
    lineHeight: 1.7,
    opacity: 0.95,
  },

  rightSection: {
    flex: 1,
    padding: "3rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  pageHeader: {
    marginBottom: "2rem",
  },

  title: {
    margin: 0,
    fontSize: 30,
    fontWeight: 700,
    color: "#222",
  },

  subtitle: {
    margin: "8px 0 0",
    fontSize: 15,
    color: "#777",
    lineHeight: 1.5,
  },

  successMsg: {
    fontSize: 14,
    color: "#1d4d16",
    background: "#eaf7e7",
    padding: "12px 16px",
    borderRadius: 10,
    marginBottom: 18,
    fontWeight: 500,
  },

  fieldGroup: {
    marginBottom: 20,
  },

  fieldLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "#555",
    display: "block",
    marginBottom: 8,
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    fontSize: 15,
    border: "1px solid #ddd",
    borderRadius: 12,
    outline: "none",
    boxSizing: "border-box",
    transition: "0.3s",
    background: "#fafafa",
  },

  submitBtn: {
    width: "100%",
    background:
      "linear-gradient(135deg, #14b89a 0%, #0f9f85 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 14,
    padding: "15px",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 10,
    boxShadow: "0 8px 20px rgba(20,184,154,0.25)",
    transition: "0.3s",
  },

  partCard: {
    border: "1px solid #eee",
    borderRadius: 12,
    padding: "14px",
    marginTop: 12,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  actionBtn: {
    padding: "8px 14px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
  },

  deleteBtn: {
    padding: "8px 14px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    background: "#FCEBEB",
    color: "#A32D2D",
    fontSize: 14,
  },
};

export default function AddPart() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [success, setSuccess] = useState(false);

  const [parts, setParts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchParts();
  }, []);

  async function fetchParts() {
    try {
      const res = await axios.get("/parts");
      setParts(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleSubmit() {
    if (!name || !price || !stock) {
      return alert("Please fill in all fields.");
    }

    try {
      await axios.post("/parts", {
        name,
        price: parseFloat(price),
        stock: parseInt(stock),
      });

      setSuccess(true);

      setName("");
      setPrice("");
      setStock("");

      fetchParts();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.log("ERROR:", err.response?.data);
      alert("Error adding part.");
    }
  }

  function startEdit(part) {
    setEditingId(part.id);

    setName(part.name);
    setPrice(part.price);
    setStock(part.stock);
  }

  async function updatePart() {
    try {
      await axios.put(`/parts/${editingId}`, {
        id: editingId,
        name,
        price: parseFloat(price),
        stock: parseInt(stock),
      });

      alert("Part updated successfully.");

      setEditingId(null);

      setName("");
      setPrice("");
      setStock("");

      fetchParts();
    } catch (err) {
      console.log(err);
      alert("Failed to update part.");
    }
  }

  async function deletePart(id) {
    const confirmDelete = window.confirm(
      "Delete this part?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`/parts/${id}`);

      setParts((prev) =>
        prev.filter((p) => p.id !== id)
      );
    } catch (err) {
      console.log(err);
      alert("Failed to delete part.");
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        
        {/* Left Side */}
        <div style={styles.leftSection}>
          <h1 style={styles.brandTitle}>
            Vehicle Parts
            <br />
            Inventory
          </h1>

          <p style={styles.brandText}>
            Manage your vehicle parts inventory efficiently.
            Add new parts, update stock quantities, and
            maintain pricing in a clean modern dashboard.
          </p>
        </div>

        {/* Right Side */}
        <div style={styles.rightSection}>
          
          <div style={styles.pageHeader}>
            <h2 style={styles.title}>
              {editingId ? "Edit Part" : "Add New Part"}
            </h2>

            <p style={styles.subtitle}>
              Fill in the details below to manage
              inventory parts.
            </p>
          </div>

          {success && (
            <div style={styles.successMsg}>
              ✓ Part added successfully!
            </div>
          )}

          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>
              Part Name
            </label>

            <input
              style={styles.input}
              type="text"
              placeholder="e.g. Brake Pad"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>
              Price (Rs.)
            </label>

            <input
              style={styles.input}
              type="number"
              placeholder="e.g. 850"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.fieldLabel}>
              Stock Quantity
            </label>

            <input
              style={styles.input}
              type="number"
              placeholder="e.g. 20"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          <button
            style={styles.submitBtn}
            onClick={
              editingId ? updatePart : handleSubmit
            }
          >
            {editingId ? "Update Part" : "Add Part"}
          </button>

          {/* Parts List */}
          <div style={{ marginTop: 30 }}>
            <h3>Parts List</h3>

            {parts.length === 0 ? (
              <p>No parts added yet.</p>
            ) : (
              parts.map((part) => (
                <div
                  key={part.id}
                  style={styles.partCard}
                >
                  <div>
                    <strong>{part.name}</strong>

                    <div
                      style={{
                        marginTop: 4,
                        color: "#666",
                      }}
                    >
                      Rs. {part.price} | Stock:{" "}
                      {part.stock}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                    }}
                  >
                    <button
                      style={styles.actionBtn}
                      onClick={() => startEdit(part)}
                    >
                      Edit
                    </button>

                    <button
                      style={styles.deleteBtn}
                      onClick={() =>
                        deletePart(part.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}