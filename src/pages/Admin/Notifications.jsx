import { useEffect, useState } from "react";
import api from "../../api/axios";

function Notifications() {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState("");

  const loadAlerts = async () => {
    try {
      setError("");
      const response = await api.get("/notifications/low-stock");
      setAlerts(response.data);
    } catch {
      setError("Failed to load notifications.");
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="mt-2 text-gray-600">
          View system alerts and low stock warnings.
        </p>

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 px-5 py-4 text-red-600">
            {error}
          </div>
        )}

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Low Stock Alerts</h2>

          <div className="mt-5 space-y-4">
            {alerts.length === 0 ? (
              <p className="rounded-xl bg-green-50 px-5 py-4 text-green-700">
                No low stock alerts. Inventory level is healthy.
              </p>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.partId}
                  className="rounded-xl border border-red-200 bg-red-50 px-5 py-4"
                >
                  <p className="font-semibold text-red-700">
                    {alert.message}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Part ID: {alert.partId} | Current Stock:{" "}
                    {alert.stockQuantity}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;