import { useState } from "react";
import axios from "../../api/axios";

export default function StaffReports() {
  const [type, setType] = useState("regulars");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);

  async function generate() {
    setLoading(true);
    setError(null);
    setRows([]);
    try {
      const q = new URLSearchParams({ type, from, to }).toString();
      const res = await axios.get(`/reports/customers?${q}`);
      setRows(res.data || []);
    } catch (e) {
      setError("Failed to load report. If backend is not running this will be empty.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <h2 style={{ margin: 0, marginBottom: 12 }}>Customer Reports</h2>

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
        <select value={type} onChange={(e) => setType(e.target.value)} style={{ padding: 8, borderRadius: 8 }}>
          <option value="regulars">Regular Customers</option>
          <option value="high-spenders">High Spenders</option>
          <option value="pending-credits">Pending Credits</option>
        </select>

        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} style={{ padding: 8, borderRadius: 8 }} />
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} style={{ padding: 8, borderRadius: 8 }} />

        <button onClick={generate} style={{ padding: "8px 16px", borderRadius: 8, background: "#E6F1FB", color: "#0C447C", border: "none", cursor: "pointer" }}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {error && <p style={{ color: "#a32d2d" }}>{error}</p>}

      <div style={{ background: "#fff", borderRadius: 8, padding: 12, border: "0.5px solid #e0e0e0" }}>
        {rows.length === 0 ? (
          <p style={{ color: "#888" }}>No results. Click Generate to run the report.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
                <th style={{ padding: 8 }}>Customer</th>
                <th style={{ padding: 8 }}>Phone</th>
                <th style={{ padding: 8 }}>Metric</th>
                <th style={{ padding: 8 }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #fafafa" }}>
                  <td style={{ padding: 8 }}>{r.name}</td>
                  <td style={{ padding: 8 }}>{r.phone}</td>
                  <td style={{ padding: 8 }}>{r.metric ?? r.total ?? "-"}</td>
                  <td style={{ padding: 8 }}>{r.details ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
