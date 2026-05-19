import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import axios from "../../api/axios";
import { clearSession } from "../../api/auth";

const styles = {
  wrapper: { padding: "0.5rem 0 2rem" },
  pageHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" },
  title: { margin: 0, fontSize: 22, fontWeight: 500 },
  logoutButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "0.65rem 1rem",
    background: "#f8fafc",
    color: "#0f172a",
    borderRadius: 999,
    border: "1px solid #cbd5e1",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
  },
  subtitle: { margin: "4px 0 0", fontSize: 14, color: "#888" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: "2rem" },
  statCard: { background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 12, padding: "1.1rem 1.25rem" },
  statLabel: { fontSize: 11, fontWeight: 500, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" },
  statValue: { fontSize: 26, fontWeight: 500, margin: 0, color: "#0f1b2d" },
  iconWrap: { width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 12 },
  sectionLabel: { fontSize: 11, fontWeight: 500, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" },
  actionsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 },
  actionCard: { background: "#fff", border: "0.5px solid #e0e0e0", borderRadius: 12, padding: "1.25rem 1.5rem", textDecoration: "none", display: "block" },
  actionTitle: { margin: "0 0 4px", fontSize: 14, fontWeight: 500, color: "#0f1b2d" },
  actionSub: { margin: 0, fontSize: 13, color: "#888" },
};

const ACTIONS = [
  { to: "/dashboard", label: "Dashboard", sub: "Overview and stats", icon: "⊞", bg: "#EAF8F4" },
  { to: "/search", label: "Search customers", sub: "Find by name, phone, or plate", icon: "🔍", bg: "#E6F1FB" },
  { to: "/register-customer", label: "Register Customer", sub: "Create customer accounts", icon: "📝", bg: "#FFF7ED" },
  { to: "/vendors", label: "Vendors", sub: "Manage supplier records", icon: "🏭", bg: "#FFF4E6" },
  { to: "/sell-parts", label: "Sell parts", sub: "Create sales and invoices", icon: "🛒", bg: "#E8F7FF" },
  { to: "/add-part", label: "Add Part", sub: "Add new part to catalog", icon: "📦", bg: "#F0FFF4" },
  { to: "/parts", label: "Parts", sub: "Browse and edit parts catalog", icon: "📚", bg: "#EAF3DE" },
  { to: "/invoices", label: "Invoices", sub: "View and manage billing", icon: "🧾", bg: "#FAEEDA" },
  { to: "/admin/staff-reports", label: "Staff Reports", sub: "View staff reports", icon: "📊", bg: "#FFF4F0" },
];

export default function StaffDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  const [data, setData] = useState({
    totalCustomers: 0,
    totalParts: 0,
    totalInvoices: 0,
    totalSales: 0,
  });

  useEffect(() => {
    axios.get("/dashboard")
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  const stats = [
    { label: "Total Customers", value: data.totalCustomers, icon: "👤", bg: "#E6F1FB" },
    { label: "Total Parts",     value: data.totalParts,     icon: "📦", bg: "#EAF3DE" },
    { label: "Total Invoices",  value: data.totalInvoices,  icon: "🧾", bg: "#FAEEDA" },
    { label: "Total Sales",     value: `Rs. ${Number(data.totalSales).toLocaleString()}`, icon: "💰", bg: "#d0f5ee" },
  ];

  return (
    <div style={styles.wrapper}>

      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Staff Dashboard</h1>
          <p style={styles.subtitle}>Welcome back — here's an overview of the system.</p>
        </div>
        <button type="button" style={styles.logoutButton} onClick={handleLogout}>
          <LogOut size={16} />
          Logout
        </button>
      </div>

      <div style={styles.statsGrid}>
        {stats.map((s) => (
          <div key={s.label} style={styles.statCard}>
            <div style={{ ...styles.iconWrap, background: s.bg }}>{s.icon}</div>
            <p style={styles.statLabel}>{s.label}</p>
            <p style={styles.statValue}>{s.value}</p>
          </div>
        ))}
      </div>

      <p style={styles.sectionLabel}>Quick actions</p>
      <div style={styles.actionsGrid}>
        {ACTIONS.map((a) => (
          <Link key={a.to} to={a.to} style={styles.actionCard}>
            <div style={{ ...styles.iconWrap, background: a.bg }}>{a.icon}</div>
            <p style={styles.actionTitle}>{a.label}</p>
            <p style={styles.actionSub}>{a.sub}</p>
          </Link>
        ))}
      </div>

    </div>
  );
}