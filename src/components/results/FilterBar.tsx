import React, { useState, useEffect } from "react";
import { Search, Filter, ChevronDown, Users, GraduationCap, Banknote, Award, Calendar } from "lucide-react";

// Same filters shape as FilterSidebarProps["filters"] — intentionally
// duplicated as a type only (no state, no logic) since no shared types
// module currently exists for this. If one is introduced later, both
// FilterBar and FilterSidebar should import from it instead.
interface FiltersState {
  country: string;
  type: string;
  level: string;
  funding: string;
  status: string;
  intake: string;
  gender: string;
  targetGroup: string;
  subject: string;
  orgType: string;
  showSavedOnly: boolean;
}

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
  onOpenMoreFilters: () => void;
  activeFilterCount: number;
}

// ES-004B: option lists below intentionally mirror the same arrays
// defined in FilterSidebar.tsx (targetGroups, levels, fundingTypes,
// types, statuses). They are presentation-layer option lists, not
// state — duplicating them here avoids modifying FilterSidebar.tsx or
// introducing a shared constants file, per "smallest possible change."
// If a shared constants module is introduced later, both components
// should read from it instead.
//
// Opportunity Explorer Frontend Taxonomy Correction (Production Owner
// LOCKED spec): each primary dropdown option is now { value, label } —
// `value` is what actually flows into filters state and is compared
// against real Supabase data (unchanged filtering predicate in
// Scholarships.tsx, untouched), `label` is the user-facing text. This
// lets the Education dropdown display "Master's" while the underlying
// filter value stays "Graduate" (the real degree_level string), and
// likewise "Competition / Award" while the value stays "Competition"
// (the real opportunity_type string) — no database change, no change
// to the filtering predicate itself.
interface FilterOption {
  value: string;
  label: string;
}

// LOCKED primary Applicants taxonomy (Production Owner acceptance
// review). Specialized professions (Teachers, Doctors, Lawyers,
// Engineers, Government Employees, etc.) intentionally removed from
// this primary list — they remain fully available, unchanged, in
// FilterSidebar.tsx's "More Filters" drawer.
//
// KNOWN LIMITATION, discovered during required pre-implementation
// investigation, reported per "stop and report separately" rather than
// silently patched: the real target_group column stores compound,
// semicolon-joined values (e.g. "Women; Researchers", "Nepali
// Students; Professionals") and the existing filtering predicate in
// Scholarships.tsx does an exact string match
// (opp.targetGroup === filters.targetGroup). This means:
//   - "Professionals", "Entrepreneurs", "Researchers" work correctly
//     today (they exist as clean standalone values in real data).
//   - "Students" is mapped to the real value "Nepali Students" (exists
//     standalone on 3 records) rather than a fictional "Students"
//     value — partial coverage, since 4 further records have "Nepali
//     Students" only as part of a compound string and won't match.
//   - "Women" has NO standalone match in real data at all (only
//     compound values like "Women; Researchers" exist) — selecting it
//     will currently return zero results. This is a pre-existing
//     exact-match-on-compound-field limitation, not something this
//     task's scope (frontend taxonomy/terminology only, no filtering
//     engine changes) authorizes fixing. Flagged for separate,
//     deliberate follow-up.
const APPLICANTS_OPTIONS: FilterOption[] = [
  { value: "All", label: "All" },
  { value: "Nepali Students", label: "Students" },
  { value: "Women", label: "Women" },
  { value: "Professionals", label: "Professionals" },
  { value: "Entrepreneurs", label: "Entrepreneurs" },
  { value: "Researchers", label: "Researchers" },
];

// LOCKED primary Education taxonomy. Values are the real degree_level
// strings (unchanged, matches Scholarships.tsx's existing
// opp.educationLevel === filters.level predicate exactly); labels are
// the corrected, student-facing terminology. "Graduate" -> "Master's"
// is the specific correction this task exists to make — Chevening,
// Erasmus Mundus, MEXT, GKS, and every other degree_level: "Graduate"
// record now surfaces correctly under "Master's".
const EDUCATION_OPTIONS: FilterOption[] = [
  { value: "All", label: "All" },
  { value: "Undergraduate", label: "Bachelor's" },
  { value: "Graduate", label: "Master's" },
  { value: "PhD", label: "PhD" },
  { value: "Research", label: "Research" },
  { value: "Any", label: "Any" },
];

