import { useState, useMemo } from 'react';

interface UsePaginationOptions {
  totalPages: number;
  initialPage?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
}

export const usePagination = ({
  totalPages,
  initialPage = 1,
}: UsePaginationOptions): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  // 경계값을 체크하는 페이지 이동 함수
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 계산된 값들을 useMemo로 최적화 (선택사항)
  const paginationInfo = useMemo(() => ({
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  }), [currentPage, totalPages]);

  const nextPage = () => {
    if (paginationInfo.hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (paginationInfo.hasPreviousPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const firstPage = () => {
    setCurrentPage(1);
  };

  const lastPage = () => {
    setCurrentPage(totalPages);
  };

  return {
    currentPage,
    totalPages,
    hasNextPage: paginationInfo.hasNextPage,
    hasPreviousPage: paginationInfo.hasPreviousPage,
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
  };
};