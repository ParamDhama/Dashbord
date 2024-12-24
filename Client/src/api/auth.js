import endpoints from "./endpoints";
import apiClient from "./apiClient";

export const loginUser = async (userName, password) => {
  try {
    if (!userName || !password) {
      throw "Username and password are required.";
    }

    console.log("Sending API request with:", { userName, password: "" }); // Mask password in logs

    // Make the API request
    const response = await apiClient.post(endpoints.LOGIN, {
      userName,
      password,
    });
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

      throw (
        error.response.data?.message || "Invalid credentials. Please try again."
      );
    }

    console.error("Unexpected Error in loginUser:", error.message);
    throw "Unable to connect to the server. Please check your internet connection.";
  }
};

export const addUser = async (data) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authorization token is missing");
    }
    // Set the Authorization header
    const response = await apiClient.post(endpoints.ADD_USER, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("API response:", response); // Debug log
    
    return response;
  } catch (error) {
    if (error.response) {
      console.error("Server Error in add user:", error.response.data);
      return error.response;
    }
  }
};

// export const fetchUsers = async (queryParams = {}) => {
//   try {
//     const token = localStorage.getItem("authToken");
//     if (!token) {
//       throw new Error("Authorization token is missing");
//     }

//     // Transform queryParams into a query string
//     const queryString = new URLSearchParams(queryParams).toString();
//     const endpointWithParams = `${endpoints.GET_USER}?${queryString}`;

//     // Set the Authorization header
//     const response = await apiClient.get(endpointWithParams, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     if(response) {
//       return response;
//     }
//   } catch (error) {
//     if (error.response) {
//       console.error("Server Error in fetch users:", error.response.data);
//     } else {
//       console.error("Error in fetch users:", error.message);
//     }
//   }
// };
export const fetchUsers = async (queryParams = {}) => {
  try {
    const token = localStorage.getItem("authToken");

    // Validate token existence
    if (!token) {
      throw new Error("Authorization token is missing");
    }

    // Construct query string from queryParams
    const queryString = new URLSearchParams(queryParams).toString();
    const endpointWithParams = `${endpoints.GET_USER}?${queryString}`;

    // Make API request with Authorization header
    const response = await apiClient.get(endpointWithParams, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Return data if response is successful
    return response?.data || [];
  } catch (error) {
    // Log server-side errors
    if (error.response) {
      console.error(
        "Server Error in fetchUsers:",
        error.response.status,
        error.response.data
      );
      throw new Error(error.response.data?.message || "Failed to fetch users.");
    }

    // Log other errors
    console.error("Error in fetchUsers:", error.message);
    throw new Error("An error occurred while fetching users.");
  }
};

export const updateUser = async (userId, updatedData) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authorization token is missing");
    }

    const endpoint = `${endpoints.UPDATE_USER}/${userId}`;

    const response = await apiClient.put(endpoint, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response) {
      return response.data;
    }
  } catch (error) {
    if (error.response) {
      console.error("Server Error in update user:", error.response.data);
    } else {
      console.error("Error in update user:", error.message);
    }
  }
};
export const deleteUser = async (userId) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authorization token is missing");
    }

    const endpoint = `${endpoints.DELETE_USER}/${userId}`;

    const response = await apiClient.delete(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response) {
      return response.data;
    }
  } catch (error) {
    if (error.response) {
      console.error("Server Error in delete user:", error.response.data);
    } else {
      console.error("Error in delete user:", error.message);
    }
  }
};


const setAuthData = (token, userId, userName, user) => {
  localStorage.setItem("authToken", token); // Store token
  localStorage.setItem("userId", userId); // Store user ID
  localStorage.setItem("userName", userName); // Store user name
  localStorage.setItem("user", JSON.stringify(user)); // Store entire user object
};

export const getAuthToken = () => {
  const token = localStorage.getItem("authToken");
  return token;
};
