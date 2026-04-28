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

      {searched && (
        <p style={styles.meta}>
          {results.length} result{results.length !== 1 ? "s" : ""} found
        </p>
      )}

      {!searched && (
        <div style={styles.emptyState}>
          <p style={styles.emptyTitle}>Search for a customer</p>
          <p style={styles.emptySub}>Enter a name, phone number, or vehicle plate above</p>
        </div>
      )}

      {searched && results.length === 0 && (
        <div style={styles.emptyState}>
          <p style={styles.emptyTitle}>No customers found</p>
          <p style={styles.emptySub}>Try a different name, phone, or plate number</p>
        </div>
      )}

      {results.map((c) => (
        <div key={c.id} style={styles.card}>
          <div style={styles.avatar}>{getInitials(c.name)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={styles.custName}>{c.name}</p>
            <p style={styles.custPhone}>{c.phone}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
              {c.vehicles?.length > 0
                ? c.vehicles.map((v) => (
                    <span key={v.id} style={styles.badgeBlue}>{v.vehicleNumber}</span>
                  ))
                : <span style={styles.badgeGray}>No vehicles</span>}
            </div>
          </div>
          <button style={styles.viewBtn} onClick={() => navigate(`/customers/${c.id}`)}>
            View
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  wrapper: { padding: "1rem 0", fontFamily: "sans-serif" },
  searchRow: { display: "flex", gap: 10, marginBottom: "1.5rem" },
  input: { flex: 1, fontSize: 14, padding: "8px 14px", border: "0.5px solid #ccc", borderRadius: 8, boxSizing: "border-box" },
  searchBtn: { fontSize: 14, padding: "8px 20px", border: "none", borderRadius: 8, background: "#E6F1FB", color: "#0C447C", fontWeight: 500, cursor: "pointer" },
  meta: { fontSize: 13, color: "#888", marginBottom: 12 },
  card: { background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 12, padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },
  avatar: { width: 42, height: 42, borderRadius: "50%", background: "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500, fontSize: 14, color: "#0C447C", flexShrink: 0 },
  custName: { margin: 0, fontSize: 15, fontWeight: 500 },
  custPhone: { margin: "2px 0 0", fontSize: 13, color: "#888" },
  viewBtn: { marginLeft: "auto", fontSize: 13, padding: "5px 14px", border: "0.5px solid #ccc", borderRadius: 8, background: "transparent", color: "#555", cursor: "pointer" },
  badgeBlue: { display: "inline-block", fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 99, background: "#E6F1FB", color: "#0C447C" },
  badgeGray: { display: "inline-block", fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 99, background: "#f5f5f5", color: "#888" },
  emptyState: { textAlign: "center", padding: "2.5rem 0" },
  emptyTitle: { margin: 0, fontWeight: 500, fontSize: 15 },
  emptySub: { margin: "4px 0 0", fontSize: 13, color: "#888" },
};