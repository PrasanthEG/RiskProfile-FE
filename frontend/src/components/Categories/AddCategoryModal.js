import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { API_BASE_URL } from "./../../config";


Modal.setAppElement("#root");

const AddCategoryModal = ({ isOpen, closeModal, refreshCategories }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDesc, setCategoryDesc] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("TOKEN failed");
          return;
        }

      const response = await fetch(`${API_BASE_URL}/add_categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: categoryName, description: categoryDesc}),
      });
      if (response.ok) {
        refreshCategories();
        closeModal();
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <Modal isOpen={true} onRequestClose={closeModal} className="modal-content" overlayClassName="modal-overlay">
      <h2>Add Category</h2>
      <form onSubmit={handleSubmit}>
        <label>Category Name:
          <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required className="input-style" />
         
        </label>
        <label>Category Description:
             <input type="text" value={categoryDesc} onChange={(e) => setCategoryDesc(e.target.value)} required className="input-style" />
        </label>
        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
          <button type="submit" className="btn-save">Save</button>
        </div>
      </form>
    </Modal>
  );
};



export default AddCategoryModal;
