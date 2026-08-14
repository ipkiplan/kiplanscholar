import React from "react";
import { UniversityComparisonRow, COMPARISON_CRITERIA, NOT_YET_AVAILABLE } from "./comparisonEngine";
import { X } from "lucide-react";

interface ComparisonTableProps {
  rows: UniversityComparisonRow[];
  onRemove: (id: string) => void;
}

/** Desktop-only (hidden below `lg`) — ComparisonCards covers mobile/tablet. */
export default function ComparisonTable({ rows, onRemove }: ComparisonTableProps) {
  return (
    <div className="hidden lg:block overflow-x-auto rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-900/60">
            <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono sticky left-0 bg-slate-50 dark:bg-slate-900/60 min-w-[180px]">
              Criteria
            </th>
            {rows.map((row) => (
              <th key={row.university.id} className="p-4 min-w-[220px] align-top">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="block font-extrabold text-sm text-slate-800 dark:text-white leading-snug">{row.university.name}</span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{row.university.city}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(row.university.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-nepal-crimson hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                    aria-label={`Remove ${row.university.name}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARISON_CRITERIA.map((criterion, idx) => (
            <tr key={criterion.key} className={idx % 2 === 0 ? "bg-white dark:bg-nepal-dark" : "bg-slate-50/50 dark:bg-slate-900/30"}>
              <td className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 sticky left-0 bg-inherit">
                {criterion.label}
              </td>
              {rows.map((row) => {
                const value = criterion.getValue(row);
                const isMissing = value === NOT_YET_AVAILABLE;
                return (
                  <td key={row.university.id} className="p-4 text-xs leading-relaxed align-top">
                    <span className={isMissing ? "text-slate-400 dark:text-slate-600 italic" : "text-slate-700 dark:text-slate-200"}>
                      {value}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}