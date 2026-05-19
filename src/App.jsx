import { Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
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
<<<<<<< HEAD
import PendingCreditReminders from "./pages/Admin/PendingCreditReminders";

// Customer Pages
=======
import CustomerLayout from "./layouts/CustomerLayout";
>>>>>>> 71052fa15d25b50068e3316a32f4943c090e430e
import CustomerSignup from "./pages/customer/CustomerSignup";
import CustomerLogin from "./pages/customer/CustomerLogin";
import CustomerProfile from "./pages/customer/CustomerProfile";
import CustomerServices from "./pages/customer/CustomerServices";
import CustomerHistory from "./pages/customer/CustomerHistory";
import CustomerPurchase from "./pages/customer/CustomerPurchase";

<<<<<<< HEAD
// Vendor / Purchase Pages (incoming branch)
import VendorPage from './pages/VendorPage';
import PartsPage from './pages/PartsPage';
import PurchaseInvoicePage from './pages/PurchaseInvoicePage';

// Layout Link Structures based on user credentials
const STAFF_NAV_ITEMS = [
  { to: "/dashboard",           label: "Dashboard",       icon: "⊞" },
  { to: "/",                    label: "Search Customer", icon: "🔍" },
  { to: "/sell-parts",          label: "Sell Parts",      icon: "🛒" },
  { to: "/add-part",            label: "Add Part",        icon: "📦" },
  { to: "/invoice",             label: "Invoice",         icon: "🧾" },
];

const ADMIN_NAV_ITEMS = [
  { to: "/admin",                    label: "Dashboard",        icon: "⊞" },
  { to: "/admin/staff-management",   label: "Manage Staff",     icon: "👥" },
  { to: "/admin/financial-reports",  label: "Finance Reports",  icon: "💰" },
  { to: "/admin/low-stock-alerts",   label: "Low Stock",        icon: "⚠️" },
  { to: "/admin/register-customer",  label: "Reg Customer",     icon: "📝" },
];

function Sidebar() {
  const location = useLocation();
  const userRole = sessionStorage.getItem("role") || "staff"; 
  const rawUser = sessionStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : { fullName: "System User" };

  // Render the appropriate context menu options based on authentication state
  const currentNavItems = userRole === "admin" ? ADMIN_NAV_ITEMS : STAFF_NAV_ITEMS;

  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>
        <div style={styles.brandIcon}>
          <span style={{ fontSize: 20 }}>⚙️</span>
        </div>
        <div>
          <div style={styles.brandName}>AUTOPART</div>
          <div style={styles.brandSub}>{userRole.toUpperCase()} PANEL</div>
        </div>
      </div>

      <nav style={styles.sideNav}>
        {currentNavItems.map(({ to, label, icon }) => {
          const active =
            location.pathname === to ||
            (to !== "/" && to !== "/admin" && location.pathname.startsWith(to));
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
        <div style={styles.userAvatar}>
          {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
        </div>
        <div>
          <div style={styles.userName}>{user.fullName || "Active User"}</div>
          <div style={styles.userRole}>
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Member
          </div>
        </div>
      </div>
    </aside>
  );
}

function TopBar() {
  const userRole = sessionStorage.getItem("role") || "staff";
  const rawUser = sessionStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : { fullName: "System User" };

  const avatarInitials = user.fullName
    ? user.fullName.split(" ").map(n => n[0]).join("").toUpperCase()
    : "SU";

  return (
    <header style={styles.topBar}>
      <div style={styles.topBarRight}>
        <button style={styles.iconBtn}>🔔</button>
        <div style={styles.topUserChip}>
          <div style={styles.topAvatar}>{avatarInitials}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{user.fullName}</div>
            <div style={{ fontSize: 11, color: "#888" }}>
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Member
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Wrapper structure component handling consistent layout decoration
function SharedShellLayout() {
  return (
    <div style={styles.shell}>
      <Sidebar />
      <div style={styles.main}>
        <TopBar />
        <div style={styles.content}>
          <Routes>
            {/* Staff Workflows */}
            <Route path="/"               element={<SearchCustomer />} />
            <Route path="/dashboard"      element={<StaffDashboard />} />
            <Route path="/customers/:id"  element={<CustomerDetails />} />
            <Route path="/sell-parts"     element={<SellParts />} />
            <Route path="/add-part"       element={<AddPart />} />
            <Route path="/invoice"        element={<InvoicePage />} />
            <Route path="/invoice/:id"    element={<InvoicePage />} />

            {/* Admin Workflows Nested in Shared Frame context */}
            <Route path="/admin-dashboard"           element={<Dashboard />} />
            <Route path="/admin/staff-management"   element={<StaffManagement />} />
            <Route path="/admin/financial-reports"  element={<FinancialReports />} />
            <Route path="/admin/low-stock-alerts"   element={<LowStockAlerts />} />
            <Route path="/admin/notifications"      element={<Notifications />} />
            <Route path="/admin/staff-reports"      element={<StaffReports />} />
            <Route path="/admin/register-customer"  element={<RegisterCustomer />} />
            <Route path="/admin/pending-credit-reminders" element={<PendingCreditReminders />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  const userRole = sessionStorage.getItem("role");

  return (
    <Routes>
      {/* Root/Index Redirect Route handling based on active profile session status */}
      <Route 
        path="/" 
        element={
          userRole === "admin" ? (
            <Navigate to="/admin" replace />
          ) : userRole === "staff" ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />

      {/* Auth Entry points */}
      <Route path="/login" element={<CustomerLogin />} />
      <Route path="/signup" element={<CustomerSignup />} />
      <Route path="/profile" element={<Navigate to="/login" replace />} />

      {/* Dedicated structural layout prefix fallback definitions */}
      <Route path="/admin" element={<SharedShellLayout />}>
        <Route index element={<Dashboard />} />
      </Route>

      <Route path="/vendors" element={<VendorPage />} />
      <Route path="/parts" element={<PartsPage />} />
      <Route path="/invoices" element={<PurchaseInvoicePage />} />

      {/* Catch-all global routing wrapper shell fall-through handling metrics */}
      <Route path="/*" element={<SharedShellLayout />} />
    </Routes>
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
=======
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer auth (Feature 12) */}
        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/signup" element={<CustomerSignup />} />

        {/* Customer portal (Features 12, 13, 14, 16) */}
        <Route element={<CustomerLayout />}>
          <Route path="/profile" element={<CustomerProfile />} />
          <Route path="/services" element={<CustomerServices />} />
          <Route path="/purchase" element={<CustomerPurchase />} />
          <Route path="/history" element={<CustomerHistory />} />
        </Route>

        {/* Admin portal */}
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="staff-management" element={<StaffManagement />} />
          <Route path="financial-reports" element={<FinancialReports />} />
          <Route path="low-stock-alerts" element={<LowStockAlerts />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="pending-credit-reminders" element={<PendingCreditReminders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
>>>>>>> 71052fa15d25b50068e3316a32f4943c090e430e
