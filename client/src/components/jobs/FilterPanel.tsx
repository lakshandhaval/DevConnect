import { Skill, JobFilters } from '../../types';
import { Search, X, Filter } from 'lucide-react';
import { useState } from 'react';

interface Props {
  filters: JobFilters;
  skills: Skill[];
  onFilterChange: (filters: Partial<JobFilters>) => void;
  onReset: () => void;
}

const JOB_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'remote', label: 'Remote' },
  { value: 'contract', label: 'Contract' },
];

const FilterPanel: React.FC<Props> = ({ filters, skills, onFilterChange, onReset }) => {
  const [showMobile, setShowMobile] = useState(false);

  const hasActiveFilters = !!(
    filters.search || filters.location || filters.jobType || filters.skillId ||
    filters.salaryMin || filters.salaryMax
  );

  const filterContent = (
    <div className="space-y-5">
      {/* Search */}
      <div>
        <label className="label">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Title, company..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            className="input-field !pl-10"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="label">Location</label>
        <input
          type="text"
          placeholder="City, state..."
          value={filters.location || ''}
          onChange={(e) => onFilterChange({ location: e.target.value, page: 1 })}
          className="input-field"
        />
      </div>

      {/* Job Type */}
      <div>
        <label className="label">Job Type</label>
        <div className="flex flex-wrap gap-2">
          {JOB_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => onFilterChange({ jobType: t.value as any, page: 1 })}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                (filters.jobType || '') === t.value
                  ? 'bg-brand-600 text-white'
                  : 'bg-surface-700 text-gray-400 hover:text-white hover:bg-surface-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Skill Filter */}
      <div>
        <label className="label">Required Skill</label>
        <select
          value={filters.skillId || ''}
          onChange={(e) => onFilterChange({ skillId: e.target.value || undefined, page: 1 })}
          className="input-field"
        >
          <option value="">All Skills</option>
          {skills.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Salary */}
      <div>
        <label className="label">Salary Range (USD/yr)</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.salaryMin || ''}
            onChange={(e) => onFilterChange({ salaryMin: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
            className="input-field"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.salaryMax || ''}
            onChange={(e) => onFilterChange({ salaryMax: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
            className="input-field"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <button onClick={onReset} className="btn-secondary w-full gap-2">
          <X className="w-4 h-4" /> Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-400" /> Filters
            </h2>
            {hasActiveFilters && (
              <span className="badge-blue">{[filters.search, filters.location, filters.jobType, filters.skillId].filter(Boolean).length} active</span>
            )}
          </div>
          {filterContent}
        </div>
      </div>

      {/* Mobile toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setShowMobile(!showMobile)}
          className={`btn-secondary w-full gap-2 ${hasActiveFilters ? 'border-brand-500 text-brand-400' : ''}`}
        >
          <Filter className="w-4 h-4" />
          {showMobile ? 'Hide Filters' : 'Show Filters'}
          {hasActiveFilters && <span className="badge-blue ml-auto">active</span>}
        </button>
        {showMobile && (
          <div className="card mt-3 animate-slide-up">
            {filterContent}
          </div>
        )}
      </div>
    </>
  );
};

export default FilterPanel;
