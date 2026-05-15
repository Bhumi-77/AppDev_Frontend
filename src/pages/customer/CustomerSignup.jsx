import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";

export default function CustomerSignup() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", vehicleNumber: "", vehicleMake: "", vehicleYear: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("error");
  const navigate = useNavigate();

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
      vehicles: form.vehicleNumber ? [
        {
          vehicleNumber: form.vehicleNumber.trim(),
          make: form.vehicleMake.trim(),
          year: form.vehicleYear ? parseInt(form.vehicleYear, 10) : new Date().getFullYear(),
        },
      ] : [],
    };

    try {
      const response = await axios.post("/user/register", payload);
      const data = response.data;

      if (data?.success) {
        sessionStorage.setItem("user_id", data?.user?.id || data?.user?._id || "");
        sessionStorage.setItem("user", JSON.stringify(data?.user || {}));
        sessionStorage.setItem("token", data?.token || "");
        setMsgType("success");
        setMessage("Registration successful! You can now manage your profile and vehicle details.");
        setTimeout(() => navigate("/profile"), 1200);
      } else {
        setMsgType("error");
        setMessage(data?.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setMsgType("error");
      setMessage(error.response?.data?.message || "Failed to register. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl rounded-[28px] bg-white p-10 shadow-2xl shadow-slate-200">
        <h1 className="text-3xl font-semibold text-slate-900">Customer Self-Registration</h1>
        <p className="mt-3 text-sm text-slate-500 max-w-2xl">
          Sign up to manage your profile, save vehicle details, view past purchases, and receive stock or credit reminders.
        </p>

        {message && (
          <div className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${msgType === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Full Name</label>
            <input
              className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Email address</label>
            <input
              type="email"
              className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Phone number</label>
            <input
              className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              value={form.phone}
              onChange={handleChange("phone")}
              placeholder="0123 456 789"
              required
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              value={form.password}
              onChange={handleChange("password")}
              placeholder="Create a password"
              required
              minLength={8}
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
            <p className="text-sm font-semibold text-slate-700">Primary vehicle details (optional)</p>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Vehicle plate number</label>
            <input
              className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              value={form.vehicleNumber}
              onChange={handleChange("vehicleNumber")}
              placeholder="ABC-1234"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Make & model</label>
            <input
              className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              value={form.vehicleMake}
              onChange={handleChange("vehicleMake")}
              placeholder="Toyota Corolla"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Year</label>
            <input
              type="number"
              className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              value={form.vehicleYear}
              onChange={handleChange("vehicleYear")}
              placeholder="2022"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold text-white transition ${loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
          >
            {loading ? "Creating account..." : "Create customer account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already registered? <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">Login here</Link>
        </p>
      </div>
    </div>
  );
}
