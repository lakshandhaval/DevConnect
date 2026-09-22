import { ApplicationStatus } from '../../types';

const STATUS_CONFIG: Record<ApplicationStatus, { label: string; className: string }> = {
  applied: { label: 'Applied', className: 'badge-blue' },
  under_review: { label: 'Under Review', className: 'badge-yellow' },
  shortlisted: { label: 'Shortlisted', className: 'badge-purple' },
  rejected: { label: 'Rejected', className: 'badge-red' },
  hired: { label: 'Hired 🎉', className: 'badge-green' },
};

const StatusBadge: React.FC<{ status: ApplicationStatus }> = ({ status }) => {
  const config = STATUS_CONFIG[status];
  return <span className={config.className}>{config.label}</span>;
};

export default StatusBadge;
