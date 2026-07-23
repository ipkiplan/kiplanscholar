import React from "react";
import { Search, X, HelpCircle } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  totalCount: number;
}

export default function SearchBar({ value, onChange, totalCount }: SearchBarProps) {
  const popularKeywords = [
    "Australia",
    "DAAD",
    "AI",
    "MBA",
    "Engineering",
    "Women",
    "Climate",
    "Public Health",
    "Entrepreneurship",
  ];

  return (
    <div className="space-y-3.5" id="search-container">
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
        </div>
        <input
          type="text"
          id="results-search-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by name, country, university, subject, degree, or keywords (e.g. 'Australia', 'AI', 'DAAD')..."
          className="w-full pl-12 pr-10 py-3.5 bg-white dark:bg-nepal-dark border border-slate-200 dark:border-slate-800/80 rounded-2xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-nepal-crimson/20 focus:border-nepal-crimson dark:focus:border-nepal-crimson-light shadow-xs transition-all"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute inset-y-0 right-3 flex items-center px-1 text-slate-400 hover:text-rose-500 transition-colors"
            title="Clear Search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Popular Search Tags */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 dark:text-slate-500 font-bold font-mono uppercase tracking-wider flex items-center gap-1">
          <HelpCircle className="h-3 w-3" /> Quick Suggest:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {popularKeywords.map((kw) => (
            <button
              key={kw}
              onClick={() => onChange(kw)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border cursor-pointer ${
                value.toLowerCase() === kw.toLowerCase()
                  ? "bg-nepal-crimson text-white border-nepal-crimson dark:bg-nepal-crimson-light dark:border-nepal-crimson-light"
                  : "bg-slate-100 dark:bg-slate-900/60 border-slate-200/50 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/80"
              }`}
            >
              {kw}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
