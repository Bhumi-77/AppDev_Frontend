import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

export default function CustomerProfile() {
  const [customer, setCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [newPlate, setNewPlate] = useState("");
  const [newMake, setNewMake] = useState("");
  const [newYear, setNewYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("success");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const userId = sessionStorage.getItem("user_id");
  const profilePath = userId ? `/customers/${userId}` : "/user/profile";

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(profilePath);
      const data = response.data;
      setCustomer(data);
      setVehicles(data.vehicles || []);
      setName(data.name || "");
      setPhone(data.phone || "");
    } catch (err) {
      setError("Unable to load your profile. Please login or register first.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      await axios.put(profilePath, { name: name.trim(), phone: phone.trim() });
      setCustomer((prev) => ({ ...prev, name: name.trim(), phone: phone.trim() }));
      setMessage("Profile updated successfully.");
      setMsgType("success");
      sessionStorage.setItem("user", JSON.stringify({ ...customer, name: name.trim(), phone: phone.trim() }));
    } catch {
      setMsgType("error");
      setMessage("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddVehicle = async () => {
    if (!newPlate.trim() || !newMake.trim()) {
      setMsgType("error");
      setMessage("Please enter vehicle plate and make.");
      return;
    }

    try {
      const endpoint = userId ? `/customers/${userId}/vehicles` : "/user/profile/vehicles";
      const response = await axios.post(endpoint, {
        vehicleNumber: newPlate.trim(),
        make: newMake.trim(),
        year: Number(newYear) || new Date().getFullYear(),
      });

      setVehicles((prev) => [...prev, response.data]);
      setMessage("Vehicle added successfully.");
      setMsgType("success");
      setNewPlate("");
      setNewMake("");
      setNewYear("");
    } catch {
      setMsgType("error");
      setMessage("Unable to add vehicle. Please try again.");
    }
  };

  const handleRemoveVehicle = async (vehicleId) => {
    try {
      await axios.delete(`/vehicles/${vehicleId}`);
      setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== vehicleId));
      setMessage("Vehicle removed.");
      setMsgType("success");
    } catch {
      setMsgType("error");
      setMessage("Failed to remove vehicle.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-[28px] bg-white p-10 shadow-2xl shadow-slate-200">
          <p className="text-center text-slate-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-[28px] bg-white p-10 shadow-2xl shadow-slate-200">
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">{error}</div>
          <button
            className="mt-6 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            onClick={() => navigate("/signup")}
          >
            Register as customer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-4xl rounded-[28px] bg-white p-10 shadow-2xl shadow-slate-200">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Customer Profile</h1>
            <p className="mt-2 text-sm text-slate-500">Manage your profile details and record vehicle information for better service.</p>
          </div>
        </div>

        {message && (
          <div className={`rounded-3xl px-5 py-4 text-sm ${msgType === "success" ? "border border-emerald-200 bg-emerald-50 text-emerald-800" : "border border-rose-200 bg-rose-50 text-rose-800"}`}>
            {message}
          </div>
        )}

        <section className="mb-10">
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Profile details</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Full name</label>
              <input
                className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Phone number</label>
              <input
                className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              className={`rounded-2xl px-5 py-3 text-sm font-semibold text-white transition ${saving ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
              disabled={saving}
              onClick={handleProfileSave}
            >
              {saving ? "Saving..." : "Save profile"}
            </button>
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-900">Your registered vehicles</h2>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50">
            {vehicles.length === 0 ? (
              <p className="p-6 text-center text-sm text-slate-500">No vehicles registered yet. Add one below.</p>
            ) : (
              vehicles.map((vehicle) => (
                <div key={vehicle.id} className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{vehicle.vehicleNumber}</p>
                    <p className="text-sm text-slate-500">{vehicle.make} · {vehicle.year}</p>
                  </div>
                  <button
                    className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                    onClick={() => handleRemoveVehicle(vehicle.id)}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-900">Add a new vehicle</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Plate number</label>
              <input
                className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                value={newPlate}
                onChange={(e) => setNewPlate(e.target.value)}
                placeholder="ABC-1234"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Make & model</label>
              <input
                className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                value={newMake}
                onChange={(e) => setNewMake(e.target.value)}
                placeholder="Toyota Corolla"
              />
            </div>
          </div>

          <div className="mt-4 grid gap-2 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Year</label>
              <input
                className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
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
    </div>
  );
}
