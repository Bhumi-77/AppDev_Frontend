import { useState } from "react";

const TABS = [
  { id: "regulars", label: "Regular Customers" },
  { id: "spenders", label: "High Spenders" },
  { id: "credits", label: "Pending Credits" },
];


function Badge({ type }) {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Inactive: "bg-slate-100 text-slate-500 border border-slate-200",
    Critical: "bg-red-50 text-red-700 border border-red-200",
    Overdue: "bg-amber-50 text-amber-700 border border-amber-200",
    Pending: "bg-blue-50 text-blue-700 border border-blue-200",
    Platinum: "bg-amber-50 text-amber-800 border border-amber-200",
    Gold: "bg-blue-50 text-blue-700 border border-blue-200",
    Silver: "bg-slate-100 text-slate-600 border border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        styles[type] || styles.Pending
      }`}
    >
      {type}
    </span>
  );
}

function FormField({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm";
const selectCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm";

// REGULAR CUSTOMERS
function RegularsPanel() {
  const [result, setResult] = useState([]);

  function generate() {
    setResult(SAMPLE_REGULARS);
  }

  return (
    <div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <FormField label="Customer Name">
            <input className={inputCls} type="text" />
          </FormField>

          <FormField label="Minimum Visits">
            <input className={inputCls} type="number" />
          </FormField>

          <FormField label="From Date">
            <input className={inputCls} type="date" />
          </FormField>

          <FormField label="To Date">
            <input className={inputCls} type="date" />
          </FormField>
        </div>

        <button
          onClick={generate}
          className="bg-slate-800 text-white px-5 py-2 rounded-xl"
        >
          Generate Report
        </button>
      </div>

      {result.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Customer ID</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Visits</th>
                <th className="p-3 text-left">Last Visit</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {result.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{r.name}</td>
                  <td className="p-3">{r.id}</td>
                  <td className="p-3">{r.phone}</td>
                  <td className="p-3">{r.visits}</td>
                  <td className="p-3">{r.last}</td>
                  <td className="p-3">
                    <Badge type={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// HIGH SPENDERS
function SpendersPanel() {
  const [result, setResult] = useState([]);

  function generate() {
    setResult(SAMPLE_SPENDERS);
  }

  function tier(i) {
    if (i === 0) return "Platinum";
    if (i === 1) return "Gold";
    return "Silver";
  }

  return (
    <div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <FormField label="Customer Name">
            <input className={inputCls} type="text" />
          </FormField>

          <FormField label="Minimum Spend">
            <input className={inputCls} type="number" />
          </FormField>

          <FormField label="Date">
            <input className={inputCls} type="date" />
          </FormField>
        </div>

        <button
          onClick={generate}
          className="bg-slate-800 text-white px-5 py-2 rounded-xl"
        >
          Generate Report
        </button>
      </div>

      {result.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Customer ID</th>
                <th className="p-3 text-left">Amount Spend</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Tier</th>
              </tr>
            </thead>

            <tbody>
              {result.map((r, i) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{r.name}</td>
                  <td className="p-3">{r.id}</td>
                  <td className="p-3">{r.spent.toLocaleString()}</td>
                  <td className="p-3">{r.date}</td>
                  <td className="p-3">
                    <Badge type={tier(i)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// PENDING CREDITS
function CreditsPanel() {
  const [result, setResult] = useState([]);

  function generate() {
    setResult(SAMPLE_CREDITS);
  }

  return (
    <div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <FormField label="Customer Name">
            <input className={inputCls} type="text" />
          </FormField>

          <FormField label="Minimum Pending Amount">
            <input className={inputCls} type="number" />
          </FormField>

          <FormField label="Credit Status">
            <select className={selectCls}>
              <option>All</option>
              <option>Pending</option>
              <option>Overdue</option>
              <option>Critical</option>
            </select>
          </FormField>
        </div>

        <button
          onClick={generate}
          className="bg-slate-800 text-white px-5 py-2 rounded-xl"
        >
          Generate Report
        </button>
      </div>

      {result.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Invoice No</th>
                <th className="p-3 text-left">Invoice Date</th>
                <th className="p-3 text-left">Due Date</th>
                <th className="p-3 text-left">Total Amount</th>
                <th className="p-3 text-left">Paid Amount</th>
                <th className="p-3 text-left">Pending Amount</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {result.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{r.name}</td>
                  <td className="p-3">{r.invoiceNo}</td>
                  <td className="p-3">{r.invoiceDate}</td>
                  <td className="p-3">{r.dueDate}</td>
                  <td className="p-3">{r.total.toLocaleString()}</td>
                  <td className="p-3">{r.paid.toLocaleString()}</td>
                  <td className="p-3 text-red-600 font-semibold">
                    {r.pending.toLocaleString()}
                  </td>
                  <td className="p-3">
                    <Badge type={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// MAIN COMPONENT
export default function CustomerReports() {
  const [activeTab, setActiveTab] = useState("regulars");

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Customer Reports
          </h1>

          <p className="text-sm text-slate-500">
            Staff portal for generating customer reports
          </p>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-slate-800 text-white"
                  : "bg-white border border-slate-200 text-slate-600"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "regulars" && <RegularsPanel />}
        {activeTab === "spenders" && <SpendersPanel />}
        {activeTab === "credits" && <CreditsPanel />}
      </div>
    </div>
  );
}