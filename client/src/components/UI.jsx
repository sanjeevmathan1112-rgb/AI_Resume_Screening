import React from 'react';

// Reusable Card component matching Navy + Teal Figma spec
export const Card = ({ children, className = '', title, subtitle, action, footer }) => {
  return (
    <div className={`bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#475569] rounded-xl shadow-xs transition-colors duration-200 overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="px-5 py-4 border-b border-[#E2E8F0] dark:border-[#475569] flex items-center justify-between">
          <div>
            {title && (
              <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
      {footer && (
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/40 border-t border-[#E2E8F0] dark:border-[#475569]">
          {footer}
        </div>
      )}
    </div>
  );
};

// Reusable Badge component
export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    teal: 'bg-[#CCFBF1] text-[#0F766E] dark:bg-teal-950/60 dark:text-[#2DD4BF] border-teal-200 dark:border-teal-800',
    navy: 'bg-slate-900 text-slate-100 dark:bg-slate-800 dark:text-white',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    danger: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
};

// Standardized Status Badge for Applications and Jobs
export const StatusBadge = ({ status }) => {
  const map = {
    New: 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    Reviewed: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    Interview: 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    Offered: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    Rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    Open: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    Closed: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[status] || map.New}`}>
      {status || 'New'}
    </span>
  );
};

// Match Score visual badge with color grading
export const ScoreBadge = ({ score, showBar = true }) => {
  const numScore = Number(score) || 0;
  
  let color = 'text-emerald-600 dark:text-emerald-400 bg-emerald-500';
  if (numScore < 50) color = 'text-rose-600 dark:text-rose-400 bg-rose-500';
  else if (numScore < 75) color = 'text-[#14B8A6] dark:text-[#2DD4BF] bg-[#14B8A6]';

  return (
    <div className="flex items-center space-x-2">
      {showBar && (
        <div className="w-16 sm:w-20 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${color.split(' ')[2]}`}
            style={{ width: `${Math.min(numScore, 100)}%` }}
          />
        </div>
      )}
      <span className={`text-xs font-bold ${color.split(' ')[0]}`}>
        {numScore}%
      </span>
    </div>
  );
};

// Reusable Modal Dialog
export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#475569] rounded-xl max-w-lg w-full shadow-xl overflow-hidden transition-colors">
        <div className="px-5 py-4 border-b border-[#E2E8F0] dark:border-[#475569] flex items-center justify-between">
          <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
          >
            ✕
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};
