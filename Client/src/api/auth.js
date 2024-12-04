import endpoints from "./endpoints";
import apiClient from "./apiClient";

export const loginUser = async (userName, passwordValue) => {
  try {
    if (!userName || !passwordValue) {
      throw "Username and password are required.";
    }

    console.log("Sending API request with:", { userName, password: "" }); // Mask password in logs

    // Make the API request
    const response = await apiClient.post(endpoints.LOGIN, { userName, passwordValue });
    debugger
    if (response?.data) {
      const token = response?.data?.user?.token;
      const userId = response?.data?.user?.userId;
      const userName = response?.data?.user?.userName;
      setAuthData(token, userId, userName, response?.data?.user);
    }

    console.log("API response:", response.data); // Debug log
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server Error in loginUser:", error.response.data);

      // Improved error handling for specific cases
      if (error.response.status === 429) {
        throw "Too many login attempts. Please try again later.";
      }

      throw error.response.data?.message || "Invalid credentials. Please try again.";
    }

    console.error("Unexpected Error in loginUser:", error.message);
    throw "Unable to connect to the server. Please check your internet connection.";
  }
};

const setAuthData = (token, userId, userName, user) => {
  localStorage.setItem('authToken', token);        // Store token
  localStorage.setItem('userId', userId);          // Store user ID
  localStorage.setItem('userName', userName);      // Store user name
  localStorage.setItem('user', JSON.stringify(user)); // Store entire user object
};

export const getAuthToken = () => {
  const token = localStorage.getItem('authToken');
  return token;
};