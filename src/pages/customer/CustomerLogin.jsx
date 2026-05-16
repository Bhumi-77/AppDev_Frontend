import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { saveCustomer, isLoggedIn } from "../../api/auth";

// Feature 12: Customers can log in to manage their account
export default function CustomerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("error");
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) navigate("/profile", { replace: true });
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data } = await axios.post("/customers/login", {
        email: email.trim(),
        password,
      });
      if (data?.success) {
        saveCustomer(data.customer);
        setMsgType("success");
        setMessage("Login successful. Redirecting...");
        setTimeout(() => navigate("/profile"), 800);
      } else {
        setMsgType("error");
        setMessage(data?.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      setMsgType("error");
      setMessage(error.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[32px] bg-white p-10 shadow-2xl shadow-slate-200">
        <h1 className="text-3xl font-semibold text-slate-900">Customer Login</h1>
        <p className="mt-3 text-sm text-slate-500">
          Sign in to manage your profile, vehicles, bookings, and history.
        </p>

        {message && (
          <div
            className={`mt-6 rounded-3xl px-4 py-3 text-sm ${
              msgType === "success"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border border-rose-200 bg-rose-50 text-rose-800"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputClass}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white transition ${
              loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          New here?{" "}
          <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
