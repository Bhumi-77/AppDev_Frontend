import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";


export default function CustomerDetails() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [sendingInvoiceId, setSendingInvoiceId] = useState(null);
  const [activeTab, setActiveTab] = useState("vehicles");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const [newPlate, setNewPlate] = useState("");
  const [newMake, setNewMake] = useState("");
  const [newYear, setNewYear] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/customers/${id}`)
      .then((res) => {
        setCustomer(res.data);
        setVehicles(res.data.vehicles ?? []);
        setInvoices(res.data.invoices ?? []);
      })
      .catch(() => setError("Failed to load customer data."))
      .finally(() => setLoading(false));
  }, [id]);

  function getInitials(name) {
    return name?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) ?? "?";
  }

  function totalSpent() {
    return invoices.reduce((sum, i) => sum + i.totalAmount, 0).toLocaleString();
  }

  function saveEdit() {
    axios
      .put(`/customers/${id}`, { name: editName, phone: editPhone })
      .then(() => {
        setCustomer((prev) => ({ ...prev, name: editName, phone: editPhone }));
        setEditMode(false);
      })
      .catch(() => alert("Failed to update customer."));
  }

  function addVehicle() {
    if (!newPlate || !newMake) return;
    axios
      .post(`/customers/${id}/vehicles`, {
        vehicleNumber: newPlate,
        make: newMake,
        year: parseInt(newYear) || new Date().getFullYear(),
      })
      .then((res) => {
        setVehicles((prev) => [...prev, res.data]);
        setNewPlate("");
        setNewMake("");
        setNewYear("");
        setActiveTab("vehicles");
      })
      .catch(() => alert("Failed to add vehicle."));
  }

  function removeVehicle(vehicleId) {
    axios
      .delete(`/vehicles/${vehicleId}`)
      .then(() => setVehicles((prev) => prev.filter((v) => v.id !== vehicleId)))
      .catch(() => alert("Failed to remove vehicle."));
  }

  function sendInvoice(invoiceId) {
    if (!invoiceId) return;
    setSendingInvoiceId(invoiceId);
    axios
      .post(`/invoices/${invoiceId}/send`)
      .then(() => alert("Invoice sent to customer email."))
      .catch(() => alert("Failed to send invoice. Ensure backend/mail service is running."))
      .finally(() => setSendingInvoiceId(null));
  }

  if (loading) return <p className="text-gray-500 text-sm text-center py-6">Loading...</p>;
  if (error) return <p className="text-red-600 text-sm text-center py-6">{error}</p>;
  if (!customer) return null;

  return (
    <div className="p-4 font-sans">

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-medium text-teal-800">{getInitials(customer.name)}</div>
        <div className="flex-1">
          <p className="text-lg font-semibold">{customer.name}</p>
          <p className="text-sm text-gray-500 mt-0.5">{customer.phone}</p>
        </div>
        <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-800">Active</span>
        <button className="px-3 py-2 text-sm border rounded-md text-gray-600" onClick={() => { setEditName(customer.name); setEditPhone(customer.phone); setEditMode(true); }}>
          Edit
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="bg-gray-100 rounded p-3 text-center"><p className="text-xs text-gray-500 mb-1">Vehicles</p><p className="text-2xl font-semibold">{vehicles.length}</p></div>
        <div className="bg-gray-100 rounded p-3 text-center"><p className="text-xs text-gray-500 mb-1">Invoices</p><p className="text-2xl font-semibold">{invoices.length}</p></div>
        <div className="bg-gray-100 rounded p-3 text-center"><p className="text-xs text-gray-500 mb-1">Total spent</p><p className="text-2xl font-semibold">${totalSpent()}</p></div>
      </div>

      <div className="flex gap-2 mb-5">
        {["vehicles", "invoices", "add"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm border rounded-full transition ${activeTab === tab ? 'bg-blue-100 text-teal-800 border-transparent' : 'text-gray-600'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "add" ? "+ Add Vehicle" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "vehicles" && (
        <div className="bg-white border rounded p-4 mb-4">
          {vehicles.length === 0 ? (
            <p className="text-gray-500">No vehicles registered.</p>
          ) : (
            vehicles.map((v) => (
              <div key={v.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <div>
                  <span className="font-medium text-sm">{v.vehicleNumber}</span>
                  <span className="text-sm text-gray-500"> · {v.make} · {v.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-teal-800">Vehicle</span>
                  <button className="bg-red-50 text-red-700 px-3 py-1 rounded" onClick={() => removeVehicle(v.id)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "invoices" && (
        <div className="bg-white border rounded p-4 mb-4">
          {invoices.length === 0 ? (
            <p className="text-gray-500">No invoices found.</p>
          ) : (
            invoices.map((i) => (
              <div key={i.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <div>
                  <span className="font-medium text-sm">Invoice #{i.id}</span>
                  <span className="text-sm text-gray-500"> · {i.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={i.status === "Paid" ? 'inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-800' : 'inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800'}>{i.status}</span>
                  <span className="font-medium">${i.totalAmount?.toLocaleString()}</span>
                  <button
                    className="bg-blue-100 text-teal-800 px-3 py-1 rounded text-sm"
                    onClick={() => sendInvoice(i.id)}
                    disabled={sendingInvoiceId === i.id}
                  >
                    {sendingInvoiceId === i.id ? "Sending..." : "Send Email"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "add" && (
        <div className="bg-white border rounded p-4 mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Add vehicle</p>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input className="text-sm p-2 border rounded w-full" placeholder="Plate number" value={newPlate} onChange={(e) => setNewPlate(e.target.value)} />
            <input className="text-sm p-2 border rounded w-full" placeholder="Make & model" value={newMake} onChange={(e) => setNewMake(e.target.value)} />
          </div>
          <input className="text-sm p-2 border rounded w-full mb-3" placeholder="Year" value={newYear} onChange={(e) => setNewYear(e.target.value)} />
          <button className="bg-blue-100 text-teal-800 px-4 py-2 rounded font-medium" onClick={addVehicle}>Add vehicle</button>
        </div>
      )}

      {editMode && (
        <div className="bg-white border rounded p-4 mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Edit customer</p>
          <div className="grid gap-2 mb-3">
            <input className="text-sm p-2 border rounded w-full" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Full name" />
            <input className="text-sm p-2 border rounded w-full" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="Phone number" />
          </div>
          <div className="flex gap-2">
            <button className="bg-blue-100 text-teal-800 px-4 py-2 rounded font-medium" onClick={saveEdit}>Save</button>
            <button className="px-3 py-2 text-sm border rounded-md text-gray-600" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </div>
      )}

    </div>
  );
}