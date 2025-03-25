import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { checkSession } from "./authService"; // Function to validate session

const EXCLUDED_PAGES = ["/","/login","/change-password","/forgot-password","/reset-password"];



const SessionChecker = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const validateSession = async () => {
      
        if (EXCLUDED_PAGES.includes(location.pathname)) {
            return;
        }
      const isValidSession = await checkSession(); // Function to validate session from backend/local storage
      
      if (!isValidSession) {
        navigate("/"); // Redirect to login if session is invalid
      }
    };

    validateSession();
  }, [location.pathname, navigate]);

  return children;
};

export default SessionChecker;
