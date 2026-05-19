import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { saveCustomer } from "../../api/auth";


export default function CustomerSignup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    vehicleNumber: "",
    make: "",
    year: "",
  });
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
      phone: form.phone.trim(),
      vehicles: [
        {
          vehicleNumber: form.vehicleNumber.trim(),
          make: form.make.trim(),
          year: form.year ? parseInt(form.year, 10) : 0,
        },
      ],
    };

    try {
      const response = await axios.post("/customers", payload);
      const createdCustomer = response.data;

      if (response.status === 201 && createdCustomer?.id) {
        saveCustomer(createdCustomer);
        setMsgType("success");
        setMessage("Registration successful! Redirecting to your profile...");
        setTimeout(() => navigate("/profile"), 1000);
      } else {
        setMsgType("error");
        setMessage(createdCustomer?.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setMsgType("error");
      setMessage(error.response?.data?.message || "Failed to register. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl rounded-[28px] bg-white p-10 shadow-2xl shadow-slate-200">
        <h1 className="text-3xl font-semibold text-slate-900">Customer Self-Registration</h1>
        <p className="mt-3 text-sm text-slate-500 max-w-2xl">
          Create an account to manage your profile, save vehicle details, book services, and view your purchase history.
        </p>

        {message && (
          <div
            className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
              msgType === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-rose-200 bg-rose-50 text-rose-800"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Full name</label>
            <input className={inputClass} value={form.name} onChange={handleChange("name")} placeholder="John Doe" required />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Email address</label>
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={handleChange("email")}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Phone number</label>
            <input className={inputClass} value={form.phone} onChange={handleChange("phone")} placeholder="9800000000" required />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              className={inputClass}
              value={form.password}
              onChange={handleChange("password")}
              placeholder="Create a password"
              required
              minLength={4}
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
            <p className="text-sm font-semibold text-slate-700">Primary vehicle details (optional)</p>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Vehicle plate number</label>
            <input
              className={inputClass}
              value={form.vehicleNumber}
              onChange={handleChange("vehicleNumber")}
              placeholder="BA-1-1234"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Make &amp; model</label>
              <input
                className={inputClass}
                value={form.make}
                onChange={handleChange("make")}
                placeholder="Toyota Corolla"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Year</label>
              <input
                type="number"
                className={inputClass}
                value={form.year}
                onChange={handleChange("year")}
                placeholder="2022"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold text-white transition ${
              loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Creating account..." : "Create customer account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
