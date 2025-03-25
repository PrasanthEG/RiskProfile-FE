// components/ui/Switch.js
import React from "react";
import "./switch.css";

const Switch = ({ checked, onChange }) => {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="slider"></span>
    </label>
  );
};

export { Switch };
