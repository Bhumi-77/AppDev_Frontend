import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

function AdminDashboard() {
  const currentYear = new Date().getFullYear();

  const [staffList, setStaffList] = useState([]);
  const [yearlyReport, setYearlyReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setError("");

      const staffResponse = await api.get("/staff");
      const reportResponse = await api.get(
        `/financialreports/yearly?year=${currentYear}`
      );

      setStaffList(staffResponse.data);
      setYearlyReport(reportResponse.data);
    } catch {
      setError("Failed to load dashboard data.");
    }
  };

  const formatCurrency = (value) => {
    return `Rs. ${Number(value || 0).toLocaleString()}`;
  };

  const totalStaff = staffList.length;
  const activeStaff = staffList.filter((staff) => staff.isActive).length;
  const adminCount = staffList.filter((staff) => staff.role === "Admin").length;
  const staffCount = staffList.filter((staff) => staff.role === "Staff").length;

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Dynamic overview of staff and financial performance.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 px-5 py-4 text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard title="Total Staff" value={totalStaff} />
          <DashboardCard title="Active Staff" value={activeStaff} />
          <DashboardCard
            title="Total Sales"
            value={formatCurrency(yearlyReport?.totalSales)}
          />
          <DashboardCard
            title="Total Revenue"
            value={formatCurrency(yearlyReport?.totalRevenue)}
          />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard title="Admins" value={adminCount} />
          <DashboardCard title="Staff Users" value={staffCount} />
          <DashboardCard
            title="Pending Credit"
            value={formatCurrency(yearlyReport?.pendingCreditAmount)}
          />
          <DashboardCard
            title="Total Invoices"
            value={yearlyReport?.totalInvoices || 0}
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Financial Summary ({currentYear})
            </h2>

            <div className="mt-5 space-y-4">
              <SummaryRow
                label="Total Sales"
                value={formatCurrency(yearlyReport?.totalSales)}
              />
              <SummaryRow
                label="Total Revenue"
                value={formatCurrency(yearlyReport?.totalRevenue)}
              />
              <SummaryRow
                label="Discounts Given"
                value={formatCurrency(yearlyReport?.totalDiscountsGiven)}
              />
              <SummaryRow
                label="Pending Credit"
                value={formatCurrency(yearlyReport?.pendingCreditAmount)}
              />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Top Selling Parts
            </h2>

            <div className="mt-5">
              {yearlyReport?.topSellingParts?.length > 0 ? (
                <div className="space-y-3">
                  {yearlyReport.topSellingParts.map((part) => (
                    <div
                      key={part.partId}
                      className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {part.partName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty Sold: {part.totalQuantitySold}
                        </p>
                      </div>

                      <span className="font-semibold text-gray-900">
                        {formatCurrency(part.totalSalesAmount)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl bg-gray-50 px-4 py-6 text-center text-gray-500">
                  No parts sold yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Management quick links for admin */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Management</h2>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/vendors"
              className="flex flex-col items-start gap-2 rounded-lg border border-gray-100 bg-gray-50 px-4 py-5 hover:shadow"
            >
              <span className="text-lg">🏭</span>
              <p className="font-semibold text-gray-800">Vendors</p>
              <p className="text-sm text-gray-500">Manage supplier records and purchase sources</p>
            </Link>

            <Link
              to="/parts"
              className="flex flex-col items-start gap-2 rounded-lg border border-gray-100 bg-gray-50 px-4 py-5 hover:shadow"
            >
              <span className="text-lg">📦</span>
              <p className="font-semibold text-gray-800">Parts</p>
              <p className="text-sm text-gray-500">View and edit parts catalog and stock</p>
            </Link>

            <Link
              to="/invoices"
              className="flex flex-col items-start gap-2 rounded-lg border border-gray-100 bg-gray-50 px-4 py-5 hover:shadow"
            >
              <span className="text-lg">🧾</span>
              <p className="font-semibold text-gray-800">Invoices</p>
              <p className="text-sm text-gray-500">Browse purchase and sales invoices</p>
            </Link>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Recent Staff</h2>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 font-semibold text-gray-600">ID</th>
                  <th className="px-5 py-3 font-semibold text-gray-600">
                    Full Name
                  </th>
                  <th className="px-5 py-3 font-semibold text-gray-600">
                    Email
                  </th>
                  <th className="px-5 py-3 font-semibold text-gray-600">
                    Role
                  </th>
                  <th className="px-5 py-3 font-semibold text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {staffList.slice(0, 5).map((staff) => (
                  <tr key={staff.id}>
                    <td className="px-5 py-4">#{staff.id}</td>
                    <td className="px-5 py-4 font-medium">
                      {staff.fullName}
                    </td>
                    <td className="px-5 py-4">{staff.email}</td>
                    <td className="px-5 py-4">{staff.role}</td>
                    <td className="px-5 py-4">
                      {staff.isActive ? "Active" : "Inactive"}
                    </td>
                  </tr>
                ))}

                {staffList.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-8 text-center text-gray-500"
                    >
                      No staff found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, value }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className="mt-3 text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
      <span className="font-medium text-gray-700">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}

export default AdminDashboard;
