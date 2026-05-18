import { useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function SearchCustomer() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  function getInitials(name) {
    return name?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) ?? "?";
  }

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(`/customers/search?query=${query}`);
      setResults(res.data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }

  return (
    <div style={styles.wrapper}>

      {/* <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Search Customer</h1>
          <p style={styles.subtitle}>Find a customer by name, phone, or vehicle plate.</p>
        </div>
      </div> */}

      {/* Search bar */}
      <div style={styles.searchRow}>
        <input
          style={styles.input}
          placeholder="Search by name, phone or vehicle number..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button style={styles.searchBtn} onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Result count */}
      {searched && (
        <p style={styles.meta}>
          {results.length} result{results.length !== 1 ? "s" : ""} found
        </p>
      )}

      {/* Initial empty state */}
      {!searched && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🔍</div>
          <p style={styles.emptyTitle}>Search for a customer</p>
          <p style={styles.emptySub}>Enter a name, phone number, or vehicle plate above</p>
        </div>
      )}

      {/* No results */}
      {searched && results.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>😕</div>
          <p style={styles.emptyTitle}>No customers found</p>
          <p style={styles.emptySub}>Try a different name, phone, or plate number</p>
        </div>
      )}

      {/* Results */}
      <div style={styles.resultsList}>
        {results.map((c) => (
          <div key={c.id} style={styles.card}>
            <div style={styles.avatar}>{getInitials(c.name)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={styles.custName}>{c.name}</p>
              <p style={styles.custPhone}>{c.phone}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                {c.vehicles?.length > 0
                  ? c.vehicles.map((v) => (
                      <span key={v.id} style={styles.badgeTeal}>{v.vehicleNumber}</span>
                    ))
                  : <span style={styles.badgeGray}>No vehicles</span>}
              </div>
            </div>
            <button style={styles.viewBtn} onClick={() => navigate(`/customers/${c.id}`)}>
              View →
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}

const styles = {
  wrapper: { padding: "0.5rem 0 2rem" },
  pageHeader: { marginBottom: "1.5rem" },
  title: { margin: 0, fontSize: 22, fontWeight: 500 },
  subtitle: { margin: "4px 0 0", fontSize: 14, color: "#888" },

  searchRow: {
    display: "flex", gap: 10,
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

  meta: { fontSize: 13, color: "#888", marginBottom: 12 },

  resultsList: { display: "flex", flexDirection: "column", gap: 10 },
  card: {
    background: "#fff",
    border: "0.5px solid #e0e0e0",
    borderRadius: 12,
    padding: "1rem 1.25rem",
    display: "flex", alignItems: "center", gap: 14,
  },
  avatar: {
    width: 46, height: 46, borderRadius: "50%",
    background: "#0f1b2d",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 600, fontSize: 15, color: "#14b89a", flexShrink: 0,
  },
  custName: { margin: 0, fontSize: 15, fontWeight: 500 },
  custPhone: { margin: "2px 0 0", fontSize: 13, color: "#888" },
  viewBtn: {
    marginLeft: "auto",
    fontSize: 13, padding: "7px 18px",
    border: "none", borderRadius: 8,
    background: "#14b89a", color: "#fff",
    fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap",
  },

  badgeTeal: { display: "inline-block", fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 99, background: "#d0f5ee", color: "#0a6b56" },
  badgeGray: { display: "inline-block", fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 99, background: "#f5f5f5", color: "#888" },

  emptyState: { textAlign: "center", padding: "4rem 0" },
  emptyIcon: { fontSize: 36, marginBottom: 12 },
  emptyTitle: { margin: 0, fontWeight: 500, fontSize: 15, color: "#333" },
  emptySub: { margin: "6px 0 0", fontSize: 13, color: "#aaa" },
};