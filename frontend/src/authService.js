import { API_BASE_URL } from "./config";

export const checkSession = async () => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage or cookies
    
    if (!token) return false;
  
    try {
      const response = await fetch(`${API_BASE_URL}/check_session`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const data = await response.json();
      return data.authenticated;
    } catch (error) {
      console.error("Session validation failed:", error);
      return false;
    }
    return true;
  };
  