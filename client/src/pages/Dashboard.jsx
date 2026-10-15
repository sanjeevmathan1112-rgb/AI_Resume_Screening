import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { ThemeContext } from '../context/ThemeContext';
import { Card, StatusBadge, ScoreBadge } from '../components/UI';
import {
  Briefcase,
  Users,
  Award,
  CheckCircle,
  Plus,
  UploadCloud,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  Clock
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard = () => {
  const { theme } = useContext(ThemeContext);
  const [data, setData] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, jobsRes, candidatesRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/jobs'),
          api.get('/candidates')
        ]);
        setData(analyticsRes.data);
        setRecentJobs(jobsRes.data.slice(0, 4));
        setRecentCandidates(candidatesRes.data.slice(0, 4));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-sm text-[#64748B] dark:text-[#CBD5E1]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#14B8A6] mr-3" />
        Loading Recruitment Dashboard...
      </div>
    );
  }

  const isDark = theme === 'dark';
  const gridColor = isDark ? '#334155' : '#E2E8F0';
  const textColor = isDark ? '#CBD5E1' : '#64748B';

  const kpis = [
    {
      title: 'Total Jobs',
      value: data?.totalJobs || 0,
      sub: 'All posted openings',
      icon: Briefcase,
      color: 'text-[#0F172A] dark:text-white',
      bg: 'bg-slate-100 dark:bg-slate-800'
    },
    {
      title: 'Active Jobs',
      value: data?.activeJobs || 0,
      sub: 'Accepting resumes',
      icon: CheckCircle,
      color: 'text-[#14B8A6]',
      bg: 'bg-[#CCFBF1] dark:bg-teal-950/60'
    },
    {
      title: 'Total Candidates',
      value: data?.totalCandidates || 0,
      sub: `${data?.resumesProcessed || 0} processed resumes`,
      icon: Users,
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-50 dark:bg-sky-950/60'
    },
    {
      title: 'Avg Match Score',
      value: `${data?.averageMatchScore || 0}%`,
      sub: 'Across screened applicants',
      icon: Award,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/60'
    },
  ];

  const STATUS_COLORS = ['#14B8A6', '#0EA5E9', '#F59E0B', '#10B981', '#EF4444'];

  return (
    <div className="space-y-6">
      {/* Top Banner / Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#475569] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
            Recruitment Overview
          </h2>
          <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] mt-0.5">
            Automated resume ranking and multi-criteria applicant evaluation.
          </p>
        </div>
        <div className="flex items-center space-x-2.5">
          <Link
            to="/jobs/create"
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#0F172A] dark:text-[#F8FAFC] text-xs font-semibold flex items-center transition cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <Plus size={15} className="mr-1.5" />
            <span>Post New Job</span>
          </Link>
          <Link
            to="/upload"
            className="px-3.5 py-2 rounded-lg bg-[#14B8A6] hover:bg-[#0D9488] text-white text-xs font-semibold flex items-center transition shadow-xs cursor-pointer"
          >
            <UploadCloud size={15} className="mr-1.5" />
            <span>Upload Resume</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#475569] rounded-xl p-5 shadow-xs transition-colors flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs font-medium text-[#64748B] dark:text-[#CBD5E1]">
                {kpi.title}
              </p>
              <h3 className="text-2xl font-black text-[#0F172A] dark:text-[#F8FAFC]">
                {kpi.value}
              </h3>
              <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1]">
                {kpi.sub}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color}`}>
              <kpi.icon size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Distribution Chart */}
        <Card
          className="lg:col-span-2"
          title="Candidate Score Distribution"
          subtitle="Frequency of overall matching scores across candidates"
          action={
            <Link to="/analytics" className="text-xs font-semibold text-[#14B8A6] hover:underline flex items-center">
              Detailed Analytics <ChevronRight size={14} />
            </Link>
          }
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.scoreDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="range" stroke={textColor} fontSize={11} />
                <YAxis stroke={textColor} fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    borderColor: isDark ? '#475569' : '#E2E8F0',
                    color: isDark ? '#F8FAFC' : '#1E293B',
                    fontSize: '12px',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" name="Candidates" fill="#14B8A6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Candidate Status Distribution */}
        <Card
          title="Application Pipeline"
          subtitle="Breakdown of candidate statuses"
        >
          <div className="h-64 w-full flex flex-col justify-center items-center">
            {data?.candidateStatus && data.candidateStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.candidateStatus}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {data.candidateStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                      borderColor: isDark ? '#475569' : '#E2E8F0',
                      color: isDark ? '#F8FAFC' : '#1E293B',
                      fontSize: '12px',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-[#64748B] dark:text-[#CBD5E1]">No applications logged yet.</p>
            )}
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {data?.candidateStatus?.map((item, idx) => (
                <div key={idx} className="flex items-center text-[10px] text-[#64748B] dark:text-[#CBD5E1] space-x-1">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: STATUS_COLORS[idx % STATUS_COLORS.length] }}
                  />
                  <span>{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Tables Row: Recent Jobs & Screened Candidates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <Card
          title="Recent Job Openings"
          subtitle="Latest roles evaluating candidate submissions"
          action={
            <Link to="/jobs" className="text-xs font-semibold text-[#14B8A6] hover:underline flex items-center">
              View All Jobs <ChevronRight size={14} />
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] dark:border-[#475569] text-[#64748B] dark:text-[#CBD5E1] font-semibold">
                  <th className="pb-2.5">Job Title</th>
                  <th className="pb-2.5">Department</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#475569]">
                {recentJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3 font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                      {job.title}
                    </td>
                    <td className="py-3 text-[#64748B] dark:text-[#CBD5E1]">
                      {job.department || 'Engineering'}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={job.status || 'Open'} />
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="text-xs font-semibold text-[#14B8A6] hover:underline"
                      >
                        Ranking →
                      </Link>
                    </td>
                  </tr>
                ))}
                {recentJobs.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-[#64748B] dark:text-[#CBD5E1]">
                      No active jobs posted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Screened Candidates */}
        <Card
          title="Recent Candidate Profiles"
          subtitle="Extracted and evaluated candidate records"
          action={
            <Link to="/candidates" className="text-xs font-semibold text-[#14B8A6] hover:underline flex items-center">
              View All Candidates <ChevronRight size={14} />
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] dark:border-[#475569] text-[#64748B] dark:text-[#CBD5E1] font-semibold">
                  <th className="pb-2.5">Candidate</th>
                  <th className="pb-2.5">Experience</th>
                  <th className="pb-2.5">Top Skills</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#475569]">
                {recentCandidates.map((cand) => (
                  <tr key={cand._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3">
                      <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{cand.name}</p>
                      <p className="text-[10px] text-[#64748B] dark:text-[#CBD5E1]">{cand.email}</p>
                    </td>
                    <td className="py-3 text-[#64748B] dark:text-[#CBD5E1]">
                      {cand.totalExperience || 0} yrs
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {cand.skills?.slice(0, 2).map((s, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/candidates/${cand._id}`}
                        className="text-xs font-semibold text-[#14B8A6] hover:underline"
                      >
                        Profile →
                      </Link>
                    </td>
                  </tr>
                ))}
                {recentCandidates.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-[#64748B] dark:text-[#CBD5E1]">
                      No candidates uploaded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
