import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";

export default function CustomerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("error");
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token") || sessionStorage.getItem("admin_token") || sessionStorage.getItem("parking_token");
    if (token) {
      navigate("/profile", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/user/login", { email: email.trim(), password });
      const data = response.data;
      if (data?.success) {
        const token = data.token || data?.accessToken || "";
        const user = data.user || data?.customer || {};
        const role = data.role || "user";
        const userId = user?.id || user?._id || "";

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", role);
        sessionStorage.setItem("user_id", userId);
        if (user) sessionStorage.setItem("user", JSON.stringify(user));

        setMsgType("success");
        setMessage("Login successful. Redirecting...");
        setTimeout(() => navigate("/profile"), 900);
      } else {
        setMsgType("error");
        setMessage(data?.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      setMsgType("error");
      setMessage(error.response?.data?.message || "Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[32px] bg-white p-10 shadow-2xl shadow-slate-200">
        <h1 className="text-3xl font-semibold text-slate-900">Customer Login</h1>
        <p className="mt-3 text-sm text-slate-500">Sign in to manage your profile, vehicles, and service requests.</p>

        {message && (
          <div className={`mt-6 rounded-3xl px-4 py-3 text-sm ${msgType === "success" ? "border border-emerald-200 bg-emerald-50 text-emerald-800" : "border border-rose-200 bg-rose-50 text-rose-800"}`}>
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
              className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
              className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white transition ${loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          New here? <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
