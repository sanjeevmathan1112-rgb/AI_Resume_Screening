# AI-Powered Resume Screening and Candidate Ranking System

An intelligent, full-stack recruitment portal designed to automate resume parsing, candidate scoring, and ranking using Natural Language Processing (NLP) and weighted matching algorithms.

Built with the **MERN** stack (MongoDB, Express, React, Node.js) and styled with a professional **Navy + Teal** UI supporting seamless **Light & Dark mode** themes.

---

## 🌟 Key Features

- **Automated Resume Parsing**: Upload resumes in PDF format; extracts candidate contact information, skills, education, and years of experience automatically.
- **Weighted NLP Scoring Algorithm**:
  - **Skills Match (50%)**: Compares required & preferred job skills against parsed candidate skills with synonym matching.
  - **TF-IDF & Cosine Similarity (25%)**: Contextual text matching between the job description and candidate resume body.
  - **Experience Scoring (15%)**: Evaluates candidate experience relative to minimum job requirements.
  - **Education Scoring (10%)**: Checks qualification alignment (Bachelor's, Master's, Ph.D.).
- **Candidate Leaderboard & Ranking**: Visual ranking with breakdown scores, matched vs. missing skills, and application status tracking.
- **Recruitment Analytics**: Interactive charts powered by Recharts showing candidate pipeline distribution, score brackets, and job application volumes.
- **Side-by-Side Candidate Comparison**: Compare candidates directly to make data-driven hiring decisions.
- **Role-Based Recruiter Authentication**: Secure JWT-based authentication with bcrypt password hashing.
- **Light & Dark Mode**: Persistent theme toggle matching the modern Navy (`#0F172A`) and Teal (`#14B8A6`) color system.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, Lucide React, Recharts, Axios, React Router v6
- **Backend**: Node.js, Express 5, Multer (file handling), pdf-parse (PDF extraction), Natural (TF-IDF & NLP)
- **Database**: MongoDB with Mongoose ODM (supports local MongoDB & MongoDB Atlas)
- **Security**: JWT (JSON Web Tokens), bcryptjs password hashing, CORS protection

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas URI)
- [Git](https://git-scm.com/)

---

### Installation & Setup

#### 1. Clone the repository
```bash
git clone https://github.com/sanjeevmathan1112-rgb/AI_Resume_Screening.git
cd AI_Resume_Screening
```

#### 2. Backend Setup
```bash
cd server
npm install
```

Configure environment variables:
Create a `.env` file in the `server` directory (or copy from `.env.example`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ai-resume-screening
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

*(Optional)* Seed sample jobs and candidates:
```bash
node seed.js
```

Start the backend server:
```bash
node server.js
```
The server will run on `http://localhost:5000`.

---

#### 3. Frontend Setup
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
The application will launch on `http://localhost:5173`.

---

## 🔐 Default Demo Credentials

If seeded with `node seed.js`:
- **Email**: `admin@example.com`
- **Password**: `Admin@123`

---

## 📁 Project Structure

```
AI-Resume-Screening/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Header, Sidebar, UI kit (Card, Badge, Modal)
│   │   ├── context/            # AuthContext, ThemeContext
│   │   ├── pages/
│   │   │   ├── Auth/           # Login, Register
│   │   │   ├── Candidates/     # CandidateList, CandidateDetail, Compare
│   │   │   ├── Jobs/           # JobList, JobCreate, JobDetail (Leaderboard)
│   │   │   ├── Resumes/        # Upload & Screening
│   │   │   ├── Analytics.jsx   # Metrics & Recharts Dashboard
│   │   │   ├── Dashboard.jsx   # Recruiter Overview
│   │   │   └── Settings.jsx    # Profile & Theme Settings
│   │   └── services/           # Axios API configuration
│   └── package.json
│
├── server/                     # Node.js + Express Backend
│   ├── config/                 # Database connection (with Atlas fallback)
│   ├── controllers/            # Auth, Jobs, Candidates, Resumes, Analytics
│   ├── middleware/             # JWT auth, Multer upload, Error handler
│   ├── models/                 # User, Job, Candidate, Application schemas
│   ├── routes/                 # Express API routes
│   ├── services/               # PDF text extraction, NLP scoring algorithm
│   ├── utils/                  # Skill dictionary, helpers
│   ├── seed.js                 # Sample database seeder
│   └── server.js               # Entry point
│
├── .gitignore
└── README.md
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
