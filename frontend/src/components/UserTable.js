import React, { useState } from "react";
import EditUserModal from "./modals/EditUserModal";
import AddUser from "./modals/AddUser";
import { API_BASE_URL } from "./../config";


const UserTable = ({ users, refreshUsers }) => {
  const current_user_type = localStorage.getItem("user_type");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openEditModal = (user) => {
    if (user.status === "inactive") return; // Prevent opening edit modal for inactive users
    setSelectedUser(user);
  };
  
  const closeEditModal = () => {
    setSelectedUser(null);
  };

  const toggleUserStatus = async (user) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    const confirmChange = window.confirm(
      `Are you sure you want to change the status to ${newStatus}?`
    );

    if (!confirmChange) return;

    try {
      const token = localStorage.getItem("token");
     
      const response = await fetch(`${API_BASE_URL}/update_user_status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: user.id, status: newStatus })
      });

      const data = await response.json();
      if (data.status === "SUCCESS") {
        alert(`User status updated to ${newStatus}!`);
        refreshUsers(); // Refresh the user list
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("An error occurred. Please try again.");
    }
  };
  const updateUser = (updatedUser) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
};

  return (
    <div>
      <div className="link-container">
        <button className="btn-add-user" onClick={() => setIsModalOpen(true)} disabled={current_user_type === "MEMBER"} >
          Add User
        </button>
        {isModalOpen && (
          <AddUser closeModal={() => setIsModalOpen(false)} refreshUsers={refreshUsers} />
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Department</th>
            <th>User Type</th>
            <th className="align_right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.firstname} {user.lastname}</td>
              <td>{user.email}</td>
              <td>{user.status}</td>
              <td>{user.department_name}</td>
              <td>{user.user_type}</td>
              <td className="align_right">
                {/* Disable Edit button for INACTIVE users */}
                <button
                  className="icon-button"
                  onClick={() => openEditModal(user)}
                  
                  disabled={user.status === "inactive" || current_user_type === "MEMBER"} 
                  style={{ opacity: user.status === "inactive" ? 0.5 : 1, cursor: user.status === "inactive" ? "not-allowed" : "pointer" }}
                >
                  <img src="/icons/edit.png" alt="Edit" className="icon-img" />
                </button>
                <button 
                  disabled={current_user_type === "MEMBER"} 
                  className={`icon-button ${user.status === "active" ? "disable-btn" : "enable-btn"}`}
                  onClick={() => toggleUserStatus(user)}
                >
                  {user.status === "active" ? "Disable" : "Enable"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Render Edit Modal When a User is Selected */}
      {selectedUser && (
       
        <EditUserModal user={selectedUser} closeModal={closeEditModal} updateUser={refreshUsers} />

      )}
    </div>
  );
};

export default UserTable;
