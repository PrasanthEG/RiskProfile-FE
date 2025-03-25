import React from "react";
import { useState,useEffect } from "react";
import "./../styles/styles.css";
import "./../styles/header.css";
import { API_BASE_URL } from "./../config";


import SettingsMenu from "./SettingsMenu";


const Header = () => {
 
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const user_type = localStorage.getItem("user_type");
  const [portal_name, setPortalName] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  



  useEffect(() => {
          fetchOrg(currentPage);
      }, [currentPage]);
  
      const fetchOrg = async () => {
          try {
              const portal_name = localStorage.getItem("portal_name");
              setPortalName(portal_name);
                if (!portal_name) {
                  
                  const response =await fetch(`${API_BASE_URL}/get_org`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                  })
              
                if (!response.ok) {
                  portal_name="ADMIN CONSOLE"
                  localStorage.setItem("portal_name", portal_name);
                  return
                }
                else{
                  const data = await response.json();
                  setCurrentPage(data["id"]);
                  setPortalName(data["portal_name"]);
                  if (data["portal_name"])
                      localStorage.setItem("portal_name", data["portal_name"]);
                }
              }
              
          } 
          catch (error) {
              console.error("Error fetching categories:", error);
          }
          
      };


  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      {/* Left: Organization Name & Logo */}
      <div className="flex items-center gap-3">
        <span className="org_header">  <img src="/icons/Logo.png" alt="Org Logo" className="logo_class" />  </span>
        <span className="org_header portal_name">{portal_name}</span>
      </div>


      {/* Right: Settings & User Preferences */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
        <button className="top_logo_class">
            <img src="/icons/user.png" alt="User Pref" className="btn-icon-img" />
          </button>
          {name && <span className="text-sm">Welcome, {name}</span>}
          {user_type && <span className="text-sm">  ({user_type})</span>}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {isMenuOpen && (
        
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg transform transition-all duration-300 origin-top">
          <SettingsMenu />
        </div>
      )}
    </div>
       
       
      
          
       
      </div>
    </header>
  );
};

export default Header;
