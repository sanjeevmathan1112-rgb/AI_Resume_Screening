const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  location: { type: String },
  education: { type: String },
  degree: { type: String },
  university: { type: String },
  graduationYear: { type: String },
  skills: [{ type: String }],
  certifications: [{ type: String }],
  projects: [{ type: String }],
  experience: { type: String },
  totalExperience: { type: Number, default: 0 },
  resumeText: { type: String },
  resumeFile: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);
