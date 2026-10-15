import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { Card, StatusBadge, ScoreBadge } from '../../components/UI';
import {
  UploadCloud,
  ChevronRight,
  User,
  ArrowLeft,
  AlertCircle,
  Building,
  MapPin,
  Clock,
  Sparkles,
  Trophy
} from 'lucide-react';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const [jobRes, rankingRes] = await Promise.all([
          api.get(`/jobs/${id}`),
          api.get(`/matching/${id}/ranking`)
        ]);
        setJob(jobRes.data);
        setCandidates(rankingRes.data);
      } catch (err) {
        console.error('Error fetching job ranking data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-xs text-[#64748B] dark:text-[#CBD5E1]">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#14B8A6] mr-2" />
        Loading job ranking leaderboard...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-8 text-center text-xs text-rose-600">
        Job not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/jobs"
          className="inline-flex items-center text-xs font-semibold text-[#14B8A6] hover:underline"
        >
          <ArrowLeft size={14} className="mr-1" /> Back to Job Openings
        </Link>
      </div>

      {/* Job Header Card */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                {job.title}
              </h2>
              <StatusBadge status={job.status || 'Open'} />
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-[#64748B] dark:text-[#CBD5E1]">
              <span className="flex items-center">
                <Building size={14} className="mr-1.5 text-[#14B8A6]" />
                {job.department || 'Engineering'}
              </span>
              <span className="flex items-center">
                <MapPin size={14} className="mr-1.5 text-[#14B8A6]" />
                {job.location || 'Remote'}
              </span>
              <span className="flex items-center">
                <Clock size={14} className="mr-1.5 text-[#14B8A6]" />
                {job.employmentType || 'Full-time'}
              </span>
            </div>
          </div>

          <Link
            to={`/upload?jobId=${job._id}`}
            className="px-4 py-2.5 rounded-lg bg-[#14B8A6] hover:bg-[#0D9488] text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-xs transition cursor-pointer self-start lg:self-auto"
          >
            <UploadCloud size={16} />
            <span>Upload Resumes for this Role</span>
          </Link>
        </div>

        {/* Description & Skill Tags */}
        <div className="mt-5 pt-4 border-t border-[#E2E8F0] dark:border-[#475569] space-y-3 text-xs">
          <p className="text-[#64748B] dark:text-[#CBD5E1] leading-relaxed">
            {job.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div>
              <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1.5">
                Required Skills (50% Weight):
              </p>
              <div className="flex flex-wrap gap-1">
                {job.requiredSkills?.map((s, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#CCFBF1] dark:bg-teal-950/60 text-[#0F766E] dark:text-[#2DD4BF] border border-teal-200 dark:border-teal-800"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1.5">
                Preferred Skills:
              </p>
              <div className="flex flex-wrap gap-1">
                {job.preferredSkills && job.preferredSkills.length > 0 ? (
                  job.preferredSkills.map((s, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400">None specified</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Candidate Ranking Leaderboard */}
      <Card
        title={`Candidate Ranking Leaderboard (${candidates.length})`}
        subtitle="Ranked dynamically by the objective weighted NLP matching engine"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-[#E2E8F0] dark:border-[#475569] text-[#64748B] dark:text-[#CBD5E1] font-semibold">
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3 text-center">Skills (50%)</th>
                <th className="px-4 py-3 text-center">TF-IDF (25%)</th>
                <th className="px-4 py-3 text-center">Exp (15%)</th>
                <th className="px-4 py-3 text-center">Edu (10%)</th>
                <th className="px-4 py-3 text-center">Overall Score</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#475569]">
              {candidates.map((app, index) => (
                <tr key={app._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black ${
                        index === 0
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                          : index === 1
                          ? 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                          : index === 2
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                          : 'text-[#64748B] dark:text-[#CBD5E1]'
                      }`}
                    >
                      #{index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="h-7 w-7 rounded-full bg-[#14B8A6]/20 text-[#14B8A6] flex items-center justify-center font-bold text-xs">
                        {app.candidateId?.name ? app.candidateId.name.charAt(0) : <User size={14} />}
                      </div>
                      <div>
                        <p className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                          {app.candidateId?.name || 'Applicant'}
                        </p>
                        <p className="text-[10px] text-[#64748B] dark:text-[#CBD5E1]">
                          {app.candidateId?.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                    {app.skillScore}%
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                    {app.similarityScore}%
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                    {app.experienceScore}%
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                    {app.educationScore}%
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="inline-block">
                      <ScoreBadge score={app.overallScore} showBar={false} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={app.status || 'New'} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/candidates/${app.candidateId?._id}`}
                      className="text-xs font-semibold text-[#14B8A6] hover:underline flex items-center justify-end"
                    >
                      <span>View</span>
                      <ChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
              {candidates.length === 0 && (
                <tr>
                  <td colSpan="9" className="px-4 py-10 text-center text-xs text-[#64748B] dark:text-[#CBD5E1]">
                    <p className="mb-2">No candidates screened for this job yet.</p>
                    <Link
                      to={`/upload?jobId=${job._id}`}
                      className="text-[#14B8A6] font-semibold underline"
                    >
                      Upload a PDF resume to screen candidates now
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default JobDetail;
