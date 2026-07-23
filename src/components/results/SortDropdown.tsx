import React from "react";
import { ArrowUpDown } from "lucide-react";

export type SortOption =
  | "Newest"
  | "Recently Added"
  | "Deadline"
  | "Opening Soon"
  | "Closing Soon"
  | "Highest Funding"
  | "Most Popular"
  | "Alphabetical (A-Z)";

interface SortDropdownProps {
  value: SortOption;
  onChange: (val: SortOption) => void;
  resultCount: number;
}

export default function SortDropdown({ value, onChange, resultCount }: SortDropdownProps) {
  const options: SortOption[] = [
    "Newest",
    "Recently Added",
    "Deadline",
    "Opening Soon",
    "Closing Soon",
    "Highest Funding",
    "Most Popular",
    "Alphabetical (A-Z)",
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-nepal-dark p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs" id="sort-dropdown-container">
      <div>
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider">
          Matches Found
        </p>
        <p className="text-base font-black text-slate-800 dark:text-white mt-0.5">
          {resultCount} {resultCount === 1 ? "Opportunity" : "Opportunities"} Available
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <label htmlFor="sort-dropdown-select" className="text-xs font-extrabold text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap flex items-center gap-1.5">
          <ArrowUpDown className="h-3.5 w-3.5 text-nepal-crimson" />
          <span>Sort By:</span>
        </label>
        <select
          id="sort-dropdown-select"
          value={value}
          onChange={(e) => onChange(e.target.value as SortOption)}
          className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-nepal-crimson focus:border-nepal-crimson cursor-pointer transition-all"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
