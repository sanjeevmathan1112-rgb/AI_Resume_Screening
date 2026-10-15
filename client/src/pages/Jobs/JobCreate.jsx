import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/UI';
import { ArrowLeft, Plus, Check } from 'lucide-react';

const JobCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    employmentType: 'Full-time',
    description: '',
    requiredSkills: '',
    preferredSkills: '',
    minimumExperience: 0,
    education: "Bachelor's Degree",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        preferredSkills: formData.preferredSkills.split(',').map(s => s.trim()).filter(Boolean),
        minimumExperience: parseInt(formData.minimumExperience, 10) || 0
      };
      await api.post('/jobs', payload);
      navigate('/jobs');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error creating job opening');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div>
        <Link
          to="/jobs"
          className="inline-flex items-center text-xs font-semibold text-[#14B8A6] hover:underline mb-2"
        >
          <ArrowLeft size={14} className="mr-1" /> Back to Job Openings
        </Link>
        <h2 className="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
          Post New Job Opening
        </h2>
        <p className="text-xs text-[#64748B] dark:text-[#CBD5E1]">
          Define role responsibilities and criteria used by the NLP screening algorithm.
        </p>
      </div>

      <Card>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Senior Java Developer"
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#475569] bg-white dark:bg-slate-900 text-[#1E293B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. Engineering / Data Analytics"
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#475569] bg-white dark:bg-slate-900 text-[#1E293B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Remote / New York, NY"
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#475569] bg-white dark:bg-slate-900 text-[#1E293B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                Employment Type
              </label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#475569] bg-white dark:bg-slate-900 text-[#1E293B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
              Job Description *
            </label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe core duties and expectations (used for TF-IDF contextual similarity)..."
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#475569] bg-white dark:bg-slate-900 text-[#1E293B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                Required Skills (Comma separated) *
              </label>
              <input
                type="text"
                name="requiredSkills"
                required
                value={formData.requiredSkills}
                onChange={handleChange}
                placeholder="e.g. Java, Spring Boot, SQL"
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#475569] bg-white dark:bg-slate-900 text-[#1E293B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
              />
              <p className="text-[10px] text-[#64748B] dark:text-[#CBD5E1] mt-0.5">
                Skills heavily weighted (50%) in candidate match score.
              </p>
            </div>
            <div>
              <label className="block font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                Preferred Skills (Comma separated)
              </label>
              <input
                type="text"
                name="preferredSkills"
                value={formData.preferredSkills}
                onChange={handleChange}
                placeholder="e.g. AWS, Docker, Microservices"
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#475569] bg-white dark:bg-slate-900 text-[#1E293B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
              />
              <p className="text-[10px] text-[#64748B] dark:text-[#CBD5E1] mt-0.5">
                Bonus keywords for ranking differentiation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                Minimum Experience (Years)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                name="minimumExperience"
                value={formData.minimumExperience}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#475569] bg-white dark:bg-slate-900 text-[#1E293B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">
                Required Education
              </label>
              <select
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] dark:border-[#475569] bg-white dark:bg-slate-900 text-[#1E293B] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
              >
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="Ph.D.">Ph.D.</option>
                <option value="Any Degree">Any Degree / Diploma</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-[#E2E8F0] dark:border-[#475569]">
            <button
              type="button"
              onClick={() => navigate('/jobs')}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-[#64748B] dark:text-[#CBD5E1] hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-[#14B8A6] hover:bg-[#0D9488] text-white font-bold transition shadow-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Check size={16} />
              <span>{loading ? 'Creating Job...' : 'Create Job Opening'}</span>
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default JobCreate;
