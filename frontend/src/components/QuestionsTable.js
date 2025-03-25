import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import AddQuestionModal from "./AddQuestionModal";
import { API_BASE_URL } from "./../config";

Modal.setAppElement("#root");

const QuestionsTable = () => {
  const current_user_type = localStorage.getItem("user_type");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [questions, setQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [answerOption, setAnswerOption] = useState("");
  const [newselectedCategory, setnewSelectedCategory] = useState("");
  const [flag_select, setFlag] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
  
  
  
  
  

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) fetchQuestions(selectedCategory);
  }, [selectedCategory]);

  

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchQuestions = async (categoryId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/questions?category_id=${categoryId}&limit=0`);
      const resp_data = await response.json();
      
      setQuestions(resp_data["data"]);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleAddOrEditQuestion = async (e) => {
    e.preventDefault();
    const url = `${API_BASE_URL}/edit_questions/${editingQuestion.id}`
     
    const method =  "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({text: questionText, category_id: selectedCategory , new_category_id: newselectedCategory  }),
      });
      if (response.ok) {
        fetchQuestions(selectedCategory);
        closeModal();
      }
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };

  const handleAddOrEditAnswer = async (e) => {
    e.preventDefault();
    const url = `${API_BASE_URL}/edit_answers/${editingQuestion.id}`;
    const method =  "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({text: answerText, category_id: selectedCategory, option: answerOption }),
      });
      if (response.ok) {
        fetchQuestions(selectedCategory);
        closeModal();
      }
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };

  const handleEdit = (question) => {
    
    setFlag(true);
    setEditingQuestion(question);
    setQuestionText(question.question_text);
    setnewSelectedCategory(selectedCategory);
    setIsModalOpen(true);
  };

  const handleEditAnswer= (question,answer) => {
    setFlag(false);
    setEditingQuestion(question);
    setAnswerText(answer.text);
    setAnswerOption(answer.option);
    setIsModalOpen(true);
  };

  const handleDisable = async (question) => {
    try {
      const newStatus = (question.status === "active" || question.status === "ACTIVE") ? "inactive" : "active";
      const questionId=question.id;
      const token = localStorage.getItem("token");
        if (!token) {
          console.log("TOKEN failed");
          return;
        }
  
      const response = await fetch(`${API_BASE_URL}/edit_questions/${questionId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      fetchQuestions(selectedCategory);
    } catch (error) {
      console.error("Error disabling question:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setQuestionText("");
    setEditingQuestion(null);
    setFlag(true);
    setnewSelectedCategory("");
    setAnswerText("");
    setAnswerOption("");
  };
  const addCloseModal = () => {
    
    setQuestionText("");
    setNewCategoryId("");
    setAnswers(["", "", "", ""]);  // Reset answers array
    setSelectedScores(["", "", "", ""]);  // Reset selected risk scores
    setIsAddModalOpen(false);
    
  };

  return (
    <div>
      <h1>Manage Questions</h1>
      <label> <strong> SELECT A CATEGORY: </strong> </label>
      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <button onClick={() => setIsAddModalOpen(true)} disabled={!selectedCategory || current_user_type === "MEMBER"}>
        Add Question
      </button>


      <table className="questions-table">
            <thead>
                <tr>
                    <th>Question</th>
                    <th></th>
                    <th></th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {questions.map((question) => (
                    <React.Fragment key={question.id}>
                        <tr>
                            <td><strong>{question.question_text}</strong></td>
                            <td> </td>
                            <td> </td>
                            <td>
                                <button  onClick={() => handleEdit(question)} disabled={ question.status==="inactive" || current_user_type === "MEMBER"}>Edit</button>
                                <button  className={`${question.status == "active" ? "disable-btn" : "enable-btn"}`}  onClick={() => handleDisable(question)} disabled={current_user_type === "MEMBER"}>
                                   
                                    {question.status == "active" ? "Disable" : "Enable"} 
                                </button>
                            </td>
                        </tr>
                        {question.options.map((answer,index) => ( 
                              <tr key={`${question.id}-${answer.score}-${index}`} className="answer-row">
                                <td>{answer.text}</td>
                                <td> {answer.score}</td>
                                <td>
                                    <button
                                        className="icon-button"
                                        onClick={() => handleEditAnswer(question,answer)}
                                        disabled={ question.status==="inactive" || current_user_type === "MEMBER"}
                                        style={{ opacity: question.status === "inactive" ? 0.5 : 1, cursor: question.status === "inactive" ? "not-allowed" : "pointer" }}
                                      >
                                        <img src="/icons/edit.png" alt="Edit" className="icon-img" />
                                      </button>
                                </td>
                            </tr>
                        ))}
                    </React.Fragment>
                ))}
            </tbody>
        </table>


      <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="modal-content" overlayClassName="modal-overlay">
       
        {flag_select && (
          <div>
           <h2>"Edit Question" </h2>
             <form onSubmit={handleAddOrEditQuestion}>
                <label>Question:</label>
               
                <textarea rows="4" cols="50" value={questionText} onChange={(e) => setQuestionText(e.target.value)} required className="input-style"/>
                <label>Category:</label>
                  <select value={newselectedCategory} onChange={(e) => setnewSelectedCategory(e.target.value)} className="input-style">
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>  
                  <br/>

                <div>
                  <button type="button" onClick={closeModal}>Cancel</button>
                  <button type="submit">Save</button>
                </div>
              </form>
            </div>
        )}
        {!flag_select && (
          <div>
           <h2>"Edit Answer" </h2>
             <form onSubmit={handleAddOrEditAnswer}>
                <label>Answer:</label>
                <textarea rows="4" cols="50" value={answerText} onChange={(e) => setAnswerText(e.target.value)} required className="input-style"/> <br/>
                <div>
                  <button type="button" onClick={closeModal}>Cancel</button>
                  <button type="submit">Save</button>
                </div>
              </form>
            </div>
        )}

      </Modal>

      <AddQuestionModal
        isOpen={isAddModalOpen}
        addCloseModal={() => setIsAddModalOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        refreshQuestions={fetchQuestions}
      />
      
    </div>


  );
};

export default QuestionsTable;
 