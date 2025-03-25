import React, { useState } from "react";
import UserList from "./UserList";  // Assuming you already have a UserList component
import CategoryList from "./CategoryList"; 
import RiskProfileList from "./RiskProfileList"; 


const AdminDashboard = () => {
 
    
    return (
    
                <div className="grid-container">
                    <UserList />
                    <CategoryList />
                    <RiskProfileList />
                </div>    
        
      
    );
};

export default AdminDashboard;
