import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { getCustomerId } from "../../api/auth";

// Feature 14: Customers can view their purchase/service history
export default function CustomerHistory() {
  const customerId = getCustomerId();
  const navigate = useNavigate();

  const [history, setHistory] = useState(null);
  const [partsMap, setPartsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!customerId) {
      navigate("/login", { replace: true });
      return;
    }
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const [historyRes, partsRes] = await Promise.all([
        axios.get(`/customeractions/history/${customerId}`),
        axios.get("/parts"),
      ]);
      setHistory(historyRes.data);
      const map = {};
      (partsRes.data || []).forEach((p) => {
        map[p.id] = p.name;
      });
      setPartsMap(map);
    } catch {
      setError("Unable to load your history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const money = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;
  const formatDate = (d) => (d ? new Date(d).toLocaleString() : "-");

  if (loading) return <p className="text-center text-slate-500">Loading history...</p>;
  if (error)
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800">{error}</div>
    );

  const invoices = history?.invoices || [];
  const appointments = history?.appointments || [];
  const partRequests = history?.partRequests || [];
  const reviews = history?.reviews || [];

  const card = "rounded-[28px] bg-white p-8 shadow-xl shadow-slate-200";
  const badge = (status) => {
    const s = (status || "").toLowerCase();
    const tone =
      s === "completed" || s === "fulfilled"
        ? "bg-emerald-100 text-emerald-700"
        : s === "cancelled" || s === "rejected"
        ? "bg-rose-100 text-rose-700"
        : "bg-amber-100 text-amber-700";
    return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{status}</span>;
  };

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-semibold text-slate-900">My History</h1>
      <p className="mt-2 text-sm text-slate-500">
        Your past purchases, appointments, part requests, and reviews.
      </p>

      {/* Purchase history */}
      <section className={`mt-8 ${card}`}>
        <h2 className="text-lg font-semibold text-slate-900">Purchase history</h2>
        {invoices.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            No purchases yet.
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            {invoices.map((inv) => (
              <div key={inv.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">Invoice #{inv.id}</p>
                  <p className="text-sm font-bold text-indigo-600">{money(inv.totalAmount)}</p>
                </div>
                <table className="mt-4 w-full text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase text-slate-400">
                      <th className="pb-2">Part</th>
                      <th className="pb-2">Qty</th>
                      <th className="pb-2">Price</th>
                      <th className="pb-2">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(inv.invoiceItems || []).map((it) => (
                      <tr key={it.id} className="border-t border-slate-200 text-slate-700">
                        <td className="py-2">{partsMap[it.partId] || `Part #${it.partId}`}</td>
                        <td className="py-2">{it.quantity}</td>
                        <td className="py-2">{money(it.price)}</td>
                        <td className="py-2">{money(it.price * it.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Appointments */}
      <section className={`mt-8 ${card}`}>
        <h2 className="text-lg font-semibold text-slate-900">Service appointments</h2>
        {appointments.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            No appointments yet.
          </p>
        ) : (
          <div className="mt-5 space-y-3">
            {appointments.map((a) => (
              <div
                key={a.id}
                className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{a.serviceType}</p>
                  <p className="text-sm text-slate-500">{formatDate(a.appointmentDate)}</p>
                </div>
                {badge(a.status)}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Part requests */}
      <section className={`mt-8 ${card}`}>
        <h2 className="text-lg font-semibold text-slate-900">Part requests</h2>
        {partRequests.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            No part requests yet.
          </p>
        ) : (
          <div className="mt-5 space-y-3">
            {partRequests.map((p) => (
              <div
                key={p.id}
                className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{p.partName}</p>
                  <p className="text-sm text-slate-500">{p.description}</p>
                </div>
                {badge(p.status)}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reviews */}
      <section className={`mt-8 ${card}`}>
        <h2 className="text-lg font-semibold text-slate-900">My reviews</h2>
        {reviews.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            No reviews yet.
          </p>
        ) : (
          <div className="mt-5 space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-amber-600">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
                <p className="mt-1 text-sm text-slate-700">{r.comment}</p>
                <p className="mt-1 text-xs text-slate-400">{formatDate(r.reviewDate)}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
