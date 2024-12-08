import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";

// Login Component
const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login/employees", data);
      console.log("Status:", response.status);
      console.log("Token:", response.data.token);

      // Save token or perform further actions
      localStorage.setItem("token", response.data.token);

      // Redirect to Admin Dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during login:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={data.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

// AdminDashboard Component
const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    designation: "",
    courses: [],
    profileImage: null,
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("/api/employees");
        setFilteredEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(newUser).forEach((key) => {
        if (key === "profileImage") {
          formData.append(key, newUser[key]);
        } else {
          formData.append(key, JSON.stringify(newUser[key]));
        }
      });

      const response = await axios.post("/api/employees", formData);
      console.log("User added successfully:", response.data);
      setShowModal(false);
      setNewUser({ name: "", email: "", designation: "", courses: [], profileImage: null });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={() => setShowModal(true)}>Add User</button>
      {showModal && (
        <form onSubmit={handleAddUser}>
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <button type="submit">Add</button>
          <button type="button" onClick={() => setShowModal(false)}>
            Cancel
          </button>
        </form>
      )}
      <ul>
        {filteredEmployees.map((emp) => (
          <li key={emp.id}>{emp.name}</li>
        ))}
      </ul>
    </div>
  );
};

// Main App Component


export default App;
