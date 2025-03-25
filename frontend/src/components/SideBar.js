import React, { useEffect,useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { API_BASE_URL } from "./../config";


const SideBar = () => {
    const [menus, setMenus] = useState([]);
    const [userType, setUserType] = useState("");

    useEffect(() => {
        const fetchMenus = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch(`${API_BASE_URL}/menus`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                const data = await response.json();

                if (data.status === "SUCCESS") {
                    
                    setMenus(data.menus); // Set the menu list
                    setUserType(data.user_type); // Set the user type (ADMIN / MEMBER)
                    filterMenus(data.menus);
                } else {
                    console.error("Error fetching menus:", data.message);
                }
            } catch (error) {
                console.error("API error:", error);
            }
        };

        fetchMenus();
    }, []);

    // **Admin menus (full access)**
    const adminMenus = [
        { menu_name: "Home", link: "/adminDashboard" },
        { menu_name: "Users", link: "/users" },
        { menu_name: "Categories", link: "/categories" },
        { menu_name: "Risk Profiles", link: "/risk-profiles" },
        { menu_name: "Questions", link: "/questions" },
        { menu_name: "Reports", link: "/reports" },
        { menu_name: "Test Options", link: "/test_options" },
        { menu_name: "Settings", link: "/settings" }
    ];
  
    const filterMenus = (apiMenus) => {
        const filteredMenus = adminMenus.filter(adminMenu =>
            apiMenus.some(apiMenu => apiMenu.menu_name === adminMenu.menu_name)
        );
        setMenus(filteredMenus);
       
    };

    
    // **Render menus based on user type**
    const displayedMenus = userType === "ADMIN" ? adminMenus : menus;
    localStorage.setItem("userAccess", JSON.stringify(displayedMenus));


  return (
          
            <ul>
                                
                                 {displayedMenus.map((menu, index) => (
                                   
                                   
                                    <li className="menu_class_li" key={index}>
                                       <img src={`/icons/${menu.menu_name}.png`} alt={`${menu.menu_name} icon`} style={{ width: "16px", height: "16px", marginRight: "10px" }} />
                                        <a href={menu.link}>{menu.menu_name}</a>
                                    </li>
                                   ))}
                                  <li>
                                     <button className="logout-button" onClick={() => {
                                        localStorage.removeItem("token"); 
                                        window.location.href = "/"; // Redirect to login
                                     }}>
                                        Logout
                                    </button>
                                  </li>
                                  
                        
          </ul>
     
  );
};

export default SideBar;
