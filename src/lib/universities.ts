/**
 * ES-010A — University Database Foundation: service layer.
 *
 * Mirrors src/lib/scholarships.ts's pattern deliberately: every function
 * is async and returns the same { data, error } shape, even though this
 * version reads from a local in-memory array rather than Supabase. That
 * means every consumer (UniversityCard, UniversityDetail, University
 * Explorer, and any future module) is written exactly as it would be
 * against a real table — when this migrates to Supabase, only the
 * function bodies below change. No consuming component should ever
 * import UNIVERSITIES from ../data/universitiesData directly; this file
 * is the only allowed access point, exactly like getScholarships() is
 * for the scholarships table.
 *
 * University is a distinct entity from Scholarship and from Country
 * (src/data/scholarships.ts's COUNTRIES). No scholarship fields have
 * been forced into this model, and this file does not read from or
 * write to either of those data sources — see the ES-010A Completion
 * Report for the full data-integrity rationale.
 */

import { UNIVERSITIES } from "../data/universitiesData";

export type PublicPrivate = "Public" | "Private";

/**
 * Row shape of the (future) `universities` table. Optional fields use
 * `null`, never an empty string or a guessed value — every consumer
 * must render null as "Not Available" via the shared `naOr` helper
 * below, never invent a figure to fill the gap.
 */
export interface University {
  id: string;
  name: string;
  country: string; // matches Country.name in src/data/scholarships.ts's COUNTRIES, for future cross-linking (ES-010E)
  city: string;
  publicPrivate: PublicPrivate | null;
  establishedYear: number | null;
  website: string | null;
  qsRanking: number | null; // QS World University Rankings position — see qsRankingYear for the edition this number belongs to
  qsRankingYear: number | null; // The QS edition year this qsRanking value was sourced from (e.g. 2026). null whenever qsRanking is null.
  theRanking: number | null; // THE World University Rankings position — see theRankingYear for the edition this number belongs to
  theRankingYear: number | null; // The THE edition year this theRanking value was sourced from. null whenever theRanking is null.
  tuitionRange: string | null;
  language: string | null; // primary language(s) of instruction
  applicationPortal: string | null;
  mainDisciplines: string[] | null;
  englishProgrammes: string | null; // brief note on English-taught programme availability
  notes: string | null;
  active: boolean;
}

export interface UniversityResult<T> {
  data: T | null;
  error: string | null;
}

function toErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return "An unexpected error occurred while fetching university data.";
}

/** Renders any nullable field consistently as "Not Available" — the single shared formatter every University component uses, so this string is never duplicated or spelled differently across components. */
export function naOr(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "Not Available";
  return String(value);
}

/** Same convention for array fields (e.g. mainDisciplines). */
export function naOrList(value: string[] | null | undefined): string {
  if (!value || value.length === 0) return "Not Available";
  return value.join(", ");
}

/**
 * Returns all active universities. Default order is alphabetical by
 * name — a neutral, balanced ordering that doesn't put the highest-QS-
 * ranked institutions first by default (previously the only order this
 * function returned, which meant every consumer's first-screen view
 * was elite-institution-heavy regardless of the dataset's actual tier
 * balance). QS ranking remains available as an explicit sort a
 * consumer can apply via sortByQsRanking() below — nothing about the
 * underlying data changes, only the default presentation order.
 */
export async function getUniversities(): Promise<UniversityResult<University[]>> {
  try {
    const sorted = [...UNIVERSITIES]
      .filter((u) => u.active)
      .sort((a, b) => a.name.localeCompare(b.name));
    return { data: sorted, error: null };
  } catch (err) {
    return { data: null, error: toErrorMessage(err) };
  }
}

/** Returns a single university by id, or null if not found. */
export async function getUniversity(id: string): Promise<UniversityResult<University>> {
  try {
    const found = UNIVERSITIES.find((u) => u.id === id && u.active) ?? null;
    return { data: found, error: null };
  } catch (err) {
    return { data: null, error: toErrorMessage(err) };
  }
}

/**
 * Searches active universities across name, country, city, and main
 * disciplines. Case-insensitive partial match, matching any field —
 * same search semantics as searchScholarships() in lib/scholarships.ts.
 */
export async function searchUniversities(searchTerm: string): Promise<UniversityResult<University[]>> {
  try {
    const trimmed = searchTerm.trim().toLowerCase();
    if (!trimmed) return getUniversities();

    const { data } = await getUniversities();
    const filtered = (data ?? []).filter((u) => {
      const haystack = [u.name, u.country, u.city, ...(u.mainDisciplines ?? [])]
        .join(" ")
        .toLowerCase();
      return haystack.includes(trimmed);
    });
    return { data: filtered, error: null };
  } catch (err) {
    return { data: null, error: toErrorMessage(err) };
  }
}

export interface UniversityFilters {
  country?: string;
  publicPrivate?: PublicPrivate;
}

/** Filters active universities by country and/or public/private status. */
export async function filterUniversities(filters: UniversityFilters): Promise<UniversityResult<University[]>> {
  try {
    const { data } = await getUniversities();
    const filtered = (data ?? []).filter((u) => {
      if (filters.country && u.country !== filters.country) return false;
      if (filters.publicPrivate && u.publicPrivate !== filters.publicPrivate) return false;
      return true;
    });
    return { data: filtered, error: null };
  } catch (err) {
    return { data: null, error: toErrorMessage(err) };
  }
}

/** Distinct, sorted country list actually present in the dataset — for filter dropdowns, never hardcoded. */
export function distinctUniversityCountries(): string[] {
  return Array.from(new Set(UNIVERSITIES.filter((u) => u.active).map((u) => u.country))).sort();
}

/**
 * Explicit QS-ranking sort, for consumers that offer it as a chosen
 * option rather than a default (e.g. a "Sort by" control). Ranked
 * universities first (best rank first), unranked ones after, name as
 * the tiebreaker within each group. Client-side re-sort of an
 * already-fetched list — does not require a new fetch.
 */
export function sortByQsRanking(universities: University[]): University[] {
  return [...universities].sort((a, b) => {
    if (a.qsRanking !== null && b.qsRanking !== null) return a.qsRanking - b.qsRanking;
    if (a.qsRanking !== null) return -1;
    if (b.qsRanking !== null) return 1;
    return a.name.localeCompare(b.name);
  });
}