// LOCKED primary Funding taxonomy (Production Owner acceptance
// review) — trimmed from the previous longer list (Fellowship
// Stipend, Paid Internship, Grant, Prize Money removed from this
// primary bar; those remain in FilterSidebar.tsx's full list).
// NOTE, flagged not fixed (out of scope — this exact list is
// explicitly locked by the approved spec): real funding_type data is
// currently only "Fully Funded" or "Scholarship" — "Partially Funded"
// and "Self-Funded" have no matching live records yet, and
// "Scholarship" (5 of 24 records) isn't one of the four locked options
// at all. Reported, not altered, since the spec explicitly locks this
// exact four-item list.
const FUNDING_OPTIONS: FilterOption[] = [
  { value: "All", label: "All" },
  { value: "Fully Funded", label: "Fully Funded" },
  { value: "Partially Funded", label: "Partially Funded" },
  { value: "Self-Funded", label: "Self-Funded" },
];

// LOCKED primary Programme Type taxonomy — "Core Opportunities" only.
// Values are the real opportunity_type strings from SDM-001 Track 4
// (unchanged, matches Scholarships.tsx's existing
// opp.opportunityType === filters.type predicate exactly); "Award" is
// display-only, folded into the existing "Competition" value per the
// locked "Competition / Award" label. The extended values (Internship,
// Conference, Exchange, Job, Volunteer, Summer School, Training,
// Accelerator, Incubator — including Halcyon Fellowship's real
// "Accelerator" classification from Track 4c) are intentionally not
// primary options here; they remain fully intact in the underlying
// TypeScript union (results/types.ts, untouched) and in
// FilterSidebar.tsx's full list.
const PROGRAMME_TYPE_OPTIONS: FilterOption[] = [
  { value: "All", label: "All" },
  { value: "Scholarship", label: "Scholarship" },
  { value: "Fellowship", label: "Fellowship" },
  { value: "Grant", label: "Grant" },
  { value: "Research", label: "Research" },
  { value: "Competition", label: "Competition / Award" },
];

// Deadline taxonomy — LOCKED as already-correct, unchanged from before
// this task (Production Owner: "Keep the current deadline concept...
// Do not redesign").
const DEADLINE_OPTIONS: FilterOption[] = [
  { value: "All", label: "All" },
  { value: "Open", label: "Open" },
  { value: "Closing Soon", label: "Closing Soon" },
  { value: "Closed", label: "Closed" },
  { value: "Rolling", label: "Rolling" },
];

// Approved mapping (confirmed by Product Owner):
// Applicants -> targetGroup, Education -> level, Funding -> funding,
// Programme Type -> type, Deadline -> status.
const PRIMARY_DROPDOWNS: Array<{
  key: keyof FiltersState;
  label: string;
  icon: React.ElementType;
  options: FilterOption[];
}> = [
  { key: "targetGroup", label: "Applicants", icon: Users, options: APPLICANTS_OPTIONS },
  { key: "level", label: "Education", icon: GraduationCap, options: EDUCATION_OPTIONS },
  { key: "funding", label: "Funding", icon: Banknote, options: FUNDING_OPTIONS },
  { key: "type", label: "Programme Type", icon: Award, options: PROGRAMME_TYPE_OPTIONS },
  { key: "status", label: "Deadline", icon: Calendar, options: DEADLINE_OPTIONS },
];

