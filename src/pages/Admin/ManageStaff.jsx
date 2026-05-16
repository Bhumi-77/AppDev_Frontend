import { useEffect, useState } from "react";
import api from "../../api/axios";

function ManageStaff() {
  const [staffList, setStaffList] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Staff",
    isActive: true,
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const loadStaff = async () => {
    try {
      setError("");
      const response = await api.get("/staff");
      setStaffList(response.data);
    } catch {
      setError("Failed to load staff.");
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "isActive" ? value === "true" : value,
    });
  };

  const resetForm = () => {
    setForm({
      fullName: "",
      email: "",
      password: "",
      role: "Staff",
      isActive: true,
    });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      if (editId) {
        await api.put(`/staff/${editId}`, {
          fullName: form.fullName,
          role: form.role,
          isActive: form.isActive,
        });
      } else {
        await api.post("/staff", {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          role: form.role,
        });
      }

      resetForm();
      loadStaff();
    } catch {
      setError("Failed to save staff.");
    }
  };

  const handleEdit = (staff) => {
    setEditId(staff.id);
    setForm({
      fullName: staff.fullName,
      email: staff.email,
      password: "",
      role: staff.role,
      isActive: staff.isActive,
    });
  };

  const handleDeactivate = async (id) => {
    const confirmDeactivate = window.confirm(
      "Are you sure you want to deactivate this staff member?"
    );

    if (!confirmDeactivate) return;

    try {
      setError("");
      await api.delete(`/staff/${id}`);
      loadStaff();
    } catch {
      setError("Failed to deactivate staff.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Staff Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Add new staff, update staff details, assign roles, and deactivate
          staff accounts.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Add / Edit Staff Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {editId ? "Update Staff" : "Add Staff"}
            </h2>
            <p className="text-sm text-slate-500">
              {editId
                ? "Update role and account status for the selected staff."
                : "Register a new staff member into the system."}
            </p>
          </div>

          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
            className="h-11 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            disabled={editId !== null}
            required
            className="h-11 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 disabled:bg-slate-100 disabled:text-slate-400"
          />

          {!editId && (
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="h-11 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
            />
          )}

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="h-11 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
          >
            <option value="Staff">Staff</option>
            <option value="Admin">Admin</option>
          </select>

          {editId && (
            <select
              name="isActive"
              value={form.isActive.toString()}
              onChange={handleChange}
              className="h-11 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          )}
        </div>

        <button
          type="submit"
          className="mt-5 rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-600"
        >
          {editId ? "Update Staff" : "Add Staff"}
        </button>
      </form>

      {/* Staff List */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Staff List
            </h2>
            <p className="text-sm text-slate-500">
              View and manage registered staff members.
            </p>
          </div>

          <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700">
            {staffList.length} Staff
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-6 py-3 font-semibold">ID</th>
                <th className="text-left px-6 py-3 font-semibold">
                  Full Name
                </th>
                <th className="text-left px-6 py-3 font-semibold">Email</th>
                <th className="text-left px-6 py-3 font-semibold">Role</th>
                <th className="text-left px-6 py-3 font-semibold">Status</th>
                <th className="text-left px-6 py-3 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {staffList.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No staff found.
                  </td>
                </tr>
              ) : (
                staffList.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-700">{staff.id}</td>

                    <td className="px-6 py-4 font-medium text-slate-900">
                      {staff.fullName}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {staff.email}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {staff.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          staff.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {staff.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(staff)}
                          className="font-semibold text-teal-600 hover:text-teal-700"
                        >
                          Edit
                        </button>

                        {staff.isActive ? (
                          <button
                            onClick={() => handleDeactivate(staff.id)}
                            className="font-semibold text-red-600 hover:text-red-700"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <span className="text-slate-400">
                            Already inactive
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageStaff;