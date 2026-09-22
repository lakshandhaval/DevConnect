import { useState, useEffect, useCallback } from 'react';
import { Job, Skill, JobFilters, PaginatedJobs } from '../types';
import * as jobsApi from '../api/jobs.api';
import * as userApi from '../api/user.api';
import * as appApi from '../api/applications.api';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/jobs/JobCard';
import FilterPanel from '../components/jobs/FilterPanel';
import Pagination from '../components/jobs/Pagination';
import { PageLoader } from '../components/common/LoadingSpinner';
import { Briefcase, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const DEFAULT_FILTERS: JobFilters = { page: 1, limit: 10 };

const JobListing = () => {
  const { user } = useAuth();
  const [data, setData] = useState<PaginatedJobs | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<JobFilters>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await jobsApi.getJobs(filters);
      setData(res.data.data);
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  useEffect(() => {
    userApi.getAllSkills().then(r => setSkills(r.data.data)).catch(() => {});
    if (user) {
      appApi.getSavedJobs().then(r => {
        setSavedJobIds(new Set(r.data.data.map(s => s.jobId)));
      }).catch(() => {});
    }
  }, [user]);

  const handleFilterChange = (partial: Partial<JobFilters>) => {
    setFilters(prev => ({ ...prev, ...partial }));
  };

  const handleSave = async (jobId: string) => {
    if (!user) { toast.error('Sign in to save jobs'); return; }
    try {
      await jobsApi.saveJob(jobId);
      setSavedJobIds(prev => new Set([...prev, jobId]));
      toast.success('Job saved!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save job');
    }
  };

  const handleUnsave = async (jobId: string) => {
    try {
      await jobsApi.unsaveJob(jobId);
      setSavedJobIds(prev => { const n = new Set(prev); n.delete(jobId); return n; });
      toast.success('Removed from saved');
    } catch {
      toast.error('Failed to remove');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="mb-10 animate-fade-in">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-900/50 border border-brand-700 rounded-full text-xs text-brand-300 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            {data?.total ?? '...'} opportunities available
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white">
          Find your next <span className="text-gradient">developer role</span>
        </h1>
        <p className="text-gray-400 mt-2 text-lg">Browse curated jobs at top tech companies</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0 lg:sticky lg:top-24 lg:self-start">
          <FilterPanel
            filters={filters}
            skills={skills}
            onFilterChange={handleFilterChange}
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />
        </div>

        {/* Job list */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <PageLoader />
          ) : !data || data.jobs.length === 0 ? (
            <div className="card text-center py-16">
              <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white">No jobs found</h3>
              <p className="text-gray-400 mt-1">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-400">
                  Showing <span className="text-white font-medium">{data.jobs.length}</span> of{' '}
                  <span className="text-white font-medium">{data.total}</span> jobs
                </p>
              </div>
              <div className="space-y-3 animate-fade-in">
                {data.jobs.map((job: Job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={savedJobIds.has(job.id)}
                    onSave={handleSave}
                    onUnsave={handleUnsave}
                    showSaveButton={!!user}
                  />
                ))}
              </div>
              <Pagination
                page={data.page}
                totalPages={data.totalPages}
                onPageChange={(p) => handleFilterChange({ page: p })}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListing;
