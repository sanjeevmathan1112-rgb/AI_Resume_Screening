import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Card, StatusBadge, ScoreBadge } from '../../components/UI';
import { User, Briefcase, GraduationCap, Mail, Phone, CheckCircle2, Award, GitCompare } from 'lucide-react';

const CandidateCompare = () => {
  const [candidates, setCandidates] = useState([]);
  const [id1, setId1] = useState('');
  const [id2, setId2] = useState('');
  const [cand1, setCand1] = useState(null);
  const [cand2, setCand2] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await api.get('/candidates');
        setCandidates(res.data);
        if (res.data.length >= 2) {
          setId1(res.data[0]._id);
          setId2(res.data[1]._id);
        } else if (res.data.length === 1) {
          setId1(res.data[0]._id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  useEffect(() => {
    if (id1) {
      api.get(`/candidates/${id1}`)
        .then(res => setCand1(res.data))
        .catch(err => console.error(err));
    } else {
      setCand1(null);
    }
  }, [id1]);

  useEffect(() => {
    if (id2) {
      api.get(`/candidates/${id2}`)
        .then(res => setCand2(res.data))
        .catch(err => console.error(err));
    } else {
      setCand2(null);
    }
  }, [id2]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-xs text-[#64748B] dark:text-[#CBD5E1]">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#14B8A6] mr-2" />
        Loading candidates for comparison...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
          Side-by-Side Candidate Comparison
        </h2>
        <p className="text-xs text-[#64748B] dark:text-[#CBD5E1]">
          Compare qualifications, extracted skill sets, years of experience, and objective match scores across any two candidates.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <label className="block text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2">
            Select Candidate #1
          </label>
          <select
            value={id1}
            onChange={(e) => setId1(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#475569] bg-white dark:bg-slate-900 text-xs text-[#1E293B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
          >
            <option value="">-- Choose Candidate 1 --</option>
            {candidates.map(c => (
              <option key={c._id} value={c._id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
        </Card>

        <Card>
          <label className="block text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2">
            Select Candidate #2
          </label>
          <select
            value={id2}
            onChange={(e) => setId2(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#475569] bg-white dark:bg-slate-900 text-xs text-[#1E293B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
          >
            <option value="">-- Choose Candidate 2 --</option>
            {candidates.map(c => (
              <option key={c._id} value={c._id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
        </Card>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Candidate 1 Column */}
        <Card className="border-t-4 border-t-[#14B8A6]">
          {cand1 ? (
            <div className="space-y-5 text-xs">
              <div className="flex items-center space-x-3 pb-3 border-b border-[#E2E8F0] dark:border-[#475569]">
                <div className="h-12 w-12 rounded-xl bg-[#14B8A6]/20 text-[#14B8A6] flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {cand1.name ? cand1.name.charAt(0) : <User size={20} />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    {cand1.name}
                  </h3>
                  <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1]">{cand1.email}</p>
                </div>
              </div>

              {/* Core Attributes */}
              <div className="space-y-2 text-[#64748B] dark:text-[#CBD5E1]">
                <p className="flex items-center">
                  <Phone size={14} className="mr-2 text-slate-400" />
                  <span>Phone: <strong className="text-[#0F172A] dark:text-[#F8FAFC]">{cand1.phone || 'Not specified'}</strong></span>
                </p>
                <p className="flex items-center">
                  <Briefcase size={14} className="mr-2 text-slate-400" />
                  <span>Experience: <strong className="text-[#0F172A] dark:text-[#F8FAFC]">{cand1.totalExperience || 0} years</strong></span>
                </p>
                <p className="flex items-center">
                  <GraduationCap size={14} className="mr-2 text-slate-400" />
                  <span>Education: <strong className="text-[#0F172A] dark:text-[#F8FAFC]">{cand1.education || 'Degree'}</strong></span>
                </p>
              </div>

              {/* Skills */}
              <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#475569]">
                <p className="font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2">
                  Extracted Skills ({cand1.skills?.length || 0})
                </p>
                <div className="flex flex-wrap gap-1">
                  {cand1.skills?.map((s, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#CCFBF1] dark:bg-teal-950/60 text-[#0F766E] dark:text-[#2DD4BF] border border-teal-200 dark:border-teal-800"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Match applications */}
              {cand1.applications && cand1.applications.length > 0 && (
                <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#475569] space-y-2">
                  <p className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    Evaluated Role Applications
                  </p>
                  {cand1.applications.map(app => (
                    <div
                      key={app._id}
                      className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-[#475569] space-y-1.5"
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-[#0F172A] dark:text-[#F8FAFC]">{app.jobId?.title || 'Job Match'}</span>
                        <span className="text-[#14B8A6] font-bold text-sm">{app.overallScore}% Match</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#CBD5E1]">
                        <span>Skills: {app.skillScore}% • TF-IDF: {app.similarityScore}%</span>
                        <StatusBadge status={app.status || 'New'} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-center py-12 text-[#64748B] dark:text-[#CBD5E1] text-xs">
              Select Candidate #1 above
            </p>
          )}
        </Card>

        {/* Candidate 2 Column */}
        <Card className="border-t-4 border-t-sky-500">
          {cand2 ? (
            <div className="space-y-5 text-xs">
              <div className="flex items-center space-x-3 pb-3 border-b border-[#E2E8F0] dark:border-[#475569]">
                <div className="h-12 w-12 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {cand2.name ? cand2.name.charAt(0) : <User size={20} />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    {cand2.name}
                  </h3>
                  <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1]">{cand2.email}</p>
                </div>
              </div>

              {/* Core Attributes */}
              <div className="space-y-2 text-[#64748B] dark:text-[#CBD5E1]">
                <p className="flex items-center">
                  <Phone size={14} className="mr-2 text-slate-400" />
                  <span>Phone: <strong className="text-[#0F172A] dark:text-[#F8FAFC]">{cand2.phone || 'Not specified'}</strong></span>
                </p>
                <p className="flex items-center">
                  <Briefcase size={14} className="mr-2 text-slate-400" />
                  <span>Experience: <strong className="text-[#0F172A] dark:text-[#F8FAFC]">{cand2.totalExperience || 0} years</strong></span>
                </p>
                <p className="flex items-center">
                  <GraduationCap size={14} className="mr-2 text-slate-400" />
                  <span>Education: <strong className="text-[#0F172A] dark:text-[#F8FAFC]">{cand2.education || 'Degree'}</strong></span>
                </p>
              </div>

              {/* Skills */}
              <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#475569]">
                <p className="font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2">
                  Extracted Skills ({cand2.skills?.length || 0})
                </p>
                <div className="flex flex-wrap gap-1">
                  {cand2.skills?.map((s, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Match applications */}
              {cand2.applications && cand2.applications.length > 0 && (
                <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#475569] space-y-2">
                  <p className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    Evaluated Role Applications
                  </p>
                  {cand2.applications.map(app => (
                    <div
                      key={app._id}
                      className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-[#475569] space-y-1.5"
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-[#0F172A] dark:text-[#F8FAFC]">{app.jobId?.title || 'Job Match'}</span>
                        <span className="text-sky-600 dark:text-sky-400 font-bold text-sm">{app.overallScore}% Match</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#CBD5E1]">
                        <span>Skills: {app.skillScore}% • TF-IDF: {app.similarityScore}%</span>
                        <StatusBadge status={app.status || 'New'} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-center py-12 text-[#64748B] dark:text-[#CBD5E1] text-xs">
              Select Candidate #2 above
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CandidateCompare;
