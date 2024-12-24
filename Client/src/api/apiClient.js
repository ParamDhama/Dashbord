import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://dashbord-n93p.onrender.com", // Replace with your backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;