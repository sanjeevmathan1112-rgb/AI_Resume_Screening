const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { extractTextFromPDF } = require('../services/pdfService');
const { extractCandidateInfo, isValidCandidateName, extractNameFromFilename } = require('../services/extractionService');
const { matchCandidateToJob } = require('../services/matchingService');
const fs = require('fs');

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    const { jobId } = req.body;
    if (!jobId) {
      if (fs.existsSync(req.file.path)) {
        try { fs.unlinkSync(req.file.path); } catch (e) {}
      }
      return res.status(400).json({ message: 'Job ID is required' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      if (fs.existsSync(req.file.path)) {
        try { fs.unlinkSync(req.file.path); } catch (e) {}
      }
      return res.status(404).json({ message: 'Job not found' });
    }

    // 1. Extract Text from PDF
    const resumeText = await extractTextFromPDF(req.file.path);

    // 2. Extract Candidate Info
    const candidateInfo = extractCandidateInfo(resumeText);

    // 3. Resolve Candidate Name with Fallback to Filename
    let resolvedName = candidateInfo.name;
    if (!resolvedName || resolvedName === 'Not specified') {
      const fromFilename = extractNameFromFilename(req.file.originalname);
      resolvedName = fromFilename || 'Unknown Candidate';
    }

    const hasValidEmail = candidateInfo.email && candidateInfo.email !== 'Not specified';
    const safeEmail = hasValidEmail
      ? candidateInfo.email
      : `applicant_${Date.now()}@screening.local`;

    // 4. Create or Update Candidate
    let candidate = null;
    if (hasValidEmail) {
      candidate = await Candidate.findOne({ email: candidateInfo.email });
    }
    
    if (candidate) {
      // Update existing candidate
      if (!isValidCandidateName(candidate.name) || candidate.name === 'Unknown Candidate') {
        if (resolvedName !== 'Unknown Candidate') {
          candidate.name = resolvedName;
        }
      }
      candidate.skills = Array.from(new Set([...(candidate.skills || []), ...(candidateInfo.extractedSkills || [])]));
      candidate.totalExperience = Math.max(candidate.totalExperience || 0, candidateInfo.experienceYears || 0);
      candidate.education = candidateInfo.educationLevel || candidate.education;
      candidate.resumeText = resumeText || candidate.resumeText;
      candidate.resumeFile = req.file.path;
      await candidate.save();
    } else {
      // Create new candidate
      candidate = new Candidate({
        name: resolvedName,
        email: safeEmail,
        phone: candidateInfo.phone || 'Not specified',
        location: 'Not specified',
        education: candidateInfo.educationLevel || 'Not specified',
        skills: candidateInfo.extractedSkills || [],
        totalExperience: candidateInfo.experienceYears || 0,
        resumeText: resumeText || '',
        resumeFile: req.file.path
      });
      await candidate.save();
    }

    // 5. Calculate Matching Score
    const matchResult = matchCandidateToJob(candidate, job);

    // 6. Create or Update Application
    let application = await Application.findOne({ candidateId: candidate._id, jobId: job._id });
    if (application) {
      Object.assign(application, matchResult);
      await application.save();
    } else {
      application = new Application({
        candidateId: candidate._id,
        jobId: job._id,
        ...matchResult
      });
      await application.save();
    }

    res.status(201).json({
      message: 'Resume processed successfully',
      candidate,
      application
    });

  } catch (err) {
    console.error('Resume upload error:', err);
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    res.status(500).json({ message: 'Server error: ' + err.message, error: err.message });
  }
};
