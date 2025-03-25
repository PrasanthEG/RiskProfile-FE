import { API_BASE_URL } from "../config";


export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

export const fetchQuestions = async (category, token) => {
  const response = await fetch(`${API_BASE_URL}/questions?category=${category}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` }
  });
  return response.json();
};

export const submitResponse = async (questionId, selectedOption, weightage, token) => {
  const response = await fetch(`${API_BASE_URL}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({ question_id: questionId, selected_option: selectedOption, weightage })
  });
  return response.json();
};

export const changePassword = async (user_id, new_password) => {
  const response = await fetch(`${API_BASE_URL}/change_password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, new_password })
  });
  return response.json();
};

export const requestPasswordReset = async (email) => {
  const response = await fetch(`${API_BASE_URL}/forgot_password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return response.json();
};

export const resetPassword = async (token, newPassword) => {
  const response = await fetch(`${API_BASE_URL}/reset_password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, new_password: newPassword }),
  });
  return response.json();
};
