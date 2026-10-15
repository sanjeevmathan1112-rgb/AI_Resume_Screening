const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const Application = require('../models/Application');

exports.getDashboardAnalytics = async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'Open' });
    const totalCandidates = await Candidate.countDocuments();
    
    const applications = await Application.find();
    const resumesProcessed = applications.length;

    let totalScore = 0;
    const statusCounts = {};
    applications.forEach(app => {
      totalScore += app.overallScore || 0;
      statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    });

    const averageMatchScore = resumesProcessed > 0 ? Math.round(totalScore / resumesProcessed) : 0;

    // Applications by Job
    const applicationsByJobRaw = await Application.aggregate([
      { $group: { _id: "$jobId", count: { $sum: 1 } } }
    ]);
    
    // We need job titles
    const jobs = await Job.find({ _id: { $in: applicationsByJobRaw.map(a => a._id) } });
    const jobMap = {};
    jobs.forEach(j => jobMap[j._id.toString()] = j.title);

    const applicationsByJob = applicationsByJobRaw.map(a => ({
      name: jobMap[a._id.toString()] || 'Unknown',
      count: a.count
    }));

    // Status distribution array for Recharts
    const candidateStatus = Object.keys(statusCounts).map(key => ({
      name: key,
      value: statusCounts[key]
    }));

    // Dummy score distribution (simplified)
    const scoreDistribution = [
      { range: '0-20', count: applications.filter(a => a.overallScore <= 20).length },
      { range: '21-40', count: applications.filter(a => a.overallScore > 20 && a.overallScore <= 40).length },
      { range: '41-60', count: applications.filter(a => a.overallScore > 40 && a.overallScore <= 60).length },
      { range: '61-80', count: applications.filter(a => a.overallScore > 60 && a.overallScore <= 80).length },
      { range: '81-100', count: applications.filter(a => a.overallScore > 80).length },
    ];

    res.json({
      totalJobs,
      activeJobs,
      totalCandidates,
      resumesProcessed,
      averageMatchScore,
      candidateStatus,
      applicationsByJob,
      scoreDistribution
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
