const { skills } = require('../utils/skillDictionary');

const nonNameLines = new Set([
  'RESUME', 'CURRICULUM VITAE', 'CV', 'BIODATA', 'BIO DATA', 'BIO-DATA',
  'CONTACT', 'CONTACT US', 'CONTACT INFO', 'CONTACT INFORMATION', 'CONTACT DETAILS',
  'GET IN TOUCH', 'GET IN TOUCH!', 'REACH ME', 'ABOUT ME', 'ABOUT', 'PROFILE',
  'PERSONAL PROFILE', 'PERSONAL DETAILS', 'SUMMARY', 'PROFESSIONAL SUMMARY',
  'EXECUTIVE SUMMARY', 'CAREER SUMMARY', 'OBJECTIVE', 'CAREER OBJECTIVE',
  'EDUCATION', 'EDUCATIONAL DETAILS', 'EDUCATIONAL QUALIFICATIONS', 'ACADEMICS',
  'ACADEMIC BACKGROUND', 'EXPERIENCE', 'WORK EXPERIENCE', 'PROFESSIONAL EXPERIENCE',
  'EMPLOYMENT HISTORY', 'SKILLS', 'TECHNICAL SKILLS', 'KEY SKILLS', 'CORE COMPETENCIES',
  'PROJECTS', 'ACADEMIC PROJECTS', 'PERSONAL PROJECTS', 'CERTIFICATIONS',
  'CERTIFICATES', 'COURSES', 'LANGUAGES', 'LANGUAGES KNOWN', 'DECLARATION',
  'ACHIEVEMENTS', 'AWARDS', 'HOBBIES', 'INTERESTS', 'REFERENCES', 'ACTIVITIES',
  'EXTRA CURRICULAR', 'EXTRA-CURRICULAR', 'EXTRA-CURRICULAR ACTIVITIES'
]);

const jobTitleOrDisciplineWords = new Set([
  'engineer', 'engineering', 'developer', 'designer', 'architect', 'manager',
  'lead', 'consultant', 'specialist', 'analyst', 'scientist', 'administrator',
  'programmer', 'technician', 'student', 'fresher', 'intern', 'graduate',
  'undergraduate', 'postgraduate', 'bachelor', 'bachelors', 'master', 'masters',
  'phd', 'doctorate', 'diploma', 'department', 'electronics', 'communication',
  'computer', 'science', 'mechanical', 'civil', 'electrical', 'information',
  'technology', 'software', 'hardware', 'telecom', 'telecommunication',
  'instrumentation', 'robotics', 'mechatronics', 'ece', 'cse', 'it', 'eee',
  'ai', 'ml', 'frontend', 'backend', 'fullstack', 'full-stack', 'data',
  'android', 'ios', 'web', 'devops', 'cloud', 'qa', 'testing', 'associate'
]);

const genericFileStopWords = new Set([
  'sample', 'test', 'template', 'document', 'doc', 'file', 'files',
  'job', 'jobs', 'application', 'applicant', 'candidate', 'unknown',
  'profile', 'my', 'new', 'draft', 'final', 'copy', 'latest', 'updated',
  'download', 'downloads', 'untitled', 'resume', 'cv', 'curriculum', 'vitae',
  'pdf', 'docx', 'doc', 'txt'
]);

function formatPersonName(raw) {
  if (!raw) return '';
  const trimmed = raw.replace(/\s+/g, ' ').trim();
  if (/[a-z]/.test(trimmed) && /[A-Z]/.test(trimmed)) {
    return trimmed;
  }
  if (/^[a-z\s.'-]+$/.test(trimmed)) {
    return trimmed.split(' ').map(w => {
      if (w.length === 1) return w.toUpperCase();
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    }).join(' ');
  }
  return trimmed;
}

function isValidCandidateName(value) {
  if (typeof value !== 'string') return false;
  const name = value.replace(/\s+/g, ' ').trim();
  if (!name || name.length < 2 || name.length > 50) return false;
  if (/\d|@|https?:|www\.|[!?:;=/*#$%\^&_|\\]/i.test(name)) return false;
  if (/^--\s*\d+\s+of\s+\d+\s*--$/i.test(name)) return false;
  if (/^page\s+\d+/i.test(name)) return false;

  const upper = name.toUpperCase().replace(/[!.,:-]/g, '').trim();
  if (nonNameLines.has(upper)) return false;
  if (genericFileStopWords.has(upper.toLowerCase())) return false;

  const words = name.split(' ').map(w => w.replace(/[^a-zA-Z]/g, '')).filter(Boolean);
  if (words.length < 1 || words.length > 5) return false;

  if (words.length === 1 && (words[0].length < 3 || jobTitleOrDisciplineWords.has(words[0].toLowerCase()))) {
    return false;
  }

  const hasJobWord = words.some(w => jobTitleOrDisciplineWords.has(w.toLowerCase()));
  if (hasJobWord) return false;

  if (skills.some(skill => skill.toLowerCase() === name.toLowerCase())) return false;

  return words.every(w => /^[A-Za-z]+$/.test(w));
}

function extractNameFromLine(line) {
  if (!line || typeof line !== 'string') return null;
  const cleanLine = line.trim();
  if (!cleanLine || cleanLine.length > 100) return null;
  if (/^--\s*\d+\s+of\s+\d+\s*--$/i.test(cleanLine)) return null;
  if (/@|https?:|www\.|github\.com|linkedin\.com/i.test(cleanLine)) return null;

  // 1. Check for labeled names
  const labeled = cleanLine.match(/^(?:candidate\s+name|full\s+name|applicant\s+name|applicant|name)\s*[:\-–—]\s*(.+)$/i);
  if (labeled) {
    const candidate = labeled[1].split(/\s*[\-|–—|•·,/]\s*|\s*\((?:[^)]+)\)\s*/)[0].trim();
    if (isValidCandidateName(candidate)) return formatPersonName(candidate);
  }

  // 2. Check full line
  if (isValidCandidateName(cleanLine)) {
    return formatPersonName(cleanLine);
  }

  // 3. Check delimited first token
  const tokens = cleanLine.split(/\s*[\-|–—|•·,/]\s*|\s*\|\s*|\s*\((?:[^)]+)\)\s*/);
  if (tokens.length > 1) {
    const firstToken = tokens[0].trim();
    if (isValidCandidateName(firstToken)) {
      return formatPersonName(firstToken);
    }
  }

  return null;
}

