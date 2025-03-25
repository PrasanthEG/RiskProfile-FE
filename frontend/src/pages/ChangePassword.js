import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { changePassword } from "../services/api";


const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const response = await changePassword(userId, newPassword);

    if (response.status === "SUCCESS") {
      navigate("/");
    } else {
      setError("Failed to change password. Try again.");
    }
  };

  return (
    <div className="login-container">
        <div className="login-box">
           
            <div>
            <span className="org_header">  <img src="/icons/Logo.png" alt="Org Logo" className="logo_class" />  </span>
            <h2>Change Password</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input type="password" placeholder="New Password" onChange={(e) => setNewPassword(e.target.value)} />
            <input type="password" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} />
            <button onClick={handleChangePassword}>Submit</button>
            </div>
        </div>
    </div>
  );
};

export default ChangePassword;