export default function FilterBar({
  search,
  onSearchChange,
  filters,
  setFilters,
  onOpenMoreFilters,
  activeFilterCount,
}: FilterBarProps) {
  // ES-004B: dropdown selections and search text no longer refresh
  // results immediately. `draftFilters` and `searchDraft` are local,
  // uncommitted copies. The committed `filters`/`search` state in
  // Scholarships.tsx — and the filtering predicate that reads them —
  // is only updated (via the same existing setFilters/onSearchChange
  // props) when the user clicks "Search Opportunities" or presses
  // Enter. No new/duplicate filtering logic is introduced; this only
  // changes *when* the existing setFilters/onSearchChange are called.
  const [draftFilters, setDraftFilters] = useState<FiltersState>(filters);
  const [searchDraft, setSearchDraft] = useState(search);

  // Keep drafts in sync when filters/search change from outside this
  // component (e.g. resetFilters(), navbar preset sync, the "all"
  // cross-tab reset in Scholarships.tsx, or edits made in the "More
  // Filters" drawer), so the bar always reflects the true current state
  // whenever it changes externally.
  useEffect(() => {
    setDraftFilters(filters);
  }, [filters]);

  useEffect(() => {
    setSearchDraft(search);
  }, [search]);

  const handleDropdownChange = (key: keyof FiltersState, value: string) => {
    // Updates the local draft only — does not call setFilters(), so no
    // refresh happens yet. Committed on submitFilters() below.
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  };

  const submitFilters = () => {
    // Commits both the dropdown selections and the search text in one
    // go, via the exact same setFilters/onSearchChange mechanism
    // Scholarships.tsx already provides. The filtering predicate itself
    // is untouched — only triggered explicitly now instead of on every
    // change.
    setFilters((prev) => ({ ...prev, ...draftFilters }));
    onSearchChange(searchDraft);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitFilters();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5 p-3 sm:p-3.5 bg-white dark:bg-nepal-dark rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-xs">
      {/* Five primary dropdown selectors — read/write draftFilters, not
          the committed filters prop, so selecting a value does not
          refresh results until Search is clicked or Enter is pressed. */}
      {PRIMARY_DROPDOWNS.map(({ key, label, icon: Icon, options }) => {
        const currentValue = draftFilters[key] as string;
        return (
          <div key={key} className="relative">
            <Icon className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={currentValue}
              onChange={(e) => handleDropdownChange(key, e.target.value)}
              className={`appearance-none pl-8 pr-8 py-2.5 rounded-xl border text-xs sm:text-[13px] font-bold cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-nepal-crimson/30 ${
                currentValue !== "All"
                  ? "bg-nepal-crimson/5 border-nepal-crimson/30 text-nepal-crimson dark:bg-nepal-crimson-light/10 dark:border-nepal-crimson-light/30 dark:text-nepal-crimson-light"
                  : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border-slate-200/60 dark:border-slate-800/80 text-slate-700 dark:text-slate-200"
              }`}
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.value === "All" ? label : opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        );
      })}

      {/* Search — placed immediately before the Search button and More
          Filters, in the same row. Typing only updates the local draft;
          the committed search state (and the existing filtering
          predicate in Scholarships.tsx) updates on Search click or
          Enter, via submitFilters() above. */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search opportunities..."
          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900 text-xs sm:text-[13px] font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-nepal-crimson/30 transition-colors"
        />
      </div>

      {/* Search button — explicit submit trigger, same effect as
          pressing Enter in the field above. Commits both draftFilters
          and searchDraft via the existing setFilters/onSearchChange
          props; no new filtering logic. shrink-0 keeps it from being
          squeezed by the flex-1 search input next to it. Uses standard
          Tailwind blue-600 rather than the custom nepal-crimson token —
          that token rendering blank (unstyled, invisible white-on-white)
          in the live app was the reported bug; blue-600/blue-700 are
          guaranteed to exist in any default Tailwind config. Swap back
          to nepal-crimson if/when that token is confirmed defined in
          the project's tailwind.config. */}
      <button
        type="button"
        onClick={submitFilters}
        className="shrink-0 whitespace-nowrap flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold cursor-pointer transition-colors shadow-md"
      >
        <Search className="h-4 w-4" />
        <span>Search Opportunities</span>
      </button>

      {/* More Filters — opens the existing FilterSidebar drawer, unchanged.
          Kept as the last control in the row. */}
      <button
        type="button"
        onClick={onOpenMoreFilters}
        className="relative flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
      >
        <Filter className="h-3.5 w-3.5 text-nepal-crimson" />
        <span>More Filters</span>
        {activeFilterCount > 0 && (
          <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-black font-mono bg-nepal-crimson text-white dark:bg-nepal-crimson-light">
            {activeFilterCount}
          </span>
        )}
      </button>
    </div>
  );
}