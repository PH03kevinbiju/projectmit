// AIIcon.js
import React from 'react';
import './AIIcon.css'; // Create a CSS file for styling

const AIIcon = ({ onClick }) => {
  return (
    <div className="ai-icon" onClick={onClick}>
      <img src="path/to/your/icon.png" alt="AI Assistant" />
    </div>
  );
};

export default AIIcon;
