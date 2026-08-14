import React from "react";
import { X, MapPin } from "lucide-react";
import { UniversityComparisonRow, COMPARISON_CRITERIA, NOT_YET_AVAILABLE } from "./comparisonEngine";

interface ComparisonCardsProps {
  rows: UniversityComparisonRow[];
  onRemove: (id: string) => void;
}

/** Mobile/tablet view (hidden at `lg` and above) — one full card per university, stacked. */
export default function ComparisonCards({ rows, onRemove }: ComparisonCardsProps) {
  return (
    <div className="lg:hidden space-y-5">
      {rows.map((row) => (
        <div
          key={row.university.id}
          className="bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="flex items-start justify-between gap-2 p-4 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/40">
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white leading-snug">{row.university.name}</h3>
              <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                <MapPin className="h-3 w-3 shrink-0" /> {row.university.city}, {row.countryName}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onRemove(row.university.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-nepal-crimson hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              aria-label={`Remove ${row.university.name}`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {COMPARISON_CRITERIA.map((criterion) => {
              const value = criterion.getValue(row);
              const isMissing = value === NOT_YET_AVAILABLE;
              return (
                <div key={criterion.key} className="flex flex-col gap-0.5 px-4 py-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    {criterion.label}
                  </span>
                  <span className={`text-xs leading-relaxed ${isMissing ? "text-slate-400 dark:text-slate-600 italic" : "text-slate-700 dark:text-slate-200"}`}>
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}