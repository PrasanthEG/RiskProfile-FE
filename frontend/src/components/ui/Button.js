// components/ui/button.js
import React from "react";

const Button = ({ children, onClick, className }) => {
  return (
    <button onClick={onClick} className={`btn ${className || ""}`}>
      {children}
    </button>
  );
};

export default Button;
