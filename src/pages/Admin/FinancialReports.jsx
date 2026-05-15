import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../api/axios";
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Receipt, 
  FileText, 
  Percent, 
  Calendar as CalendarIcon 
} from "lucide-react";

const FinancialReports = () => {
  const [reportType, setReportType] = useState("daily");
  const [date, setDate] = useState("");
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    try {
      setError("");
      setReport(null);
      setLoading(true);

      let response;
      if (reportType === "daily") {
        response = await api.get(`/financialreports/daily?date=${date}`);
      } else if (reportType === "monthly") {
        response = await api.get(`/financialreports/monthly?year=${year}&month=${month}`);
      } else {
        response = await api.get(`/financialreports/yearly?year=${year}`);
      }
      setReport(response.data);
    } catch (err) {
      setError("Failed to fetch report. Please check your inputs or connection.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;

  const exportPDF = () => {
    if (!report) {
      alert("Please generate a report first.");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Financial Report", 14, 18);

    doc.setFontSize(11);
    doc.text(`Report Type: ${report.reportType}`, 14, 28);
    doc.text(`Generated Date: ${new Date().toLocaleDateString()}`, 14, 35);

    autoTable(doc, {
      startY: 45,
      head: [["Metric", "Amount"]],
      body: [
        ["Total Revenue", formatCurrency(report.totalRevenue)],
        ["Total Sales", formatCurrency(report.totalSales)],
        ["Total Invoices", report.totalInvoices],
        ["Total Discounts Given", formatCurrency(report.totalDiscountsGiven)],
        ["Pending Credit Amount", formatCurrency(report.pendingCreditAmount)],
      ],
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 12,
      head: [["Part Name", "Units Sold", "Revenue"]],
      body:
        report.topSellingParts && report.topSellingParts.length > 0
          ? report.topSellingParts.map((part) => [
              part.partName,
              part.totalQuantitySold,
              formatCurrency(part.totalSalesAmount),
            ])
          : [["No parts sold in this period", "-", "-"]],
    });

    doc.save(`${report.reportType}-financial-report.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] px-6 py-10 font-sans text-slate-900">
      <div className="mx-auto max-w-7xl">
        
        {/* --- HEADER SECTION --- */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-[#3b41c5]">
                <BarChart3 size={24} />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-[#1e293b]">
                Financial Analytics
              </h1>
            </div>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Review your business performance and sales trends.
            </p>
          </div>
          <button
            onClick={exportPDF}
            disabled={!report}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={16} />
            Export PDF
          </button>
        </div>

        {/* --- FILTER BAR --- */}
        <div className="mb-10 flex flex-col items-center gap-6 rounded-2xl border border-slate-100 bg-white p-2 shadow-sm md:flex-row">
          {/* Tabs */}
          <div className="flex w-full rounded-xl bg-slate-100 p-1 md:w-auto">
            {["daily", "monthly", "yearly"].map((type) => (
              <button
                key={type}
                onClick={() => setReportType(type)}
                className={`flex-1 px-6 py-2 text-sm font-bold capitalize transition-all rounded-lg md:flex-none ${
                  reportType === type
                    ? "bg-white text-[#00bfa5] shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Minimalist Inputs */}
          <div className="flex flex-1 items-center px-4 w-full">
            {reportType === "daily" && (
              <div className="relative w-full">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent py-2 text-slate-600 outline-none border-b border-transparent focus:border-[#00bfa5] accent-[#00bfa5] transition-all"
                />
              </div>
            )}
            {reportType === "monthly" && (
              <div className="flex gap-8 w-full">
                <input
                  placeholder="2026"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-1/2 bg-transparent py-2 outline-none border-b border-transparent focus:border-[#00bfa5] transition-all"
                />
                <input
                  placeholder="Month (1-12)"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-1/2 bg-transparent py-2 outline-none border-b border-transparent focus:border-[#00bfa5] transition-all"
                />
              </div>
            )}
            {reportType === "yearly" && (
              <input
                placeholder="Enter Year (e.g. 2026)"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-transparent py-2 outline-none border-b border-transparent focus:border-[#00bfa5] transition-all"
              />
            )}
          </div>

          {/* Teal Action Button */}
          <button
            onClick={fetchReport}
            disabled={loading}
            className="w-full rounded-xl bg-[#00bfa5] px-10 py-3 text-sm font-black uppercase tracking-wider text-white transition-all hover:bg-[#00a892] hover:shadow-lg hover:shadow-[#00bfa5]/20 disabled:bg-slate-300 md:w-auto"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {/* --- RESULTS OR EMPTY STATE --- */}
        {report ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* KPI Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard 
                label="NET REVENUE" 
                value={formatCurrency(report.totalRevenue)} 
                icon={<TrendingUp size={20} />} 
                iconColor="text-emerald-500" 
                bgColor="bg-emerald-50"
              />
              <MetricCard 
                label="TOTAL SALES" 
                value={formatCurrency(report.totalSales)} 
                icon={<Receipt size={20} />} 
                iconColor="text-blue-500" 
                bgColor="bg-blue-50"
              />
              <MetricCard 
                label="INVOICES" 
                value={report.totalInvoices} 
                icon={<FileText size={20} />} 
                iconColor="text-orange-500" 
                bgColor="bg-orange-50"
              />
              <MetricCard 
                label="DISCOUNTS" 
                value={formatCurrency(report.totalDiscountsGiven)} 
                icon={<Percent size={20} />} 
                iconColor="text-purple-500" 
                bgColor="bg-purple-50"
              />
            </div>

            {/* Inventory Table */}
            <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-8 py-6">
                <h3 className="text-lg font-bold text-[#1e293b]">Top Performing Inventory</h3>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600">
                  Live Data
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-y border-slate-50 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      <th className="px-8 py-4">Part Details</th>
                      <th className="px-8 py-4 text-center">Units Sold</th>
                      <th className="px-8 py-4 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {report.topSellingParts?.map((part) => (
                      <tr key={part.partId} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-5 font-bold text-slate-700">{part.partName}</td>
                        <td className="px-8 py-5 text-center font-medium text-slate-500">{part.totalQuantitySold}</td>
                        <td className="px-8 py-5 text-right font-black text-slate-900">{formatCurrency(part.totalSalesAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* DASH-DASH BOUNDARY EMPTY STATE */
          <div className="flex min-h-[450px] flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white/40 shadow-inner">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 text-slate-300">
              <CalendarIcon size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No Report Selected</h3>
            <p className="mt-2 max-w-xs text-center text-sm font-medium text-slate-400">
              Choose a timeframe above to view your financial breakdown and inventory performance.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-center text-sm font-bold text-red-600">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-component for KPI Cards
const MetricCard = ({ label, value, icon, iconColor, bgColor }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">{label}</p>
        <h3 className="mt-3 text-2xl font-black text-[#1e293b]">{value}</h3>
      </div>
      <div className={`rounded-xl ${bgColor} ${iconColor} p-2.5 shadow-sm`}>
        {icon}
      </div>
    </div>
  </div>
);

export default FinancialReports;
