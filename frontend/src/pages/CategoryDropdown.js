import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "./../config";

const CategoryDropdown = ({ onSelect }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        fetch(`${API_BASE_URL}/categories`)  // Update API URL if needed
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCategories(data);
                } else {
                    console.error("API did not return an array:", data);
                    setCategories([]);
                }
            })
            .catch(err => {
                console.error("Error fetching categories:", err);
                setCategories([]);
            });
    }, []);

    const handleCategoryChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedCategory(selectedValue);
        onSelect(selectedValue);  // Pass selected category to parent component
    };

    return (
        <div>
            <label htmlFor="category">Select a Category:</label>
            <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
                <option value="">-- Choose Category --</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CategoryDropdown;
