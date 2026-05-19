import { useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function SearchCustomer() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [editingVehicle, setEditingVehicle] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  const navigate = useNavigate();

  function getInitials(name) {
    return (
      name
        ?.split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) ?? "?"
    );
  }

  async function handleSearch() {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const res = await axios.get(
        `/customers/search?query=${query}`
      );

      setResults(res.data);
    } catch (err) {
      console.log(err);
      setResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }

  function startEdit(vehicle) {
    setEditingVehicle(vehicle.id);

    setVehicleNumber(vehicle.vehicleNumber || "");
    setModel(vehicle.model || "");
    setYear(vehicle.year || "");
  }

  async function updateVehicle(customerId) {
    try {
      await axios.put(`/vehicles/${editingVehicle}`, {
        id: editingVehicle,
        vehicleNumber,
        model,
        year,
        customerId,
      });

      alert("Vehicle updated successfully");

      setEditingVehicle(null);

      handleSearch();
    } catch (err) {
      console.log(err);
      alert("Failed to update vehicle");
    }
  }

  async function deleteVehicle(id) {
    const confirmDelete = window.confirm(
      "Delete this vehicle?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`/vehicles/${id}`);

      alert("Vehicle deleted");

      handleSearch();
    } catch (err) {
      console.log(err);
      alert("Failed to delete vehicle");
    }
  }

  return (
    <div style={styles.wrapper}>
      {/* Search Bar */}
      <div style={styles.searchRow}>
        <input
          style={styles.input}
          placeholder="Search by customer, phone, vehicle number or model..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && handleSearch()
          }
        />

        <button
          style={styles.searchBtn}
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Result Count */}
      {searched && (
        <p style={styles.meta}>
          {results.length} result
          {results.length !== 1 ? "s" : ""} found
        </p>
      )}

      {/* Initial Empty State */}
      {!searched && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🔍</div>

          <p style={styles.emptyTitle}>
            Search for a customer
          </p>

          <p style={styles.emptySub}>
            Enter a customer name, phone,
            vehicle number, or vehicle model.
          </p>
        </div>
      )}

      {/* No Results */}
      {searched && results.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>😕</div>

          <p style={styles.emptyTitle}>
            No customers found
          </p>

          <p style={styles.emptySub}>
            Try another keyword.
          </p>
        </div>
      )}

      {/* Results */}
      <div style={styles.resultsList}>
        {results.map((c) => (
          <div key={c.id} style={styles.card}>
            {/* Avatar */}
            <div style={styles.avatar}>
              {getInitials(c.name)}
            </div>

            {/* Customer Info */}
            <div style={{ flex: 1 }}>
              <p style={styles.custName}>
                {c.name}
              </p>

              <p style={styles.custPhone}>
                {c.phone}
              </p>

              {/* Vehicles */}
              <div style={styles.vehicleContainer}>
                {c.vehicles?.length > 0 ? (
                  c.vehicles.map((v) => (
                    <div
                      key={v.id}
                      style={styles.vehicleCard}
                    >
                      {editingVehicle === v.id ? (
                        <>
                          <input
                            style={{
                              ...styles.input,
                              marginBottom: 8,
                            }}
                            placeholder="Vehicle Number"
                            value={vehicleNumber}
                            onChange={(e) =>
                              setVehicleNumber(
                                e.target.value
                              )
                            }
                          />

                          <input
                            style={{
                              ...styles.input,
                              marginBottom: 8,
                            }}
                            placeholder="Model"
                            value={model}
                            onChange={(e) =>
                              setModel(
                                e.target.value
                              )
                            }
                          />

                          <input
                            style={{
                              ...styles.input,
                              marginBottom: 8,
                            }}
                            placeholder="Year"
                            value={year}
                            onChange={(e) =>
                              setYear(
                                e.target.value
                              )
                            }
                          />

                          <div style={styles.actionRow}>
                            <button
                              style={styles.editBtn}
                              onClick={() =>
                                updateVehicle(c.id)
                              }
                            >
                              Save
                            </button>

                            <button
                              style={styles.cancelBtn}
                              onClick={() =>
                                setEditingVehicle(
                                  null
                                )
                              }
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              flexWrap: "wrap",
                            }}
                          >
                            <span
                              style={
                                styles.badgeTeal
                              }
                            >
                              {v.vehicleNumber}
                            </span>

                            <span
                              style={
                                styles.vehicleText
                              }
                            >
                              {v.model} · {v.year}
                            </span>
                          </div>

                          <div
                            style={styles.actionRow}
                          >
                            <button
                              style={
                                styles.editBtn
                              }
                              onClick={() =>
                                startEdit(v)
                              }
                            >
                              Edit
                            </button>

                            <button
                              style={
                                styles.deleteBtn
                              }
                              onClick={() =>
                                deleteVehicle(
                                  v.id
                                )
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <span style={styles.badgeGray}>
                    No vehicles
                  </span>
                )}
              </div>
            </div>

            {/* View Button */}
            <button
              style={styles.viewBtn}
              onClick={() =>
                navigate(`/customers/${c.id}`)
              }
            >
              View →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: "0.5rem 0 2rem",
  },

  searchRow: {
    display: "flex",
    gap: 10,
    marginBottom: "1.5rem",
  },

  input: {
    flex: 1,
    fontSize: 14,
    padding: "10px 16px",
    border: "0.5px solid #ddd",
    borderRadius: 10,
    outline: "none",
    background: "#fff",
    boxSizing: "border-box",
  },

  searchBtn: {
    fontSize: 14,
    padding: "10px 28px",
    border: "none",
    borderRadius: 10,
    background: "#14b89a",
    color: "#fff",
    fontWeight: 500,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  meta: {
    fontSize: 13,
    color: "#888",
    marginBottom: 12,
  },

  resultsList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  card: {
    background: "#fff",
    border: "0.5px solid #e0e0e0",
    borderRadius: 12,
    padding: "1rem 1.25rem",
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: "50%",
    background: "#0f1b2d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    fontSize: 15,
    color: "#14b89a",
    flexShrink: 0,
  },

  custName: {
    margin: 0,
    fontSize: 15,
    fontWeight: 600,
  },

  custPhone: {
    margin: "4px 0 0",
    fontSize: 13,
    color: "#888",
  },

  vehicleContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 12,
  },

  vehicleCard: {
    border: "1px solid #eee",
    borderRadius: 10,
    padding: 10,
    background: "#fafafa",
  },

  vehicleText: {
    fontSize: 12,
    color: "#666",
  },

  actionRow: {
    marginTop: 10,
    display: "flex",
    gap: 8,
  },

  viewBtn: {
    marginLeft: "auto",
    fontSize: 13,
    padding: "7px 18px",
    border: "none",
    borderRadius: 8,
    background: "#14b89a",
    color: "#fff",
    fontWeight: 500,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  badgeTeal: {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 500,
    padding: "2px 8px",
    borderRadius: 99,
    background: "#d0f5ee",
    color: "#0a6b56",
  },

  badgeGray: {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 500,
    padding: "2px 8px",
    borderRadius: 99,
    background: "#f5f5f5",
    color: "#888",
  },

  editBtn: {
    padding: "6px 14px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    background: "#14b89a",
    color: "#fff",
    fontSize: 12,
  },

  deleteBtn: {
    padding: "6px 14px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    background: "#FCEBEB",
    color: "#A32D2D",
    fontSize: 12,
  },

  cancelBtn: {
    padding: "6px 14px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    background: "#eee",
    color: "#333",
    fontSize: 12,
  },

  emptyState: {
    textAlign: "center",
    padding: "4rem 0",
  },

  emptyIcon: {
    fontSize: 36,
    marginBottom: 12,
  },

  emptyTitle: {
    margin: 0,
    fontWeight: 500,
    fontSize: 15,
    color: "#333",
  },

  emptySub: {
    margin: "6px 0 0",
    fontSize: 13,
    color: "#aaa",
  },
};