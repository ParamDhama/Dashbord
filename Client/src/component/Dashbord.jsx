import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashbord.css";
import { addUser, fetchUsers } from "../api/auth";

const employees = [
  { name: "John Doe", email: "john@demo.com", id: 1 },
  { name: "Jane Smith", email: "jane@demo.com", id: 2 },
  { name: "Sam Adams", email: "sam@demo.com", id: 3 },
];

function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [profileImage, setProfileImage] = useState(
    "https://via.placeholder.com/40"
  );
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    courses: [],
    profileImage: null,
  });

  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const response = await fetchUsers();
      setFilteredEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    setFilteredEmployees(
      employees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

  const handleLogout = () => {
    navigate("/login");
  };

  const handleAddUserClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewUser({
      name: "",
      email: "",
      mobile: "",
      designation: "",
      courses: [],
      profileImage: null,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await addUser(newUser);
      fetchEmployees();
      alert("User added successfully!"); // Success alert
      setShowModal(false);
      setNewUser({
        name: "",
        email: "",
        mobile: "",
        designation: "",
        courses: [],
        profileImage: null,
      });
    } catch (error) {
      alert("Failed to add user. Please try again."); // Error alert
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCourseChange = (e) => {
    const { value } = e.target;
    setNewUser((prevState) => {
      const updatedCourses = prevState.courses.includes(value)
        ? prevState.courses.filter((course) => course !== value)
        : [...prevState.courses, value];
      return { ...prevState, courses: updatedCourses };
    });
  };

  const handleFileChange = (e) => {
    setNewUser((prevState) => ({
      ...prevState,
      profileImage: e.target.files[0],
    }));
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-left">
          <div className="logo">Admin Dashboard</div>
        </div>
        <div className="navbar-right">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="profile-icon">
            <img src={profileImage} alt="Profile" />
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      <div className="add-user-button-container">
        <button className="add-user-btn" onClick={handleAddUserClick}>
          Add User
        </button>
      </div>

      <div className="employee-list">
        <h2>Employees</h2>
        <ul>
          {filteredEmployees?.length > 0 ? (
            filteredEmployees.map((emp, index) => (
              <li key={index}>
                <span>
                  <b>{index + 1} {". "}</b>
                </span>
                <span>{emp.name}</span> - <span>{emp.email}</span>
              </li>
            ))
          ) : (
            <li>No employees found</li>
          )}
        </ul>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New User</h2>
            <form onSubmit={handleFormSubmit} className="user-form">
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-container">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-container">
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  name="mobile"
                  value={newUser.mobile}
                  onChange={handleInputChange}
                  pattern="[0-9]{10}"
                  required
                  maxLength="10"
                  title="Please enter a valid 10-digit mobile number"
                />
              </div>

              <div className="input-container">
                <select
                  name="designation"
                  value={newUser.designation}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Designation</option>
                  <option value="Hr">Hr</option>
                  <option value="Manager">Manager</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>

              <div className="course-section">
                <label>Courses</label>
                <div className="input-courses">
                  <div className="course-name">
                    <input
                      type="checkbox"
                      id="react"
                      value="React"
                      checked={newUser.courses.includes("React")}
                      onChange={handleCourseChange}
                    />
                    <label htmlFor="react">React</label>
                  </div>
                  <div className="course-name">
                    <input
                      type="checkbox"
                      id="nodejs"
                      value="Node"
                      checked={newUser.courses.includes("Node")}
                      onChange={handleCourseChange}
                    />
                    <label htmlFor="nodejs">Node.js</label>
                  </div>
                  <div className="course-name">
                    <input
                      type="checkbox"
                      id="mongodb"
                      value="MongoDB"
                      checked={newUser.courses.includes("MongoDB")}
                      onChange={handleCourseChange}
                    />
                    <label htmlFor="mongodb">MongoDB</label>
                  </div>
                </div>
              </div>

              <div className="gender-section">
                <label>Gender</label>
                <div className="gender-options">
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="male"
                    onChange={handleInputChange}
                  />
                  <label htmlFor="male">Male</label>
                </div>
                <div className="gender-options">
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="female"
                    onChange={handleInputChange}
                  />
                  <label htmlFor="female">Female</label>
                </div>
              </div>

              <div className="input-container">
                <label>Profile Image</label>
                <input
                  type="file"
                  name="profileImage"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="submit-btn">
                  Add User
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
