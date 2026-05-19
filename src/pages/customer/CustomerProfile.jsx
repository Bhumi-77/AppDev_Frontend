// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "../../api/axios";

// export default function CustomerProfile() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [customer, setCustomer] = useState(null);
//   const [vehicles, setVehicles] = useState([]);
//   const [message, setMessage] = useState("");
//   const [msgType, setMsgType] = useState("success");

//   // Profile form state
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//   });

//   // Add vehicle form state
//   const [vehicleForm, setVehicleForm] = useState({
//     vehicleNumber: "",
//     make: "",
//     year: new Date().getFullYear(),
//   });
//   const [addingVehicle, setAddingVehicle] = useState(false);
//   const [savingProfile, setSavingProfile] = useState(false);

//   // Get auth data from session
//   const token = sessionStorage.getItem("token");
//   const userId = sessionStorage.getItem("user_id");

//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//       return;
//     }
//     loadProfile();
//   }, []);

//   const loadProfile = async () => {
//     try {
//       setLoading(true);
//       setMessage("");
      
//       // Try multiple endpoints
//       let response;
//       try {
//         response = await axios.get(`/auth/profile`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       } catch (err1) {
//         if (err1.response?.status === 404 || err1.response?.status === 400) {
//           response = await axios.get(`/customers/profile`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//         } else {
//           throw err1;
//         }
//       }

//       const data = response.data?.data || response.data;
//       setCustomer(data);
//       setFormData({
//         name: data.fullName || data.name || "",
//         email: data.email || "",
//         phone: data.phoneNumber || data.phone || "",
//       });
//       setVehicles(data.vehicles || []);
//     } catch (err) {
//       console.error("Error loading profile:", err.response?.data || err.message);
//       // Don't redirect - show the form for user to interact with
//       setFormData({
//         name: "",
//         email: sessionStorage.getItem("user_email") || "",
//         phone: "",
//       });
//       setMessage("Could not load profile data. Please try saving your information.");
//       setMsgType("error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleProfileChange = (field) => (e) => {
//     setFormData((prev) => ({ ...prev, [field]: e.target.value }));
//   };

//   const handleSaveProfile = async (e) => {
//     e.preventDefault();
//     setSavingProfile(true);
//     setMessage("");

//     try {
//       await axios.put(
//         `/auth/profile`,
//         {
//           fullName: formData.name.trim(),
//           phoneNumber: formData.phone.trim(),
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setMsgType("success");
//       setMessage("Profile updated successfully!");
//     } catch (err) {
//       console.error("Error saving profile:", err.response?.data || err.message);
//       setMsgType("error");
//       setMessage(err.response?.data?.message || "Failed to update profile. Please try again.");
//     } finally {
//       setSavingProfile(false);
//     }
//   };

//   const handleVehicleChange = (field) => (e) => {
//     setVehicleForm((prev) => ({
//       ...prev,
//       [field]: field === "year" ? parseInt(e.target.value) : e.target.value,
//     }));
//   };

//   const handleAddVehicle = async (e) => {
//     e.preventDefault();
//     if (!vehicleForm.vehicleNumber.trim() || !vehicleForm.make.trim()) {
//       setMessage("Please enter vehicle plate and make.");
//       setMsgType("error");
//       return;
//     }

//     setAddingVehicle(true);
//     setMessage("");

//     try {
//       const response = await axios.post(
//         `/vehicles`,
//         {
//           vehicleNumber: vehicleForm.vehicleNumber.trim(),
//           make: vehicleForm.make.trim(),
//           year: vehicleForm.year,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setVehicles((prev) => [...prev, response.data?.data || response.data]);
//       setVehicleForm({
//         vehicleNumber: "",
//         make: "",
//         year: new Date().getFullYear(),
//       });
//       setMsgType("success");
//       setMessage("Vehicle added successfully!");
//     } catch (err) {
//       console.error("Error adding vehicle:", err.response?.data || err.message);
//       setMsgType("error");
//       setMessage(err.response?.data?.message || "Failed to add vehicle. Please try again.");
//     } finally {
//       setAddingVehicle(false);
//     }
//   };

//   const handleRemoveVehicle = async (vehicleId) => {
//     if (!window.confirm("Are you sure you want to remove this vehicle?")) return;

//     try {
//       await axios.delete(`/vehicles/${vehicleId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
//       setMsgType("success");
//       setMessage("Vehicle removed successfully!");
//     } catch (err) {
//       console.error("Error removing vehicle:", err.response?.data || err.message);
//       setMsgType("error");
//       setMessage(err.response?.data?.message || "Failed to remove vehicle. Please try again.");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
//         <div className="w-full max-w-4xl rounded-[28px] bg-white p-10 shadow-2xl shadow-slate-200">
//           <p className="text-center text-slate-500 animate-pulse">Loading your profile...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-100 px-4 py-8">
//       <div className="mx-auto max-w-4xl">
//         <div className="rounded-[28px] bg-white p-10 shadow-2xl shadow-slate-200">
//           <div className="mb-8">
//             <h1 className="text-3xl font-semibold text-slate-900">Customer Profile</h1>
//             <p className="mt-2 text-sm text-slate-500">Manage your personal details and vehicle information.</p>
//           </div>

