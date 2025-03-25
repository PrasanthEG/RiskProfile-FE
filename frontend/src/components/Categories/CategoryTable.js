import React, { useState, useEffect } from "react";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import { API_BASE_URL } from "./../../config";

const CategoryTable = () => {
  const current_user_type = localStorage.getItem("user_type"); 
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/all`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = (newCategory) => {
    setCategories([...categories, newCategory]);
    setIsAddModalOpen(false);
  };

  const handleEditCategory = (updatedCategory) => {
    setCategories(categories.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat));
    setIsEditModalOpen(false);
  };

  const handleDeleteCategory = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/categories/${id}`, { method: "GET" });
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };


  const toggleUserStatus = async (category) => {
  
    const newStatus = category.status === "active" ? "inactive" : "active";
    const confirmChange = window.confirm(
      `Are you sure you want to change the status to ${newStatus}?`
    );

    if (!confirmChange) return;

    try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("TOKEN failed");
          return;
        }
  
      const response = await fetch(`${API_BASE_URL}/update_categories/${category.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ category_id: category.id, status: newStatus })
      });

      const data = await response.json();
      if (data.status === "SUCCESS") {
        alert(`Category status updated to ${newStatus}!`);
        fetchCategories(); // Refresh the user list
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error updating category status:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div>
    
      <h1>Category Management</h1>
      <button className="btn-add-user" onClick={() => setIsAddModalOpen(true)} disabled={current_user_type === "MEMBER"}>Add Category</button>

      <table>
        <thead>
          <tr>
         
            <th>Name</th>
            <th>Description </th>
            <th>Status </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category.id}>
             
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td>{category.status}</td>
              <td>
                <button onClick={() => { setSelectedCategory(category); setIsEditModalOpen(true); }} disabled={category.status === "inactive" || current_user_type === "MEMBER"} >Edit</button>
                <button 
                  className={`icon-button ${category.status === "active" ? "disable-btn" : "enable-btn"}`}
                  disabled={current_user_type === "MEMBER"} 
                  onClick={() => toggleUserStatus(category)}
                >
                  {category.status === "active" ? "Disable" : "Enable"}
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      

      {isAddModalOpen && <AddCategoryModal closeModal={() => setIsAddModalOpen(false)} addCategory={handleAddCategory} refreshCategories={fetchCategories} />}
      {isEditModalOpen && <EditCategoryModal category={selectedCategory} closeModal={() => setIsEditModalOpen(false)} editCategory={handleEditCategory} refreshCategories={fetchCategories} />}

      

    </div>
    
  );
};

export default CategoryTable;
