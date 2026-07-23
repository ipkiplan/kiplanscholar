import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-6 mt-6" id="pagination-controls">
      <div className="hidden sm:block">
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
            currentPage === 1
              ? "bg-slate-50 dark:bg-slate-900 border-slate-200/40 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed"
              : "bg-white dark:bg-nepal-dark border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-nepal-crimson hover:text-nepal-crimson"
          }`}
          title="Previous Page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {getPageNumbers().map((p, idx) => {
          if (p === "...") {
            return (
              <span key={`dots-${idx}`} className="px-3 py-1.5 text-xs text-slate-400 dark:text-slate-600 font-bold font-mono">
                ...
              </span>
            );
          }
          return (
            <button
              key={`page-${p}`}
              onClick={() => onPageChange(p as number)}
              className={`min-w-[36px] h-9 rounded-xl border flex items-center justify-center text-xs font-black font-mono transition-all cursor-pointer ${
                currentPage === p
                  ? "bg-gradient-to-r from-nepal-crimson to-nepal-crimson-light text-white border-nepal-crimson dark:from-nepal-crimson-light dark:to-nepal-crimson"
                  : "bg-white dark:bg-nepal-dark border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-nepal-crimson hover:text-nepal-crimson"
              }`}
            >
              {p}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
            currentPage === totalPages
              ? "bg-slate-50 dark:bg-slate-900 border-slate-200/40 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed"
              : "bg-white dark:bg-nepal-dark border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-nepal-crimson hover:text-nepal-crimson"
          }`}
          title="Next Page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
