import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api.js";




const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for login errors
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message before login attempt

    try {
      const data = await loginUser(email, password);

      if (data.status === "SUCCESS" && data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user_type", data.user_type);
        localStorage.setItem("name", `${data.user_fname} ${data.user_lname}`);
       
        navigate("/adminDashboard");
      } 
      else if (data.status === "CHANGE_PASSWORD_REQUIRED") {
        //localStorage.setItem("token", data.access_token);
        navigate("/change-password", { state: { userId: data.user_id } });
      }
      else {
        
        setErrorMessage("Invalid email or password. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Login failed due to server error. Please try again later.");
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="login-container">
      
      <div className="login-box">
        <h2> <span className="org_header">  <img src="/icons/Logo.png" alt="Org Logo" className="logo_class" />  </span></h2>
        <p className="sub-text">Sign in to access your Admin Console</p>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              className="login_input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              className="login_input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
          <p>
            <a href="#" onClick={() => navigate("/forgot-password")}>Forgot Password?</a>
          </p>
        
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
 
