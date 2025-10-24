'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MoviesPagination as PaginationData } from '@/store/slices/moviesSlice';
import { generatePageNumbers } from '@/lib/utils';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

interface MoviesPaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
}

export function MoviesPagination({ pagination, onPageChange }: MoviesPaginationProps) {
  const { page: currentPage, totalPages, hasPrev, hasNext } = pagination;
  const pageNumbers = generatePageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center space-x-4">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className="pagination-button"
      >
        <ChevronLeft className="pagination-icon" />
        <span className="pagination-button-text">Prev</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-2">
        {pageNumbers.map((pageNum, index) => {
          if (pageNum === -1) {
            return (
              <span key={`ellipsis-${index}`} className="text-text-muted px-2">
                ...
              </span>
            );
          }

          const isActive = pageNum === currentPage;
          
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`pagination-page-button ${isActive ? 'active' : 'inactive'}`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className="pagination-button"
      >
        <span className="pagination-button-text">Next</span>
        <ChevronRight className="pagination-icon" />
      </button>
    </div>
  );
}
