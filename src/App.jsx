import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import './App.css';

// Staff Pages
import SearchCustomer from "./pages/staff/SearchCustomer";
import CustomerDetails from "./pages/staff/CustomerDetails";
import SellParts from "./pages/staff/SellParts.jsx";
import InvoicePage from "./pages/staff/InvoicePage";
import StaffDashboard from "./pages/staff/StaffDashboard";
import AddPart from "./pages/staff/Addparts.jsx";
import StaffReports from "./pages/staff/StaffReports";
import RegisterCustomer from "./pages/staff/RegisterCustomer";

// Admin Pages
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Admin/AdminDashboard";
import StaffManagement from "./pages/Admin/ManageStaff";
import FinancialReports from "./pages/Admin/FinancialReports";
import LowStockAlerts from "./pages/Admin/LowStockAlerts";
import Notifications from "./pages/Admin/Notifications";
import PendingCreditReminders from "./pages/Admin/PendingCreditReminders";

// Customer Pages
import CustomerSignup from "./pages/customer/CustomerSignup";
import CustomerProfile from "./pages/customer/CustomerProfile";
import CustomerLogin from "./pages/customer/CustomerLogin";

const NAV_ITEMS = [
  { to: "/dashboard",  label: "Dashboard",       icon: "⊞" },
  { to: "/",           label: "Search Customer", icon: "🔍" },
  { to: "/sell-parts", label: "Sell Parts",      icon: "🛒" },
  { to: "/add-part",   label: "Add Part",        icon: "📦" },
  { to: "/invoice",    label: "Invoice",         icon: "🧾" },
];

function Sidebar() {
  const location = useLocation();
  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>
        <div style={styles.brandIcon}>
          <span style={{ fontSize: 20 }}>⚙️</span>
        </div>
        <div>
          <div style={styles.brandName}>AUTOPART</div>
          <div style={styles.brandSub}>STAFF PANEL</div>
        </div>
      </div>

      <nav style={styles.sideNav}>
        {NAV_ITEMS.map(({ to, label, icon }) => {
          const active =
            location.pathname === to ||
            (to !== "/" && location.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              style={{ ...styles.navItem, ...(active ? styles.navItemActive : {}) }}
            >
              <span style={styles.navIcon}>{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={styles.sidebarFooter}>
        <div style={styles.userAvatar}>S</div>
        <div>
          <div style={styles.userName}>Staff User</div>
          <div style={styles.userRole}>Staff Member</div>
        </div>
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <header style={styles.topBar}>
      <div style={styles.topBarRight}>
        <button style={styles.iconBtn}>🔔</button>
        <div style={styles.topUserChip}>
          <div style={styles.topAvatar}>SU</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Staff User</div>
            <div style={{ fontSize: 11, color: "#888" }}>Staff Member</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function AppLayout() {
  return (
    <div style={styles.shell}>
      <Sidebar />
      <div style={styles.main}>
        <TopBar />
        <div style={styles.content}>
          <Routes>
            {/* Staff Routes */}
            <Route path="/"              element={<SearchCustomer />} />
            <Route path="/dashboard"     element={<StaffDashboard />} />
            <Route path="/customers/:id" element={<CustomerDetails />} />
            <Route path="/sell-parts"    element={<SellParts />} />
            <Route path="/add-part"      element={<AddPart />} />
            <Route path="/invoice"       element={<InvoicePage />} />
            <Route path="/invoice/:id"   element={<InvoicePage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/signup" element={<CustomerSignup />} />
        <Route path="/profile" element={<CustomerProfile />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="staff-management" element={<StaffManagement />} />
          <Route path="financial-reports" element={<FinancialReports />} />
          <Route path="low-stock-alerts" element={<LowStockAlerts />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="staff-reports" element={<StaffReports />} />
          <Route path="register-customer" element={<RegisterCustomer />} />
          <Route path="customers/:id" element={<CustomerDetails />} />
          <Route path="pending-credit-reminders" element={<PendingCreditReminders />} />
        </Route>

        {/* Staff Layout Fallback Structure */}
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

const styles = {
  shell: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "sans-serif",
    background: "#f4f6f8",
  },
  sidebar: {
    width: 240,
    background: "#0f1b2d",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    position: "fixed",
    top: 0, left: 0, bottom: 0,
    zIndex: 100,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "20px 20px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  },
  brandIcon: {
    width: 36, height: 36,
    background: "#14b89a",
    borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  brandName: { fontSize: 15, fontWeight: 700, letterSpacing: "0.08em", color: "#fff" },
  brandSub:  { fontSize: 10, color: "#14b89a", letterSpacing: "0.12em", fontWeight: 500 },
  sideNav: {
    flex: 1,
    padding: "12px 10px",
    display: "flex", flexDirection: "column", gap: 2,
  },
  navItem: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 12px",
    borderRadius: 8,
    fontSize: 14, color: "#a0aec0",
    textDecoration: "none",
    transition: "background 0.15s, color 0.15s",
  },
  navItemActive: {
    background: "#14b89a",
    color: "#fff",
    fontWeight: 500,
  },
  navIcon: { fontSize: 16, width: 20, textAlign: "center" },
  sidebarFooter: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "14px 16px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
  },
  userAvatar: {
    width: 34, height: 34, borderRadius: "50%",
    background: "#14b89a",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, fontWeight: 600, color: "#fff",
  },
  userName: { fontSize: 13, fontWeight: 500, color: "#fff" },
  userRole: { fontSize: 11, color: "#718096" },
  main: {
    marginLeft: 240,
    flex: 1,
    display: "flex", flexDirection: "column",
    minHeight: "100vh",
  },
  topBar: {
    display: "flex", alignItems: "center", justifyContent: "flex-end",
    padding: "10px 24px",
    background: "#fff",
    borderBottom: "1px solid #e8ecf0",
    position: "sticky", top: 0, zIndex: 50,
  },
  topBarRight: { display: "flex", alignItems: "center", gap: 12 },
  iconBtn: {
    background: "none", border: "none",
    fontSize: 18, cursor: "pointer", color: "#555",
    padding: "4px 8px",
  },
  topUserChip: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "4px 10px",
    borderRadius: 8,
    cursor: "pointer",
  },
  topAvatar: {
    width: 34, height: 34, borderRadius: "50%",
    background: "#0f1b2d",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 600, color: "#14b89a",
  },
  content: { padding: "28px 32px", flex: 1 },
};

export default App;
