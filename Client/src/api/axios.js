import React, { useState } from "react";
import axios from "axios";


const App = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value, // Dynamically update the corresponding field
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    try {
      const userData = {
        email: data.email,
        password: data.password,
      };

      // Send POST request to backend
      const response = await axios.post("/api/login/employees", userData);

      console.log("Status:", response.status);
      console.log("Token:", response.data.token);

      // Perform further actions, e.g., save the token, redirect user
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

export default App;