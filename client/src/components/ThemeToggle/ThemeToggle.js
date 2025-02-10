import React from 'react';
import './ThemeToggle.css';

const ThemeToggle = ({ isDarkTheme, onToggleTheme }) => {
  return (
    <button 
      className="floating-theme-toggle" 
      onClick={onToggleTheme}
      aria-label="Toggle theme"
    >
      {isDarkTheme ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle; 