import React from "react";
import { Building2 } from "lucide-react";

interface ComparisonEmptyStateProps {
  selectedCount: number;
}

export default function ComparisonEmptyState({ selectedCount }: ComparisonEmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800/40">
      <div className="p-4 bg-white dark:bg-nepal-dark rounded-2xl shadow-sm mb-4">
        <Building2 className="h-8 w-8 text-slate-300 dark:text-slate-600" />
      </div>
      <h3 className="font-extrabold text-slate-700 dark:text-slate-200 text-base">
        {selectedCount === 0 ? "Select at least 2 universities to compare" : "Select 1 more university to start comparing"}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1.5 leading-relaxed">
        Choose universities from the list above — you can compare up to 4 at once, side by side.
      </p>
    </div>
  );
}