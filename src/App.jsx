import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";

import SearchCustomer from "./pages/staff/SearchCustomer";
import CustomerDetails from "./pages/staff/CustomerDetails";
import FinancialReports from "./pages/Admin/FinancialReports";
import ManageStaff from "./pages/Admin/ManageStaff";

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <h2>Vehicle System</h2>

        <div>
          <Link to="/">Home</Link>
          <Link to="/admin/reports">Financial Reports</Link>
          <Link to="/admin/staff">Manage Staff</Link>
          <Link to="/staff/search-customer">Search Customer</Link>
          <Link to="/staff/customer-details">Customer Details</Link>
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <div className="page">
              <h1>Vehicle Parts Selling and Inventory Management System</h1>
              <p>Welcome to the dashboard.</p>
            </div>
          }
        />

        <Route path="/admin/reports" element={<FinancialReports />} />
        <Route path="/admin/staff" element={<ManageStaff />} />
        <Route path="/staff/search-customer" element={<SearchCustomer />} />
        <Route path="/staff/customer-details" element={<CustomerDetails id={1} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

