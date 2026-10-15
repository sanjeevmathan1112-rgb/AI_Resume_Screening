import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import JobList from './pages/Jobs/JobList';
import JobCreate from './pages/Jobs/JobCreate';
import JobDetail from './pages/Jobs/JobDetail';
import CandidateList from './pages/Candidates/CandidateList';
import CandidateDetail from './pages/Candidates/CandidateDetail';
import CandidateCompare from './pages/Candidates/CandidateCompare';
import UploadResume from './pages/Resumes/Upload';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-500 font-medium">
        <div className="w-6 h-6 border-2 border-[#14B8A6] border-t-transparent rounded-full animate-spin mr-3" />
        Authenticating session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#F8FAFC] overflow-hidden transition-colors duration-200">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F8FAFC] dark:bg-[#0F172A] p-4 md:p-6 transition-colors duration-200">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/jobs" element={<ProtectedRoute><JobList /></ProtectedRoute>} />
            <Route path="/jobs/create" element={<ProtectedRoute><JobCreate /></ProtectedRoute>} />
            <Route path="/jobs/:id" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />

            <Route path="/candidates" element={<ProtectedRoute><CandidateList /></ProtectedRoute>} />
            <Route path="/candidates/:id" element={<ProtectedRoute><CandidateDetail /></ProtectedRoute>} />
            <Route path="/compare" element={<ProtectedRoute><CandidateCompare /></ProtectedRoute>} />
            <Route path="/upload" element={<ProtectedRoute><UploadResume /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
