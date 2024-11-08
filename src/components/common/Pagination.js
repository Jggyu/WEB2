// src/components/common/Pagination.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronLeft, 
  faChevronRight, 
  faEllipsis 
} from '@fortawesome/free-solid-svg-icons';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  maxVisible = 5 
}) => {
  const getPageNumbers = () => {
    let pages = [];
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    // 시작 페이지 조정
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    // 첫 페이지
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    // 중간 페이지들
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // 마지막 페이지
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 my-8">
      {/* 이전 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md transition-colors disabled:opacity-50
        disabled:cursor-not-allowed hover:bg-gray-700"
        aria-label="이전 페이지"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      {/* 페이지 번호들 */}
      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-2">
              <FontAwesomeIcon icon={faEllipsis} />
            </span>
          ) : (
            <button
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-md transition-colors
              ${currentPage === page 
                ? 'bg-netflix-red text-white' 
                : 'hover:bg-gray-700'
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      {/* 다음 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md transition-colors disabled:opacity-50
        disabled:cursor-not-allowed hover:bg-gray-700"
        aria-label="다음 페이지"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};