import React, { useState, useEffect } from "react";
import Button from "./../components/ui/Button";  // Use relative path
import { Card, CardContent } from "./../components/ui/Card";
import { Autocomplete } from "./../components/ui/Autocomplete";
import { Switch } from "./../components/ui/Switch";
import { API_BASE_URL } from "./../config";




import "./../styles/settings.css";
import "./../components/ui/ui_components.css";  // Use relative path



export default function Settings() {
  const [orgDetails, setOrgDetails] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [menuAccess, setMenuAccess] = useState([]);
  const [newOrg, setNewOrg] = useState({ name: "", portal_name: "" });
 

  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchOrgDetails();
    fetchUsers();
  }, []);


  const fetchOrgDetails = async () => {
    const response = await fetch(`${API_BASE_URL}/get_organization`);

    if (response.status === 401 || !response.ok) {  // Token expired or invalid
       return;
    }
    const data = await response.json();
    setOrgDetails(data);
  };

  const fetchUsers = async () => {
    const response = await fetch(`${API_BASE_URL}/user_emails`);
    const data = await response.json();
    
    setUsers(data);
  };

  const handleUserSelect = async (user) => {
    setSelectedUser();
    
    const response = await fetch(`${API_BASE_URL}/manage_user_acl`,{
    method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: user})
      });
    const data = await response.json();
    setMenuAccess(data);
  };

  const handleNewOrgChange = (e) => {
    const { name, value } = e.target;
    setNewOrg({ ...newOrg, [name]: value });
  };

  const handleAddOrganization = async () => {
    if (!newOrg.name ||  !newOrg.portal_name ) {
      alert("Please enter both name and email.");
      return;
    }

    const response = await fetch(`${API_BASE_URL}/org_create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrg),
    });

    if (response.ok) {
      localStorage.setItem("portal_name", newOrg["portal_name"]);
      alert("Organization added successfully!");
      setNewOrg({ name: "", portal_name: "" }); // Reset form
      fetchOrgDetails(); // Refresh list
      
    } else {
      alert("Failed to add organization.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>Settings</h1>

      {/* Organization Details */}
      <Card>
        <CardContent>
          <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>Organization Details</h2>
        
          
            <table>
                <tr>
                    <th> Name:  </th>
                    <th> Portal Name: </th>
                </tr>
              
                {orgDetails && orgDetails.map((org) => (
                    <tr> 
                        <td>{org.name} </td>
                        <td>{org.portal_name} </td>
                       
                    </tr> 
            ))}
            </table> 
              
        </CardContent>
      </Card>

       {/* Add New Organization */}
       <Card>
        <CardContent>
          <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>Add New Organization</h2>
          <input
            type="text"
            name="name"
            placeholder="Organization Name"
            value={newOrg.name}
            onChange={handleNewOrgChange}
            style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
          />
          <input
            type="text"
            name="portal_name"
            placeholder="Portal Name"
            value={newOrg.portal_name}
            onChange={handleNewOrgChange}
            style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
          />
           
          <button onClick={handleAddOrganization} style={{ padding: "8px 16px", cursor: "pointer" }}>
            Add Organization
          </button>
        </CardContent>
      </Card>

      {/* User-Menu Mapping */}
      <Card>
        <CardContent>
          <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>Search user with Email</h2>
          <Autocomplete
            options={users.map((u) => u.email)}
            onChange={handleUserSelect}
            placeholder="Select user by email"
          />

        <table>
            <tr>
                <th> Menu Access:  </th>
                <th> Access </th>
            </tr>
            {menuAccess.map((menu) => (
              
              <tr>
                <td>{menu.menu_name}</td>
                <td>{menu.access}</td>
                </tr>
            ))}
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
