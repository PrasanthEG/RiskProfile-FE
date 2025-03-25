import React, { useState, useEffect } from "react";
import AddRiskModal from "./AddRiskModal";
import EditRiskModal from "./EditRiskModal";
import { API_BASE_URL } from "./../../config";


const RiskTable = () => {
  const current_user_type = localStorage.getItem("user_type");
  const [risks, setRisks] = useState([]);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchRisks();
  }, []);

  const fetchRisks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/risks`);
      const data = await response.json();
      setRisks(data);
    } catch (error) {
      console.error("Error fetching Risks:", error);
    }
  };

  const handleAddRisk = (newRisk) => {
    setRisks([...risks, newRisk]);
    setIsAddModalOpen(false);
  };

  const handleEditRisk = (updatedRisk) => {
    setRisks(riks.map(risk => risk.id === updatedRisk.id ? updatedRisk : risk));
    setIsEditModalOpen(false);
  };


  const toggleUserStatus = async (risk) => {
  
    const newStatus = risk.status === "active" ? "inactive" : "active";
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
  
      const response = await fetch(`${API_BASE_URL}/update_risks/${risk.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ risk_id: risk.id, status: newStatus })
      });

      const data = await response.json();
      if (data.status === "SUCCESS") {
        alert(`Risk status updated to ${newStatus}!`);
        fetchRisks(); // Refresh the user list
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error updating risk status:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <h1>Risk Profile  Management</h1>
      <button onClick={() => setIsAddModalOpen(true)} disabled={current_user_type === "MEMBER"} >Add Risk Profile</button>
      <table>
        <thead>
          <tr>
         
            <th>Name</th>
            <th>Description </th>
            <th>Score Threshold</th>
            <th>Score Tags</th>
            <th>Status </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {risks.map(risk => (
            <tr key={risk.id}>
             
              <td>{risk.name}</td>
              <td>{risk.description}</td>
              <td>{risk.threshold_score}</td>
              <td>{risk.tags}</td>
              <td>{risk.status}</td>
              <td>
                <button onClick={() => { setSelectedRisk(risk); setIsEditModalOpen(true); }}  disabled={risk.status === "inactive" || current_user_type === "MEMBER"} >Edit</button>
                <button 
                  disabled={current_user_type === "MEMBER"} 
                  className={`icon-button ${risk.status === "active" ? "disable-btn" : "enable-btn"}`}
                  onClick={() => toggleUserStatus(risk)}
                >
                  {risk.status === "active" ? "Disable" : "Enable"}
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

      

      {isAddModalOpen && <AddRiskModal closeModal={() => setIsAddModalOpen(false)} addRisk={handleAddRisk} refreshRisks={fetchRisks} />}
      {isEditModalOpen && <EditRiskModal risk={selectedRisk} closeModal={() => setIsEditModalOpen(false)} editRisk={handleEditRisk} refreshRisks={fetchRisks} />}

      

    </div>
  );
};

export default RiskTable;
