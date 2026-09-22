import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Application, ApplicationStatus } from '../../types';
import * as appApi from '../../api/applications.api';
import * as jobsApi from '../../api/jobs.api';
import { PageLoader } from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/applications/StatusBadge';
import { ArrowLeft, Users, Calendar, MapPin, Briefcase } from 'lucide-react';
import { formatDate, jobTypeBadgeColor } from '../../utils/format';
import toast from 'react-hot-toast';

const STATUS_OPTIONS: ApplicationStatus[] = ['applied', 'under_review', 'shortlisted', 'rejected', 'hired'];

const AdminJobApplicants = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobId) return;
    Promise.all([
      appApi.getJobApplications(jobId),
      jobsApi.getJob(jobId),
    ]).then(([appsRes, jobRes]) => {
      setApplications(appsRes.data.data);
      setJobTitle(`${jobRes.data.data.title} @ ${jobRes.data.data.company}`);
    }).catch(() => toast.error('Failed to load applicants'))
      .finally(() => setLoading(false));
  }, [jobId]);

  const updateStatus = async (appId: string, status: ApplicationStatus) => {
    try {
      await appApi.updateApplicationStatus(appId, status);
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <button onClick={() => navigate('/admin')} className="btn-ghost mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-brand-900/50 border border-brand-700 rounded-xl flex items-center justify-center">
          <Users className="w-5 h-5 text-brand-400" />
        </div>
        <div>
          <h1 className="section-title">Applicants</h1>
          <p className="text-gray-400 text-sm">{jobTitle}</p>
        </div>
        <span className="badge-blue ml-auto">{applications.length} applicant{applications.length !== 1 ? 's' : ''}</span>
      </div>

      {applications.length === 0 ? (
        <div className="card text-center py-16">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white">No applicants yet</h3>
          <p className="text-gray-400 mt-1">Applications will appear here once candidates apply</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="card">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {app.user?.name[0].toUpperCase() ?? '?'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h3 className="font-semibold text-white">{app.user?.name}</h3>
                      <p className="text-sm text-gray-400">{app.user?.email}</p>
                      <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                        {app.user?.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {app.user.location}
                          </span>
                        )}
                        {app.user?.experienceLevel && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" /> {app.user.experienceLevel}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Applied {formatDate(app.createdAt)}
                        </span>
                      </div>
                      {/* Skills */}
                      {app.user?.skills && app.user.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {app.user.skills.map(s => (
                            <span key={s.id} className="badge-blue text-xs">{s.name}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Status control */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <StatusBadge status={app.status} />
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app.id, e.target.value as ApplicationStatus)}
                        className="input-field py-1.5 text-sm w-auto"
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Cover letter */}
                  {app.coverLetter && (
                    <div className="mt-3 p-3 bg-surface-700 border border-surface-500 rounded-xl">
                      <p className="text-xs font-medium text-gray-400 mb-1">Cover Letter</p>
                      <p className="text-sm text-gray-300 line-clamp-3">{app.coverLetter}</p>
                    </div>
                  )}

                  {/* Resume link */}
                  {app.user?.resumeUrl && (
                    <a
                      href={app.user.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 mt-2 transition-colors"
                    >
                      📄 View Resume
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminJobApplicants;
