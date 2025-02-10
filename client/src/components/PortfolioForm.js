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
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Bio:</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Skills (comma-separated):</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., JavaScript, React, Node.js"
              required
            />
          </div>

          <div>
            <label>Profile Image:</label>
            <input
              type="file"
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
                <div>
                  <label>Title:</label>
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Description:</label>
                  <textarea
                    value={project.description}
                    onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Technologies Used:</label>
                  <input
                    type="text"
                    value={project.technologies}
                    onChange={(e) => handleProjectChange(index, 'technologies', e.target.value)}
                    placeholder="e.g., React, Node.js, MongoDB"
                    required
                  />
                </div>
                <div>
                  <label>Project Link:</label>
                  <input
                    type="url"
                    value={project.link}
                    onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label>Project Image:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleProjectImageChange(index, e.target.files[0])}
                  />
                  {files.projectImages[index] && (
                    <p className="file-selected">
                      Selected: {files.projectImages[index].name}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <button type="button" onClick={handleAddProject} className="add-project-btn">
              Add Another Project
            </button>
          </div>

          <div>
            <label>GitHub URL:</label>
            <input
              type="url"
              name="contact.github"
              value={formData.contact.github}
              onChange={handleChange}
              placeholder="https://github.com/yourusername"
            />
          </div>

          <div>
            <label>LinkedIn URL:</label>
            <input
              type="url"
              name="contact.linkedin"
              value={formData.contact.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/yourusername"
            />
          </div>

          <div>
            <label>Resume:</label>
            <input
              type="file"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </div>

          <button type="submit">Create Portfolio</button>
        </form>
      </div>
    </div>
  );
};

export default PortfolioForm; 