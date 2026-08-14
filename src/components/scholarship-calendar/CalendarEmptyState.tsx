import React from "react";
import { CalendarSearch } from "lucide-react";

interface CalendarEmptyStateProps {
  onClearFilters: () => void;
}

export default function CalendarEmptyState({ onClearFilters }: CalendarEmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800/40">
      <div className="p-4 bg-white dark:bg-nepal-dark rounded-2xl shadow-sm mb-4">
        <CalendarSearch className="h-8 w-8 text-slate-300 dark:text-slate-600" />
      </div>
      <h3 className="font-extrabold text-slate-700 dark:text-slate-200 text-base">
        No scholarships match your filters
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1.5 leading-relaxed">
        Try broadening your search — clear a filter, choose "All Countries" or "All Degree Levels", or switch off "Featured Only" to see more results.
      </p>
      <button
        type="button"
        onClick={onClearFilters}
        className="mt-5 px-4 py-2 bg-gradient-to-r from-nepal-blue to-nepal-blue-light dark:from-nepal-crimson dark:to-nepal-crimson-light text-white font-bold text-xs rounded-xl shadow-md hover:opacity-95 cursor-pointer"
      >
        Clear All Filters
      </button>
    </div>
  );
}