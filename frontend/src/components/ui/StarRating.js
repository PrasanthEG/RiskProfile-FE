import React, { useState } from "react";
import "./StarRating.css";

const StarRating = ({ submitFeedback }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const labels = ["Terrible", "Bad", "Okay", "Good", "Excellent"];

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating!");
      return;
    }
    await submitFeedback(rating);
  };

  return (
    <div className="star-rating">
      <h3>Rate the accuracy of Risk Profiling:</h3>
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= (hover || rating) ? "selected" : ""}`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            ★
          </span>
        ))}
      </div>
      <p>{rating > 0 ? labels[rating - 1] : "Select a rating"}</p>
      <button onClick={handleSubmit}>Submit Feedback</button>

      <style>
        {`
          .star-rating { text-align: center; font-family: Arial, sans-serif; }
          .stars { font-size: 2rem; cursor: pointer; }
          .star { color: gray; transition: color 0.3s; }
          .star.selected { color: gold; }
          button { margin-top: 10px; padding: 5px 15px; cursor: pointer; }
        `}
      </style>
    </div>
  );
};

export default StarRating;
