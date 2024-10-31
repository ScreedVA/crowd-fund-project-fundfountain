import React from "react"; // Ensure React is imported
import "./ProgressBar.css";

type ProgressBarProps = {
  percentage: number; // Type definition for the percentage prop
};

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  // Assumes `percentage` is in the 0-100 range for width styling

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
    </div>
  );
};

export default ProgressBar;
