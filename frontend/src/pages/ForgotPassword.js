import React, { useState } from "react";
import { requestPasswordReset } from "../services/api"; 

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async () => {
    const response = await requestPasswordReset(email);
    setMessage(response.message);
  };

  return (
    <div className="login-container">
        <div className="login-box">
            <div>
            <span className="org_header">  <img src="/icons/Logo.png" alt="Org Logo" className="logo_class" />  </span>

                <h2>Forgot Password?</h2>
                <input
                    type="email"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={handleForgotPassword}>Send Reset Link</button>
                {message && <p>{message}</p>}
            </div>
        </div>
    </div>
  );
};

export default ForgotPassword;


