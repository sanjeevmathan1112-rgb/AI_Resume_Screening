import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Sun, Moon, ArrowRight, Lock, Mail, User, Building, AlertCircle } from 'lucide-react';

const Register = () => {
  const { register } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, organization || 'Recruitment Team');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#F8FAFC] flex flex-col justify-center items-center px-4 py-8 relative transition-colors duration-200">
      {/* Theme Toggle Top Right */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 rounded-lg bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#475569] text-[#64748B] dark:text-[#CBD5E1] hover:text-[#14B8A6] dark:hover:text-[#14B8A6] transition"
        title="Toggle Theme"
      >
        {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-[#0F172A]" />}
      </button>

      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[#14B8A6] text-white shadow-sm mb-3">
            <Sparkles size={24} />
          </div>
          <h2 className="text-2xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            CREATE HR ACCOUNT
          </h2>
          <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] mt-1">
            Set up recruiter access for automated candidate ranking
          </p>
        </div>

        <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#475569] rounded-2xl p-6 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#475569] bg-white dark:bg-slate-900 text-xs text-[#1E293B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                Work Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#475569] bg-white dark:bg-slate-900 text-xs text-[#1E293B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                Company / Organization
              </label>
              <div className="relative">
                <Building size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Tech Corp / College Placement Cell"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#475569] bg-white dark:bg-slate-900 text-xs text-[#1E293B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#475569] bg-white dark:bg-slate-900 text-xs text-[#1E293B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#475569] bg-white dark:bg-slate-900 text-xs text-[#1E293B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-2.5 px-4 rounded-lg bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold text-xs tracking-wide transition shadow-xs flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight size={15} />
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#64748B] dark:text-[#CBD5E1]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#14B8A6] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
