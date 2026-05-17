import { useEffect, useState } from "react";
import api from "../../api/axios";
import { MailWarning, Send, RefreshCw } from "lucide-react";

export default function PendingCreditReminders() {
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingId, setSendingId] = useState(null);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/creditreminders/pending");
      setReminders(response.data);
    } catch {
      setError("Failed to load pending credit reminders.");
    } finally {
      setLoading(false);
    }
  };

  const sendReminder = async (invoiceId) => {
    try {
      setSendingId(invoiceId);
      setError("");
      setSuccess("");

      const response = await api.post(`/creditreminders/send/${invoiceId}`);

      setSuccess(response.data.message || "Reminder email sent successfully.");
    } catch {
      setError("Failed to send reminder email.");
    } finally {
      setSendingId(null);
    }
  };

  const formatCurrency = (value) => {
    return `Rs. ${Number(value || 0).toLocaleString()}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <MailWarning size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Pending Credit Reminders
              </h1>
              <p className="text-slate-500 mt-1">
                View pending credit invoices and send payment reminder emails.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={loadReminders}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-white font-semibold hover:bg-slate-800"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {success && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-2xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between">
          <h2 className="font-bold text-slate-900">Pending Credit List</h2>
          <span className="text-sm text-slate-500">
            Total Pending: {reminders.length}
          </span>
        </div>

        {loading ? (
          <div className="px-6 py-10 text-center text-slate-500">
            Loading pending credits...
          </div>
        ) : reminders.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="font-semibold text-green-600">
              No pending credit invoices.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              All customer payments are currently cleared.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-600">
                    Invoice
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-600">
                    Customer
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-600">
                    Email
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-600">
                    Amount Due
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-600">
                    Status
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-600">
                    Invoice Date
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {reminders.map((item) => (
                  <tr key={item.invoiceId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      #{item.invoiceId}
                    </td>
                    <td className="px-6 py-4">{item.customerName}</td>
                    <td className="px-6 py-4">{item.customerEmail}</td>
                    <td className="px-6 py-4 font-bold text-red-600">
                      {formatCurrency(item.amountDue)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
                        {item.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">{formatDate(item.invoiceDate)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => sendReminder(item.invoiceId)}
                        disabled={sendingId === item.invoiceId}
                        className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white font-semibold hover:bg-orange-600 disabled:bg-orange-300"
                      >
                        <Send size={15} />
                        {sendingId === item.invoiceId ? "Sending..." : "Send"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}