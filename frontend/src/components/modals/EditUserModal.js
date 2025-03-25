import React, { useState,useEffect } from "react";

import Modal from "react-modal";
import { API_BASE_URL } from "./../../config";



Modal.setAppElement("#root"); // Ensure accessibility compliance

const EditUserModal = ({ user, closeModal, updateUser }) => {
  const [formData, setFormData] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    status: user.status,
    user_type: user.user_type,
    department_id: ""
  });

  const [departments, setDepartments] = useState([]);

    // Fetch departments from API
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/departments`); // API endpoint to get departments
                const data = await response.json();
                
                setDepartments(data);
                 // Assuming response has a key 'departments'
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };

        fetchDepartments();
    }, []);

    // Populate form when user data is received
    useEffect(() => {
        if (user) {
            setFormData({
                firstname: user.firstname || "",
                lastname: user.lastname || "",
                email: user.email || "",
                user_type: user.user_type || "",
                department_id: user.department_id || ""
            });
        }
    }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {

        const token = localStorage.getItem("token"); // Get the token from local storage or session storage
        if (!token) {
            setError("Unauthorized: No token found");
            setLoading(false);
            return;
        }
        const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`  // Add JWT token here

        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedUser = await response.json();
      updateUser(updatedUser); // Update the user list in the parent component
      
      closeModal(); // Close the modal
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <Modal isOpen={true} onRequestClose={closeModal} className="modal-content" overlayClassName="modal-overlay">
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} required className="input-style"/>
        </label>
        <label>
          Last Name:
          <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} required className="input-style"/>
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-style"/>
        </label>
        
        {user.user_type !== "MEMBER" && (
          <label>
              User Type:<br/>
              <select name="user_type" value={formData.user_type} onChange={handleChange} required className="input-style">
                  <option value="ADMIN">ADMIN</option>
                  <option value="MEMBER">MEMBER</option>
              </select>
          </label>
)}

        <label>Department:</label>
                <select name="department_id" value={formData.department_id} onChange={handleChange} required className="input-style"> 
                    <option value="">Select Department</option>
                    {departments.map(dep => (
                        <option key={dep.id} value={dep.id}>
                            {dep.name}
                        </option>
                    ))}
                </select>

        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
          <button type="submit" className="btn-save">Save</button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUserModal;
 /*

import React, { useState, useEffect } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const EditUserModal = ({ user, closeModal, refreshUsers }) => {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        user_type: "",
        department_id: ""
    });

    const [departments, setDepartments] = useState([]);

    // Fetch departments from API
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/api/departments"); // API endpoint to get departments
                const data = await response.json();
                //alert(data.departments)
                setDepartments(data);
                 // Assuming response has a key 'departments'
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };

        fetchDepartments();
    }, []);

    // Populate form when user data is received
    useEffect(() => {
        if (user) {
            setFormData({
                firstname: user.firstname || "",
                lastname: user.lastname || "",
                email: user.email || "",
                user_type: user.user_type || "",
                department_id: user.department_id || ""
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://127.0.0.1:5000/api/users/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
        
              const updatedUser = await response.json();
              //updateUser(updatedUser); // Update the user list in the parent component
              refreshUsers();
              closeModal(); // Close the modal
            } catch (error) {
              console.error("Error updating user:", error);
            }



           
    };

    return (
        <Modal isOpen={true} onRequestClose={closeModal} className="modal-content" overlayClassName="modal-overlay">
            <h2>Edit User</h2>
            <form onSubmit={handleSubmit} autoComplete="off">
                <label>First Name:</label>
                <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} required />

                <label>Last Name:</label>
                <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} required />

                <label>Email:</label>
                <input type="email" name="email" value={formData.email} disabled />

                <label>User Type:</label>
                <select name="user_type" value={formData.user_type} onChange={handleChange} required className="input-style">
                    <option value="ADMIN">ADMIN</option>
                    <option value="MEMBER">MEMBER</option>
                </select>

                <label>Department:</label>
                <select name="department_id" value={formData.department_id} onChange={handleChange} required className="input-style"> 
                    <option value="">Select Department</option>
                    {departments.map(dep => (
                        <option key={dep.id} value={dep.id}>
                            {dep.name}
                        </option>
                    ))}
                </select>

                <div className="modal-actions">
                   
                    <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                    <button type="submit" className="btn-save">Save</button>
                  
                </div>
            </form>
        </Modal>
    );
};

export default EditUserModal;

*/