require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Job = require('./models/Job');
const Candidate = require('./models/Candidate');
const Application = require('./models/Application');
const connectDB = require('./config/db');
const { matchCandidateToJob } = require('./services/matchingService');

const seedData = async () => {
  await connectDB();

  try {
    // Clear existing data
    await User.deleteMany();
    await Job.deleteMany();
    await Candidate.deleteMany();
    await Application.deleteMany();

    // 1. Create Admin User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    const admin = await User.create({
      name: 'Admin HR',
      email: 'admin@example.com',
      password: hashedPassword,
      organization: 'Tech Corp'
    });

    console.log('Admin user created: admin@example.com / Admin@123');

    // 2. Create 3 Standard Jobs
    const jobs = await Job.insertMany([
      {
        title: 'Java Developer',
        department: 'Engineering',
        location: 'Remote',
        employmentType: 'Full-time',
        description: 'We are seeking an experienced Java Developer proficient in modern Spring Boot microservices, relational SQL databases, AWS cloud infrastructure, and Docker containerization.',
        requiredSkills: ['Java', 'Spring Boot', 'SQL'],
        preferredSkills: ['AWS', 'Docker'],
        minimumExperience: 3,
        education: "Bachelor's Degree",
        createdBy: admin._id,
        status: 'Open'
      },
      {
        title: 'Data Analyst',
        department: 'Data & Analytics',
        location: 'New York, NY',
        employmentType: 'Full-time',
        description: 'Looking for a Data Analyst to build business intelligence dashboards, perform advanced SQL queries, data modeling with Python, and statistical reporting in Tableau and R.',
        requiredSkills: ['Python', 'SQL', 'Tableau', 'Data Analysis'],
        preferredSkills: ['Machine Learning', 'R'],
        minimumExperience: 2,
        education: "Bachelor's Degree",
        createdBy: admin._id,
        status: 'Open'
      },
      {
        title: 'AI/ML Engineer',
        department: 'AI Research',
        location: 'San Francisco, CA',
        employmentType: 'Full-time',
        description: 'Seeking an AI/ML Engineer to train deep learning models, implement Natural Language Processing (NLP) pipelines using TensorFlow and PyTorch, and deploy models on AWS SageMaker.',
        requiredSkills: ['Python', 'TensorFlow', 'Machine Learning', 'NLP'],
        preferredSkills: ['PyTorch', 'AWS SageMaker'],
        minimumExperience: 4,
        education: "Master's Degree",
        createdBy: admin._id,
        status: 'Open'
      }
    ]);

    console.log(`Created ${jobs.length} jobs.`);

    const javaJob = jobs.find(j => j.title === 'Java Developer');
    const dataJob = jobs.find(j => j.title === 'Data Analyst');
    const aimlJob = jobs.find(j => j.title === 'AI/ML Engineer');

    // 3. Create 10 Realistic Candidates with varied skills and experience
    const candidateData = [
      {
        name: 'Aarav Sharma',
        email: 'aarav.sharma@example.com',
        phone: '+1 (555) 234-5678',
        location: 'Seattle, WA',
        education: "Bachelor's Degree",
        skills: ['Java', 'Spring Boot', 'SQL', 'AWS', 'Docker', 'Git'],
        totalExperience: 5,
        resumeText: 'Aarav Sharma - Senior Java Backend Engineer with 5 years experience building scalable enterprise APIs using Java, Spring Boot, SQL, AWS, and Docker container orchestration.',
        targetJob: javaJob,
        status: 'Interview'
      },
      {
        name: 'Priya Patel',
        email: 'priya.patel@example.com',
        phone: '+1 (555) 345-6789',
        location: 'Chicago, IL',
        education: "Bachelor's Degree",
        skills: ['Java', 'SQL', 'Git', 'Agile'],
        totalExperience: 2,
        resumeText: 'Priya Patel - Junior Software Developer with 2 years of Java development and relational SQL database experience. Eager to expand into cloud computing.',
        targetJob: javaJob,
        status: 'Reviewed'
      },
      {
        name: 'Marcus Vance',
        email: 'marcus.vance@example.com',
        phone: '+1 (555) 456-7890',
        location: 'Austin, TX',
        education: "Bachelor's Degree",
        skills: ['Java', 'Spring Boot', 'SQL', 'Docker'],
        totalExperience: 4,
        resumeText: 'Marcus Vance - Backend Java Engineer with 4 years experience creating RESTful microservices with Spring Boot and SQL databases, Dockerized CI/CD pipelines.',
        targetJob: javaJob,
        status: 'Offered'
      },
      {
        name: 'Elena Rostova',
        email: 'elena.rostova@example.com',
        phone: '+1 (555) 567-8901',
        location: 'New York, NY',
        education: "Bachelor's Degree",
        skills: ['Python', 'SQL', 'Tableau', 'Data Analysis', 'R', 'Machine Learning'],
        totalExperience: 4,
        resumeText: 'Elena Rostova - Senior Data Analyst with 4 years of experience delivering predictive business analytics using Python, SQL, Tableau, R, and statistical machine learning modeling.',
        targetJob: dataJob,
        status: 'Offered'
      },
      {
        name: 'Devon Miller',
        email: 'devon.miller@example.com',
        phone: '+1 (555) 678-9012',
        location: 'Boston, MA',
        education: "Bachelor's Degree",
        skills: ['Python', 'SQL', 'Tableau', 'Data Analysis'],
        totalExperience: 3,
        resumeText: 'Devon Miller - Data Analyst with 3 years experience transforming business questions into executive dashboards in Tableau, utilizing SQL data warehouses and Python scripts.',
        targetJob: dataJob,
        status: 'Interview'
      },
      {
        name: 'Sofia Chen',
        email: 'sofia.chen@example.com',
        phone: '+1 (555) 789-0123',
        location: 'San Jose, CA',
        education: "Master's Degree",
        skills: ['Python', 'SQL', 'Data Analysis'],
        totalExperience: 1,
        resumeText: 'Sofia Chen - Entry Level Data Analyst with Master degree in Information Systems, proficient in Python and SQL query optimization.',
        targetJob: dataJob,
        status: 'Reviewed'
      },
      {
        name: 'Dr. Liam O\'Connor',
        email: 'liam.oconnor@example.com',
        phone: '+1 (555) 890-1234',
        location: 'San Francisco, CA',
        education: "Ph.D.",
        skills: ['Python', 'TensorFlow', 'Machine Learning', 'NLP', 'PyTorch', 'AWS SageMaker'],
        totalExperience: 6,
        resumeText: 'Dr. Liam O\'Connor - AI Research Scientist with PhD in Computer Science and 6 years industry experience in NLP, deep learning, TensorFlow, PyTorch, and large language model training on AWS SageMaker.',
        targetJob: aimlJob,
        status: 'Offered'
      },
      {
        name: 'Ananya Reddy',
        email: 'ananya.reddy@example.com',
        phone: '+1 (555) 901-2345',
        location: 'Mountain View, CA',
        education: "Master's Degree",
        skills: ['Python', 'TensorFlow', 'Machine Learning', 'NLP', 'PyTorch'],
        totalExperience: 4,
        resumeText: 'Ananya Reddy - Machine Learning Engineer with 4 years specializing in NLP architectures, sentiment classifiers, PyTorch, and TensorFlow production deployment.',
        targetJob: aimlJob,
        status: 'Interview'
      },
      {
        name: 'Carlos Mendez',
        email: 'carlos.mendez@example.com',
        phone: '+1 (555) 012-3456',
        location: 'San Diego, CA',
        education: "Bachelor's Degree",
        skills: ['Python', 'Machine Learning', 'SQL'],
        totalExperience: 2,
        resumeText: 'Carlos Mendez - Junior ML Developer with 2 years experience building exploratory models with Python and analyzing relational data with SQL.',
        targetJob: aimlJob,
        status: 'New'
      },
      {
        name: 'Hannah Becker',
        email: 'hannah.becker@example.com',
        phone: '+1 (555) 123-4567',
        location: 'Remote',
        education: "Bachelor's Degree",
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        totalExperience: 3,
        resumeText: 'Hannah Becker - Full Stack MERN Developer with 3 years building responsive web applications using React, Node.js, Express, and MongoDB.',
        targetJob: javaJob,
        status: 'Rejected'
      }
    ];

    for (const c of candidateData) {
      const candidate = await Candidate.create({
        name: c.name,
        email: c.email,
        phone: c.phone,
        location: c.location,
        education: c.education,
        skills: c.skills,
        totalExperience: c.totalExperience,
        resumeText: c.resumeText,
        resumeFile: 'seeded'
      });

      // Match candidate against targeted job using the real NLP service
      const match = matchCandidateToJob(candidate, c.targetJob);

      await Application.create({
        candidateId: candidate._id,
        jobId: c.targetJob._id,
        ...match,
        status: c.status,
        recruiterNotes: `Automated baseline screening evaluated candidate for ${c.targetJob.title}.`
      });
    }

    console.log(`Created ${candidateData.length} candidates with complete NLP evaluation applications.`);
    console.log('Database seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
