import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import './PortfolioForm.css';

const PortfolioForm = () => {
  const navigate = useNavigate();
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
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

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    bio: '',
    skills: '',
    projects: [{
      title: '',
      description: '',
      technologies: '',
      link: ''
    }],
    contact: {
      github: '',
      linkedin: '',
      email: '',
      phone: ''
    }
  });
  const [files, setFiles] = useState({
    profileImage: null,
    resume: null,
    projectImages: [null]
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const formDataToSend = new FormData();

      // Append basic fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('bio', formData.bio);
      formDataToSend.append('skills', formData.skills);
      formDataToSend.append('contact', JSON.stringify(formData.contact));

      // Append projects data
      formDataToSend.append('projects', JSON.stringify(formData.projects));

      // Append profile image and resume
      if (files.profileImage) {
        formDataToSend.append('profileImage', files.profileImage);
      }
      if (files.resume) {
        formDataToSend.append('resume', files.resume);
      }

      // Append project images
      files.projectImages.forEach((image, index) => {
        if (image) {
          formDataToSend.append(`projectImage${index}`, image);
          console.log(`Appending project image ${index}:`, image); // Debug log
        }
      });

      const response = await axios.post(
        'http://localhost:5000/api/portfolio/create', 
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      navigate(response.data.portfolioUrl);
    } catch (error) {
      console.error('Error creating portfolio:', error);
      setError(error.response?.data?.error || 'Error creating portfolio. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    setFiles(prev => ({
      ...prev,
      [name]: fileList[0]
    }));
  };

  const handleProjectChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  const handleAddProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        { title: '', description: '', technologies: '', link: '' }
      ]
    }));
    
    // Add a placeholder for the new project's image
    setFiles(prev => ({
      ...prev,
      projectImages: [...prev.projectImages, null]
    }));
  };

  const handleProjectImageChange = (index, file) => {
    setFiles(prev => ({
      ...prev,
      projectImages: [
        ...prev.projectImages.slice(0, index),
        file,
        ...prev.projectImages.slice(index + 1)
      ]
    }));
  };

  return (
    <div className="form-container">
      <ThemeToggle isDark={isDarkTheme} onToggle={toggleTheme} />
      <div className="container">
        <h1>Create Your Portfolio</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="portfolio-form">
          <div className="form-group">
            <label htmlFor="name" className="required">
              <i className="fas fa-user"></i>
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role" className="required">
              <i className="fas fa-briefcase"></i>
              Role
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g. Full Stack Developer"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="required">
              <i className="fas fa-envelope"></i>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio" className="required">
              <i className="fas fa-comment-alt"></i>
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="skills" className="required">
              <i className="fas fa-code"></i>
              Skills
            </label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., JavaScript, React, Node.js"
              required
            />
          </div>

          <div className="form-group file-upload">
            <label htmlFor="profileImage">
              <i className="fas fa-image"></i>
              Profile Image
            </label>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="projects-section">
            <h2>Projects</h2>
            {formData.projects.map((project, index) => (
              <div key={index} className="project-item">
                <h3>Project {index + 1}</h3>
                <div className="form-group">
                  <label className="required">
                    <i className="fas fa-project-diagram"></i>
                    Title
                  </label>
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="required">
                    <i className="fas fa-align-left"></i>
                    Description
                  </label>
                  <textarea
                    value={project.description}
                    onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="required">
                    <i className="fas fa-tools"></i>
                    Technologies Used
                  </label>
                  <input
                    type="text"
                    value={project.technologies}
                    onChange={(e) => handleProjectChange(index, 'technologies', e.target.value)}
                    placeholder="e.g., React, Node.js, MongoDB"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    <i className="fas fa-link"></i>
                    Project Link
                  </label>
                  <input
                    type="url"
                    value={project.link}
                    onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className="form-group file-upload">
                  <label>
                    <i className="fas fa-image"></i>
                    Project Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleProjectImageChange(index, e.target.files[0])}
                  />
                </div>
              </div>
            ))}
            <button type="button" onClick={handleAddProject} className="add-project-btn">
              <i className="fas fa-plus"></i> Add Another Project
            </button>
          </div>

          <div className="form-group">
            <label>
              <i className="fab fa-github"></i>
              GitHub URL
            </label>
            <input
              type="url"
              name="contact.github"
              value={formData.contact.github}
              onChange={handleChange}
              placeholder="https://github.com/yourusername"
            />
          </div>

          <div className="form-group">
            <label>
              <i className="fab fa-linkedin"></i>
              LinkedIn URL
            </label>
            <input
              type="url"
              name="contact.linkedin"
              value={formData.contact.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/yourusername"
            />
          </div>

          <div className="form-group file-upload">
            <label>
              <i className="fas fa-file-pdf"></i>
              Resume
            </label>
            <input
              type="file"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </div>

          <button type="submit" className="submit-button">
            <i className="fas fa-paper-plane"></i> Create Portfolio
          </button>
        </form>
      </div>
    </div>
  );
};

export default PortfolioForm; 