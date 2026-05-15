import { BrowserRouter, Routes, Route } from "react-router-dom";
import PendingCreditReminders from "./pages/Admin/PendingCreditReminders";
import AdminLayout from "./layouts/AdminLayout";

import Dashboard from "./pages/Admin/AdminDashboard";
import StaffManagement from "./pages/Admin/ManageStaff";
import FinancialReports from "./pages/Admin/FinancialReports";
import LowStockAlerts from "./pages/Admin/LowStockAlerts";
import Notifications from "./pages/Admin/Notifications";

function App() {
  return (
    <BrowserRouter>
      <Routes>
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