function extractCandidateName(lines) {
  if (!lines || !Array.isArray(lines)) return 'Not specified';

  // Pass 1: Labeled names
  for (const line of lines) {
    const labeled = line.match(/^(?:candidate\s+name|full\s+name|applicant\s+name|applicant|name)\s*[:\-–—]\s*(.+)$/i);
    if (labeled) {
      const candidate = extractNameFromLine(labeled[0]);
      if (candidate) return candidate;
    }
  }

  // Pass 2: Search top 25 non-empty lines
  for (const line of lines.slice(0, 25)) {
    const candidate = extractNameFromLine(line);
    if (candidate) return candidate;
  }

  return 'Not specified';
}

function extractNameFromFilename(filename) {
  if (!filename || typeof filename !== 'string') return null;
  let base = filename.replace(/\.[^/.]+$/, '');
  base = base.replace(/^\d+[-_]/, '');
  base = base.replace(/\s*\([^)]*\)|\s*\[[^\]]*\]/g, ' ');
  base = base.replace(/[-_.]*(?:resume|cv|curriculum\s*vitae|biodata|bio\s*data|final|draft|v\d+|copy|ece|cse|it|eee|mech|civil|btech|be|mtech)[\w\s.-]*/gi, ' ');
  base = base.replace(/[._\-+]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!base || base.length < 2) return null;

  const words = base.split(/\s+/).filter(Boolean);
  if (words.length < 1 || words.length > 5) return null;
  if (words.every(w => genericFileStopWords.has(w.toLowerCase()))) return null;
  if (words.some(w => genericFileStopWords.has(w.toLowerCase()) && words.length === 1)) return null;

  if (!isValidCandidateName(base)) return null;

  return formatPersonName(base);
}

exports.extractCandidateInfo = (text) => {
  const info = {
    name: 'Not specified',
    email: 'Not specified',
    phone: 'Not specified',
    extractedSkills: [],
    experienceYears: 0,
    educationLevel: 'Not specified'
  };

  if (!text) return info;

  // Extract Email
  const normalizedText = text.replace(/\s*@\s*/g, '@');
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi;
  const emails = normalizedText.match(emailRegex);
  if (emails && emails.length > 0) info.email = emails[0];

  // Extract Phone
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const phones = text.match(phoneRegex);
  if (phones && phones.length > 0) info.phone = phones[0];

  // Extract Name from lines
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  info.name = extractCandidateName(lines);

  // Extract Skills
  const textLower = text.toLowerCase();
  const matchedSkills = new Set();
  skills.forEach(skill => {
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const flags = skill === 'R' ? '' : 'i';
    const skillRegex = new RegExp(`\\b${escapedSkill}\\b`, flags);
    if (skillRegex.test(text)) {
      matchedSkills.add(skill);
    }
  });
  info.extractedSkills = Array.from(matchedSkills);

  // Extract Experience
  const expRegex = /(\d+)\+?\s*(?:years|yrs)\s*(?:of)?\s*(?:experience)?/gi;
  let expMatch;
  let maxExp = 0;
  while ((expMatch = expRegex.exec(text)) !== null) {
    const years = parseInt(expMatch[1], 10);
    if (years > maxExp) maxExp = years;
  }
  info.experienceYears = maxExp;

  // Extract Education
  if (textLower.includes('bachelor') || textLower.includes('b.s') || textLower.includes('bsc') || textLower.includes('b.e') || textLower.includes('b.tech')) {
    info.educationLevel = "Bachelor's Degree";
  } else if (textLower.includes('master') || textLower.includes('m.s') || textLower.includes('msc') || textLower.includes('m.e') || textLower.includes('m.tech')) {
    info.educationLevel = "Master's Degree";
  } else if (textLower.includes('phd') || textLower.includes('doctorate')) {
    info.educationLevel = "Ph.D.";
  }

  return info;
};

exports.isValidCandidateName = isValidCandidateName;
exports.extractCandidateName = extractCandidateName;
exports.extractNameFromFilename = extractNameFromFilename;
