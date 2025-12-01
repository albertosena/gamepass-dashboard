import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationState } from '../../types';

interface PaginationProps {
    pagination: PaginationState;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ pagination, onPageChange }) => {
    const { currentPage, totalPages, totalItems, itemsPerPage } = pagination;

    if (totalPages <= 1) {
        return null;
    }

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 7;

        if (totalPages <= maxVisible) {
            // Show all pages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show first, last, and pages around current
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-4 py-3 bg-xbox-light rounded-lg border border-white/5">
            {/* Info */}
            <div className="text-sm text-gray-400">
                Showing <span className="font-medium text-white">{startItem}</span> to{' '}
                <span className="font-medium text-white">{endItem}</span> of{' '}
                <span className="font-medium text-white">{totalItems}</span> games
            </div>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-xbox-dark text-gray-300 hover:text-white"
                    aria-label="Previous page"
                >
                    <ChevronLeft size={18} />
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                        {page === '...' ? (
                            <span className="px-3 py-2 text-gray-500">...</span>
                        ) : (
                            <button
                                onClick={() => onPageChange(page as number)}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === page
                                        ? 'bg-xbox-green text-white'
                                        : 'text-gray-300 hover:bg-xbox-dark hover:text-white'
                                    }`}
                            >
                                {page}
                            </button>
                        )}
                    </React.Fragment>
                ))}

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-xbox-dark text-gray-300 hover:text-white"
                    aria-label="Next page"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};
