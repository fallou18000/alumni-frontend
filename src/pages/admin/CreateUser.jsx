import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const CreateUser = ({ onRefresh }) => {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role_id: 2,
  });

  const [excelUsers, setExcelUsers] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // CREATE ONE USER
  const createUser = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/admin/create-user",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onRefresh();
    } catch (err) {
      alert("Error creating user");
    }
  };

  // READ EXCEL
  const handleExcel = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      const formatted = json.map((u) => ({
        first_name: u.first_name,
        last_name: u.last_name,
        email: u.email,
        role_id: Number(u.role_id) || 2,
      }));

      setExcelUsers(formatted);
    };

    reader.readAsArrayBuffer(file);
  };

  // IMPORT USERS
  const importUsers = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/admin/create-user",
        { users: excelUsers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onRefresh();
    } catch {
      alert("Import failed");
    }
  };

  return (
    <div className="create-user">

      {/* FORM */}
      <div className="form-section">
        <h3>Single User</h3>

        <input name="first_name" placeholder="First name" onChange={handleChange} />
        <input name="last_name" placeholder="Last name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />

        <select name="role_id" onChange={handleChange}>
          <option value={2}>Alumni</option>
          <option value={3}>Responsable</option>
          <option value={1}>Admin</option>
        </select>

        <button className="btn primary" onClick={createUser}>
          Create
        </button>
      </div>

      {/* IMPORT */}
      <div className="form-section">
        <h3>Import CSV / Excel</h3>

        <input type="file" onChange={handleExcel} />

        <button className="btn" onClick={importUsers}>
          Import ({excelUsers.length})
        </button>
      </div>

    </div>
  );
};

export default CreateUser;