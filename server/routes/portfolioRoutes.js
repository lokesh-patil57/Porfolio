const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Portfolio = require('../models/Portfolio');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Add file filter to only allow images and PDFs
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'resume') {
    // Allow PDFs for resume
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Resume must be a PDF file'), false);
    }
  } else {
    // Allow images for other fields
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
};

const uploadMiddleware = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Configure multer fields for multiple file uploads
const uploadFields = uploadMiddleware.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
  // Add dynamic field names for project images
  ...Array(10).fill().map((_, i) => ({ 
    name: `projectImage${i}`, 
    maxCount: 1 
  }))
]);

// Create portfolio route
router.post('/create', uploadFields, async (req, res) => {
  try {
    // Debug logs
    console.log('Received files:', req.files);
    console.log('Received body:', req.body);

    // Check if email exists
    const existingPortfolio = await Portfolio.findOne({ email: req.body.email });
    if (existingPortfolio) {
      return res.status(400).json({ 
        error: 'A portfolio with this email already exists' 
      });
    }

    // Parse projects data and handle project images
    const projects = JSON.parse(req.body.projects).map((project, index) => {
      // Get the project image file if it exists
      const projectImageFile = req.files[`projectImage${index}`];
      const projectImage = projectImageFile ? projectImageFile[0].filename : null;

      console.log(`Processing project ${index}:`, {
        title: project.title,
        imageFile: projectImageFile,
        finalImage: projectImage
      });

      return {
        title: project.title,
        description: project.description,
        technologies: project.technologies.split(',').map(tech => tech.trim()),
        link: project.link,
        image: projectImage // Store the filename in the database
      };
    });

    // Create portfolio object
    const portfolioData = {
      name: req.body.name,
      email: req.body.email,
      bio: req.body.bio,
      skills: req.body.skills.split(',').map(skill => skill.trim()),
      projects: projects,
      contact: JSON.parse(req.body.contact || '{}'),
      profileImage: req.files?.profileImage ? req.files.profileImage[0].filename : null,
      resume: req.files?.resume ? req.files.resume[0].filename : null
    };

    console.log('Final portfolio data:', portfolioData);

    // Create and save portfolio
    const portfolio = new Portfolio(portfolioData);
    await portfolio.save();

    res.json({ 
      message: 'Portfolio created successfully',
      data: portfolio,
      portfolioUrl: `/portfolio/${portfolio.portfolioUrl}`
    });
  } catch (error) {
    console.error('Error creating portfolio:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        error: 'This email is already associated with a portfolio' 
      });
    }
    
    res.status(500).json({ 
      error: error.message || 'Error creating portfolio. Please try again.' 
    });
  }
});

// Get portfolio route
router.get('/:portfolioUrl', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ 
      portfolioUrl: req.params.portfolioUrl 
    });
    
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    res.json({ portfolio });
  } catch (error) {
    console.error('Error retrieving portfolio:', error);
    res.status(500).json({ error: 'Error retrieving portfolio' });
  }
});

module.exports = router; 