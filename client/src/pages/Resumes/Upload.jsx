import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../services/api';
import { Card, ScoreBadge } from '../../components/UI';
import {
  UploadCloud,
  CheckCircle,
  XCircle,
  FileText,
  Briefcase,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';

const UploadResume = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialJobId = queryParams.get('jobId') || '';

  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState(initialJobId);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [lastApplication, setLastApplication] = useState(null);
  const [recentCandidates, setRecentCandidates] = useState([]);

  const fetchRecent = async () => {
    try {
      const res = await api.get('/candidates');
      setRecentCandidates(res.data.slice(0, 5));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs');
        const openJobs = res.data.filter(j => j.status === 'Open');
        setJobs(openJobs);
        if (!jobId && openJobs.length > 0) {
          setJobId(openJobs[0]._id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobs();
    fetchRecent();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus(null);
      setMessage('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      if (dropped.type === 'application/pdf' || dropped.name.endsWith('.pdf')) {
        setFile(dropped);
        setStatus(null);
        setMessage('');
      } else {
        setStatus('error');
        setMessage('Only PDF documents are accepted.');
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !jobId) return;

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobId', jobId);

    setUploading(true);
    setStatus(null);

    try {
      const res = await api.post('/resumes/upload', formData);
      setStatus('success');
      setMessage(`Resume successfully screened for ${res.data.candidate?.name || 'Applicant'}!`);
      setLastApplication(res.data);
      setFile(null);
      fetchRecent();
      const input = document.getElementById('resume-file-input');
      if (input) input.value = '';
    } catch (err) {
      console.error(err);
      setStatus('error');
      const errDetail = err.response?.data?.error || err.response?.data?.message || err.message || 'Error uploading file';
      setMessage(errDetail);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
          Upload & Screen Candidate Resumes
        </h2>
        <p className="text-xs text-[#64748B] dark:text-[#CBD5E1]">
          Upload candidate resumes in PDF format to automatically extract skills, calculate TF-IDF similarity, and rank against job descriptions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form Area */}
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleUpload} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1.5">
                  Select Target Job Position *
                </label>
                <select
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#475569] bg-white dark:bg-slate-900 text-[#1E293B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
                >
                  <option value="" disabled>Select a role...</option>
                  {jobs.map(job => (
                    <option key={job._id} value={job._id}>
                      {job.title} - {job.department || 'Engineering'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1.5">
                  Candidate Resume (PDF) *
                </label>

                {/* Drag and drop box */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition ${
                    isDragging
                      ? 'border-[#14B8A6] bg-teal-50/50 dark:bg-teal-950/20'
                      : 'border-slate-300 dark:border-slate-700 hover:border-[#14B8A6]'
                  }`}
                >
                  <UploadCloud size={40} className="text-[#14B8A6] mb-2" />
                  <p className="font-semibold text-xs text-[#0F172A] dark:text-[#F8FAFC]">
                    Drag and drop resume PDF here, or click to choose file
                  </p>
                  <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] mt-1">
                    Accepts standard PDF documents up to 5 MB
                  </p>

                  <input
                    id="resume-file-input"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="mt-3 text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#14B8A6] file:text-white hover:file:bg-[#0D9488] cursor-pointer"
                  />

                  {file && (
                    <div className="mt-3 flex items-center px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-medium">
                      <FileText size={14} className="mr-1.5 text-[#14B8A6]" />
                      <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading || !file || !jobId}
                className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs tracking-wide transition shadow-xs flex items-center justify-center space-x-2 cursor-pointer ${
                  uploading || !file || !jobId
                    ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-[#14B8A6] hover:bg-[#0D9488] text-white'
                }`}
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>Extracting Text & Calculating NLP Match Scores...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Upload and Screen Resume</span>
                  </>
                )}
              </button>
            </form>

            {/* Success alert with direct action */}
            {status === 'success' && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 space-y-2 text-xs">
                <div className="flex items-center space-x-2 font-bold">
                  <CheckCircle size={18} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>{message}</span>
                </div>
                {lastApplication?.application && (
                  <div className="pl-6 flex flex-wrap items-center gap-3 text-xs">
                    <span>
                      Overall Match Score: <strong>{lastApplication.application.overallScore}%</strong>
                    </span>
                    <Link
                      to={`/jobs/${jobId}`}
                      className="font-bold underline text-[#0F766E] dark:text-[#2DD4BF] hover:text-[#0D9488]"
                    >
                      View Role Leaderboard →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Error alert */}
            {status === 'error' && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
                <XCircle size={18} className="flex-shrink-0" />
                <span>{message}</span>
              </div>
            )}
          </Card>
        </div>

        {/* Recent Uploads Side Panel */}
        <div>
          <Card
            title="Recent Screenings"
            subtitle="Latest parsed applicants"
          >
            <div className="space-y-3">
              {recentCandidates.map((cand) => (
                <div
                  key={cand._id}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-[#475569] text-xs space-y-1 hover:border-[#14B8A6] transition"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                      {cand.name}
                    </p>
                    <span className="text-[10px] text-[#64748B] dark:text-[#CBD5E1]">
                      {cand.totalExperience || 0} yrs exp
                    </span>
                  </div>
                  <p className="text-[10px] text-[#64748B] dark:text-[#CBD5E1] truncate">
                    {cand.email}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-[#14B8A6] font-medium truncate max-w-[120px]">
                      {cand.education || 'Degree'}
                    </span>
                    <Link
                      to={`/candidates/${cand._id}`}
                      className="text-[10px] font-semibold text-[#14B8A6] hover:underline"
                    >
                      Inspect →
                    </Link>
                  </div>
                </div>
              ))}
              {recentCandidates.length === 0 && (
                <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] text-center py-4">
                  No recent uploads.
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadResume;
