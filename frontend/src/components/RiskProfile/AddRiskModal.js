import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { API_BASE_URL } from "./../../config";


Modal.setAppElement("#root");

const AddRiskModal = ({ isOpen, closeModal, refreshRisks }) => {
  const [RiskName, setRiskName] = useState("");
  const [RiskDesc, setRiskDesc] = useState("");
  const [RiskScore, setRiskScore] = useState("");
  const [RiskTags, setRiskTags] = useState("");
  const [RiskIndv, setRiskIndv] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("TOKEN failed");
          return;
        }

      const response = await fetch(`${API_BASE_URL}/add_risks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: RiskName, description: RiskDesc,score_threshold: RiskScore, tags: RiskTags, indv_score: RiskIndv }),
      });
      if (response.ok) {
        refreshRisks();
        closeModal();
      }
    } catch (error) {
      console.error("Error adding Risk:", error);
    }
  };

  return (
    <Modal isOpen={true} onRequestClose={closeModal} className="modal-content" overlayClassName="modal-overlay">
      <h2>Add Risk</h2>
      <form onSubmit={handleSubmit}>
        <label>Risk Name:
          <input type="text" value={RiskName} onChange={(e) => setRiskName(e.target.value)} required className="input-style" />
         
        </label>
        <label>Risk Description:
             <input type="text" value={RiskDesc} onChange={(e) => setRiskDesc(e.target.value)} required className="input-style" />
        </label>

        <label>Score Threshold (between 0 to 100) 
             <input type="text" value={RiskScore} onChange={(e) => setRiskScore(e.target.value)} required className="input-style" />
        </label>

        <label> Max Score for a Question of this type ? (Between 1 to 25) 
             <input type="text" value={RiskIndv} onChange={(e) => setRiskIndv(e.target.value)} required className="input-style" />
        </label>
        <label>Tags
             <input type="text" value={RiskTags} onChange={(e) => setRiskTags(e.target.value)} required className="input-style" />
        </label>
        
        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
          <button type="submit" className="btn-save">Save</button>
        </div>
      </form>
    </Modal>
  );
};



export default AddRiskModal;
