import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { UNSAFE_SingleFetchRedirectSymbol } from "react-router-dom";
import { API_BASE_URL } from "./../../config";

const EditCategoryModal = ({ isOpen, closeModal, category, refreshCategories }) => {
  
  const [categoryName, setCategoryName] = useState(category ? category.name : "");
  const [description, setDesc] = useState(category ? category.description : "");
  const [status, setStatus] = useState(category ? category.status : "");

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
      setDesc(category.description);
      setStatus(category.status);
    }
  }, [category]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem("token");   
        const response = await fetch(`${API_BASE_URL}/update_categories/${category.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
           "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: categoryName, description: description }),
      });
      if (response.ok) {
        refreshCategories();
        closeModal();
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <Modal isOpen={true} onRequestClose={closeModal} className="modal-content" overlayClassName="modal-overlay">
      <h2>Edit Category</h2>
      <form onSubmit={handleSubmit}>
        <label>Profile Name:
          <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required className="input-style" />
        </label>
        <label>Description
          <input type="text" value={description} onChange={(e) => setDesc(e.target.value)} required className="input-style" />
        </label>
        
          
       
        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
          <button type="submit" className="btn-save">Save</button>
        </div>
      </form>
    </Modal>
  );
};

export default  EditCategoryModal;
