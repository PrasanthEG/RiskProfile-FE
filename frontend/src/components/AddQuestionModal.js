import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { API_BASE_URL } from "./../config";


Modal.setAppElement("#root");

const AddQuestionModal = ({ isOpen, addCloseModal, categories, selectedCategory, refreshQuestions }) => {
  const [questionText, setQuestionText] = useState("");
  const [newCategoryId, setNewCategoryId] = useState(selectedCategory || "");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [riskProfiles, setRiskProfiles] = useState([]);
  const [selectedScores, setSelectedScores] = useState(["", "", "", ""]);
  const token = localStorage.getItem("token");

  
  useEffect(() => {
    fetchRiskProfiles();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      
      setQuestionText("");
      setNewCategoryId("");
      setAnswers(["", "", "", ""]);
      setSelectedScores(["", "", "", ""]);
    }
  }, [isOpen]);

  const fetchRiskProfiles = async () => {
    try {
      
        if (!token) {
          console.log("TOKEN failed");
          return;
        }
  
      const response = await fetch(`${API_BASE_URL}/risks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      setRiskProfiles(data);
      
    } catch (error) {
      console.error("Error fetching risk profiles:", error);
    }
  };

  
  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleScoreChange = (index, value) => {
    const updatedScores = [...selectedScores];
    updatedScores[index] = value;
    setSelectedScores(updatedScores);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${API_BASE_URL}//add_question`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` },

        body: JSON.stringify({
          question_text: questionText,
          category_id: newCategoryId,
          answers: answers.map((ans, i) => ({
            text: ans,
            risk_score: selectedScores[i] || null,
          })),
        }),
      });

      if (response.ok) {
        refreshQuestions(newCategoryId);
        addCloseModal();
      }
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  
  

  return (
    <Modal isOpen={isOpen} onRequestClose={addCloseModal} className="modal-content" overlayClassName="modal-overlay">
  <h2>Add New Question</h2>
  <form onSubmit={handleSubmit}>
    <label>Question:</label>
    <textarea
      rows="3"
      cols="50"
      value={questionText}
      onChange={(e) => setQuestionText(e.target.value)}
      required
      className="input-style"
    />

    <label>Category:</label>
    <select value={newCategoryId} onChange={(e) => setNewCategoryId(e.target.value)} className="input-style">
      <option value="">Select Category</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>{cat.name}</option>
      ))}
    </select>

    <h3>Answers & Risk Profile</h3>
    {[0, 1, 2, 3].map((index) => {
      const usedScores = selectedScores.filter((score) => score !== "");

      return (
        <div key={index} className="answer-group">
          <input
            type="text"
            value={answers[index]}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            placeholder={`Answer ${index + 1}`}
            required
            className="input-style"
          />
          <select
            value={selectedScores[index] || ""}
            onChange={(e) => handleScoreChange(index, e.target.value)}
            className="input-style"
          >
            <option value="">Select Risk Profile</option>
            {riskProfiles.map((profile) => (
              <option
                key={profile.risk_Indv}
                value={profile.risk_Indv}
                disabled={usedScores.includes(profile.risk_Indv)} // Disable selected options
              >
                {profile.name}
              </option>
            ))}
          </select>
        </div>
      );
    })}

    <div>
      <button type="button" onClick={addCloseModal}>Cancel</button>
      <button type="submit">Save</button>
    </div>
  </form>
</Modal>

  );
};

export default AddQuestionModal;
