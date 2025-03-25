import React, { useState,useEffect } from "react";
import Modal from "react-modal";
import { API_BASE_URL } from "./../../config";


Modal.setAppElement("#root");

const AddUser = ({ closeModal, refreshUsers }) => {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        new_val1: "",
        new_val2: "",
        user_type: "MEMBER",
        department_id: ""
       
    },);

    
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        fetch(`${API_BASE_URL}/departments`)
          .then((res) => res.json())
          .then((data) => setDepartments(data))
          .catch((err) => console.error("Error fetching departments", err));
      }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.new_val2.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
          
            formData["department_id"]=selectedDepartment;
            const response = await fetch(`${API_BASE_URL}/add_user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.status === "SUCCESS") {
                alert("User added successfully!");
                refreshUsers();  // ✅ Update the user list
                closeModal();    // ✅ Close the modal
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error adding user:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <Modal isOpen={true} onRequestClose={closeModal} className="modal-content" overlayClassName="modal-overlay">
            <h2>Add User</h2>
            <form onSubmit={handleSubmit} autoComplete="off">
                <input type="text" name="fake_email" style={{ display: "none" }} autoComplete="off" />
                <input type="password" name="fake_password" style={{ display: "none" }} autoComplete="off" />

                <label>First Name:</label>
                <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} required />

                <label>Last Name:</label>
                <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} required />

                <label>Email:</label>
                <input type="email" name="new_val1" value={formData.new_val1} onChange={handleChange} required autoComplete="new-email" />

                <label>Password:</label>
                <input type="password" name="new_val2" value={formData.new_val2} onChange={handleChange} required autoComplete="new-password" />

                
                <label>Department</label>
                    <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} required className="input-style">
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                        {dept.name}
                        </option>
                    ))}
                </select>

                <label>User Type:</label>
                <select name="user_type" value={formData.user_type} onChange={handleChange} className="input-style">
                    <option value="ADMIN">ADMIN</option>
                    <option value="MEMBER">MEMBER</option>
                </select>

                <div className="modal-actions">
                    <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                    <button type="submit" className="btn-save">Save</button>
                </div>
            </form>
        </Modal>
    );
};

export default AddUser;
