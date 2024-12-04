import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashbord.css";

// Dummy data for the search feature
const employees = [
  { name: "John Doe", email: "john@demo.com", id: 1 },
  { name: "Jane Smith", email: "jane@demo.com", id: 2 },
  { name: "Sam Adams", email: "sam@demo.com", id: 3 },
];

function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState(employees);
  const [profileImage, setProfileImage] = useState(
    "https://via.placeholder.com/40" // Placeholder for profile image
  );
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    designation: "",
    courses: [],
    profileImage: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Filter employees based on the search query
    setFilteredEmployees(
      employees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

  const handleLogout = () => {
    // Perform logout (clear session, redirect to login)
    navigate("/login");
  };

  const handleAddUserClick = () => {
    setShowModal(true); // Open modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close modal
    setNewUser({
      name: "",
      email: "",
      designation: "",
      courses: [],
      profileImage: null,
    }); // Reset form
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Process the new user (e.g., send to backend or add to the list)
    console.log("New User Added:", newUser);
    // After adding, close the modal
    setShowModal(false);
    setNewUser({
      name: "",
      email: "",
      designation: "",
      courses: [],
      profileImage: null,
    }); // Reset form
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
      {/* Navbar with Profile Image Icon and Search Bar */}
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

      {/* Add User Button */}
      <div className="add-user-button-container">
        <button className="add-user-btn" onClick={handleAddUserClick}>
          Add User
        </button>
      </div>

      {/* Employee List Section */}
      <div className="employee-list">
        <h2>Employees</h2>
        <ul>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((emp) => (
              <li key={emp.id}>
                <span>{emp.name}</span> - <span>{emp.email}</span>
              </li>
            ))
          ) : (
            <li>No employees found</li>
          )}
        </ul>
      </div>

      {/* Modal Form for Adding User */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New User</h2>
            <form onSubmit={handleFormSubmit} className="user-form">
              {/* Name Input */}
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

              {/* Email Input */}
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

              {/* Designation Dropdown */}
              <div className="input-container">
                <select
                  name="designation"
                  value={newUser.designation}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Designation</option>
                  <option value="HR">HR</option>
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
                  <input type='radio' id="male" name="gender" value="male" />
                  <label htmlFor="male">Male</label>
                </div>
                <div className="gender-options">
                  <input type='radio' id="female" name="gender" value="female" />
                  <label htmlFor="female">Female</label>
                </div>
              </div>

              {/* Profile Image Upload */}
              <div className="input-container">
                <label>Profile Image</label>
                <input
                  type="file"
                  name="profileImage"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>

              {/* Modal Actions */}
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
