import React, { useState } from "react";
import CategoryDropdown from "./CategoryDropdown";
import QuestionsList from "./QuestionsList";


const TestProfile = () => {
    const [selectedCategory, setSelectedCategory] = useState("");

    return (
        <div className="scrollable-container">
            <h1>Risk Profile Form</h1>
            <CategoryDropdown onSelect={setSelectedCategory} />
            {selectedCategory && <QuestionsList categoryId={selectedCategory} />}
        </div>
        
    );
};

export default TestProfile;

