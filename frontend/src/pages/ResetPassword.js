import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/api";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const response = await resetPassword(token, newPassword);

    if (response.status === "SUCCESS") {
      navigate("/");
    } else {
      setError("Failed to reset password. Try again.");
    }
  };

  return (
    <div className="login-container">
        <div className="login-box">
            <div>
                <span className="org_header">  <img src="/icons/Logo.png" alt="Org Logo" className="logo_class" />  </span>

                <h2>Reset Password</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <input type="password" placeholder="New Password" onChange={(e) => setNewPassword(e.target.value)} />
                <input type="password" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} />
                <button onClick={handleResetPassword}>Submit</button>
            </div>
        </div>
    </div>
     
  );
};

export default ResetPassword;
