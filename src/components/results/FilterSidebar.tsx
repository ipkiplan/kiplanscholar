import React, { useState } from "react";
import {
  Filter,
  RefreshCw,
  Globe,
  Award,
  GraduationCap,
  Banknote,
  Activity,
  Calendar,
  Users,
  BookOpen,
  Building,
  ChevronDown,
  ChevronUp,
  X,
  Bookmark,
} from "lucide-react";
import { COUNTRY_FLAGS } from "./CountryBadge";

interface FilterSidebarProps {
  filters: {
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
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
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
    }>
  >;
  resetFilters: () => void;
  savedCount: number;
  isOpen: boolean; // Mobile drawer state
  onClose: () => void; // Mobile drawer close handler
}

// ES-004 Addendum: Intake and Organization Type have no backing column
// anywhere in the locked schema (mapScholarship.ts hardcodes both to a
// single static value for every scholarship). Selecting any non-"All"
// option here would silently return zero or misleading results with no
// indication why. Per Chief Architect direction, these sections are
// hidden rather than removed — the underlying filter state (in
// Scholarships.tsx's INITIAL_FILTERS) and this component's own
// `filters.intake` / `filters.orgType` props are untouched, so flipping
// these two flags to true is the only change needed once Schema v2
// adds real backing columns for either dimension.
const SHOW_INTAKE_FILTER = false;
const SHOW_ORG_TYPE_FILTER = false;

// ES-004B refinement: the "Target Candidate Group" section previously
// rendered here has been removed to eliminate duplication — this
// dimension (filters.targetGroup) is now exclusively controlled via
// the "Applicants" dropdown in the new horizontal FilterBar. The
// underlying filters.targetGroup state, its type in FilterSidebarProps,
// and the filtering predicate in Scholarships.tsx are all untouched —
// only this component's own rendered section was removed. If this
// dimension ever needs to appear in "More Filters" again, restore the
// section using filters.targetGroup / handleFilterSelect("targetGroup", ...)
// exactly as before.

export default function FilterSidebar({
  filters,
  setFilters,
  resetFilters,
  savedCount,
  isOpen,
  onClose,
}: FilterSidebarProps) {
  // Collapsible sections state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    country: true,
    type: true,
    level: true,
    funding: true,
    status: true,
    intake: false,
    gender: false,
    subject: false,
    orgType: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFilterSelect = (key: keyof typeof filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Filter option arrays
  const countries = [
    "All",
    "Australia",
    "United Kingdom",
    "United States",
    "Canada",
    "Germany",
    "Japan",
    "South Korea",
    "China",
    "Netherlands",
    "Finland",
    "Norway",
    "Sweden",
    "Switzerland",
    "France",
    "Italy",
    "European Union",
    "Global",
  ];

  const types = [
    "All",
    "Scholarship",
    "Fellowship",
    "Internship",
    "Grant",
    "Conference",
    "Exchange",
    "Research",
    "Competition",
    "Job",
    "Volunteer",
    "Summer School",
    "Training",
    "Accelerator",
    "Incubator",
  ];

  // ES-004B: previously a predefined list ("Bachelor's", "Master's",
  // "High School", etc.) that never exactly matched any real
  // degree_level value (same mismatch category as the Subject caveat
  // noted below). Now uses the actual real values, consistent with the
  // educationLevel fix in mapScholarship.ts.
  const levels = ["All", "Undergraduate", "Graduate", "PhD", "Research", "Any"];

  const fundingTypes = [
    "All",
    "Fully Funded",
    "Partially Funded",
    "Self Funded",
    "Fellowship Stipend",
    "Paid Internship",
    "Grant",
    "Prize Money",
  ];

  // ES-004B: "Opening Soon" removed — status derivation in mapScholarship.ts
  // can only ever produce Rolling/Open/Closing Soon/Closed, so this option
  // could never match anything (same category of bug already fixed in the
  // sort case during ES-004 C2, found here in the filter list too).
  const statuses = ["All", "Open", "Closing Soon", "Closed", "Rolling"];

  const intakes = [
    "All",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "Rolling Intake",
  ];

  const genders = ["All", "Women", "Men"];

  // ES-004 Addendum note: subjectArea is now derived from the real
  // field_of_study column (previously hardcoded to "Business"), so this
  // section is kept enabled per Chief Architect direction. However, the
  // pill options below are exact-match against free-text database
  // values like "Biomedical, Physical Science, Engineering" — none of
  // the 24 real scholarship records currently match any single pill
  // here exactly, so most selections will still return zero results in
  // practice. This is a genuine data/option-list mismatch, not a
  // hardcoded-field bug — flagged for a future pass (see ES-004
  // Addendum QA note), not fixed here per "smallest possible change."
  const subjects = [
    "All",
    "Engineering",
    "AI",
    "Computer Science",
    "Data Science",
    "Medicine",
    "Public Health",
    "Agriculture",
    "Business",
    "Economics",
    "Law",
    "Education",
    "Climate Change",
    "Energy",
    "Environment",
    "Architecture",
    "Arts",
    "Humanities",
  ];

  const orgTypes = [
    "All",
    "Government",
    "University",
    "NGO",
    "INGO",
    "UN Agency",
    "Development Bank",
    "Private Foundation",
  ];

  // Helper to render filter pills/select buttons
  const renderFilterList = (
    list: string[],
    currentValue: string,
    filterKey: keyof typeof filters,
    hasFlags: boolean = false
  ) => {
    return (
      <div className="flex flex-wrap gap-1.5 pt-1.5 max-h-[220px] overflow-y-auto pr-1">
        {list.map((item) => {
          const isSelected = currentValue === item;
          const flag = hasFlags && item !== "All" ? COUNTRY_FLAGS[item] || "🌐" : null;

          return (
            <button
              key={item}
              onClick={() => handleFilterSelect(filterKey, item)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                isSelected
                  ? "bg-nepal-crimson text-white border-nepal-crimson dark:bg-nepal-crimson-light dark:border-nepal-crimson-light shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200/50 dark:border-slate-800/80"
              }`}
            >
              {flag && <span className="text-[13px]">{flag}</span>}
              <span>{item}</span>
            </button>
          );
        })}
      </div>
    );
  };

  const sidebarContent = (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <h3 className="font-extrabold text-slate-800 dark:text-white flex items-center gap-2 text-sm sm:text-base">
          <Filter className="h-4.5 w-4.5 text-nepal-crimson" />
          <span>Precision Filter Panel</span>
        </h3>
        <button
          onClick={resetFilters}
          className="text-xs text-slate-400 hover:text-nepal-crimson dark:hover:text-nepal-crimson-light flex items-center gap-1 font-bold cursor-pointer transition-colors"
        >
          <RefreshCw className="h-3 w-3" /> Clear All
        </button>
      </div>

      {/* Bookmarked Filter */}
      <div className="p-3.5 bg-rose-500/5 dark:bg-rose-500/2 rounded-2xl border border-rose-500/10 flex items-center justify-between">
        <label className="flex items-center gap-2.5 cursor-pointer select-none group">
          <input
            type="checkbox"
            checked={filters.showSavedOnly}
            onChange={(e) => handleFilterSelect("showSavedOnly", e.target.checked)}
            className="rounded text-nepal-crimson focus:ring-nepal-crimson/35 h-4 w-4 border-rose-200 dark:border-rose-950 bg-white dark:bg-slate-900 cursor-pointer"
          />
          <span className="text-xs font-black uppercase text-slate-600 dark:text-slate-300 group-hover:text-nepal-crimson transition-colors flex items-center gap-1">
            <Bookmark className="h-3.5 w-3.5 text-rose-500 fill-rose-500/20" />
            Saved Bookmarks
          </span>
        </label>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-black font-mono bg-rose-500/10 text-rose-500">
          {savedCount}
        </span>
      </div>

      <div className="space-y-5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
        {/* Status Group */}
        <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <button
            onClick={() => toggleSection("status")}
            className="w-full flex justify-between items-center text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-500" /> Application Status
            </span>
            {openSections.status ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {openSections.status && renderFilterList(statuses, filters.status, "status")}
        </div>

        {/* Country Filter */}
        <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <button
            onClick={() => toggleSection("country")}
            className="w-full flex justify-between items-center text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-nepal-blue" /> Study Destination
            </span>
            {openSections.country ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {openSections.country && renderFilterList(countries, filters.country, "country", true)}
        </div>

        {/* Opportunity Type */}
        <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <button
            onClick={() => toggleSection("type")}
            className="w-full flex justify-between items-center text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Award className="h-4 w-4 text-nepal-gold" /> Opportunity Type
            </span>
            {openSections.type ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {openSections.type && renderFilterList(types, filters.type, "type")}
        </div>

        {/* Education Level */}
        <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <button
            onClick={() => toggleSection("level")}
            className="w-full flex justify-between items-center text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-indigo-500" /> Education Level
            </span>
            {openSections.level ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {openSections.level && renderFilterList(levels, filters.level, "level")}
        </div>

        {/* Funding */}
        <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <button
            onClick={() => toggleSection("funding")}
            className="w-full flex justify-between items-center text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Banknote className="h-4 w-4 text-emerald-500" /> Funding Structure
            </span>
            {openSections.funding ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {openSections.funding && renderFilterList(fundingTypes, filters.funding, "funding")}
        </div>

        {/* Intake — hidden pending Schema v2, see SHOW_INTAKE_FILTER above */}
        {SHOW_INTAKE_FILTER && (
          <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
            <button
              onClick={() => toggleSection("intake")}
              className="w-full flex justify-between items-center text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-teal-500" /> Intake Session
              </span>
              {openSections.intake ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {openSections.intake && renderFilterList(intakes, filters.intake, "intake")}
          </div>
        )}

        {/* Gender */}
        <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <button
            onClick={() => toggleSection("gender")}
            className="w-full flex justify-between items-center text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-fuchsia-500" /> Gender Preference
            </span>
            {openSections.gender ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {openSections.gender && renderFilterList(genders, filters.gender, "gender")}
        </div>

        {/* Subject Area — kept enabled: subjectArea is now real data, not
            hardcoded. See ES-004 Addendum note above the `subjects` array
            regarding the exact-match/free-text data mismatch caveat. */}
        <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <button
            onClick={() => toggleSection("subject")}
            className="w-full flex justify-between items-center text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-violet-500" /> Subject / Academic Field
            </span>
            {openSections.subject ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {openSections.subject && renderFilterList(subjects, filters.subject, "subject")}
        </div>

        {/* Organization Type — hidden pending Schema v2, see SHOW_ORG_TYPE_FILTER above */}
        {SHOW_ORG_TYPE_FILTER && (
          <div className="pb-4">
            <button
              onClick={() => toggleSection("orgType")}
              className="w-full flex justify-between items-center text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Building className="h-4 w-4 text-amber-500" /> Provider Organization
              </span>
              {openSections.orgType ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {openSections.orgType && renderFilterList(orgTypes, filters.orgType, "orgType")}
          </div>
        )}
      </div>
    </div>
  );

  return (
    // ES-004B: previously rendered as an always-visible sticky sidebar
    // on desktop (`hidden lg:block ... sticky`) plus a separate
    // mobile-only slide-in drawer. Now that the horizontal FilterBar is
    // the primary filter UI, this component serves as the secondary
    // "More Filters" panel on both desktop and mobile — same drawer
    // JSX and internal filter logic, unchanged, just no longer gated
    // to mobile-only (`lg:hidden` removed) and the old always-visible
    // desktop block removed.
    <div
      className={`fixed inset-0 z-50 flex justify-end transition-all duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Dark backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`relative w-full max-w-sm h-full bg-white dark:bg-nepal-dark border-l border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between shadow-2xl transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800 rounded-xl text-slate-500 cursor-pointer hover:text-rose-500"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        <div className="flex-1 mt-6 overflow-hidden">{sidebarContent}</div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex gap-3 shrink-0">
          <button
            onClick={resetFilters}
            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs rounded-xl border border-slate-200/40 dark:border-slate-800/80 cursor-pointer"
          >
            Reset Filters
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gradient-to-r from-nepal-crimson to-nepal-crimson-light text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer"
          >
            Apply Filter Presets
          </button>
        </div>
      </div>
    </div>
  );
}