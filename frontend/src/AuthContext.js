/* import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        navigate("/");
      } else {
        try {
          const response = await fetch("http://127.0.0.1:5000/api/check-session", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!response.ok) {
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            navigate("/");
          }
        } catch (error) {
          console.error("Session validation error:", error);
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          navigate("/");
        }
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
 */




import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { checkSession } from "./authService";


const AuthContext = createContext();

const EXCLUDED_ROUTES = ["/", "/change_password", "/reset_password"];


export const AuthProvider = ({ children }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const validateSession = async () => {
      if (EXCLUDED_ROUTES.includes(location.pathname)) {
        setIsAuthenticated(true); // Skip session check for excluded pages
        return;
      }


      try {
        const isValidSession = await checkSession();
        setIsAuthenticated(isValidSession);
      } catch (error) {
        console.error("Session validation error:", error);
        setIsAuthenticated(false);
      }
    };

    validateSession();
  }, [location.pathname]);

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);









