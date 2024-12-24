// src/api/endpoints.js



const endpoints = {
  LOGIN: "/api/login", // Login endpoint
  ADD_USER: "api/signup/employees/",
  GET_USER: "api/signup/employees",
  UPDATE_USER: "api/signup/employees",
  DELETE_USER: "api/signup/employees",
  CHECK_EMAIL: (email) => `http://localhost:8889/api/signup/check-email?email=${email}`
  
};

export default endpoints;
