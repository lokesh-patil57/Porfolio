const Portfolio = require('../models/Portfolio');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

const createPortfolio = async (req, res) => {
  try {
    const {
      name,
      email,
      bio,
      skills,
      projects,
      contact
    } = req.body;

    // Generate a unique URL for the portfolio
    const portfolioUrl = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

    // Create new portfolio
    const portfolio = new Portfolio({
      user: {
        name,
        email,
        bio,
        profileImage: req.files.profileImage ? `/uploads/${req.files.profileImage[0].filename}` : null,
        resume: req.files.resume ? `/uploads/${req.files.resume[0].filename}` : null
      },
      skills: JSON.parse(skills),
      projects: JSON.parse(projects),
      contact: JSON.parse(contact),
      portfolioUrl
    });

    await portfolio.save();

    res.status(201).json({
      success: true,
      portfolioUrl: `/portfolio/${portfolioUrl}`
    });
  } catch (error) {
    console.error('Portfolio creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating portfolio',
      error: error.message
    });
  }
};

const getPortfolio = async (req, res) => {
  try {
    const { portfolioUrl } = req.params;
    const portfolio = await Portfolio.findOne({ portfolioUrl });
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    res.status(200).json({
      success: true,
      portfolio
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching portfolio',
      error: error.message
    });
  }
};

module.exports = {
  createPortfolio,
  getPortfolio,
  upload
}; 