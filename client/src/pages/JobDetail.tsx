import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Job } from '../types';
import * as jobsApi from '../api/jobs.api';
import * as appApi from '../api/applications.api';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/common/LoadingSpinner';
import StatusBadge from '../components/applications/StatusBadge';
import {
  MapPin, DollarSign, Briefcase, Calendar, Building2,
  Bookmark, BookmarkCheck, ArrowLeft, Send, User
} from 'lucide-react';
import { formatSalary, formatDate, jobTypeBadgeColor } from '../utils/format';
import toast from 'react-hot-toast';

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applyModal, setApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      jobsApi.getJob(id),
      user ? appApi.getSavedJobs() : Promise.resolve(null),
      user ? appApi.getMyApplications() : Promise.resolve(null),
    ]).then(([jobRes, savedRes, appRes]) => {
      setJob(jobRes.data.data);
      if (savedRes) setIsSaved(savedRes.data.data.some(s => s.jobId === id));
      if (appRes) setHasApplied(appRes.data.data.some(a => a.jobId === id));
    }).catch(() => toast.error('Failed to load job'))
      .finally(() => setLoading(false));
  }, [id, user]);

  const toggleSave = async () => {
    if (!user) { toast.error('Sign in to save jobs'); return; }
    try {
      if (isSaved) {
        await jobsApi.unsaveJob(id!);
        setIsSaved(false);
        toast.success('Removed from saved');
      } else {
        await jobsApi.saveJob(id!);
        setIsSaved(true);
        toast.success('Job saved!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleApply = async () => {
    if (!user) { toast.error('Sign in to apply'); return; }
    setApplying(true);
    try {
      await jobsApi.applyToJob(id!, coverLetter);
      setHasApplied(true);
      setApplyModal(false);
      toast.success('Application submitted! 🎉');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!job) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold text-white">Job not found</h2>
      <Link to="/jobs" className="btn-primary mt-4">Back to Jobs</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job header */}
          <div className="card">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-lg">
                {job.company[0]}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white">{job.title}</h1>
                <div className="flex items-center gap-2 mt-1 text-gray-400">
                  <Building2 className="w-4 h-4" />
                  <span className="font-medium">{job.company}</span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-brand-400" /> {job.location}
                  </span>
                  {(job.salaryMin || job.salaryMax) && (
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      {formatSalary(job.salaryMin, job.salaryMax)}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> {formatDate(job.createdAt)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className={`badge ${jobTypeBadgeColor(job.jobType)}`}>
                    <Briefcase className="w-3 h-3 mr-1" />{job.jobType}
                  </span>
                  {job.skills.map(s => (
                    <span key={s.id} className="badge-blue">{s.name}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-4">Job Description</h2>
            <div className="prose prose-invert max-w-none">
              {job.description.split('\n').map((line, i) => (
                <p key={i} className={`text-gray-300 leading-relaxed ${line === '' ? 'mt-3' : ''}`}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card sticky top-24">
            <div className="space-y-3">
              {user ? (
                <>
                  {hasApplied ? (
                    <div className="text-center py-4">
                      <div className="text-2xl mb-2">✅</div>
                      <p className="font-semibold text-white">Already Applied</p>
                      <p className="text-sm text-gray-400 mt-1">Check your application status</p>
                      <Link to="/applications" className="btn-secondary w-full mt-3 justify-center">
                        View Applications
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={() => setApplyModal(true)}
                      className="btn-primary w-full justify-center py-3"
                    >
                      <Send className="w-4 h-4" /> Apply Now
                    </button>
                  )}

                  <button
                    onClick={toggleSave}
                    className={`w-full justify-center ${isSaved ? 'btn-secondary text-brand-400 border-brand-600' : 'btn-secondary'}`}
                  >
                    {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    {isSaved ? 'Saved' : 'Save Job'}
                  </button>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-sm mb-3">Sign in to apply or save this job</p>
                  <Link to="/login" className="btn-primary w-full justify-center">
                    Sign In to Apply
                  </Link>
                </div>
              )}
            </div>

            <div className="divider my-4" />

            {/* Posted by */}
            {job.postedBy && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <User className="w-4 h-4" />
                <span>Posted by <span className="text-gray-300">{job.postedBy.name}</span></span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {applyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-lg animate-slide-up">
            <h2 className="text-xl font-bold text-white mb-1">Apply to {job.title}</h2>
            <p className="text-sm text-gray-400 mb-4">{job.company}</p>

            <div>
              <label className="label">Cover Letter <span className="text-gray-500">(optional)</span></label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={6}
                placeholder="Tell them why you're a great fit..."
                className="input-field resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{coverLetter.length}/5000</p>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setApplyModal(false)} className="btn-secondary flex-1 justify-center">
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={applying}
                className="btn-primary flex-1 justify-center"
              >
                {applying ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><Send className="w-4 h-4" /> Submit Application</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
