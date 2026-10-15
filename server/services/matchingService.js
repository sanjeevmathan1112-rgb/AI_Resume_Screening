const { calculateSimilarity } = require('../utils/nlpUtils');

exports.matchCandidateToJob = (candidate, job) => {
  // 1. Skill Match (50%)
  const jobSkills = [...(job.requiredSkills || []), ...(job.preferredSkills || [])].map(s => s.toLowerCase());
  const candidateSkills = (candidate.skills || []).map(s => s.toLowerCase());
  
  let matchedSkills = [];
  let missingSkills = [];
  
  jobSkills.forEach(skill => {
    if (candidateSkills.includes(skill)) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const additionalSkills = candidateSkills.filter(skill => !jobSkills.includes(skill));
  
  const skillScore = jobSkills.length > 0 ? (matchedSkills.length / jobSkills.length) * 100 : 0;

  // 2. TF-IDF Similarity (25%)
  const candidateText = candidate.resumeText || candidateSkills.join(' ');
  const jobText = `${job.title} ${job.description} ${jobSkills.join(' ')}`;
  
  const similarityRaw = calculateSimilarity(jobText, candidateText);
  const similarityScore = similarityRaw * 100;

  // 3. Experience Match (15%)
  let experienceScore = 0;
  const reqExp = job.minimumExperience || 0;
  const candExp = candidate.totalExperience || 0;
  if (reqExp === 0) {
    experienceScore = candExp > 0 ? 100 : 50; // Bonus for having exp if none required
  } else if (candExp >= reqExp) {
    experienceScore = 100;
  } else {
    experienceScore = (candExp / reqExp) * 100;
  }

  // 4. Education Match (10%)
  let educationScore = 0;
  const reqEdu = (job.education || '').toLowerCase();
  const candEdu = (candidate.educationLevel || '').toLowerCase();
  
  if (!reqEdu) {
    educationScore = 100;
  } else if (candEdu.includes(reqEdu) || reqEdu.includes(candEdu)) {
    educationScore = 100;
  } else if (candEdu.includes('phd') || candEdu.includes('master')) {
    educationScore = 100; // Assuming higher degrees cover bachelor's
  } else {
    educationScore = 50; // Partial match or not explicitly mentioned
  }

  // 5. Overall Score
  const overallScore = (skillScore * 0.50) + (similarityScore * 0.25) + (experienceScore * 0.15) + (educationScore * 0.10);

  return {
    skillScore: Math.round(skillScore),
    similarityScore: Math.round(similarityScore),
    experienceScore: Math.round(experienceScore),
    educationScore: Math.round(educationScore),
    overallScore: Math.round(overallScore),
    matchedSkills,
    missingSkills,
    additionalSkills
  };
};
