import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Card } from '../components/UI';
import { User, Sun, Moon, Shield, Building, Mail, LogOut, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Card */}
      <Card title="Recruiter Profile" subtitle="Your active HR credentials and organization">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="h-20 w-20 rounded-full bg-[#14B8A6]/20 border-2 border-[#14B8A6] flex items-center justify-center text-[#14B8A6] text-2xl font-bold">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="space-y-1.5 flex-1">
            <h4 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              {user?.name || 'Admin HR'}
            </h4>
            <div className="flex flex-wrap gap-4 text-xs text-[#64748B] dark:text-[#CBD5E1]">
              <span className="flex items-center">
                <Mail size={14} className="mr-1.5 text-[#14B8A6]" />
                {user?.email || 'admin@example.com'}
              </span>
              <span className="flex items-center">
                <Building size={14} className="mr-1.5 text-[#14B8A6]" />
                {user?.organization || 'Tech Corp'}
              </span>
              <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 size={14} className="mr-1" /> Verified Administrator
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Theme Preference Card */}
      <Card title="Display & Theme Settings" subtitle="Choose between Navy Light and Dark interfaces">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-[#475569]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-[#475569] text-[#14B8A6]">
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} className="text-amber-500" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                Interface Mode: <span className="capitalize text-[#14B8A6]">{theme} Mode</span>
              </p>
              <p className="text-xs text-[#64748B] dark:text-[#CBD5E1]">
                Theme persists across browser sessions via local storage.
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#0F172A] dark:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#475569] transition cursor-pointer flex items-center justify-center space-x-1.5 self-start sm:self-auto"
          >
            {theme === 'dark' ? <Sun size={15} className="text-amber-400 mr-1" /> : <Moon size={15} className="mr-1" />}
            <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
          </button>
        </div>
      </Card>

      {/* System & Architecture Info */}
      <Card title="System Architecture" subtitle="AI screening engine specifications">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-[#E2E8F0] dark:border-[#475569] space-y-1">
            <p className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">Scoring Algorithm Weights</p>
            <p className="text-[#64748B] dark:text-[#CBD5E1]">
              Skills (50%) + TF-IDF (25%) + Experience (15%) + Education (10%)
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-[#E2E8F0] dark:border-[#475569] space-y-1">
            <p className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">NLP & Parser Engine</p>
            <p className="text-[#64748B] dark:text-[#CBD5E1]">
              Local Vector TF-IDF, Cosine Similarity, PDF-Parse v2.4 (Zero external AI cost)
            </p>
          </div>
        </div>
      </Card>

      {/* Account Actions */}
      <Card title="Account Actions">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
              Sign out of this session
            </p>
            <p className="text-xs text-[#64748B] dark:text-[#CBD5E1]">
              You will be redirected to the HR Login screen.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition flex items-center justify-center space-x-1.5 cursor-pointer self-start sm:self-auto"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
