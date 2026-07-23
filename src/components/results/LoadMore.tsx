import React from "react";
import { ArrowDown } from "lucide-react";

interface LoadMoreProps {
  currentLoaded: number;
  totalAvailable: number;
  onLoadMore: () => void;
}

export default function LoadMore({ currentLoaded, totalAvailable, onLoadMore }: LoadMoreProps) {
  if (currentLoaded >= totalAvailable) return null;

  const percentage = Math.round((currentLoaded / totalAvailable) * 100);

  return (
    <div className="flex flex-col items-center justify-center space-y-3.5 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80" id="load-more-controls">
      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider">
        Showing {currentLoaded} of {totalAvailable} Opportunities ({percentage}%)
      </p>

      {/* Modern thin progress bar */}
      <div className="w-full max-w-xs h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-nepal-blue to-nepal-crimson transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <button
        onClick={onLoadMore}
        className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl border border-slate-200/60 dark:border-slate-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95 duration-100"
      >
        <ArrowDown className="h-4 w-4 text-nepal-crimson" />
        <span>Load More Opportunities</span>
      </button>
    </div>
  );
}
