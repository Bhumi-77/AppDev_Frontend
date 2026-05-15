import { useState } from "react";
import api from "../../api/axios";

function FinancialReports() {
  const [reportType, setReportType] = useState("daily");
  const [date, setDate] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    try {
      setError("");
      setReport(null);

      let response;

      if (reportType === "daily") {
        response = await api.get(`/financialreports/daily?date=${date}`);
      } else if (reportType === "monthly") {
        response = await api.get(
          `/financialreports/monthly?year=${year}&month=${month}`
        );
      } else {
        response = await api.get(`/financialreports/yearly?year=${year}`);
      }

      setReport(response.data);
    } catch (err) {
      setError("Failed to load report.");
    }
  };

  return (
    <div className="page">
      <h2>Financial Reports</h2>

      <div className="card">
        <label>Report Type</label>
        <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        {reportType === "daily" && (
          <>
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </>
        )}

        {reportType === "monthly" && (
          <>
            <label>Year</label>
            <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="2026" />

            <label>Month</label>
            <input value={month} onChange={(e) => setMonth(e.target.value)} placeholder="1-12" />
          </>
        )}

        {reportType === "yearly" && (
          <>
            <label>Year</label>
            <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="2026" />
          </>
        )}

        <button onClick={fetchReport}>Generate Report</button>
      </div>

      {error && <p className="error">{error}</p>}

      {report && (
        <div className="card">
          <h3>{report.reportType} Report</h3>
          <p>Total Sales: Rs. {report.totalSales}</p>
          <p>Total Paid: Rs. {report.totalPaid}</p>
          <p>Total Credit: Rs. {report.totalCredit}</p>
          <p>Total Invoices: {report.totalInvoices}</p>
        </div>
      )}
    </div>
  );
}

export default FinancialReports;