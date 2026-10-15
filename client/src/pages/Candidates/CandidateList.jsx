import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { Card, StatusBadge, ScoreBadge } from '../../components/UI';
import { Search, User, Mail, Phone, Briefcase, GraduationCap, Eye, Filter } from 'lucide-react';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExp, setFilterExp] = useState('all');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await api.get('/candidates');
        setCandidates(res.data);
      } catch (err) {
        console.error('Error fetching candidates:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  const filtered = candidates.filter(c => {
    const matchesSearch =
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filterExp === 'junior') return matchesSearch && (c.totalExperience || 0) < 3;
    if (filterExp === 'mid') return matchesSearch && (c.totalExperience || 0) >= 3 && (c.totalExperience || 0) < 5;
    if (filterExp === 'senior') return matchesSearch && (c.totalExperience || 0) >= 5;

    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-xs text-[#64748B] dark:text-[#CBD5E1]">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#14B8A6] mr-2" />
        Loading candidate database...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
            Candidate Profiles ({candidates.length})
          </h2>
          <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] mt-0.5">
            Profiles parsed from resumes with extracted skills, experience, and educational background.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Experience Filter */}
          <select
            value={filterExp}
            onChange={(e) => setFilterExp(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#475569] bg-white dark:bg-slate-900 text-xs text-[#1E293B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
          >
            <option value="all">All Experience Levels</option>
            <option value="junior">Junior (&lt; 3 yrs)</option>
            <option value="mid">Mid-Level (3-4 yrs)</option>
            <option value="senior">Senior (5+ yrs)</option>
          </select>

          {/* Search box */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#475569] bg-white dark:bg-slate-900 text-xs text-[#1E293B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#14B8A6] w-52 sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#475569] rounded-xl shadow-xs overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-[#E2E8F0] dark:border-[#475569] text-[#64748B] dark:text-[#CBD5E1] font-semibold">
                <th className="px-5 py-3.5">Candidate Name</th>
                <th className="px-5 py-3.5">Contact Details</th>
                <th className="px-5 py-3.5">Experience</th>
                <th className="px-5 py-3.5">Education</th>
                <th className="px-5 py-3.5">Extracted Skills</th>
                <th className="px-5 py-3.5 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#475569]">
              {filtered.map((candidate) => (
                <tr key={candidate._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center space-x-2.5">
                      <div className="h-8 w-8 rounded-full bg-[#14B8A6]/20 text-[#14B8A6] font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {candidate.name ? candidate.name.charAt(0).toUpperCase() : <User size={14} />}
                      </div>
                      <div>
                        <p className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                          {candidate.name}
                        </p>
                        <p className="text-[10px] text-[#64748B] dark:text-[#CBD5E1]">
                          ID: {candidate._id.slice(-6)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[#64748B] dark:text-[#CBD5E1]">
                    <p className="flex items-center">
                      <Mail size={12} className="mr-1 text-slate-400" />
                      {candidate.email}
                    </p>
                    {candidate.phone && candidate.phone !== 'Not specified' && (
                      <p className="flex items-center text-[10px] mt-0.5">
                        <Phone size={12} className="mr-1 text-slate-400" />
                        {candidate.phone}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-[#0F172A] dark:text-[#F8FAFC]">
                    {candidate.totalExperience || 0} years
                  </td>
                  <td className="px-5 py-3.5 text-[#64748B] dark:text-[#CBD5E1]">
                    {candidate.education || candidate.educationLevel || 'Not specified'}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1 max-w-[240px]">
                      {candidate.skills?.slice(0, 3).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                      {candidate.skills?.length > 3 && (
                        <span className="text-[10px] text-[#64748B] dark:text-[#CBD5E1]">
                          +{candidate.skills.length - 3}
                        </span>
                      )}
                      {(!candidate.skills || candidate.skills.length === 0) && (
                        <span className="text-[10px] text-slate-400">None detected</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      to={`/candidates/${candidate._id}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#0F172A] dark:text-[#F8FAFC] font-semibold text-xs inline-flex items-center space-x-1 transition cursor-pointer border border-slate-200 dark:border-slate-700"
                    >
                      <Eye size={14} />
                      <span>View</span>
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-xs text-[#64748B] dark:text-[#CBD5E1]">
                    No candidates found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CandidateList;
