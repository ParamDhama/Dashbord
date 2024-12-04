import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth"; // Import loginUser function
import "./login.css";

function CollegeLoginPage() {
  const [userName, setUserName] = useState(""); // Change from email to userName
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Define setError for error handling
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form default submission behavior
    setLoading(true); // Set loading state

    try {
      // Call the loginUser function
      const { token, user } = await loginUser(userName, password); // Pass userName instead of email
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error.message || error);
      setError(error.message || "Invalid credentials"); // Display error to user
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="dynamic-background">
      <div className="login-container">
        <div className="header">
          <div className="college-logo">🎓</div>
          <h1>College Tech Portal</h1>
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Student Login</h2>
          <div className="input-container">
            <label htmlFor="userName">Username</label>
            <input
              id="userName"
              type="text"
              placeholder="Enter your username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>} {/* Display errors */}
        </form>
      </div>
    </div>
  );
}

export default CollegeLoginPage;