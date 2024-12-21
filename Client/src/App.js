import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./component/Login";
import Dashboard from "./component/Dashbord"; // Fixed typo


// fetch('http://localhost:8889/api/signup/employees')
//   .then((response) => response.json())
//   .then((data) => console.log('data', data))
//   .catch((err) => console.log('err', err));
// Define routes
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <LoginPage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/dashboard", // Fixed typo in path
      element: <Dashboard />,
    }
  ]
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;