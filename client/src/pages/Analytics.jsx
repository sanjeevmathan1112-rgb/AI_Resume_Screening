import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Card } from '../components/UI';
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
  Cell,
  Legend
} from 'recharts';
import { Briefcase, Users, FileText, Award, BarChart3 } from 'lucide-react';

const STATUS_COLORS = {
  Applied: '#64748B',      // Slate
  Shortlisted: '#14B8A6',  // Teal
  Interviewed: '#6366F1',  // Indigo
  Rejected: '#EF4444',     // Red
  Hired: '#10B981'         // Emerald
};

const PALETTE = ['#14B8A6', '#6366F1', '#F59E0B', '#10B981', '#EF4444', '#0EA5E9'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0F172A] text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-slate-700">
        <p className="font-semibold mb-1">{label || payload[0].name}</p>
        <p className="text-[#14B8A6] font-bold">
          Count: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load recruitment analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-slate-500 text-sm">
        <div className="w-6 h-6 border-2 border-[#14B8A6] border-t-transparent rounded-full animate-spin mr-3" />
        Loading analytics engine...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-rose-500 font-medium">
        Error loading analytics data. Please ensure the backend is running.
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Job Openings',
      value: data.totalJobs || 0,
      icon: Briefcase,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40'
    },
    {
      title: 'Active Roles',
      value: data.activeJobs || 0,
      icon: Award,
      color: 'text-[#14B8A6]',
      bg: 'bg-teal-50 dark:bg-teal-950/40'
    },
    {
      title: 'Resumes Screened',
      value: data.resumesProcessed || 0,
      icon: FileText,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40'
    },
    {
      title: 'Avg Match Score',
      value: `${data.averageMatchScore || 0}%`,
      icon: BarChart3,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
          Recruitment & Screening Analytics
        </h2>
        <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] mt-0.5">
          Real-time hiring metrics, candidate distribution, and AI screening efficiency
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-[#1E293B] p-5 rounded-xl border border-[#E2E8F0] dark:border-[#475569] shadow-xs flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-medium text-[#64748B] dark:text-[#CBD5E1]">
                  {kpi.title}
                </p>
                <h3 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mt-1">
                  {kpi.value}
                </h3>
              </div>
              <div className={`p-3 rounded-lg ${kpi.bg} ${kpi.color}`}>
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications by Status */}
        <Card
          title="Applications by Hiring Status"
          subtitle="Breakdown of candidate progress across pipeline stages"
        >
          <div className="h-72 w-full pt-2">
            {data.candidateStatus && data.candidateStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.candidateStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {data.candidateStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STATUS_COLORS[entry.name] || PALETTE[index % PALETTE.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No candidate status data recorded yet
              </div>
            )}
          </div>
        </Card>

        {/* Score Distribution */}
        <Card
          title="Candidate Match Score Distribution"
          subtitle="AI matching score brackets (Skills 50%, TF-IDF 25%, Exp 15%, Edu 10%)"
        >
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.scoreDistribution || []}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} />
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#14B8A6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Applications by Job */}
      <Card
        title="Candidate Volume by Job Opening"
        subtitle="Number of resumes submitted and scored per active opening"
      >
        <div className="h-80 w-full pt-2">
          {data.applicationsByJob && data.applicationsByJob.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.applicationsByJob}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 30, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={140}
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#0F172A" radius={[0, 4, 4, 0]} className="fill-[#0F172A] dark:fill-[#38BDF8]" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No job application records available yet
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
