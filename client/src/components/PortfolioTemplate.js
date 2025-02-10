import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ThemeToggle from './ThemeToggle';
import './PortfolioTemplate.css';
import PortfolioNav from './PortfolioNav';

// Add this skill icons mapping object at the top of your file
const SKILL_ICONS = {
  'html': { icon: 'fab fa-html5', color: '#E34F26' },
  'css': { icon: 'fab fa-css3-alt', color: '#1572B6' },
  'javascript': { icon: 'fab fa-js', color: '#F7DF1E' },
  'mongodb': { icon: 'fas fa-database', color: '#47A248' },
  'php': { icon: 'fab fa-php', color: '#777BB4' },
  'tensorflow': { icon: 'fas fa-brain', color: '#FF6F00' },
  'bootstrap': { icon: 'fab fa-bootstrap', color: '#7952B3' },
  'nodejs': { icon: 'fab fa-node-js', color: '#339933' },
  'c++': { icon: 'fas fa-code', color: '#00599C' },
  'c': { icon: 'fas fa-copyright', color: '#A8B9CC' },
  'java': { icon: 'fab fa-java', color: '#007396' },
  'python': { icon: 'fab fa-python', color: '#3776AB' },
  'c#': { icon: 'fas fa-sharp', color: '#239120' },
  'mysql': { icon: 'fas fa-database', color: '#4479A1' },
  'tailwind': { icon: 'fas fa-wind', color: '#06B6D4' },
  'express': { icon: 'fas fa-server', color: '#000000' },
  'react': { icon: 'fab fa-react', color: '#61DAFB' },
  'angular': { icon: 'fab fa-angular', color: '#DD0031' },
  'django': { icon: 'fab fa-python', color: '#092E20' },
  'spring': { icon: 'fas fa-leaf', color: '#6DB33F' },
  'flutter': { icon: 'fas fa-mobile-alt', color: '#02569B' },
  'kotlin': { icon: 'fab fa-android', color: '#7F52FF' },
  'react native': { icon: 'fab fa-react', color: '#61DAFB' }
};

const PortfolioTemplate = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const { portfolioUrl } = useParams();
  const [imageLoading, setImageLoading] = useState({});

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkTheme(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  // Handle theme toggle
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.documentElement.setAttribute(
      'data-theme',
      isDarkTheme ? 'light' : 'dark'
    );
    localStorage.setItem('theme', isDarkTheme ? 'light' : 'dark');
  };

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/portfolio/${portfolioUrl}`);
        console.log('Fetched portfolio data:', response.data.portfolio); // Debug log
        setPortfolio(response.data.portfolio);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [portfolioUrl]);

  const handleResumeClick = () => {
    if (portfolio.resume) {
      window.open(`http://localhost:5000/uploads/${portfolio.resume}`, '_blank');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!portfolio) return <div className="error">Portfolio not found</div>;

  return (
    <div className="portfolio-template">
      <PortfolioNav />
      <ThemeToggle isDark={isDarkTheme} onToggle={toggleTheme} />
      
      {/* Simplified Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to My Portfolio</h1>
          <p>Exploring the intersection of creativity and technology</p>
        </div>
      </section>

      {/* Profile Section */}
      <header className="portfolio-header">
        {portfolio.profileImage && (
          <img 
            src={`http://localhost:5000/uploads/${portfolio.profileImage}`}
            alt={portfolio.name}
            className="profile-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-profile.png';
            }}
          />
        )}
        <h1>{portfolio.name}</h1>
        <h3 className="role">{portfolio.role}</h3>
        <p className="bio">{portfolio.bio}</p>
      </header>

      <section className="skills-section">
        <h2 className="section-title">
          <i className="fas fa-code"></i>
          Skills
        </h2>
        <div className="skills-grid">
          {portfolio.skills.map((skill, index) => {
            const skillLower = skill.toLowerCase();
            const skillInfo = SKILL_ICONS[skillLower] || { icon: 'fas fa-code', color: '#666' };
            
            return (
              <div 
                key={index} 
                className="skill-item"
                style={{'--skill-color': skillInfo.color}}
              >
                <i className={skillInfo.icon}></i>
                <span>{skill}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="projects-section">
        <h2 className="section-title">
          <i className="fas fa-project-diagram"></i>
          Projects
        </h2>
        <div className="projects-grid">
          {portfolio.projects.map((project, index) => (
            <div key={index} className="project-card">
              <h3 className="project-title">{project.title}</h3>
              <div className={`project-image-container ${imageLoading[index] ? 'loading' : ''}`}>
                <img
                  src={`http://localhost:5000/uploads/${project.image}`}
                  alt={project.title}
                  className="project-image"
                  onLoad={() => setImageLoading(prev => ({ ...prev, [index]: false }))}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-project.png';
                    setImageLoading(prev => ({ ...prev, [index]: false }));
                  }}
                />
              </div>
              <div className="project-content">
                <p className="project-description">{project.description}</p>
                <div className="project-technologies">
                  {project.technologies.map((tech, i) => {
                    const techLower = tech.toLowerCase().trim();
                    const techInfo = SKILL_ICONS[techLower] || { icon: 'fas fa-code', color: '#666' };
                    
                    return (
                      <span 
                        key={i} 
                        className="tech-tag"
                        style={{'--tech-color': techInfo.color}}
                      >
                        <i className={techInfo.icon}></i>
                        {tech}
                      </span>
                    );
                  })}
                </div>
                {project.link && (
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="project-link"
                  >
                    <i className="fas fa-external-link-alt"></i>
                    View Project
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="contact-section">
        <h2 className="section-title">
          <i className="fas fa-envelope"></i>
          Contact
        </h2>
        <div className="contact-links">
          {portfolio.contact.github && (
            <a href={portfolio.contact.github} target="_blank" rel="noopener noreferrer" className="contact-link">
              <i className="fab fa-github"></i>
              <span>GitHub</span>
            </a>
          )}
          {portfolio.contact.linkedin && (
            <a href={portfolio.contact.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">
              <i className="fab fa-linkedin"></i>
              <span>LinkedIn</span>
            </a>
          )}
          {portfolio.email && (
            <a href={`mailto:${portfolio.email}`} className="contact-link">
              <i className="fas fa-envelope"></i>
              <span>Email</span>
            </a>
          )}
          {portfolio.contact.phone && (
            <a href={`tel:${portfolio.contact.phone}`} className="contact-link">
              <i className="fas fa-phone"></i>
              <span>Phone</span>
            </a>
          )}
        </div>
      </section>

      {portfolio.resume && (
        <section className="resume-section">
          <h2 className="section-title">
            <i className="fas fa-file-alt"></i>
            Resume
          </h2>
          <div className="resume-container">
            <button 
              className="resume-view-btn"
              onClick={handleResumeClick}
            >
              <i className="fas fa-eye"></i>
              <span>View Resume</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

export default PortfolioTemplate;