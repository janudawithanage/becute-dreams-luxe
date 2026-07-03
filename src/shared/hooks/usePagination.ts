import { useState, useMemo } from 'react';

interface UsePaginationOptions {
  pageSize?: number;
}

interface UsePaginationResult<T> {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  paginatedItems: T[];
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  getPageNumbers: () => (number | 'ellipsis')[];
}

export function usePagination<T>(
  items: T[],
  options: UsePaginationOptions = {},
): UsePaginationResult<T> {
  const { pageSize = 12 } = options;
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Reset to page 1 if current page exceeds total pages
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safePage, pageSize]);

  const setPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | 'ellipsis')[] = [1];
    if (safePage > 3) pages.push('ellipsis');
    const start = Math.max(2, safePage - 1);
    const end = Math.min(totalPages - 1, safePage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (safePage < totalPages - 2) pages.push('ellipsis');
    pages.push(totalPages);
    return pages;
  };

  return {
    currentPage: safePage,
    totalPages,
    totalItems,
    pageSize,
    paginatedItems,
    setPage,
    nextPage: () => setPage(safePage + 1),
    prevPage: () => setPage(safePage - 1),
    canGoNext: safePage < totalPages,
    canGoPrev: safePage > 1,
    getPageNumbers,
  };
}
