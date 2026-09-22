import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<Props> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1);

  const renderPages = () => {
    const result: (number | 'ellipsis')[] = [];
    visible.forEach((p, i) => {
      if (i > 0 && p - visible[i - 1] > 1) result.push('ellipsis');
      result.push(p);
    });
    return result;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="btn-secondary px-3 py-2 disabled:opacity-40"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {renderPages().map((item, i) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-500">…</span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
              item === page
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/40'
                : 'text-gray-400 hover:text-white hover:bg-surface-700'
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="btn-secondary px-3 py-2 disabled:opacity-40"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
