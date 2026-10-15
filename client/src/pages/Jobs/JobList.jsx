import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { Card, StatusBadge, Modal } from '../../components/UI';
import { Plus, Search, Eye, Edit2, Trash2, MapPin, Building, Briefcase } from 'lucide-react';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editJob, setEditJob] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', department: '', location: '', status: 'Open' });
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(jobs.filter(j => j._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete job');
    }
  };

  const openEditModal = (job) => {
    setEditJob(job);
    setEditForm({
      title: job.title || '',
      department: job.department || '',
      location: job.location || '',
      status: job.status || 'Open'
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editJob) return;
    setSavingEdit(true);
    try {
      const res = await api.put(`/jobs/${editJob._id}`, editForm);
      setJobs(jobs.map(j => j._id === editJob._id ? res.data : j));
      setEditJob(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update job');
    } finally {
      setSavingEdit(false);
    }
  };

  const filtered = jobs.filter(j =>
    j.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-xs text-[#64748B] dark:text-[#CBD5E1]">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#14B8A6] mr-2" />
        Loading jobs...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
            Job Openings ({jobs.length})
          </h2>
          <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] mt-0.5">
            Manage target roles, requirements, and candidate screening criteria.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#475569] bg-white dark:bg-slate-900 text-xs text-[#1E293B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#14B8A6] w-48 sm:w-64"
            />
          </div>
          <Link
            to="/jobs/create"
            className="px-3.5 py-1.5 rounded-lg bg-[#14B8A6] hover:bg-[#0D9488] text-white text-xs font-semibold flex items-center transition shadow-xs cursor-pointer"
          >
            <Plus size={15} className="mr-1.5" />
            <span>Create Job</span>
          </Link>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#475569] rounded-xl shadow-xs overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-[#E2E8F0] dark:border-[#475569] text-[#64748B] dark:text-[#CBD5E1] font-semibold">
                <th className="px-5 py-3.5">Job Title</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Location</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Required Skills</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#475569]">
              {filtered.map((job) => (
                <tr key={job._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{job.title}</p>
                    <p className="text-[10px] text-[#64748B] dark:text-[#CBD5E1]">Min {job.minimumExperience || 0} yrs • {job.education || 'Degree'}</p>
                  </td>
                  <td className="px-5 py-3.5 text-[#64748B] dark:text-[#CBD5E1] font-medium">
                    {job.department || 'General'}
                  </td>
                  <td className="px-5 py-3.5 text-[#64748B] dark:text-[#CBD5E1]">
                    {job.location || 'Remote'}
                  </td>
                  <td className="px-5 py-3.5 text-[#64748B] dark:text-[#CBD5E1]">
                    {job.employmentType || 'Full-time'}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1 max-w-[220px]">
                      {job.requiredSkills?.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#CCFBF1] dark:bg-teal-950/60 text-[#0F766E] dark:text-[#2DD4BF] border border-teal-200 dark:border-teal-800"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.requiredSkills?.length > 3 && (
                        <span className="text-[10px] text-[#64748B] dark:text-[#CBD5E1]">
                          +{job.requiredSkills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={job.status || 'Open'} />
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/jobs/${job._id}`}
                        title="View Candidates & Ranking"
                        className="p-1.5 rounded-md text-[#14B8A6] hover:bg-teal-50 dark:hover:bg-teal-950/40 transition"
                      >
                        <Eye size={16} />
                      </Link>
                      <button
                        onClick={() => openEditModal(job)}
                        title="Edit Job"
                        className="p-1.5 rounded-md text-[#64748B] hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(job._id)}
                        title="Delete Job"
                        className="p-1.5 rounded-md text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-xs text-[#64748B] dark:text-[#CBD5E1]">
                    No job postings found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Job Modal */}
      <Modal
        isOpen={!!editJob}
        onClose={() => setEditJob(null)}
        title="Edit Job Information"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
              Job Title
            </label>
            <input
              type="text"
              required
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#475569] bg-white dark:bg-slate-900 text-[#1E293B] dark:text-[#F8FAFC]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                Department
              </label>
              <input
                type="text"
                value={editForm.department}
                onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#475569] bg-white dark:bg-slate-900 text-[#1E293B] dark:text-[#F8FAFC]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                Location
              </label>
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#475569] bg-white dark:bg-slate-900 text-[#1E293B] dark:text-[#F8FAFC]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
              Status
            </label>
            <select
              value={editForm.status}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#475569] bg-white dark:bg-slate-900 text-[#1E293B] dark:text-[#F8FAFC]"
            >
              <option value="Open">Open (Accepting Resumes)</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-[#E2E8F0] dark:border-[#475569]">
            <button
              type="button"
              onClick={() => setEditJob(null)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingEdit}
              className="px-4 py-1.5 rounded-lg bg-[#14B8A6] hover:bg-[#0D9488] text-white font-semibold"
            >
              {savingEdit ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default JobList;
