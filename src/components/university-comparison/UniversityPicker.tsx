import React, { useMemo, useState } from "react";
import { CheckCircle2, MapPin, Search } from "lucide-react";
import { University } from "../../lib/universities";

interface UniversityPickerProps {
  universities: University[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  maxSelection: number;
}

const selectClass =
  "px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-nepal-crimson cursor-pointer";

export default function UniversityPicker({ universities, selectedIds, onToggle, maxSelection }: UniversityPickerProps) {
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

  const countryOptions = useMemo(() => {
    return Array.from(new Set(universities.map((u) => u.country))).sort();
  }, [universities]);

  const filtered = universities.filter((u) => {
    const matchesSearch = !search.trim() || u.name.toLowerCase().includes(search.trim().toLowerCase()) || u.city.toLowerCase().includes(search.trim().toLowerCase());
    const matchesCountry = !countryFilter || u.country === countryFilter;
    return matchesSearch && matchesCountry;
  });

  const atLimit = selectedIds.length >= maxSelection;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by university or city..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-nepal-crimson"
          />
        </div>
        <select className={selectClass} value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}>
          <option value="">All Countries</option>
          {countryOptions.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto pr-1">
        {filtered.map((u) => {
          const isSelected = selectedIds.includes(u.id);
          const disabled = !isSelected && atLimit;
          return (
            <button
              key={u.id}
              type="button"
              disabled={disabled}
              onClick={() => onToggle(u.id)}
              className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? "bg-nepal-crimson/5 border-nepal-crimson/40 dark:bg-nepal-crimson-light/10"
                  : disabled
                    ? "bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/40 opacity-50 cursor-not-allowed"
                    : "bg-white dark:bg-nepal-dark border-slate-200/60 dark:border-slate-800/60 hover:border-nepal-crimson/30"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-extrabold text-xs text-slate-800 dark:text-white leading-snug">{u.name}</h4>
                {isSelected && <CheckCircle2 className="h-4 w-4 text-nepal-crimson dark:text-nepal-crimson-light shrink-0" />}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                <MapPin className="h-3 w-3 shrink-0" />
                <span>{u.city}, {u.country}</span>
              </div>
              <span className="inline-block mt-2 text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                {u.publicPrivate ?? "Not Available"}
              </span>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-xs text-slate-400 py-8">No universities match your search.</p>
        )}
      </div>

      <p className="text-[11px] text-slate-400 dark:text-slate-500">
        {selectedIds.length} of {maxSelection} selected {atLimit && "- remove one to choose a different university"}
      </p>
    </div>
  );
}