import React from "react";
import { Star, X } from "lucide-react";
import { CalendarFilterState, INITIAL_CALENDAR_FILTERS, MONTH_NAMES } from "./calendarUtils";

interface CalendarFiltersProps {
  filters: CalendarFilterState;
  onChange: (filters: CalendarFilterState) => void;
  countries: string[];
  degreeLevels: string[];
  fundingTypes: string[];
  showMonthFilter: boolean;
}

const selectClass =
  "px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-nepal-crimson cursor-pointer";

export default function CalendarFilters({
  filters,
  onChange,
  countries,
  degreeLevels,
  fundingTypes,
  showMonthFilter,
}: CalendarFiltersProps) {
  const hasActiveFilters =
    filters.country ||
    filters.degreeLevel ||
    filters.fundingType ||
    filters.month !== null ||
    filters.featuredOnly ||
    filters.deadlineWithinDays !== null;

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <select
        className={selectClass}
        value={filters.country ?? ""}
        onChange={(e) => onChange({ ...filters, country: e.target.value || null })}
      >
        <option value="">All Countries</option>
        {countries.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select
        className={selectClass}
        value={filters.degreeLevel ?? ""}
        onChange={(e) => onChange({ ...filters, degreeLevel: e.target.value || null })}
      >
        <option value="">All Degree Levels</option>
        {degreeLevels.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <select
        className={selectClass}
        value={filters.fundingType ?? ""}
        onChange={(e) => onChange({ ...filters, fundingType: e.target.value || null })}
      >
        <option value="">All Funding Types</option>
        {fundingTypes.map((f) => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>

      {showMonthFilter && (
        <select
          className={selectClass}
          value={filters.month === null ? "" : String(filters.month)}
          onChange={(e) => onChange({ ...filters, month: e.target.value === "" ? null : Number(e.target.value) })}
        >
          <option value="">All Months</option>
          {MONTH_NAMES.map((m, idx) => (
            <option key={m} value={idx}>{m}</option>
          ))}
        </select>
      )}

      <button
        type="button"
        onClick={() => onChange({ ...filters, featuredOnly: !filters.featuredOnly })}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
          filters.featuredOnly
            ? "bg-nepal-gold/10 text-nepal-gold border-nepal-gold/30"
            : "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200/60 dark:border-slate-800"
        }`}
      >
        <Star className="h-3.5 w-3.5" fill={filters.featuredOnly ? "currentColor" : "none"} />
        Featured Only
      </button>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => onChange(INITIAL_CALENDAR_FILTERS)}
          className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-nepal-crimson dark:text-nepal-crimson-light hover:underline cursor-pointer"
        >
          <X className="h-3.5 w-3.5" /> Clear Filters
        </button>
      )}
    </div>
  );
}