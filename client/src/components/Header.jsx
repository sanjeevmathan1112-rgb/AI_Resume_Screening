import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Sun, Moon, User, LogOut, Menu, Shield } from 'lucide-react';

const pageTitles = {
  '/dashboard': 'Dashboard Overview',
  '/jobs': 'Job Openings',
  '/jobs/create': 'Create New Job',
  '/candidates': 'Candidate Profiles',
  '/upload': 'Resume Upload & Screening',
  '/compare': 'Compare Candidates',
  '/analytics': 'Recruitment Analytics',
  '/settings': 'System Settings'
};

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Match title or fallback for detail pages
  let currentTitle = pageTitles[location.pathname];
  if (!currentTitle) {
    if (location.pathname.startsWith('/jobs/')) currentTitle = 'Job Details & Ranking';
    else if (location.pathname.startsWith('/candidates/')) currentTitle = 'Candidate Evaluation';
    else currentTitle = 'AI Resume Screening';
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-[#1E293B] border-b border-[#E2E8F0] dark:border-[#475569] h-16 px-4 md:px-6 flex items-center justify-between transition-colors duration-200 shadow-xs">
      <div className="flex items-center space-x-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-md text-[#64748B] hover:text-[#0F172A] dark:text-[#CBD5E1] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle navigation menu"
          >
            <Menu size={20} />
          </button>
        )}
        <div>
          <h1 className="text-lg md:text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            {currentTitle}
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-lg text-[#64748B] dark:text-[#CBD5E1] hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#14B8A6] dark:hover:text-[#14B8A6] transition-colors border border-[#E2E8F0] dark:border-[#475569] flex items-center justify-center cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun size={18} className="text-amber-400" />
          ) : (
            <Moon size={18} className="text-[#0F172A]" />
          )}
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center space-x-2 pl-2 border-l border-[#E2E8F0] dark:border-[#475569]">
          <div className="h-8 w-8 rounded-full bg-[#CCFBF1] dark:bg-teal-950/60 border border-[#14B8A6]/40 flex items-center justify-center text-[#14B8A6] font-semibold text-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User size={14} />}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-[#1E293B] dark:text-[#F8FAFC] leading-none">
              {user?.name || 'HR Recruiter'}
            </p>
            <p className="text-[10px] text-[#64748B] dark:text-[#CBD5E1] mt-0.5">
              {user?.organization || 'Recruitment Team'}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title="Logout"
          className="p-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
        >
          <LogOut size={16} />
          <span className="hidden lg:inline text-xs">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
