import React, { useEffect, useMemo, useState } from "react";
import { Building2, ArrowRight } from "lucide-react";
import { getUniversities, distinctUniversityCountries, University } from "../lib/universities";
import { buildComparisonRow } from "../components/university-comparison/comparisonEngine";
import UniversityPicker from "../components/university-comparison/UniversityPicker";
import ComparisonTable from "../components/university-comparison/ComparisonTable";
import ComparisonCards from "../components/university-comparison/ComparisonCards";
import ComparisonEmptyState from "../components/university-comparison/ComparisonEmptyState";

/**
 * ES-010C — University Comparison.
 *
 * Migrated from the retired src/data/universities.ts foundation onto
 * the canonical src/lib/universities.ts service layer (see the
 * University Modules Reconciliation Report and the ES-010C migration
 * notes). Now fetches via getUniversities() — async, matching every
 * other module in this app that reads through a service layer —
 * rather than importing a raw array directly.
 *
 * Public page (no login required), matching Country Guide / Visa
 * Preparation Hub / Scholarship Calendar's access level — this is an
 * informational comparison tool, not a personal document builder.
 *
 * Reuses the existing "select country -> jump to Opportunity Explorer,
 * pre-filtered" mechanism (onSelectCountryFilter, already used by
 * Country Guide) for the "View scholarships" links below — no new
 * navigation pattern introduced.
 */
const MAX_SELECTION = 4;

interface UniversityComparisonProps {
  onSelectCountryFilter: (countryName: string) => void;
}

export default function UniversityComparisonPage({ onSelectCountryFilter }: UniversityComparisonProps) {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      setLoading(true);
      const { data } = await getUniversities();
      setUniversities(data ?? []);
      setLoading(false);
    };
    fetchUniversities();
  }, []);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_SELECTION) return prev;
      return [...prev, id];
    });
  };

  const handleRemove = (id: string) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const selectedRows = useMemo(() => {
    return selectedIds
      .map((id) => universities.find((u) => u.id === id))
      .filter((u): u is University => !!u)
      .map(buildComparisonRow);
  }, [selectedIds, universities]);

  const uniqueCountries = useMemo(
    () => Array.from(new Set(selectedRows.map((r) => r.countryName))),
    [selectedRows]
  );

  const countryCount = useMemo(() => distinctUniversityCountries().length, []);
  const universityCount = universities.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

      {/* Page Header */}
      <div className="space-y-3 text-center md:text-left">
        <span className="text-xs font-bold uppercase tracking-widest text-nepal-crimson dark:text-nepal-crimson-light font-mono bg-nepal-crimson/5 dark:bg-nepal-crimson-light/10 px-3 py-1.5 rounded-full">
          University Comparison
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-nepal-blue dark:text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
          <Building2 className="h-8 w-8 text-nepal-crimson shrink-0" />
          Compare Universities Side by Side
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl">
          {loading
            ? "Real, verified universities. Country-level figures (tuition, living cost, visa) come from Country Guide and the Visa Preparation Hub — where a country isn't covered there yet, we say so honestly rather than guessing."
            : `Covering ${universityCount} real, verified universities across ${countryCount} countries. Country-level figures (tuition, living cost, visa) come from Country Guide and the Visa Preparation Hub — where a country isn't covered there yet, we say so honestly rather than guessing.`}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 border-3 border-nepal-crimson/20 border-t-nepal-crimson rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* University Picker */}
          <div className="bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 sm:p-7 shadow-premium">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 font-mono mb-4">
              Choose Universities (2–{MAX_SELECTION})
            </h2>
            <UniversityPicker
              universities={universities}
              selectedIds={selectedIds}
              onToggle={handleToggle}
              maxSelection={MAX_SELECTION}
            />
          </div>

          {/* Comparison Output */}
          {selectedRows.length < 2 ? (
            <ComparisonEmptyState selectedCount={selectedRows.length} />
          ) : (
            <div className="space-y-5">
              <ComparisonTable rows={selectedRows} onRemove={handleRemove} />
              <ComparisonCards rows={selectedRows} onRemove={handleRemove} />

              {/* Reuses the existing Country Guide -> Opportunity Explorer filter jump */}
              {uniqueCountries.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {uniqueCountries.map((countryName) => (
                    <button
                      key={countryName}
                      type="button"
                      onClick={() => onSelectCountryFilter(countryName)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-nepal-blue to-nepal-blue-light dark:from-nepal-crimson dark:to-nepal-crimson-light text-white font-bold text-xs rounded-xl shadow-sm hover:opacity-95 transition-all cursor-pointer"
                    >
                      View {countryName} scholarships <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}