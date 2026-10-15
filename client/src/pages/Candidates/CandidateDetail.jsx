import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { Card, StatusBadge, ScoreBadge } from '../../components/UI';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Save,
  ArrowLeft,
  FileText,
  AlertCircle
} from 'lucide-react';

const CandidateDetail = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState({});
  const [savingNotes, setSavingNotes] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  const fetchCandidate = async () => {
    try {
      const res = await api.get(`/candidates/${id}`);
      setCandidate(res.data);
      if (res.data.applications) {
        const initialNotes = {};
        res.data.applications.forEach(app => {
          initialNotes[app._id] = app.recruiterNotes || '';
        });
        setNotes(initialNotes);
      }
    } catch (err) {
      console.error('Error fetching candidate:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidate();
  }, [id]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.put(`/applications/${appId}/status`, { status: newStatus });
      fetchCandidate();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update candidate status');
    }
  };

  const handleSaveNotes = async (appId) => {
    setSavingNotes(true);
    setSaveSuccess('');
    try {
      await api.put(`/applications/${appId}/notes`, { recruiterNotes: notes[appId] || '' });
      setSaveSuccess('Recruiter notes saved.');
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating notes:', err);
      alert('Failed to save recruiter notes');
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-xs text-[#64748B] dark:text-[#CBD5E1]">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#14B8A6] mr-2" />
        Loading candidate profile...
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="p-8 text-center text-xs text-rose-600">
        Candidate not found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Link */}
      <div>
        <Link
          to="/candidates"
          className="inline-flex items-center text-xs font-semibold text-[#14B8A6] hover:underline"
        >
          <ArrowLeft size={14} className="mr-1" /> Back to Candidate Profiles
        </Link>
      </div>

      {/* Header Profile Card */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-2xl bg-[#14B8A6]/20 border-2 border-[#14B8A6] flex items-center justify-center text-[#14B8A6] text-2xl font-bold flex-shrink-0">
              {candidate.name ? candidate.name.charAt(0).toUpperCase() : <User size={24} />}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                {candidate.name}
              </h2>
              <div className="flex flex-wrap gap-4 text-xs text-[#64748B] dark:text-[#CBD5E1]">
                <span className="flex items-center">
                  <Mail size={13} className="mr-1.5 text-[#14B8A6]" />
                  {candidate.email}
                </span>
                <span className="flex items-center">
                  <Phone size={13} className="mr-1.5 text-[#14B8A6]" />
                  {candidate.phone || 'Not specified'}
                </span>
                <span className="flex items-center">
                  <MapPin size={13} className="mr-1.5 text-[#14B8A6]" />
                  {candidate.location || 'Not specified'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-[#E2E8F0] dark:border-[#475569] pt-3 sm:pt-0 sm:pl-5 text-xs text-[#64748B] dark:text-[#CBD5E1]">
            <div>
              <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                {candidate.totalExperience || 0} Years Experience
              </p>
              <p className="text-[11px]">
                {candidate.education || candidate.educationLevel || 'Degree'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Job Screening & Score Breakdown Section */}
      {candidate.applications && candidate.applications.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
            Evaluated Job Applications ({candidate.applications.length})
          </h3>

          {candidate.applications.map((app) => (
            <Card key={app._id} className="border-l-4 border-l-[#14B8A6]">
              {/* Job title & Status updater */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-[#475569] gap-3">
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    {app.jobId ? `${app.jobId.title} (${app.jobId.department || 'General'})` : 'Target Role'}
                  </h4>
                  <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1]">
                    Application ID: {app._id.slice(-8)} • Current Status: <span className="font-semibold text-[#14B8A6]">{app.status}</span>
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Status:</span>
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    className="px-2.5 py-1 rounded-lg border border-[#E2E8F0] dark:border-[#475569] bg-white dark:bg-slate-900 text-xs text-[#1E293B] dark:text-[#F8FAFC] font-semibold focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
                  >
                    <option value="New">New</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Interview">Interview</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Exact Formula Scoring Breakdown with Weights */}
              <div className="my-5">
                <p className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-3">
                  Score Breakdown & Weighting Criteria
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                  {/* Overall Match */}
                  <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                    <p className="text-[10px] font-bold uppercase text-[#0F766E] dark:text-[#2DD4BF]">
                      Overall Match
                    </p>
                    <p className="text-2xl font-black text-[#0F766E] dark:text-[#2DD4BF] my-0.5">
                      {app.overallScore}%
                    </p>
                    <p className="text-[9px] text-[#64748B] dark:text-[#CBD5E1]">Weighted Total</p>
                  </div>

                  {/* Skills Match 50% */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-[#475569]">
                    <p className="text-[10px] font-bold uppercase text-[#64748B] dark:text-[#CBD5E1]">
                      Skills (50% Weight)
                    </p>
                    <p className="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC] my-0.5">
                      {app.skillScore}%
                    </p>
                    <p className="text-[9px] text-[#64748B] dark:text-[#CBD5E1]">Requirement Match</p>
                  </div>

                  {/* TF-IDF Similarity 25% */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-[#475569]">
                    <p className="text-[10px] font-bold uppercase text-[#64748B] dark:text-[#CBD5E1]">
                      TF-IDF (25% Weight)
                    </p>
                    <p className="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC] my-0.5">
                      {app.similarityScore}%
                    </p>
                    <p className="text-[9px] text-[#64748B] dark:text-[#CBD5E1]">Vector Similarity</p>
                  </div>

                  {/* Experience 15% */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-[#475569]">
                    <p className="text-[10px] font-bold uppercase text-[#64748B] dark:text-[#CBD5E1]">
                      Exp (15% Weight)
                    </p>
                    <p className="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC] my-0.5">
                      {app.experienceScore}%
                    </p>
                    <p className="text-[9px] text-[#64748B] dark:text-[#CBD5E1]">Years Comparison</p>
                  </div>

                  {/* Education 10% */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-[#475569]">
                    <p className="text-[10px] font-bold uppercase text-[#64748B] dark:text-[#CBD5E1]">
                      Edu (10% Weight)
                    </p>
                    <p className="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC] my-0.5">
                      {app.educationScore}%
                    </p>
                    <p className="text-[9px] text-[#64748B] dark:text-[#CBD5E1]">Degree Level</p>
                  </div>
                </div>
              </div>

              {/* Matched / Missing / Additional Skills analysis */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5 text-xs">
                {/* Matched */}
                <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <p className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center mb-1.5">
                    <CheckCircle2 size={14} className="mr-1 text-emerald-600" /> Matched Skills ({app.matchedSkills?.length || 0})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {app.matchedSkills && app.matchedSkills.length > 0 ? (
                      app.matchedSkills.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-[#64748B]">None matched</span>
                    )}
                  </div>
                </div>

                {/* Missing */}
                <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                  <p className="font-bold text-amber-800 dark:text-amber-300 flex items-center mb-1.5">
                    <XCircle size={14} className="mr-1 text-amber-600" /> Missing Skills ({app.missingSkills?.length || 0})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {app.missingSkills && app.missingSkills.length > 0 ? (
                      app.missingSkills.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400">All required skills present</span>
                    )}
                  </div>
                </div>

                {/* Additional */}
                <div className="p-3.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                  <p className="font-bold text-[#0F766E] dark:text-[#2DD4BF] flex items-center mb-1.5">
                    <PlusCircle size={14} className="mr-1 text-[#14B8A6]" /> Additional Skills ({app.additionalSkills?.length || 0})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {app.additionalSkills && app.additionalSkills.length > 0 ? (
                      app.additionalSkills.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#CCFBF1] dark:bg-teal-900 text-[#0F766E] dark:text-[#2DD4BF]">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-[#64748B]">None detected</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Recruiter Notes Area */}
              <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#475569]">
                <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1.5">
                  Recruiter Feedback & Evaluation Notes
                </label>
                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    placeholder="Add interview observations, recruiter remarks, or action points..."
                    value={notes[app._id] || ''}
                    onChange={(e) => setNotes({ ...notes, [app._id]: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#475569] bg-white dark:bg-slate-900 text-xs text-[#1E293B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
                  />
                  <button
                    onClick={() => handleSaveNotes(app._id)}
                    disabled={savingNotes}
                    className="px-4 py-2 rounded-lg bg-[#14B8A6] hover:bg-[#0D9488] text-white text-xs font-semibold flex items-center space-x-1 cursor-pointer self-end flex-shrink-0"
                  >
                    <Save size={14} />
                    <span>Save</span>
                  </button>
                </div>
                {saveSuccess && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                    {saveSuccess}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Extracted Skills & Resume Raw Text */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card
            title="Extracted Resume Text"
            subtitle="Raw text stream parsed from candidate PDF"
          >
            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-lg border border-[#E2E8F0] dark:border-[#475569] max-h-96 overflow-y-auto font-mono text-[11px] leading-relaxed text-[#1E293B] dark:text-[#F8FAFC] whitespace-pre-wrap">
              {candidate.resumeText || 'No text content extracted from this document.'}
            </div>
          </Card>
        </div>

        <div>
          <Card
            title="Candidate Skills"
            subtitle="All skills extracted from resume"
          >
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills && candidate.skills.length > 0 ? (
                candidate.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#CCFBF1] dark:bg-teal-950/60 text-[#0F766E] dark:text-[#2DD4BF] border border-teal-200 dark:border-teal-800"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-xs text-[#64748B] dark:text-[#CBD5E1]">
                  No skills identified from skill taxonomy dictionary.
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetail;
