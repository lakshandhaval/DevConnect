import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SavedJob } from '../types';
import * as appApi from '../api/applications.api';
import * as jobsApi from '../api/jobs.api';
import { PageLoader } from '../components/common/LoadingSpinner';
import { Bookmark, MapPin, DollarSign, Briefcase, Trash2 } from 'lucide-react';
import { formatSalary, timeAgo, jobTypeBadgeColor } from '../utils/format';
import toast from 'react-hot-toast';

const SavedJobs = () => {
  const [saved, setSaved] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appApi.getSavedJobs()
      .then(r => setSaved(r.data.data))
      .catch(() => toast.error('Failed to load saved jobs'))
      .finally(() => setLoading(false));
  }, []);

  const handleUnsave = async (e: React.MouseEvent, savedJob: SavedJob) => {
    e.preventDefault();
    try {
      await jobsApi.unsaveJob(savedJob.jobId);
      setSaved(prev => prev.filter(s => s.id !== savedJob.id));
      toast.success('Removed from saved jobs');
    } catch {
      toast.error('Failed to remove');
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="page-header">
        <h1 className="section-title flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-brand-400" /> Saved Jobs
        </h1>
        <p className="text-gray-400 mt-1">{saved.length} saved job{saved.length !== 1 ? 's' : ''}</p>
      </div>

      {saved.length === 0 ? (
        <div className="card text-center py-16">
          <Bookmark className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">No saved jobs yet</h3>
          <p className="text-gray-400 mt-1 mb-4">Bookmark jobs you're interested in for easy access</p>
          <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {saved.map((savedJob) => (
            <Link key={savedJob.id} to={`/jobs/${savedJob.jobId}`} className="block">
              <div className="card-hover group relative">
                <button
                  onClick={(e) => handleUnsave(e, savedJob)}
                  className="absolute top-4 right-4 p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-900/20 transition-all z-10"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-start gap-4 pr-10">
                  <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                    {savedJob.job.company[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white group-hover:text-brand-300 transition-colors">
                      {savedJob.job.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-0.5">{savedJob.job.company}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {savedJob.job.location}
                      </span>
                      {(savedJob.job.salaryMin || savedJob.job.salaryMax) && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" /> {formatSalary(savedJob.job.salaryMin, savedJob.job.salaryMax)}
                        </span>
                      )}
                      <span className={`badge ${jobTypeBadgeColor(savedJob.job.jobType)}`}>{savedJob.job.jobType}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {savedJob.job.skills.slice(0, 4).map(s => (
                        <span key={s.id} className="badge-blue">{s.name}</span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Saved {timeAgo(savedJob.createdAt)}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