//           {message && (
//             <div
//               className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
//                 msgType === "success"
//                   ? "border-emerald-200 bg-emerald-50 text-emerald-800"
//                   : "border-rose-200 bg-rose-50 text-rose-800"
//               }`}
//             >
//               {message}
//             </div>
//           )}

//           {/* Profile Section */}
//           <section className="mb-10">
//             <h2 className="mb-6 text-lg font-semibold text-slate-900">Personal Information</h2>
//             <form onSubmit={handleSaveProfile} className="space-y-5">
//               <div className="grid gap-5 md:grid-cols-2">
//                 <div className="grid gap-2">
//                   <label className="text-sm font-medium text-slate-700">Full Name</label>
//                   <input
//                     type="text"
//                     value={formData.name}
//                     onChange={handleProfileChange("name")}
//                     className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                     placeholder="John Doe"
//                     required
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <label className="text-sm font-medium text-slate-700">Email</label>
//                   <input
//                     type="email"
//                     value={formData.email}
//                     disabled
//                     className="rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-600 outline-none cursor-not-allowed"
//                   />
//                 </div>
//               </div>

//               <div className="grid gap-2">
//                 <label className="text-sm font-medium text-slate-700">Phone Number</label>
//                 <input
//                   type="tel"
//                   value={formData.phone}
//                   onChange={handleProfileChange("phone")}
//                   className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                   placeholder="+1 (555) 000-0000"
//                   required
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={savingProfile}
//                 className={`rounded-2xl px-6 py-3 text-sm font-semibold text-white transition ${
//                   savingProfile
//                     ? "bg-indigo-300 cursor-not-allowed"
//                     : "bg-indigo-600 hover:bg-indigo-700"
//                 }`}
//               >
//                 {savingProfile ? "Saving..." : "Save Profile"}
//               </button>
//             </form>
//           </section>

//           {/* Vehicles Section */}
//           <section className="mb-10">
//             <h2 className="mb-6 text-lg font-semibold text-slate-900">Your Vehicles</h2>

//             {vehicles.length === 0 ? (
//               <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center">
//                 <p className="text-sm text-slate-600">No vehicles registered yet.</p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {vehicles.map((vehicle) => (
//                   <div
//                     key={vehicle.id}
//                     className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center"
//                   >
//                     <div>
//                       <p className="font-semibold text-slate-900">{vehicle.vehicleNumber}</p>
//                       <p className="text-sm text-slate-600">
//                         {vehicle.make} • {vehicle.year}
//                       </p>
//                     </div>
//                     <button
//                       onClick={() => handleRemoveVehicle(vehicle.id)}
//                       className="rounded-2xl bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-200"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </section>

//           {/* Add Vehicle Section */}
//           <section>
//             <h2 className="mb-6 text-lg font-semibold text-slate-900">Add New Vehicle</h2>
//             <form onSubmit={handleAddVehicle} className="space-y-5">
//               <div className="grid gap-5 md:grid-cols-2">
//                 <div className="grid gap-2">
//                   <label className="text-sm font-medium text-slate-700">Plate Number</label>
//                   <input
//                     type="text"
//                     value={vehicleForm.vehicleNumber}
//                     onChange={handleVehicleChange("vehicleNumber")}
//                     className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                     placeholder="ABC-1234"
//                     required
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <label className="text-sm font-medium text-slate-700">Make & Model</label>
//                   <input
//                     type="text"
//                     value={vehicleForm.make}
//                     onChange={handleVehicleChange("make")}
//                     className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                     placeholder="Toyota Corolla"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="grid gap-2 md:max-w-xs">
//                 <label className="text-sm font-medium text-slate-700">Year</label>
//                 <input
//                   type="number"
//                   value={vehicleForm.year}
//                   onChange={handleVehicleChange("year")}
//                   className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
//                   min="1990"
//                   max={new Date().getFullYear() + 1}
//                   required
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={addingVehicle}
//                 className={`rounded-2xl px-6 py-3 text-sm font-semibold text-white transition ${
//                   addingVehicle
//                     ? "bg-emerald-300 cursor-not-allowed"
//                     : "bg-emerald-600 hover:bg-emerald-700"
//                 }`}
//               >
//                 {addingVehicle ? "Adding..." : "Add Vehicle"}
//               </button>
//             </form>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// }
