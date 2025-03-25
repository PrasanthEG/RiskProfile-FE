import React, { useState, useEffect } from "react";
import UserTable from "./../components/UserTable";
import { API_BASE_URL } from "./../config";

const User = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("TOKEN failed");
        return;
      }
      const response = await fetch(`${API_BASE_URL}/get_users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        alert("Session timed out. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/";
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching USERS:", error);
    }
  };

  return (
    <div className="app-container">
      <h1>Manage Users</h1>
      <UserTable users={users} refreshUsers={fetchUsers} />
    </div>
  );
};

export default User;
