import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  UploadCloud,
  GitCompare,
  BarChart3,
  Settings,
  Sparkles,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Jobs', path: '/jobs', icon: Briefcase },
    { name: 'Candidates', path: '/candidates', icon: Users },
    { name: 'Upload Resume', path: '/upload', icon: UploadCloud },
    { name: 'Compare', path: '/compare', icon: GitCompare },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/60 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#0F172A] dark:bg-[#020617] border-r border-slate-800 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand / Logo */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#14B8A6] flex items-center justify-center text-white shadow-xs">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide leading-tight">
                AI RESUME
              </h2>
              <p className="text-[10px] text-[#14B8A6] font-medium tracking-wider uppercase">
                Screening System
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden text-slate-400 hover:text-white p-1 rounded-md"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors group ${
                  isActive
                    ? 'bg-[#14B8A6]/15 text-[#14B8A6] border-l-3 border-[#14B8A6]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <item.icon
                size={18}
                className="mr-3 transition-colors group-hover:text-slate-200"
              />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Responsible AI Disclaimer Banner */}
        <div className="p-3 m-3 rounded-lg bg-slate-900/90 dark:bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 leading-snug">
          <p className="font-semibold text-slate-300 mb-1 text-[11px]">Responsible AI</p>
          AI-generated matching scores support recruiter review and should not replace human judgment.
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-800/80 text-[10px] text-slate-500">
          College Project Edition • v2.0
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
