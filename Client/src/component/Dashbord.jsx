import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { addUser, fetchUsers } from "../api/auth";
import Aleart from "./Aleart";

// Dummy data for the search feature (for local testing)
const employees = [
  { name: "John Doe", email: "john@demo.com", id: 1 },
  { name: "Jane Smith", email: "jane@demo.com", id: 2 },
  { name: "Sam Adams", email: "sam@demo.com", id: 3 },
];

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB

function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/40");
  const [showModal, setShowModal] = useState(false);
  const [isAleart, setIsAleart] = useState(false);
  const [aleartMessage,setAleartMessage] = useState("No");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    courses: "",
    gender: "",
    profileImage: null,
  });
  const [users, setUsers] = useState([]); // State to store fetched users
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const navigate = useNavigate();

const handleAleart = () => {
  setIsAleart(true);
  setTimeout(() => {
    setIsAleart(false);
  }, 5000);
}


  // Logout function
  const handleLogout = () => {
    navigate("/login");
  };

  useEffect(() => {
    const fetchAndValidateUsers = async () => {
      try {
        setLoading(true);
  
        // Fetch users from API
        const response = await fetchUsers();
        console.log("API Response:", response); // Log response for debugging
  
        if (response && response.employees) {
          const fetchedUsers = response.employees;
  
          // Validate profile images and update the user objects
          const updatedUsers = await Promise.all(
            fetchedUsers.map(async (user) => {
              const isValid = await checkImageUrl(user.profileImage);
              return { ...user, isValidProfileImage: isValid };
            })
          );
  
          // Update the users state with validated data
          setUsers(updatedUsers);
        } else {
          setUsers([]);
        }
      } catch (err) {
        setError("Failed to fetch users. Please try again.");
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAndValidateUsers();
  }, []); // Run effect only once
  

  const checkImageUrl = async (url) => {
    if (!url) return false;
  
    try {
      // Send a request to the image URL to check if it's valid
      const response = await fetch(url);
  
      // Return true if the response status is 200 (OK)
      return response.ok;
    } catch (error) {
      // Handle network or other errors
      console.error(`Error checking URL ${url}:`, error);
      return false;
    }
  };

  // Search filter logic
  const filteredEmployees = users.filter(
    (user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Modal and form handling
  const handleAddUserClick = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    resetNewUserForm();
  };

  const resetNewUserForm = () => {
    setNewUser({
      name: "",
      email: "",
      mobile: "",
      designation: "",
      courses: [],
      gender: "",
      profileImage: null,
    });
  };
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Calculate paginated data
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredEmployees.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res =  await addUser(newUser);
      console.log("API Response:", res.data); // Log response for debugging
      if(res.status == 409)
      {
        // alert(res.data.error)
        handleAleart();
        setAleartMessage(res.data.error);
        resetNewUserForm();
      }
      else
      {
        setShowModal(false);
        setUsers((prevUsers) => [...prevUsers, newUser]); // Optimistically update the user list
        resetNewUserForm();
      }


    } catch (error) {
      alert("Failed to add user. Please try again.");
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
    const { value, checked } = e.target;
    console.log("Value:", value, "Checked:", checked);
  
    setNewUser((prevState) =>{return { ...prevState, courses: value }});
  };
  

  const handleGenderChange = (e) => {
    const { value } = e.target;
    setNewUser((prevState) => ({
      ...prevState,
      gender: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        alert("Only JPG, JPEG, and PNG files are allowed.");
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        alert("File size should not exceed 2 MB.");
        return;
      }
      setNewUser((prevState) => ({
        ...prevState,
        profileImage: file,
      }));
    }
  };
  

  return (
    <div className="dashboard-container">
      <div style={{position:'absolute'}}>
        {isAleart&&  <Aleart message={aleartMessage}/>}
      </div>
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
  {loading && <p>Loading...</p>}
  {error && <p style={{ color: "red" }}>{error}</p>}
  {!loading && !error && (
    <>
      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Profile Image</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Course</th>
            <th>Designation</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.length > 0 ? (
            currentRows.map((user, index) => (
              <tr key={index}>
                <td>
  {user.isValidProfileImage ? (
    <img
      src={user.profileImage}
      alt="Profile"
      style={{
        width: "50px",
        height: "50px",
        borderRadius: "50%",
      }}
    />
  ) : (
    <div
      style={{
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backgroundColor: "#007BFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#FFF",
        fontWeight: "bold",
        fontSize: "20px",
      }}
    >
      {user.name[0].toUpperCase()}
    </div>
  )}
</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.mobile}</td>
                <td>{[user.courses]}</td>
                <td>{user.designation}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div style={{ marginTop: "10px", textAlign: "center" }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            style={{
              margin: "0 5px",
              padding: "5px 10px",
              backgroundColor: page === currentPage ? "#007BFF" : "#FFF",
              color: page === currentPage ? "#FFF" : "#000",
              border: "1px solid #CCC",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {page}
          </button>
        ))}
      </div>
    </>
  )}
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
                  value={newUser.mobile || ""}
                  onChange={handleInputChange}
                  pattern="[0-9]{10}"
                  required
                />
              </div>

              <div className="course-section">
                <label>Courses</label>
                <div className="input-courses">
                  {["React", "Node", "MongoDB"].map((course) => (
                    <div className="course-name" key={course}>
                      <input
                        type="checkbox"
                        id={course}
                        value={course}
                        checked={newUser.courses.includes(course)}
                        onChange={handleCourseChange}
                      />
                      <label htmlFor={course}>{course}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="input-container">
                <select
                  name="designation"
                  value={newUser.designation}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Designation</option>
                  <option value="Hr">HR</option>
                  <option value="Manager">Manager</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>

              <div className="gender-section">
                <label>Gender</label>
                <div className="gender-options">
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="male"
                    checked={newUser.gender === "male"}
                    onChange={handleGenderChange}
                  />
                  <label htmlFor="male">Male</label>
                </div>
                <div className="gender-options">
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="female"
                    checked={newUser.gender === "female"}
                    onChange={handleGenderChange}
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
                  accept="image/jpeg, image/png, image/jpg"
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
