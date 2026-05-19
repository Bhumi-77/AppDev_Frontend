import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const roleTabs = [
  { key: "customer", label: "Customer" },
  { key: "staff", label: "Staff" },
  { key: "admin", label: "Admin" },
];

export default function CustomerLogin() {
  const [activeTab, setActiveTab] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("error");
  const navigate = useNavigate();

  useEffect(() => {
    // Standardize checking the token globally
    const token = sessionStorage.getItem("token");
    if (token) {
      const role = sessionStorage.getItem("role");
      if (role === "admin") navigate("/admin", { replace: true });
      else if (role === "staff") navigate("/register-customer", { replace: true });
      else navigate("/profile", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const endpoint = "/auth/login";

    const payload = {
      email: email.trim(),
      password,
      role: activeTab, // 👈 CRITICAL: Tells your C# Backend which role is logging in!
    };

    try {
      const response = await axios.post(endpoint, payload);
      const data = response.data;

      if (data?.success || data?.token) { // Accommodates various success flag schemes
        const token = data.token || data?.accessToken || "";
        const user = data.user || data?.customer || data?.staff || data?.admin || {};
        const role = data.role || activeTab;
        
        // Dynamically extract ID from the matching entity wrapper
        const finalUserId = data.customerId || data.userId || user?.id || user?._id || "";

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", role);
        sessionStorage.setItem("user_id", finalUserId); // 👈 Safely assigns numeric ID or GUID fallback
        
        if (user && Object.keys(user).length > 0) {
          sessionStorage.setItem("user", JSON.stringify(user));
        }

        setMsgType("success");
        setMessage("Login successful. Redirecting...");

        setTimeout(() => {
          if (role === "admin") navigate("/admin", { replace: true });
          else if (role === "staff") navigate("/register-customer", { replace: true });
          else navigate("/profile", { replace: true });
        }, 800);
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
      <div className="w-full max-w-md rounded-4xl bg-white p-8 shadow-2xl shadow-slate-200">
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Vehicle Parts & Inventory</h1>
          <p className="mt-2 text-sm text-slate-500">
            {activeTab === "customer"
              ? "Login to your customer account"
              : activeTab === "staff"
              ? "Login to your staff account"
              : "Login to your admin account"}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6 bg-slate-100 p-1 rounded-2xl">
          {roleTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveTab(tab.key);
                setMessage("");
              }}
              className={`rounded-xl py-2 text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {message && (
          <div
            className={`mb-6 rounded-2xl px-4 py-3 text-sm font-medium ${
              msgType === "success"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border border-rose-200 bg-rose-50 text-rose-800"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Email ID</label>
            <input
              type="email"  // 👈 Swapped type from text to email for browser validation validation checks
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email id"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                style={{ background: 'transparent', border: 'none', margin: 0, padding: 0 }} 
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-2xl px-4 py-3.5 text-sm font-semibold text-white shadow-md transition duration-200 ${
              loading 
                ? "bg-indigo-400 cursor-not-allowed" 
                : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-[0.99]"
            }`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {activeTab === "customer" && (
          <p className="mt-4 text-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer transition-colors">Forgot password?</p>
        )}

        {activeTab === "customer" && (
          <>
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-bold tracking-wider">OR</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:bg-slate-50 hover:border-slate-400 active:scale-[0.99]"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
              Continue with Google
            </button>
          </>
        )}

        {activeTab === "customer" && (
          <p className="mt-6 text-center text-sm text-slate-500">
            No account? <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">Create one</Link>
          </p>
        )}
      </div>
    </div>
  );
}