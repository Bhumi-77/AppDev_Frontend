import React, { useState } from "react";
import api from "../../api/axios";

const TABS = [
  { id: "regulars", label: "Regular Customers" },
  { id: "spenders", label: "High Spenders" },
  { id: "credits", label: "Pending Credits" },
];

function Badge({ type }) {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Inactive: "bg-slate-100 text-slate-500 border border-slate-200",
    Pending: "bg-blue-50 text-blue-700 border border-blue-200",
    Platinum: "bg-amber-50 text-amber-800 border border-amber-200",
    Silver: "bg-slate-100 text-slate-600 border border-slate-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[type] || styles.Pending}`}>
      {type}
    </span>
  );
}

export default function CustomerReports() {
  const [activeTab, setActiveTab] = useState("regulars");
  const [result, setResult] = useState([]);
  const [filters, setFilters] = useState({});

  const fetchData = async (endpoint) => {
    try {
      // The full path must match: /api/reports/customer/ + endpoint
      const { data } = await api.get(`/reports/customer/${endpoint}`, { params: filters });
      setResult(data);
    } catch (err) {
      console.error("API Request Failed:", err);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Customer Reports</h1>
      
      <div className="flex gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setResult([]); setFilters({}); }}
            className={`px-4 py-2 rounded-xl text-sm ${activeTab === tab.id ? "bg-slate-800 text-white" : "bg-white border"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border p-6 mb-6 flex gap-4 items-end">
        {activeTab === "regulars" && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Customer Name</label>
            <input className="border p-2 rounded-lg" onChange={(e) => setFilters({ name: e.target.value })} />
          </div>
        )}
        {activeTab === "spenders" && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Min Spend</label>
            <input type="number" className="border p-2 rounded-lg" onChange={(e) => setFilters({ minSpend: e.target.value })} />
          </div>
        )}
        {activeTab === "credits" && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
            <select className="border p-2 rounded-lg" onChange={(e) => setFilters({ status: e.target.value })}>
              <option value="All">All</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        )}
        <button onClick={() => fetchData(activeTab)} className="bg-slate-800 text-white px-6 py-2 rounded-xl">Generate</button>
      </div>

      {result.length > 0 && (
        <div className="bg-white rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50"><tr><th className="p-3 text-left">Customer</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Value</th></tr></thead>
            <tbody>
              {result.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3 font-medium">{r.name}</td>
                  <td className="p-3"><Badge type={r.status} /></td>
                  <td className="p-3">{r.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}