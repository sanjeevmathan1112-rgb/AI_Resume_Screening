const Candidate = require('../models/Candidate');
const Application = require('../models/Application');
const { extractCandidateInfo, isValidCandidateName } = require('../services/extractionService');

const normalizeCandidate = (candidate) => {
  const data = candidate.toObject();
  const extracted = extractCandidateInfo(data.resumeText || '');

  if (!isValidCandidateName(data.name)) {
    data.name = isValidCandidateName(extracted.name) ? extracted.name : 'Unknown Candidate';
  }
  if ((!data.email || data.email.startsWith('applicant_')) && extracted.email !== 'Not specified') {
    data.email = extracted.email;
  }
  if (!(data.totalExperience > 0) && extracted.experienceYears > 0) {
    data.totalExperience = extracted.experienceYears;
  }
  if (!Array.isArray(data.skills) || data.skills.length === 0) {
    data.skills = extracted.extractedSkills;
  }
  return data;
};

exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates.map(normalizeCandidate));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    const applications = await Application.find({ candidateId: candidate._id }).populate('jobId', 'title department location');
    res.json({ ...normalizeCandidate(candidate), applications });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    await Application.deleteMany({ candidateId: req.params.id });
    res.json({ message: 'Candidate and associated applications removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
