import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Application } from '../types';
import * as appApi from '../api/applications.api';
import { PageLoader } from '../components/common/LoadingSpinner';
import StatusBadge from '../components/applications/StatusBadge';
import { FileText, MapPin, Building2, Calendar, ChevronRight } from 'lucide-react';
import { formatDate, jobTypeBadgeColor } from '../utils/format';
import toast from 'react-hot-toast';

const MyApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appApi.getMyApplications()
      .then(r => setApplications(r.data.data))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="page-header">
        <h1 className="section-title flex items-center gap-2">
          <FileText className="w-6 h-6 text-brand-400" /> My Applications
        </h1>
        <p className="text-gray-400 mt-1">{applications.length} total application{applications.length !== 1 ? 's' : ''}</p>
      </div>

      {applications.length === 0 ? (
        <div className="card text-center py-16">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">No applications yet</h3>
          <p className="text-gray-400 mt-1 mb-4">Start applying to jobs to track your progress here</p>
          <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <Link key={app.id} to={`/jobs/${app.jobId}`} className="block">
              <div className="card-hover group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                    {app.job.company[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-brand-300 transition-colors">
                          {app.job.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5 text-sm text-gray-400">
                          <Building2 className="w-3.5 h-3.5" /> {app.job.company}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <StatusBadge status={app.status} />
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-brand-400 transition-colors" />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {app.job.location}
                      </span>
                      <span className={`badge ${jobTypeBadgeColor(app.job.jobType)}`}>{app.job.jobType}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Applied {formatDate(app.createdAt)}
                      </span>
                    </div>
                    {app.coverLetter && (
                      <p className="mt-2 text-xs text-gray-500 line-clamp-1 italic">
                        "{app.coverLetter}"
                      </p>
                    )}
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

export default MyApplications;
