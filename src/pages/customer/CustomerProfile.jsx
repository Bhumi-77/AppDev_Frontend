import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { getCustomerId, saveCustomer } from "../../api/auth";

// Feature 12: Customers can manage their profile & vehicle details
export default function CustomerProfile() {
  const customerId = getCustomerId();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [newVehicle, setNewVehicle] = useState({ vehicleNumber: "", make: "", year: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("success");

  useEffect(() => {
    if (!customerId) {
      navigate("/login", { replace: true });
      return;
    }
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const flash = (type, text) => {
    setMsgType(type);
    setMessage(text);
  };

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/customers/${customerId}`);
      setCustomer(data);
      setVehicles(data.vehicles || []);
      setName(data.name || "");
      setPhone(data.phone || "");
    } catch {
      flash("error", "Unable to load your profile. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      await axios.put(`/customers/${customerId}`, { name: name.trim(), phone: phone.trim() });
      const updated = { ...customer, name: name.trim(), phone: phone.trim() };
      setCustomer(updated);
      saveCustomer(updated);
      flash("success", "Profile updated successfully.");
    } catch {
      flash("error", "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddVehicle = async () => {
    if (!newVehicle.vehicleNumber.trim()) {
      flash("error", "Please enter a vehicle plate number.");
      return;
    }
    try {
      const { data } = await axios.post("/customeractions/add-vehicle", {
        vehicleNumber: newVehicle.vehicleNumber.trim(),
        make: newVehicle.make.trim(),
        year: Number(newVehicle.year) || 0,
        customerId,
      });
      setVehicles((prev) => [...prev, data]);
      setNewVehicle({ vehicleNumber: "", make: "", year: "" });
      flash("success", "Vehicle added successfully.");
    } catch {
      flash("error", "Unable to add vehicle. Please try again.");
    }
  };

  const handleUpdateVehicle = async (vehicle) => {
    try {
      await axios.put(`/customeractions/update-vehicle/${vehicle.id}`, {
        vehicleNumber: vehicle.vehicleNumber,
        make: vehicle.make,
        year: Number(vehicle.year) || 0,
      });
      flash("success", "Vehicle updated.");
    } catch {
      flash("error", "Failed to update vehicle.");
    }
  };

  const handleRemoveVehicle = async (id) => {
    try {
      await axios.delete(`/customeractions/delete-vehicle/${id}`);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      flash("success", "Vehicle removed.");
    } catch {
      flash("error", "Failed to remove vehicle.");
    }
  };

  const editVehicleField = (id, field, value) => {
    setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  const inputClass =
    "rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  if (loading) {
    return <p className="text-center text-slate-500">Loading profile...</p>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-semibold text-slate-900">My Profile</h1>
      <p className="mt-2 text-sm text-slate-500">
        Manage your profile details and registered vehicles.
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

      {/* Profile details */}
      <section className="mt-8 rounded-[28px] bg-white p-8 shadow-xl shadow-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Profile details</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Full name</label>
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Phone number</label>
            <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Email (cannot be changed)</label>
            <input className={`${inputClass} opacity-60`} value={customer?.email || ""} disabled />
          </div>
        </div>
        <button
          className={`mt-5 rounded-2xl px-5 py-3 text-sm font-semibold text-white transition ${
            saving ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
          disabled={saving}
          onClick={handleProfileSave}
        >
          {saving ? "Saving..." : "Save profile"}
        </button>
      </section>

      {/* Registered vehicles */}
      <section className="mt-8 rounded-[28px] bg-white p-8 shadow-xl shadow-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Registered vehicles</h2>
        <div className="mt-5 space-y-4">
          {vehicles.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
              No vehicles registered yet. Add one below.
            </p>
          ) : (
            vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_1fr_120px_auto] md:items-end"
              >
                <div className="grid gap-1">
                  <label className="text-xs font-medium text-slate-500">Plate number</label>
                  <input
                    className={inputClass}
                    value={vehicle.vehicleNumber || ""}
                    onChange={(e) => editVehicleField(vehicle.id, "vehicleNumber", e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <label className="text-xs font-medium text-slate-500">Make &amp; model</label>
                  <input
                    className={inputClass}
                    value={vehicle.make || ""}
                    onChange={(e) => editVehicleField(vehicle.id, "make", e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <label className="text-xs font-medium text-slate-500">Year</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={vehicle.year || ""}
                    onChange={(e) => editVehicleField(vehicle.id, "year", e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    onClick={() => handleUpdateVehicle(vehicle)}
                  >
                    Save
                  </button>
                  <button
                    className="rounded-2xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
                    onClick={() => handleRemoveVehicle(vehicle.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Add vehicle */}
      <section className="mt-8 rounded-[28px] bg-white p-8 shadow-xl shadow-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Add a new vehicle</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Plate number</label>
            <input
              className={inputClass}
              value={newVehicle.vehicleNumber}
              onChange={(e) => setNewVehicle((p) => ({ ...p, vehicleNumber: e.target.value }))}
              placeholder="BA-1-1234"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Make &amp; model</label>
            <input
              className={inputClass}
              value={newVehicle.make}
              onChange={(e) => setNewVehicle((p) => ({ ...p, make: e.target.value }))}
              placeholder="Toyota Corolla"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">Year</label>
            <input
              type="number"
              className={inputClass}
              value={newVehicle.year}
              onChange={(e) => setNewVehicle((p) => ({ ...p, year: e.target.value }))}
              placeholder="2024"
            />
          </div>
        </div>
        <button
          className="mt-5 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          onClick={handleAddVehicle}
        >
          Add vehicle
        </button>
      </section>
    </div>
  );
}
