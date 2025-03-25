import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "./../config";


const QuestionsForm = ({ categoryId }) => {
    const [questions, setQuestions] = useState([]);
    const [responses, setResponses] = useState({});
    const [userId, setUserId] = useState("abc123"); // Placeholder for user ID
    const [dob, setDob] = useState(""); // Date of Birth
    const [stage, setStage] = useState("Initial"); // Stage
    const [source, setSource] = useState("Web"); // Source (Web/Mobile)

    const navigate = useNavigate();


    useEffect(() => {
        if (categoryId) {
            fetch(`${API_BASE_URL}/questions?category_id=${categoryId}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data["data"])) {
                        setQuestions(data["data"]);
                        // Initialize response state with empty selections
                        const initialResponses = {};
                        data["data"].forEach(q => {
                            initialResponses[q.id] = "";
                        });
                        setResponses(initialResponses);
                    } else {
                        console.error("API did not return an array:", data["data"]);
                        setQuestions([]);
                    }
                })
                .catch(err => {
                    console.error("Error fetching questions:", err);
                    setQuestions([]);
                });
        }
    }, [categoryId]);

    const handleOptionChange = (questionId, optionValue) => {
        setResponses(prev => ({
            ...prev,
            [questionId]: optionValue
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formattedResponses = Object.keys(responses).map(questionId => ({
            question_id: parseInt(questionId),
            selected_option: responses[questionId]
        }));

        const requestData = {
            user_id: userId,
            source,
            stage,
            dob,
            responses: formattedResponses
        };

        console.log("Submitting:", requestData);

        try {
            const response = await fetch(`${API_BASE_URL}/submit-responses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error("Failed to submit responses");
            }

            const result = await response.json();
            //alert("Responses submitted successfully!");
            console.log("Response:", result);
            navigate("/results", { state: {  userId: result.user_id, riskProfile: result.risk_profile, tags: result.tags || [] } });

        } catch (error) {
            console.error("Error submitting responses:", error);
            alert("Failed to submit responses. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Questions</h3>

            <label>
                Date of Birth:
                <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                />
            </label>

            {questions.length > 0 ? (
                questions.map((q) => (
                    <div key={q.id}>
                        <p> <b>{q.question_text} </b> </p>
                        <div>
                        <label>
                            <input
                                type="radio"
                                name={`question_${q.id}`}
                                value="option_1"
                                checked={responses[q.id] === "option_1"}
                                onChange={() => handleOptionChange(q.id, "option_1")}
                            />
                           {q.options['option_1']}
                        </label>
                        </div>
                        <div>
                        <label>
                            <input
                                type="radio"
                                name={`question_${q.id}`}
                                value="option_2"
                                checked={responses[q.id] === "option_2"}
                                onChange={() => handleOptionChange(q.id, "option_2")}
                            />
                           {q.options['option_2']}
                        </label>
                        </div>
                        <div>
                        <label>
                            <input
                                type="radio"
                                name={`question_${q.id}`}
                                value="option_3"
                                checked={responses[q.id] === "option_3"}
                                onChange={() => handleOptionChange(q.id, "option_3")}
                            />
                           {q.options['option_3']}
                        </label>
                        </div>
                        <div>
                        <label>
                            <input
                                type="radio"
                                name={`question_${q.id}`}
                                value="option_4"
                                checked={responses[q.id] === "option_4"}
                                onChange={() => handleOptionChange(q.id, "option_4")}
                            />
                           {q.options['option_4']}
                        </label>
                        </div>
                    </div>
                ))
            ) : (
                <p>No questions available for this category.</p>
            )}
            <br/><br/>
            <button type="submit">Submit</button>
        </form>
    );
};

export default QuestionsForm;

