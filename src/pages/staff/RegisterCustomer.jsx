import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

export default function RegisterCustomer() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      vehicles: [],
    };

    if (vehicleNumber.trim() || vehicleMake.trim() || vehicleYear.trim()) {
      payload.vehicles.push({
        vehicleNumber: vehicleNumber.trim(),
        make: vehicleMake.trim(),
        year: parseInt(vehicleYear, 10) || new Date().getFullYear(),
      });
    }

    try {
      const response = await axios.post("/customers", payload);
      const customer = response.data;
      setMessageType("success");
      setMessage("Customer registered successfully.");
      setTimeout(() => {
        navigate(`/customers/${customer.id}`);
      }, 900);
    } catch (error) {
      setMessageType("error");
      setMessage(error.response?.data?.message || "Failed to register customer. Please check the details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <h2 style={{ margin: 0, marginBottom: 14 }}>Register New Customer</h2>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>
        Staff can add a new customer and optionally capture one vehicle record immediately.
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
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16, maxWidth: 640 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <label style={{ fontSize: 14, fontWeight: 600 }}>Customer name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter full name"
            style={{ padding: 12, borderRadius: 12, border: "1px solid #d1d5db", width: "100%" }}
          />
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <label style={{ fontSize: 14, fontWeight: 600 }}>Phone number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="Enter phone number"
            style={{ padding: 12, borderRadius: 12, border: "1px solid #d1d5db", width: "100%" }}
          />
        </div>

        <div style={{ padding: 16, borderRadius: 18, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Vehicle details (optional)</p>
          <p style={{ margin: "4px 0 16px", fontSize: 13, color: "#475569" }}>
            Add one primary vehicle record while registering the customer.
          </p>

          <div style={{ display: "grid", gap: 12 }}>
            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder="Vehicle plate number"
              style={{ padding: 12, borderRadius: 12, border: "1px solid #d1d5db", width: "100%" }}
            />
            <input
              type="text"
              value={vehicleMake}
              onChange={(e) => setVehicleMake(e.target.value)}
              placeholder="Make & model"
              style={{ padding: 12, borderRadius: 12, border: "1px solid #d1d5db", width: "100%" }}
            />
            <input
              type="number"
              value={vehicleYear}
              onChange={(e) => setVehicleYear(e.target.value)}
              placeholder="Year"
              style={{ padding: 12, borderRadius: 12, border: "1px solid #d1d5db", width: "100%" }}
            />
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
            padding: "12px 18px",
            fontSize: 15,
            fontWeight: 600,
            cursor: loading ? "default" : "pointer",
            width: "fit-content",
          }}
        >
          {loading ? "Registering customer..." : "Register customer"}
        </button>
      </form>
    </div>
  );
}
