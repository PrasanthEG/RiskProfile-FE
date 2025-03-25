// components/ui/Card.js
import React from "react";
import "./card.css";

const Card = ({ children }) => {
  return <div className="card">{children}</div>;
};

const CardContent = ({ children }) => {
  return <div className="card-content">{children}</div>;
};

export { Card, CardContent };
