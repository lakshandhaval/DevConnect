import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as appApi from '../../api/applications.api';
import * as jobsApi from '../../api/jobs.api';
import { Job } from '../../types';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { LayoutDashboard, Briefcase, FileText, TrendingUp, Plus, Edit, Trash2, Users, ChevronRight } from 'lucide-react';
import { formatDate } from '../../utils/format';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState<{ totalJobs: number; totalApplications: number; appsPerJob: any[] } | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      appApi.getAdminStats(),
      jobsApi.getJobs({ limit: 50 }),
    ]).then(([statsRes, jobsRes]) => {
      setStats(statsRes.data.data);
      setJobs(jobsRes.data.data.jobs);
    }).catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (jobId: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await jobsApi.deleteJob(jobId);
      setJobs(prev => prev.filter(j => j.id !== jobId));
      toast.success('Job deleted');
    } catch {
      toast.error('Failed to delete job');
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-brand-400" /> Admin Dashboard
          </h1>
          <p className="text-gray-400 mt-1">Manage jobs, review applications, track metrics</p>
        </div>
        <Link to="/admin/jobs/new" className="btn-primary">
          <Plus className="w-4 h-4" /> Post New Job
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card glow-brand">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Jobs</p>
              <p className="text-3xl font-bold text-white mt-1">{stats?.totalJobs ?? 0}</p>
            </div>
            <div className="w-12 h-12 bg-brand-900/50 border border-brand-700 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-brand-400" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Applications</p>
              <p className="text-3xl font-bold text-white mt-1">{stats?.totalApplications ?? 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-900/30 border border-green-800 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Avg Apps / Job</p>
              <p className="text-3xl font-bold text-white mt-1">
                {stats?.totalJobs ? (stats.totalApplications / stats.totalJobs).toFixed(1) : '0'}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-900/30 border border-purple-800 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jobs list */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">All Job Postings</h2>
          </div>
          <div className="space-y-2">
            {jobs.map(job => (
              <div key={job.id} className="card-hover flex items-center gap-4">
                <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {job.company[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{job.title}</p>
                  <p className="text-xs text-gray-400">{job.company} · {job.location} · {formatDate(job.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link to={`/admin/jobs/${job.id}/applications`} className="btn-ghost text-xs py-1.5 px-2.5 gap-1">
                    <Users className="w-3.5 h-3.5" /> Applicants
                  </Link>
                  <Link to={`/admin/jobs/${job.id}/edit`} className="btn-ghost text-xs py-1.5 px-2.5">
                    <Edit className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(job.id, job.title)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-900/20 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <Link to={`/jobs/${job.id}`} className="text-gray-500 hover:text-brand-400 p-1.5">
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
            {jobs.length === 0 && (
              <div className="card text-center py-12">
                <Briefcase className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400">No jobs posted yet</p>
                <Link to="/admin/jobs/new" className="btn-primary mt-3">Post First Job</Link>
              </div>
            )}
          </div>
        </div>

        {/* Top jobs by applications */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Top Jobs by Applications</h2>
          <div className="space-y-2">
            {stats?.appsPerJob.slice(0, 8).map((item, i) => (
              <div key={item.jobId} className="card py-3 px-4 flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500 w-5">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{item.jobTitle}</p>
                  <p className="text-xs text-gray-400">{item.company}</p>
                </div>
                <span className="badge-blue flex-shrink-0">{item.count} apps</span>
              </div>
            ))}
            {!stats?.appsPerJob.length && (
              <div className="card text-center py-8">
                <p className="text-gray-500 text-sm">No applications yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
