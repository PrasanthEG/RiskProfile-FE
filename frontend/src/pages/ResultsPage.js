
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StarRating from './../components/ui/StarRating'; // Adjust the path if needed
import { API_BASE_URL } from "./../config";




const ResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
   
    const [results, setResults] = useState([]);
    const [risk_profile, setRisks] = useState([]);
    const riskProfile = location.state?.riskProfile || "Unknown Profile";
    const tags = location.state?.tags 
        ? location.state.tags.split(",").map(tag => tag.trim()) 
        : [];


    const [totalScore, setTotalScore] = useState(0);

    useEffect(() => {
            setTotalScore(results.reduce((total, res) => total + res.selected_score, 0));
        }, [results]);

    useEffect(() => {
        fetchData();
      }, []);


       const submitFeedback = async (rating) => {
        try {
          const response = await fetch(`${API_BASE_URL}/user_risk_validate`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: userId,
                validation: rating
            }) 
          });
          if (!response.ok) {
            throw new Error("Failed to validate risk profile");
            }

            const result = await response.json();
       

            alert(`Risk profile rating successful !`);
          
        } catch (error) {
          console.error("Error submitting feedback:", error);
        }
      };

      

      const userId = location.state?.userId;  
      
      const fetchData = async () => {
        try {
          
            const response = await fetch(`${API_BASE_URL}/result_summary`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: userId,
                })
            });


          const data = await response.json();
          setResults(data["results_data"]);
          setRisks(data["risk_profile"]);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };

    // Assuming user_id is passed in state



    return (
        <div className="results-container">
            <h1>Risk Profile Result</h1>
            <h2>{riskProfile}</h2>
                <p>Tags: {tags.length > 0 ? tags.join(", ") : "No tags available"}</p>

                <br /><br/>
            <div>
                <p className="mb-4">Please rate your experience below:</p>
                <StarRating submitFeedback={submitFeedback} />
            </div>
            <br /><br/>

            <table className="results-table">
                        <thead>
                            <tr>
        
                                <th>Question</th>
                                <th>Answer</th>
                                <th>Score</th>
                               
                            </tr>
                        </thead>
                        <tbody>
                        
                            {results && results.map((res) => (
                                <React.Fragment key={res.question_id}>
                                    <tr>
                                        <td> {res.question_text} </td>
                                        <td>{res.selected_option_value}</td>
                                        <td> {res.selected_score} </td>
                                 
                                    </tr>
                                </React.Fragment>
                            ))}
                            <tr>
                                <td> Total Score </td>
                                <td>  </td>
                                <td> {totalScore} </td>
                            </tr>
                        </tbody>
                    </table>
            <br /><br/>
            <table className="risk-table">
                        <thead>
                            <tr>
        
                                <th>Risk Profile </th>
                                <th>Description </th>
                                <th>Threshold Score</th>
                               
                            </tr>
                        </thead>
                        <tbody>
                            {risk_profile && risk_profile.map((res) => (
                                <React.Fragment key={res.id }>
                                   
                                    <tr className={res.name === riskProfile ? "tr_highlight" : ""}>

                                        <td> {res.name}  </td>
                                        <td>{res.description}</td>
                                        <td> {res.score_threshold} </td>
                                        
                                    </tr>
                                </React.Fragment>
                            ))}
                           
                        </tbody>
                    </table>
        </div>
    );
};

export default ResultsPage;
