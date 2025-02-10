const mongoose = require('mongoose');

// Clear any existing models to prevent duplicate model errors
mongoose.models = {};
mongoose.modelSchemas = {};

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: String,
  technologies: [{ type: String }],
  link: String
});

const portfolioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bio: { type: String, required: true },
  skills: [String],
  projects: [projectSchema],
  contact: {
    github: String,
    linkedin: String,
    email: String,
    phone: String
  },
  profileImage: String,
  resume: String,
  portfolioUrl: String,
  createdAt: { type: Date, default: Date.now }
});

// Generate portfolioUrl before saving
portfolioSchema.pre('save', async function(next) {
  if (!this.portfolioUrl) {
    const baseUrl = this.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    let portfolioUrl = baseUrl;
    let counter = 1;
    
    // Keep trying until we find a unique portfolioUrl
    while (true) {
      const existingPortfolio = await this.constructor.findOne({ portfolioUrl });
      if (!existingPortfolio) {
        this.portfolioUrl = portfolioUrl;
        break;
      }
      portfolioUrl = `${baseUrl}-${counter}`;
      counter++;
    }
  }
  next();
});

module.exports = mongoose.model('Portfolio', portfolioSchema); 