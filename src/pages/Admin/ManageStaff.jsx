import { useEffect, useState } from "react";
import api from "../../api/axios";

function ManageStaff() {
  const [staffList, setStaffList] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Staff",
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const loadStaff = async () => {
    try {
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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      fullName: "",
      email: "",
      password: "",
      role: "Staff",
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
          isActive: true,
        });
      } else {
        await api.post("/staff", form);
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
    });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/staff/${id}`);
      loadStaff();
    } catch {
      setError("Failed to delete staff.");
    }
  };

  return (
    <div className="page">
      <h2>Manage Staff</h2>

      <form className="card" onSubmit={handleSubmit}>
        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          disabled={editId !== null}
          required
        />

        {!editId && (
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        )}

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="Staff">Staff</option>
          <option value="Admin">Admin</option>
        </select>

        <button type="submit">{editId ? "Update Staff" : "Add Staff"}</button>

        {editId && (
          <button type="button" onClick={resetForm}>
            Cancel Edit
          </button>
        )}
      </form>

      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Active</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {staffList.map((staff) => (
            <tr key={staff.id}>
              <td>{staff.id}</td>
              <td>{staff.fullName}</td>
              <td>{staff.email}</td>
              <td>{staff.role}</td>
              <td>{staff.isActive ? "Yes" : "No"}</td>
              <td>
                <button onClick={() => handleEdit(staff)}>Edit</button>
                <button onClick={() => handleDelete(staff.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageStaff;