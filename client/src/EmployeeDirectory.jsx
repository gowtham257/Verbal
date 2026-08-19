import { useEffect, useState } from "react";

const emptyForm = {
  empId: "",
  empName: "",
  designation: "",
  salary: "",
  experience: "",
  address: "",
  mobile: "",
  joinDate: "",
};

function EmployeeDirectory({ token, onUnauthorized }) {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const authFetch = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      onUnauthorized();
      throw new Error("Session expired, please sign in again");
    }
    return res;
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await authFetch("/api/employees");
      if (!res.ok) throw new Error("Failed to load employees");
      const data = await res.json();
      setEmployees(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      const isEditing = Boolean(editingId);
      const res = await authFetch(isEditing ? `/api/employees/${editingId}` : "/api/employees", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to save employee");
      }
      setForm(emptyForm);
      setEditingId(null);
      await fetchEmployees();
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (emp) => {
    setEditingId(emp._id);
    setForm({
      empId: emp.empId,
      empName: emp.empName,
      designation: emp.designation,
      salary: emp.salary,
      experience: emp.experience,
      address: emp.address,
      mobile: emp.mobile,
      joinDate: new Date(emp.joinDate).toISOString().slice(0, 10),
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = async (id) => {
    try {
      const res = await authFetch(`/api/employees/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete employee");
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
      if (editingId === id) handleCancelEdit();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <section className="card">
        <h2>{editingId ? "Edit Employee" : "Add Employee"}</h2>
        <form className="entry-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="empId">Emp Id</label>
            <input id="empId" type="text" value={form.empId} onChange={handleChange("empId")} required />
          </div>

          <div className="field">
            <label htmlFor="empName">Emp Name</label>
            <input id="empName" type="text" value={form.empName} onChange={handleChange("empName")} required />
          </div>

          <div className="field">
            <label htmlFor="designation">Designation</label>
            <input
              id="designation"
              type="text"
              value={form.designation}
              onChange={handleChange("designation")}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="salary">Salary</label>
            <input
              id="salary"
              type="number"
              min="0"
              value={form.salary}
              onChange={handleChange("salary")}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="experience">Experience (years)</label>
            <input
              id="experience"
              type="number"
              min="0"
              step="0.1"
              value={form.experience}
              onChange={handleChange("experience")}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="mobile">Mobile</label>
            <input id="mobile" type="tel" value={form.mobile} onChange={handleChange("mobile")} required />
          </div>

          <div className="field">
            <label htmlFor="joinDate">Emp Join Date</label>
            <input
              id="joinDate"
              type="date"
              value={form.joinDate}
              onChange={handleChange("joinDate")}
              required
            />
          </div>

          <div className="field field-wide">
            <label htmlFor="address">Address</label>
            <input id="address" type="text" value={form.address} onChange={handleChange("address")} required />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update Employee" : "Add Employee"}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} disabled={saving}>
                Cancel
              </button>
            )}
          </div>
        </form>
        {error && <p className="error">{error}</p>}
      </section>

      <section className="card">
        <h2>Employee Directory</h2>
        {loading ? (
          <p>Loading...</p>
        ) : employees.length === 0 ? (
          <p>No employees added yet.</p>
        ) : (
          <div className="table-scroll">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Emp Id</th>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Salary</th>
                  <th>Experience</th>
                  <th>Mobile</th>
                  <th>Address</th>
                  <th>Join Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>{emp.empId}</td>
                    <td>{emp.empName}</td>
                    <td>{emp.designation}</td>
                    <td>{emp.salary}</td>
                    <td>{emp.experience} yr</td>
                    <td>{emp.mobile}</td>
                    <td>{emp.address}</td>
                    <td>{new Date(emp.joinDate).toLocaleDateString()}</td>
                    <td className="row-actions">
                      <button className="edit-btn" onClick={() => handleEdit(emp)} type="button">
                        Edit
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(emp._id)} type="button">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

export default EmployeeDirectory;
