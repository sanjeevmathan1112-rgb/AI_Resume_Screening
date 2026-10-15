const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  skillScore: { type: Number, default: 0 },
  similarityScore: { type: Number, default: 0 },
  experienceScore: { type: Number, default: 0 },
  educationScore: { type: Number, default: 0 },
  overallScore: { type: Number, default: 0 },
  matchedSkills: [{ type: String }],
  missingSkills: [{ type: String }],
  additionalSkills: [{ type: String }],
  status: { type: String, enum: ['New', 'Reviewed', 'Interview', 'Offered', 'Rejected'], default: 'New' },
  recruiterNotes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
