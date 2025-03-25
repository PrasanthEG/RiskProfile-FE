/* import React from "react";
import ReactDOM from "react-dom/client";

import Login from "./pages/Login";
import ResultsPage from "./pages/ResultsPage";
import AdminDashboard from "./pages/AdminDashboard";
import SideBar from "./components/SideBar";

import Dashboard from "./pages/Dashboard";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/adminDashboard" element={<AdminDashboard />} />
    </Routes>
  </Router>


); 


import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Import App component
import { BrowserRouter } from "react-router-dom"; 
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  
); */


import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Use createRoot
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import ErrorBoundary from "./ErrorBoundary";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  

  <React.StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);



