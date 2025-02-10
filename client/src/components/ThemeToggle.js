import React from 'react';
import './ThemeToggle.css';

const ThemeToggle = ({ isDark, onToggle }) => {
  return (
    <div className="theme-toggle">
      <input
        type="checkbox"
        id="theme-switch"
        className="theme-switch"
        checked={isDark}
        onChange={onToggle}
      />
      <label htmlFor="theme-switch" className="theme-switch-label">
        <span className="theme-switch-inner"></span>
        <span className="theme-switch-switch"></span>
      </label>
    </div>
  );
};

export default ThemeToggle; 