import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { saveCustomer, setAuthToken } from "../../api/auth";

export default function RegisterCustomer() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setMessageType("error");
      setMessage("A valid email is required.");
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setMessageType("error");
      setMessage("Password is required for customer login.");
      setLoading(false);
      return;
    }

    if (!vehicleNumber.trim() || !vehicleMake.trim() || !vehicleYear.trim()) {
      setMessageType("error");
      setMessage("All vehicle details are required.");
      setLoading(false);
      return;
    }

    const payload = {
      fullName: name.trim(),
      email: email.trim().toLowerCase(),
      phoneNumber: phone.trim(),
      password: password.trim(),
      vehicles: [
        {
          vehicleNumber: vehicleNumber.trim(),
          make: vehicleMake.trim(),
          year: parseInt(vehicleYear, 10),
        },
      ],
    };

    try {
      const res = await axios.post("/auth/register", payload);

      // Save minimal customer info
      const created = res.data || {};
      const savedCustomer = created?.user ?? { id: null, email: payload.email, fullName: payload.fullName };
      saveCustomer(savedCustomer);

      // Attempt auto-login
      try {
        const loginRes = await axios.post("/auth/login", {
          email: payload.email,
          password: payload.password,
          role: "Customer",
        });

        const data = loginRes.data || {};
        const token = data.token ?? data.Token ?? data.accessToken ?? "";
        const role = (data.role ?? data.Role ?? "customer").toLowerCase();
        const user = data.user ?? data.User ?? savedCustomer || {};
        const finalUserId = data.customerId ?? data.userId ?? user?.id ?? user?.Id ?? "";

        if (token) {
          sessionStorage.setItem("token", token);
          setAuthToken(token);
        }
        sessionStorage.setItem("role", role);
        if (finalUserId) sessionStorage.setItem("user_id", finalUserId);
        if (user && Object.keys(user).length > 0) sessionStorage.setItem("user", JSON.stringify(user));

        setMessageType("success");
        setMessage("Registered and signed in. Redirecting to profile...");
        setTimeout(() => navigate("/profile", { replace: true }), 800);
      } catch (loginErr) {
        console.error("Auto-login failed:", loginErr?.response ?? loginErr);
        setMessageType("success");
        setMessage("Customer registered. Please login with your email and password.");
        setTimeout(() => navigate("/login", { replace: true }), 1000);
      }
    } catch (error) {
      console.error("Registration failed:", error?.response ?? error);
      setMessageType("error");
      setMessage(error.response?.data?.message || "Failed to register customer. Please check the details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <h2 style={{ margin: 0, marginBottom: 14 }}>Register New Customer</h2>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>
        Create a new customer account along with their mandatory primary vehicle details.
      </p>

      {message && (
        <div
          style={{
            marginBottom: 18,
            padding: 14,
            borderRadius: 12,
            background: messageType === "success" ? "#ecfdf5" : "#fef2f2",
            color: messageType === "success" ? "#065f46" : "#991b1b",
            border: `1px solid ${messageType === "success" ? "#6ee7b7" : "#fecaca"}`,
            fontWeight: 500,
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16, maxWidth: 640 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <label style={{ fontSize: 14, fontWeight: 600 }}>Customer Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter full name"
            style={{ padding: 12, borderRadius: 12, border: "1px solid #d1d5db", width: "100%", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <label style={{ fontSize: 14, fontWeight: 600 }}>Phone Number *</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="Enter phone number"
            style={{ padding: 12, borderRadius: 12, border: "1px solid #d1d5db", width: "100%", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <label style={{ fontSize: 14, fontWeight: 600 }}>Email Address *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="name@example.com"
            style={{ padding: 12, borderRadius: 12, border: "1px solid #d1d5db", width: "100%", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <label style={{ fontSize: 14, fontWeight: 600 }}>Password *</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Set a customer password"
            style={{ padding: 12, borderRadius: 12, border: "1px solid #d1d5db", width: "100%", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ padding: 16, borderRadius: 18, background: "#f8fafc", border: "1px solid #cbd5e1" }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Vehicle Details *</p>
          <p style={{ margin: "4px 0 16px", fontSize: 13, color: "#475569" }}>
            You must link a primary vehicle to complete customer registration.
          </p>

          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Plate Number *</label>
              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                required
                placeholder="e.g., Ba 1234"
                style={{ padding: 12, borderRadius: 12, border: "1px solid #d1d5db", width: "100%", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Make & Model *</label>
              <input
                type="text"
                value={vehicleMake}
                onChange={(e) => setVehicleMake(e.target.value)}
                required
                placeholder="e.g., Toyota Corolla"
                style={{ padding: 12, borderRadius: 12, border: "1px solid #d1d5db", width: "100%", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Manufacture Year *</label>
              <input
                type="number"
                value={vehicleYear}
                onChange={(e) => setVehicleYear(e.target.value)}
                required
                placeholder="e.g., 2021"
                min="1900"
                max={new Date().getFullYear() + 1}
                style={{ padding: 12, borderRadius: 12, border: "1px solid #d1d5db", width: "100%", boxSizing: "border-box" }}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? "#bfdbfe" : "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 14,
            padding: "12px 24px",
            fontSize: 15,
            fontWeight: 600,
            cursor: loading ? "default" : "pointer",
            width: "fit-content",
          }}
        >
          {loading ? "Registering..." : "Register Customer & Vehicle"}
        </button>
      </form>
    </div>
  );
}
