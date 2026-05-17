import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function LowStockAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setError("");
      const response = await api.get("/notifications/low-stock");
      setAlerts(response.data);
    } catch {
      setError("Failed to load low stock alerts.");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Low Stock Alerts
          </h1>
          <p className="text-slate-500 mt-1">
            Parts with stock quantity below 10 will appear here.
          </p>
        </div>

        <button
          onClick={loadAlerts}
          className="rounded-xl bg-teal-500 px-4 py-2 text-white font-semibold hover:bg-teal-600"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-5 py-4 text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-2xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between">
          <h2 className="font-bold text-slate-900">Alert Details</h2>
          <span className="text-sm text-slate-500">
            Total Alerts: {alerts.length}
          </span>
        </div>

        {alerts.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="font-semibold text-green-600">
              Inventory level is healthy.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              No parts are currently below the low stock threshold.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {alerts.map((alert) => (
              <div
                key={alert.partId}
                className="px-6 py-5 flex items-center justify-between hover:bg-gray-50"
              >
                <div>
                  <p className="font-bold text-red-600">{alert.message}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Part ID: {alert.partId}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-slate-500">Current Stock</p>
                  <p className="text-2xl font-bold text-red-600">
                    {alert.stockQuantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}