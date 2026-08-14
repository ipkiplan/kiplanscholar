/**
 * ES-008 — Scholarship Calendar: shared types and pure helper functions.
 *
 * Deliberately built directly on `Scholarship` (src/lib/scholarships.ts,
 * the real Supabase-backed schema) rather than `EnrichedOpportunity`
 * (src/components/results/types.ts). That type currently fails to
 * resolve its base type (see the ES-006D.1 Completion Report's
 * "technical debt" note — `results/types.ts` imports `Scholarship`
 * from the broken `src/types.ts`, not from `lib/scholarships.ts`),
 * which cascades into missing-property errors anywhere it's used.
 * `Scholarship` itself resolves cleanly and already has every field
 * this module needs (id, title, organization, country, degree_level,
 * funding_type, deadline, featured, slug) — so this module reads
 * directly from the canonical schema and never touches that gap.
 *
 * No new scholarship model, no duplicated data — this only adds
 * calendar-specific *derived* fields (days remaining, urgency band)
 * computed from the real columns.
 */

import { Scholarship } from "../../lib/scholarships";

export type Urgency = "red" | "amber" | "green" | "none";

export interface CalendarScholarship extends Scholarship {
  /** Days from today until the deadline. null = no deadline (rolling admission). Negative = already closed. */
  daysRemaining: number | null;
  urgency: Urgency;
}

/** Local-date-safe "today at midnight" — avoids off-by-one issues from time-of-day components. */
function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function daysBetween(from: Date, to: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((to.getTime() - from.getTime()) / msPerDay);
}

/**
 * Urgency banding used by the "Upcoming Deadlines" widget:
 * red = closing within 30 days, amber = within 60, green = within 90.
 * Already-closed or far-future/rolling deadlines get "none" — they
 * still appear in Month/List views, just outside the urgency windows.
 */
export function urgencyFor(daysRemaining: number | null): Urgency {
  if (daysRemaining === null || daysRemaining < 0) return "none";
  if (daysRemaining <= 30) return "red";
  if (daysRemaining <= 60) return "amber";
  if (daysRemaining <= 90) return "green";
  return "none";
}

export function withCalendarFields(s: Scholarship): CalendarScholarship {
  const today = startOfToday();
  const daysRemaining = s.deadline ? daysBetween(today, new Date(s.deadline)) : null;
  return {
    ...s,
    daysRemaining,
    urgency: urgencyFor(daysRemaining),
  };
}

export const URGENCY_STYLES: Record<
  Exclude<Urgency, "none">,
  { dot: string; badgeBg: string; badgeText: string; label: string }
> = {
  red: {
    dot: "bg-red-500",
    badgeBg: "bg-red-500/10",
    badgeText: "text-red-600 dark:text-red-400",
    label: "Closing Soon",
  },
  amber: {
    dot: "bg-amber-500",
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-600 dark:text-amber-400",
    label: "Upcoming",
  },
  green: {
    dot: "bg-emerald-500",
    badgeBg: "bg-emerald-500/10",
    badgeText: "text-emerald-600 dark:text-emerald-400",
    label: "Open",
  },
};

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatDeadline(deadline: string | null): string {
  if (!deadline) return "Rolling Admission";
  const d = new Date(deadline);
  if (Number.isNaN(d.getTime())) return deadline;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export interface CalendarFilterState {
  country: string | null;
  degreeLevel: string | null;
  fundingType: string | null;
  month: number | null; // 0-11, matches Date#getMonth()
  featuredOnly: boolean;
  deadlineWithinDays: 30 | 60 | 90 | null;
}

export const INITIAL_CALENDAR_FILTERS: CalendarFilterState = {
  country: null,
  degreeLevel: null,
  fundingType: null,
  month: null,
  featuredOnly: false,
  deadlineWithinDays: null,
};

export function matchesFilters(s: CalendarScholarship, filters: CalendarFilterState): boolean {
  if (filters.country && s.country !== filters.country) return false;
  if (filters.degreeLevel && s.degree_level !== filters.degreeLevel) return false;
  if (filters.fundingType && s.funding_type !== filters.fundingType) return false;
  if (filters.featuredOnly && !s.featured) return false;
  if (filters.month !== null) {
    if (!s.deadline) return false;
    if (new Date(s.deadline).getMonth() !== filters.month) return false;
  }
  if (filters.deadlineWithinDays !== null) {
    if (s.daysRemaining === null || s.daysRemaining < 0 || s.daysRemaining > filters.deadlineWithinDays) {
      return false;
    }
  }
  return true;
}

/** Distinct, sorted option lists for filter dropdowns — derived from real loaded data, never hardcoded. */
export function distinctOptions(scholarships: Scholarship[]) {
  const countries = new Set<string>();
  const degreeLevels = new Set<string>();
  const fundingTypes = new Set<string>();
  scholarships.forEach((s) => {
    if (s.country) countries.add(s.country);
    if (s.degree_level) degreeLevels.add(s.degree_level);
    if (s.funding_type) fundingTypes.add(s.funding_type);
  });
  return {
    countries: Array.from(countries).sort(),
    degreeLevels: Array.from(degreeLevels).sort(),
    fundingTypes: Array.from(fundingTypes).sort(),
  };
}