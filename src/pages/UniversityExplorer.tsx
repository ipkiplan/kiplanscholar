import React, { useEffect, useMemo, useState } from "react";
import { Search, University as UniversityIcon } from "lucide-react";
import { getUniversities, distinctUniversityCountries, sortByQsRanking, University, PublicPrivate } from "../lib/universities";
import UniversityCard from "../components/university/UniversityCard";
import UniversityDetail from "../components/university/UniversityDetail";

/**
 * ES-010A — University Explorer (Foundation).
 *
 * This is a minimal browse experience proving UniversityCard and
 * UniversityDetail work end-to-end against the real service layer —
 * not the full-featured Explorer. Per the ES: "This ES does NOT
 * implement University Comparison" and the fuller filtering/sorting
 * experience is explicitly deferred to ES-010B. Only a basic search,
 * country filter, public/private filter, and default/QS-ranking sort
 * toggle are included here, since a flat, unfilterable grid would be
 * a poor foundation demo.
 *
 * Only imports from ../lib/universities — never from
 * ../data/universitiesData directly, per the ES's "components must not
 * import raw data directly" rule.
 */
type SortMode = "recommended" | "qsRanking";

export default function UniversityExplorer() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<PublicPrivate | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("recommended");
  const [selected, setSelected] = useState<University | null>(null);

  useEffect(() => {
    const fetchUniversities = async () => {
      setLoading(true);
      const { data } = await getUniversities();
      setUniversities(data ?? []);
      setLoading(false);
    };
    fetchUniversities();
  }, []);

  const countries = useMemo(() => distinctUniversityCountries(), []);

  // getUniversities() already returns a neutral, alphabetical-by-name
  // "recommended" default (see lib/universities.ts) — no reordering
  // needed for that mode. QS ranking is applied client-side only when
  // explicitly chosen, so it never quietly becomes the default again.
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const base = universities.filter((u) => {
      if (countryFilter && u.country !== countryFilter) return false;
      if (typeFilter && u.publicPrivate !== typeFilter) return false;
      if (!term) return true;
      const haystack = [u.name, u.city, u.country, ...(u.mainDisciplines ?? [])].join(" ").toLowerCase();
      return haystack.includes(term);
    });
    return sortMode === "qsRanking" ? sortByQsRanking(base) : base;
  }, [universities, search, countryFilter, typeFilter, sortMode]);

  const countryCount = countries.length;
  const universityCount = universities.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      <div className="space-y-3 text-center md:text-left">
        <span className="text-xs font-bold uppercase tracking-widest text-nepal-crimson dark:text-nepal-crimson-light font-mono bg-nepal-crimson/5 dark:bg-nepal-crimson-light/10 px-3 py-1.5 rounded-full">
          University Explorer
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-nepal-blue dark:text-white tracking-tight">
          Browse Universities Worldwide
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl">
          {loading
            ? "Real, verified institutions — rankings, tuition, and programme details in one place."
            : `Real, verified institutions across ${countryCount} ${countryCount === 1 ? "country" : "countries"} (${universityCount} universities) — rankings, tuition, and programme details in one place.`}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-2.5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by university, city, or discipline..."
            className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:border-nepal-crimson placeholder-slate-400"
          />
        </div>
        <select
          value={countryFilter ?? ""}
          onChange={(e) => setCountryFilter(e.target.value || null)}
          className="px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-nepal-crimson cursor-pointer"
        >
          <option value="">All Countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={typeFilter ?? ""}
          onChange={(e) => setTypeFilter((e.target.value || null) as PublicPrivate | null)}
          className="px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-nepal-crimson cursor-pointer"
        >
          <option value="">All Types</option>
          <option value="Public">Public</option>
          <option value="Private">Private</option>
        </select>
        <select
          value={sortMode}
          onChange={(e) => setSortMode(e.target.value as SortMode)}
          className="px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-nepal-crimson cursor-pointer"
          aria-label="Sort by"
        >
          <option value="recommended">Sort: Recommended</option>
          <option value="qsRanking">Sort: QS Ranking</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 border-3 border-nepal-crimson/20 border-t-nepal-crimson rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center text-center py-16 px-6 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800/40">
          <div className="p-4 bg-white dark:bg-nepal-dark rounded-2xl shadow-sm mb-4">
            <UniversityIcon className="h-8 w-8 text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="font-extrabold text-slate-700 dark:text-slate-200 text-base">No universities match your search</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1.5 leading-relaxed">
            Try a different search term, or choose "All Countries" to see the full list.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((u) => (
            <UniversityCard key={u.id} university={u} onViewDetails={() => setSelected(u)} />
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-slate-900/40 p-4 overflow-y-auto" onClick={() => setSelected(null)}>
          <div className="w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
            <UniversityDetail university={selected} onClose={() => setSelected(null)} />
          </div>
        </div>
      )}
    </div>
  );
}