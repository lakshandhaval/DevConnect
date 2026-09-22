import { Link } from 'react-router-dom';
import { Job } from '../../types';
import { MapPin, DollarSign, Briefcase, Clock, Bookmark, BookmarkCheck } from 'lucide-react';
import { formatSalary, timeAgo, jobTypeBadgeColor } from '../../utils/format';

interface Props {
  job: Job;
  isSaved?: boolean;
  onSave?: (jobId: string) => void;
  onUnsave?: (jobId: string) => void;
  showSaveButton?: boolean;
}

const JobCard: React.FC<Props> = ({ job, isSaved, onSave, onUnsave, showSaveButton = true }) => {
  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      onUnsave?.(job.id);
    } else {
      onSave?.(job.id);
    }
  };

  return (
    <Link to={`/jobs/${job.id}`} className="block">
      <div className="card-hover group">
        <div className="flex items-start justify-between gap-4">
          {/* Company Avatar */}
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {job.company[0].toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-white group-hover:text-brand-300 transition-colors line-clamp-1">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-400 mt-0.5">{job.company}</p>
              </div>
              {showSaveButton && (
                <button
                  onClick={handleSaveClick}
                  className={`flex-shrink-0 p-2 rounded-lg transition-all duration-200 ${
                    isSaved
                      ? 'text-brand-400 bg-brand-900/30 hover:bg-red-900/30 hover:text-red-400'
                      : 'text-gray-500 hover:text-brand-400 hover:bg-brand-900/30'
                  }`}
                  title={isSaved ? 'Remove from saved' : 'Save job'}
                >
                  {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </button>
              )}
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {job.location}
              </span>
              {(job.salaryMin || job.salaryMax) && (
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" /> {formatSalary(job.salaryMin, job.salaryMax)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {timeAgo(job.createdAt)}
              </span>
            </div>

            {/* Job type + skills */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span className={`badge ${jobTypeBadgeColor(job.jobType)}`}>
                <Briefcase className="w-3 h-3 mr-1" />{job.jobType}
              </span>
              {job.skills.slice(0, 4).map((skill) => (
                <span key={skill.id} className="badge-blue">{skill.name}</span>
              ))}
              {job.skills.length > 4 && (
                <span className="badge-gray">+{job.skills.length - 4}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
