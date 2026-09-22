import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as jobsApi from '../../api/jobs.api';
import * as userApi from '../../api/user.api';
import { Skill } from '../../types';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { ArrowLeft, Save, Plus, X, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const JOB_TYPES = ['full-time', 'part-time', 'remote', 'contract'] as const;

const AdminJobForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = !!id && id !== 'new';

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    jobType: 'full-time' as typeof JOB_TYPES[number],
    salaryMin: '',
    salaryMax: '',
    description: '',
    skillIds: [] as string[],
  });

  useEffect(() => {
    const loadData = async () => {
      const [skillsRes] = await Promise.all([userApi.getAllSkills()]);
      setAllSkills(skillsRes.data.data);

      if (isEdit) {
        const jobRes = await jobsApi.getJob(id!);
        const job = jobRes.data.data;
        setForm({
          title: job.title,
          company: job.company,
          location: job.location,
          jobType: job.jobType,
          salaryMin: job.salaryMin?.toString() || '',
          salaryMax: job.salaryMax?.toString() || '',
          description: job.description,
          skillIds: job.skills.map(s => s.id),
        });
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    loadData().catch(() => { toast.error('Failed to load data'); setLoading(false); });
  }, [id, isEdit]);

  const toggleSkill = (skillId: string) => {
    setForm(prev => ({
      ...prev,
      skillIds: prev.skillIds.includes(skillId)
        ? prev.skillIds.filter(s => s !== skillId)
        : [...prev.skillIds, skillId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      company: form.company,
      location: form.location,
      jobType: form.jobType,
      salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
      salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
      description: form.description,
      skillIds: form.skillIds,
    };

    try {
      if (isEdit) {
        await jobsApi.updateJob(id!, payload);
        toast.success('Job updated!');
      } else {
        await jobsApi.createJob(payload);
        toast.success('Job posted!');
      }
      navigate('/admin');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save job');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  const selectedSkills = allSkills.filter(s => form.skillIds.includes(s.id));
  const availableSkills = allSkills.filter(s => !form.skillIds.includes(s.id));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <button onClick={() => navigate('/admin')} className="btn-ghost mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-brand-900/50 border border-brand-700 rounded-xl flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-brand-400" />
        </div>
        <div>
          <h1 className="section-title">{isEdit ? 'Edit Job' : 'Post New Job'}</h1>
          <p className="text-gray-400 text-sm">Fill in the details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card space-y-5">
          <h2 className="font-semibold text-white border-b border-surface-600 pb-3">Basic Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Job Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                className="input-field"
                placeholder="Senior Frontend Engineer"
                required
                minLength={3}
              />
            </div>
            <div>
              <label className="label">Company *</label>
              <input
                type="text"
                value={form.company}
                onChange={e => setForm({...form, company: e.target.value})}
                className="input-field"
                placeholder="Acme Corp"
                required
              />
            </div>
            <div>
              <label className="label">Location *</label>
              <input
                type="text"
                value={form.location}
                onChange={e => setForm({...form, location: e.target.value})}
                className="input-field"
                placeholder="San Francisco, CA or Remote"
                required
              />
            </div>
            <div>
              <label className="label">Job Type *</label>
              <select
                value={form.jobType}
                onChange={e => setForm({...form, jobType: e.target.value as any})}
                className="input-field"
              >
                {JOB_TYPES.map(t => (
                  <option key={t} value={t} className="capitalize">{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Salary Min (USD)</label>
              <input
                type="number"
                value={form.salaryMin}
                onChange={e => setForm({...form, salaryMin: e.target.value})}
                className="input-field"
                placeholder="e.g. 80000"
                min={0}
              />
            </div>
            <div>
              <label className="label">Salary Max (USD)</label>
              <input
                type="number"
                value={form.salaryMax}
                onChange={e => setForm({...form, salaryMax: e.target.value})}
                className="input-field"
                placeholder="e.g. 120000"
                min={0}
              />
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-semibold text-white border-b border-surface-600 pb-3">Job Description *</h2>
          <textarea
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            rows={10}
            placeholder="Describe the role, responsibilities, requirements, and benefits..."
            className="input-field resize-none"
            required
            minLength={10}
          />
          <p className="text-xs text-gray-500">Use blank lines to separate paragraphs</p>
        </div>

        <div className="card space-y-4">
          <h2 className="font-semibold text-white border-b border-surface-600 pb-3">Required Skills</h2>

          {selectedSkills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSkill(s.id)}
                  className="flex items-center gap-1.5 badge-blue pr-1.5 hover:bg-red-900/30 hover:border-red-800 hover:text-red-300 transition-all"
                >
                  {s.name} <X className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}

          <div>
            <p className="text-xs text-gray-400 mb-2">Click to add:</p>
            <div className="flex flex-wrap gap-2">
              {availableSkills.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSkill(s.id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-gray-400 border border-surface-500 hover:border-brand-500 hover:text-brand-400 transition-all"
                >
                  <Plus className="w-3 h-3" /> {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => navigate('/admin')} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn-primary px-8">
            {saving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <><Save className="w-4 h-4" /> {isEdit ? 'Update Job' : 'Post Job'}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminJobForm;
