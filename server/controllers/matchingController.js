const Application = require('../models/Application');
const Job = require('../models/Job');

exports.getJobRanking = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const applications = await Application.find({ jobId })
      .populate('candidateId')
      .sort({ overallScore: -1 }); // Rank by score descending

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
