import React from 'react';
import './PortfolioNav.css';

const PortfolioNav = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="portfolio-nav">
      <div className="nav-container">
        <ul className="nav-menu">
          <li onClick={() => scrollToSection('home')}>Home</li>
          <li onClick={() => scrollToSection('about')}>About</li>
          <li onClick={() => scrollToSection('projects')}>Projects</li>
          <li onClick={() => scrollToSection('hire-me')}>Hire Me</li>
          <li onClick={() => scrollToSection('post')}>Post</li>
        </ul>
      </div>
    </nav>
  );
};

export default PortfolioNav; 