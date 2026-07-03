import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPageChange: (page: number) => void;
  getPageNumbers: () => (number | 'ellipsis')[];
  className?: string;
}

export function PaginationControls({
  currentPage,
  totalPages,
  canGoPrev,
  canGoNext,
  onPageChange,
  getPageNumbers,
  className,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1', className)}
    >
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrev}
        aria-label="Go to previous page"
        className={cn(
          'flex h-9 items-center gap-1 rounded-full px-3 text-xs uppercase tracking-[0.15em] transition-all duration-200',
          canGoPrev
            ? 'hover:bg-foreground/5 text-foreground'
            : 'cursor-not-allowed opacity-30 text-muted-foreground',
        )}
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Page numbers */}
      {pageNumbers.map((page, idx) =>
        page === 'ellipsis' ? (
          <span
            key={`ellipsis-${idx}`}
            className="flex h-9 w-9 items-center justify-center text-muted-foreground"
          >
            <MoreHorizontal className="h-4 w-4" />
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={`Go to page ${page}`}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full text-sm transition-all duration-200',
              page === currentPage
                ? 'bg-foreground text-background font-medium'
                : 'hover:bg-foreground/5 text-foreground',
            )}
          >
            {page}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        aria-label="Go to next page"
        className={cn(
          'flex h-9 items-center gap-1 rounded-full px-3 text-xs uppercase tracking-[0.15em] transition-all duration-200',
          canGoNext
            ? 'hover:bg-foreground/5 text-foreground'
            : 'cursor-not-allowed opacity-30 text-muted-foreground',
        )}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </nav>
  );
}
