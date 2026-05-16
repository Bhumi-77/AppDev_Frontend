import { BrowserRouter, Routes, Route } from "react-router-dom";
import PendingCreditReminders from "./pages/Admin/PendingCreditReminders";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Admin/AdminDashboard";
import StaffManagement from "./pages/Admin/ManageStaff";
import FinancialReports from "./pages/Admin/FinancialReports";
import LowStockAlerts from "./pages/Admin/LowStockAlerts";
import Notifications from "./pages/Admin/Notifications";
import CustomerLayout from "./layouts/CustomerLayout";
import CustomerSignup from "./pages/customer/CustomerSignup";
import CustomerLogin from "./pages/customer/CustomerLogin";
import CustomerProfile from "./pages/customer/CustomerProfile";
import CustomerServices from "./pages/customer/CustomerServices";
import CustomerHistory from "./pages/customer/CustomerHistory";
import CustomerPurchase from "./pages/customer/CustomerPurchase";

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
