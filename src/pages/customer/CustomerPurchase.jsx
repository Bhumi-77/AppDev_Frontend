import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { getCustomerId } from "../../api/auth";

const LOYALTY_THRESHOLD = 5000;

// Feature 16: Loyalty Program - customers get 10% discount when a single
// purchase total is more than 5000.
export default function CustomerPurchase() {
  const customerId = getCustomerId();
  const navigate = useNavigate();

  const [parts, setParts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("error");

  useEffect(() => {
    if (!customerId) {
      navigate("/login", { replace: true });
      return;
    }
    loadParts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadParts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/parts");
      setParts(data || []);
    } catch {
      setMsgType("error");
      setMessage("Unable to load parts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const setQty = (partId, value) => {
    const qty = Math.max(0, parseInt(value, 10) || 0);
    setQuantities((prev) => ({ ...prev, [partId]: qty }));
  };

  const money = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;

  // Live preview of the loyalty discount before submitting
  const { subtotal, loyaltyApplied, discount, total } = useMemo(() => {
    const sub = parts.reduce((sum, p) => sum + p.price * (quantities[p.id] || 0), 0);
    const applied = sub > LOYALTY_THRESHOLD;
    const disc = applied ? sub * 0.1 : 0;
    return { subtotal: sub, loyaltyApplied: applied, discount: disc, total: sub - disc };
  }, [parts, quantities]);

  const handlePurchase = async () => {
    const items = parts
      .filter((p) => (quantities[p.id] || 0) > 0)
      .map((p) => ({ partId: p.id, quantity: quantities[p.id] }));

    if (items.length === 0) {
      setMsgType("error");
      setMessage("Please select at least one part to purchase.");
      return;
    }

    setSubmitting(true);
    setMessage("");
    setReceipt(null);
    try {
      const { data } = await axios.post("/sales/sell", { customerId, items });
      setReceipt(data);
      setQuantities({});
      await loadParts(); // refresh stock
      setMsgType("success");
      setMessage("Purchase completed successfully.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setMsgType("error");
      setMessage(
        typeof error.response?.data === "string"
          ? error.response.data
          : "Purchase failed. Please check stock and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-24 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  if (loading) return <p className="text-center text-slate-500">Loading parts...</p>;

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-semibold text-slate-900">Buy Parts</h1>
      <p className="mt-2 text-sm text-slate-500">
        Loyalty Program: spend more than {money(LOYALTY_THRESHOLD)} in a single purchase and get{" "}
        <span className="font-semibold text-indigo-600">10% off</span> automatically.
      </p>

      {message && (
        <div
          className={`mt-6 rounded-3xl px-5 py-4 text-sm ${
            msgType === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {message}
        </div>
      )}

      {receipt && (
        <div className="mt-6 rounded-[28px] border border-indigo-200 bg-indigo-50 p-6">
          <h2 className="text-lg font-semibold text-indigo-900">Receipt (Invoice #{receipt.invoice?.id})</h2>
          <div className="mt-3 space-y-1 text-sm text-indigo-900">
            <p>Subtotal: {money(receipt.subtotal)}</p>
            <p>
              Loyalty discount (10%):{" "}
              {receipt.loyaltyApplied ? `- ${money(receipt.discount)}` : "Not applied"}
            </p>
            <p className="text-base font-bold">Total paid: {money(receipt.total)}</p>
          </div>
        </div>
      )}

      <section className="mt-8 rounded-[28px] bg-white p-8 shadow-xl shadow-slate-200">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase text-slate-400">
              <th className="pb-3">Part</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">In stock</th>
              <th className="pb-3">Quantity</th>
              <th className="pb-3">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((p) => (
              <tr key={p.id} className="border-t border-slate-200 text-slate-700">
                <td className="py-3 font-medium text-slate-900">{p.name}</td>
                <td className="py-3">{money(p.price)}</td>
                <td className="py-3">{p.stock}</td>
                <td className="py-3">
                  <input
                    type="number"
                    min="0"
                    max={p.stock}
                    className={inputClass}
                    value={quantities[p.id] || ""}
                    onChange={(e) => setQty(p.id, e.target.value)}
                    placeholder="0"
                  />
                </td>
                <td className="py-3">{money(p.price * (quantities[p.id] || 0))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 border-t border-slate-200 pt-5">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="mt-1 flex justify-between text-sm">
            <span className={loyaltyApplied ? "text-emerald-600" : "text-slate-400"}>
              Loyalty discount (10%)
              {!loyaltyApplied && subtotal > 0 && (
                <span className="ml-1 text-xs">
                  (spend over {money(LOYALTY_THRESHOLD)} to unlock)
                </span>
              )}
            </span>
            <span className={loyaltyApplied ? "text-emerald-600" : "text-slate-400"}>
              {loyaltyApplied ? `- ${money(discount)}` : money(0)}
            </span>
          </div>
          <div className="mt-2 flex justify-between text-lg font-bold text-slate-900">
            <span>Total</span>
            <span>{money(total)}</span>
          </div>

          <button
            disabled={submitting}
            onClick={handlePurchase}
            className={`mt-6 w-full rounded-2xl px-5 py-3 text-sm font-semibold text-white transition ${
              submitting ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {submitting ? "Processing..." : "Complete purchase"}
          </button>
        </div>
      </section>
    </div>
  );
}
