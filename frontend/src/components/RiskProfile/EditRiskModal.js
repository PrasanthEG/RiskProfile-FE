import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { UNSAFE_SingleFetchRedirectSymbol } from "react-router-dom";
import { API_BASE_URL } from "./../../config";



const EditRiskModal = ({ isOpen, closeModal, risk, refreshRisks }) => {
  const [riskName, setRiskName] = useState(risk ? risk.name : "");
  const [description, setDesc] = useState(risk ? risk.description : "");
  const [status, setStatus] = useState(risk ? risk.status : "");
  const [score, setScore] = useState(risk ? risk.status : "");
  const [risk_indv, setRiskIndv] = useState(risk ? risk.risk_Indv : "");
  const [tags, setTags] = useState(risk ? risk.status : "");

  useEffect(() => {
    if (risk) {
      setRiskName(risk.name);
      setDesc(risk.description);
      setStatus(risk.status);
      setScore(risk.threshold_score);
      setTags(risk.tags);
      setRiskIndv(risk.risk_Indv);
    }
  }, [risk]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem("token");   
        const response = await fetch(`${API_BASE_URL}/update_risks/${risk.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
           "Authorization": `Bearer ${token}`
        },
  
  body: JSON.stringify({ name: riskName, description: description ,score: score, tags:tags, indv_score: risk_indv }),
      });
      if (response.ok) {
        refreshRisks();
        closeModal();
      }
    } catch (error) {
      console.error("Error updating risk:", error);
    }
  };

  return (
    <Modal isOpen={true} onRequestClose={closeModal} className="modal-content" overlayClassName="modal-overlay">
      <h2>Edit Risk</h2>
      <form onSubmit={handleSubmit}>
        <label>Profile Name:
          <input type="text" value={riskName} onChange={(e) => setRiskName(e.target.value)} required className="input-style" />
        </label>
        <label>Description
          <input type="text" value={description} onChange={(e) => setDesc(e.target.value)} required className="input-style" />
        </label>
        <label>Score Threshold (between 0 to 100) 
          <input type="text" value={score} onChange={(e) => setScore(e.target.value)} required className="input-style" />
        </label>
        <label> Max Score for a Question of this type ? (Between 1 to 25) 
             <input type="text" value={risk_indv} onChange={(e) => setRiskIndv(e.target.value)} required className="input-style" />
        </label>
        <label>Tags
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} required className="input-style" />
        </label>
          
       
        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
          <button type="submit" className="btn-save">Save</button>
        </div>
      </form>
    </Modal>
  );
};

export default  EditRiskModal;
