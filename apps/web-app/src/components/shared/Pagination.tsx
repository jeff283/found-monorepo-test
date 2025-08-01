'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
}

const pageRange = (start: number, end: number) => {
  return [...Array(end - start + 1)].map((_, i) => i + start);
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
}: PaginationProps) {
  const visiblePages = useMemo(() => {
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return pageRange(1, totalPages);
    }

    const startPages = [1, 2];
    const endPages = [totalPages - 1, totalPages];

    if (currentPage <= 3) {
      return [...pageRange(1, 3), 'dots', ...endPages];
    } else if (currentPage >= totalPages - 2) {
      return [...startPages, 'dots', ...pageRange(totalPages - 2, totalPages)];
    } else {
      return [1, 'dots', currentPage - 1, currentPage, currentPage + 1, 'dots', totalPages];
    }
  }, [currentPage, totalPages]);

  return (
    <div className="flex items-center justify-between py-4 px-2 text-sm flex-wrap gap-4">
      {/* Items Per Page Selector */}
      <div className="flex items-center gap-2">
        <span>Show</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="border border-muted rounded-md px-2 py-1 bg-background text-foreground"
        >
          {[10, 12, 20, 50].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Prev Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md border disabled:opacity-40"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page Number Buttons */}
        {visiblePages.map((page, idx) => {
          if (page === 'dots') {
            return (
              <span key={`dots-${idx}`} className="px-3 py-1 text-muted-foreground">
                ...
              </span>
            );
          }

          if (typeof page === 'number') {
            return (
              <button
                key={`page-${page}`}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 rounded-md border ${
                  page === currentPage
                    ? 'bg-primary text-white border-primary'
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                {page}
              </button>
            );
          }

          return null;
        })}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md border disabled:opacity-40"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
