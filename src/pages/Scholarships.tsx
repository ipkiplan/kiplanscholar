import { getScholarships } from "../lib/scholarships";
import { mapSupabaseScholarship } from "../utils/mapScholarship";
import { notifyError } from "../lib/notifications";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Award,
  X,
  ChevronRight,
  CheckCircle,
  ExternalLink,
  Sparkles,
  BookOpen,
  Info,
  DollarSign,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EnrichedOpportunity } from "../components/results/types";
import SortDropdown, { SortOption } from "../components/results/SortDropdown";
import FilterBar from "../components/results/FilterBar";
import FilterSidebar from "../components/results/FilterSidebar";
import OpportunityGrid from "../components/results/OpportunityGrid";
import StatisticsBar from "../components/results/StatisticsBar";
import Pagination from "../components/results/Pagination";
import LoadMore from "../components/results/LoadMore";

interface ScholarshipsProps {
  selectedScholarshipId: string | null;
  setSelectedScholarshipId: (id: string | null) => void;
  setCurrentTab: (tab: string) => void;
}

const INITIAL_FILTERS = {
  country: "All",
  type: "All",
  level: "All",
  funding: "All",
  status: "All",
  intake: "All",
  gender: "All",
  targetGroup: "All",
  subject: "All",
  orgType: "All",
  showSavedOnly: false,
};

// ES-004 / B3: "Required Application Documents" and "Success &
// Application Tips" in the Detail Panel have no backing schema data —
// their source arrays are always empty, so those sections currently
// never render. Per Chief Architect direction, this is temporarily
// hidden rather than removed: Schema v2 is expected to add real
// Application Documents / Application Tips / AI Guidance data, at
// which point this flag (and only this flag) needs to flip to true —
// no other code changes should be needed.
const SHOW_UNIMPLEMENTED_DETAIL_SECTIONS = false;

export default function Scholarships({
  selectedScholarshipId,
  setSelectedScholarshipId,
  setCurrentTab,
}: ScholarshipsProps) {
  // Search-state persistence key. sessionStorage (not localStorage) per
  // requirement — survives navigation away/back and page refresh within
  // the same tab, but clears when the tab/window is closed.
  const SEARCH_STATE_KEY = "kiplan_scholarship_search_state";

  const [search, setSearch] = useState<string>(() => {
    try {
      const saved = sessionStorage.getItem(SEARCH_STATE_KEY);
      return saved ? JSON.parse(saved).search ?? "" : "";
    } catch {
      return "";
    }
  });
  const [filters, setFilters] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SEARCH_STATE_KEY);
      return saved ? { ...INITIAL_FILTERS, ...JSON.parse(saved).filters } : INITIAL_FILTERS;
    } catch {
      return INITIAL_FILTERS;
    }
  });
  // ES-004 / C1: previously defaulted to "Most Popular", which compares
  // viewsCount — always 0 for every scholarship (no view-tracking data
  // exists in the locked schema), so that sort had no real effect.
  // "Deadline" is genuinely meaningful with current data.
  const [sortBy, setSortBy] = useState<SortOption>("Deadline");
  const [opportunities, setOpportunities] = useState<EnrichedOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Mobile drawer state
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Load More state (for mobile viewport)
  const [visibleItemsCount, setVisibleItemsCount] = useState(6);

  // Details slide-over
  const [viewDetail, setViewDetail] = useState<EnrichedOpportunity | null>(null);

  // Saved/Bookmarks local state
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("saved_scholarships");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleSaveToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem("saved_scholarships", JSON.stringify(next));
      return next;
    });
  };

  const resetFilters = () => {
    setSearch("");
    setFilters(INITIAL_FILTERS);
    setCurrentPage(1);
    setVisibleItemsCount(6);
  };

  // Persist search + filters to sessionStorage on every change. This is
  // the single write path — resetFilters() above calls setSearch/
  // setFilters, so a reset is automatically captured here too, with no
  // separate clearing logic needed.
  useEffect(() => {
    try {
      sessionStorage.setItem(
        SEARCH_STATE_KEY,
        JSON.stringify({ search, filters })
      );
    } catch {
      // sessionStorage can throw in rare cases (private browsing quota,
      // etc.) — search still works in-memory for this session, it just
      // won't survive a tab close/navigation-away-and-back in that case.
    }
  }, [search, filters]);

  // Sync details from other tabs/pages
  useEffect(() => {
    if (selectedScholarshipId) {
      if (selectedScholarshipId === "all") {
        resetFilters();
      } else {
        const found = opportunities.find((opp) => opp.id === selectedScholarshipId);
        if (found) {
          setViewDetail(found);
        }
      }
      setSelectedScholarshipId(null);
    }
  }, [selectedScholarshipId]);

  // Sync filter presets from Navbar dropdown links
  useEffect(() => {
    const preset = (window as any).scholarshipFilterPreset;
    if (preset) {
      setSearch(preset.search || "");
      setFilters((prev) => ({
        ...prev,
        level: preset.level || "All",
        type: preset.category && prev.type === "All" ? "Scholarship" : prev.type,
        country: preset.country || "All",
      }));
      delete (window as any).scholarshipFilterPreset;
    }
  }, []);

   // ES-004 / D1: previously queried Supabase directly, bypassing the
   // canonical data service established during Scholarship Service
   // Consolidation. Now routes through the same single source of truth
   // every other page uses. getScholarships() already filters to
   // active=true internally, matching the previous .eq("active", true).
  useEffect(() => {
    const fetchScholarships = async () => {
      setLoading(true);
      const { data, error } = await getScholarships();

      if (error) {
        console.error("Scholarship fetch error:", error);
        notifyError(error);
        setLoading(false);
        return;
      }

      const mapped = (data || []).map(mapSupabaseScholarship);

      setOpportunities(mapped);
      setLoading(false);
    };

    fetchScholarships();
  }, []);

  // Recalculate pagination reset when filters change
  useEffect(() => {
    setCurrentPage(1);
    setVisibleItemsCount(6);
  }, [search, filters, sortBy]);

  // Filtering Logic
  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      search === "" ||
      opp.title.toLowerCase().includes(search.toLowerCase()) ||
      opp.organization.toLowerCase().includes(search.toLowerCase()) ||
      opp.provider.toLowerCase().includes(search.toLowerCase()) ||
      opp.country.toLowerCase().includes(search.toLowerCase()) ||
      opp.subjectArea.toLowerCase().includes(search.toLowerCase()) ||
      opp.opportunityType.toLowerCase().includes(search.toLowerCase()) ||
      opp.educationLevel.toLowerCase().includes(search.toLowerCase()) ||
      opp.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())) ||
      opp.eligibility.some((elig) => elig.toLowerCase().includes(search.toLowerCase())) ||
      opp.benefits.some((ben) => ben.toLowerCase().includes(search.toLowerCase()));

    const matchesCountry = filters.country === "All" || opp.country === filters.country;
    const matchesType = filters.type === "All" || opp.opportunityType === filters.type;
    const matchesLevel = filters.level === "All" || opp.educationLevel === filters.level;
    const matchesFunding = filters.funding === "All" || opp.funding === filters.funding;
    const matchesStatus = filters.status === "All" || opp.status === filters.status;
    const matchesIntake = filters.intake === "All" || opp.intake === filters.intake;
    const matchesGender = filters.gender === "All" || opp.gender === filters.gender;
    const matchesTargetGroup =
      filters.targetGroup === "All" || opp.targetGroup === filters.targetGroup;
    const matchesSubject = filters.subject === "All" || opp.subjectArea === filters.subject;
    const matchesOrgType =
      filters.orgType === "All" || opp.organizationType === filters.orgType;
    const matchesSaved = !filters.showSavedOnly || savedIds.includes(opp.id);

    return (
      matchesSearch &&
      matchesCountry &&
      matchesType &&
      matchesLevel &&
      matchesFunding &&
      matchesStatus &&
      matchesIntake &&
      matchesGender &&
      matchesTargetGroup &&
      matchesSubject &&
      matchesOrgType &&
      matchesSaved
    );
  });

  // Sorting Logic
  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    switch (sortBy) {
      case "Newest":
      case "Recently Added":
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      case "Deadline":
        // Prioritize active opportunities first, expired ones to the bottom
        if (a.daysRemaining < 0 && b.daysRemaining >= 0) return 1;
        if (b.daysRemaining < 0 && a.daysRemaining >= 0) return -1;
        return a.daysRemaining - b.daysRemaining;
      case "Closing Soon":
        const aVal = a.daysRemaining < 0 ? 9999 : a.daysRemaining;
        const bVal = b.daysRemaining < 0 ? 9999 : b.daysRemaining;
        return aVal - bVal;
      case "Highest Funding":
        const aFund = a.fullyFunded === "Yes" ? 2 : a.funding === "Grant" ? 1 : 0;
        const bFund = b.fullyFunded === "Yes" ? 2 : b.funding === "Grant" ? 1 : 0;
        return bFund - aFund;
      case "Most Popular":
        return b.viewsCount - a.viewsCount;
      case "Alphabetical (A-Z)":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  // Statistics calculation based on filtered opportunities
  const totalCount = sortedOpportunities.length;
  const openCount = opportunities.filter((o) => o.status === "Open").length;
  const closingSoonCount = opportunities.filter((o) => o.status === "Closing Soon").length;
  const uniqueCountriesCount = new Set(opportunities.map((o) => o.country)).size;

  // Pagination indexing
  const totalPages = Math.ceil(sortedOpportunities.length / itemsPerPage);
  const paginatedOpportunities = sortedOpportunities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Load more sizing (mobile layout fallback)
  const loadMoreOpportunities = sortedOpportunities.slice(0, visibleItemsCount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="opportunity-results-engine">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 font-mono tracking-wide" aria-label="Breadcrumb">
        <button
          type="button"
          onClick={() => {
            setCurrentTab("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="hover:text-nepal-blue cursor-pointer transition-colors bg-transparent border-none p-0 font-bold text-xs text-slate-400 dark:text-slate-500 font-mono"
        >
          Home
        </button>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-800 dark:text-white">Opportunity Finder</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 border-b border-slate-100 dark:border-slate-800/80 pb-6">
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-nepal-crimson dark:text-nepal-crimson-light font-mono bg-nepal-crimson/5 dark:bg-nepal-crimson-light/10 px-3.5 py-1.5 rounded-full border border-nepal-crimson/10">
            Precision Opportunity Finder
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-nepal-blue dark:text-white tracking-tight">
            Explore Verified Global Opportunities
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Connect directly with verified graduate fellowships, fully funded international scholarships, tech startup accelerators, internships, and research grants designed for Nepali leaders.
          </p>
        </div>
      </div>

      {/* Horizontal Filter Bar — primary filter presentation (ES-004B).
          Reuses the exact same filters/setFilters/search/onSearchChange
          contract; the filtering predicate below is completely
          untouched. FilterSidebar (rendered further down) is now the
          secondary "More Filters" overlay for the remaining dimensions. */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        filters={filters}
        setFilters={setFilters}
        onOpenMoreFilters={() => setIsFilterDrawerOpen(true)}
        activeFilterCount={Object.values(filters).filter((val) => val !== "All" && val !== false).length}
      />

      {/* "More Filters" overlay — same FilterSidebar component and all
          of its internal filter logic, unchanged; only its outer
          visibility wrapper changed (see FilterSidebar.tsx). */}
      <FilterSidebar
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
        savedCount={savedIds.length}
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
      />

      {/* Quick Statistics Bar — moved below the horizontal FilterBar per
          ES-004B refinement; values/props unchanged. */}
      <StatisticsBar
        totalCount={totalCount}
        openCount={openCount}
        closingSoonCount={closingSoonCount}
        countriesCount={uniqueCountriesCount}
      />

      {/* Results Area — full width, no longer constrained to an 8-column
          content area now that the sidebar is gone */}
      <div className="space-y-6">

        {/* Sorting and Summary Dropdown */}
        <SortDropdown value={sortBy} onChange={setSortBy} resultCount={totalCount} />

        {loading && opportunities.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-slate-500 dark:text-slate-400 text-sm font-medium">
            Loading opportunities...
          </div>
        ) : (
          <>
            {/* Desktop Sizing (Uses standard pagination) */}
            <div className="hidden sm:block space-y-6">
              <OpportunityGrid
                opportunities={paginatedOpportunities}
                savedIds={savedIds}
                onSaveToggle={handleSaveToggle}
                onExplore={setViewDetail}
                onResetFilters={resetFilters}
              />
              
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>

            {/* Mobile Sizing (Uses responsive layout Load-More list) */}
              <div className="block sm:hidden space-y-6">
                <OpportunityGrid
                  opportunities={loadMoreOpportunities}
                  savedIds={savedIds}
                  onSaveToggle={handleSaveToggle}
                  onExplore={setViewDetail}
                  onResetFilters={resetFilters}
                />

                <LoadMore
                  currentLoaded={loadMoreOpportunities.length}
                  totalAvailable={sortedOpportunities.length}
                  onLoadMore={() => setVisibleItemsCount((prev) => prev + 6)}
                />
              </div>
            </>
          )}

      </div>

      {/* Details Slide-Over (Modal) */}
      <AnimatePresence>
        {viewDetail && (
          <div
            className="fixed inset-0 z-50 overflow-hidden"
            aria-labelledby="slide-over-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="absolute inset-0 overflow-hidden">
              {/* Blur backdrop overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity cursor-pointer"
                onClick={() => setViewDetail(null)}
              />

              {/* Panel placement */}
              <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 26, stiffness: 190 }}
                  className="w-screen max-w-xl bg-white dark:bg-nepal-dark shadow-2xl flex flex-col h-full border-l border-slate-200/60 dark:border-slate-800/80"
                >
                  {/* Slide-over Header */}
                  <div className="px-6 py-5 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/60 flex justify-between items-start gap-4 shrink-0">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap text-[10px] font-black uppercase font-mono tracking-widest text-nepal-crimson dark:text-nepal-crimson-light mb-1">
                        <span>{viewDetail.country}</span>
                        <span>•</span>
                        <span>{viewDetail.opportunityType}</span>
                        <span>•</span>
                        <span>{viewDetail.educationLevel}</span>
                      </div>
                      <h2 id="slide-over-title" className="text-xl font-black text-nepal-blue dark:text-white leading-snug">
                        {viewDetail.title}
                      </h2>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-bold font-mono mt-0.5">
                        Provided by: {viewDetail.organization}
                      </p>
                    </div>
                    <button
                      onClick={() => setViewDetail(null)}
                      className="p-2 bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-500 rounded-xl border border-slate-200/40 dark:border-slate-700/50 cursor-pointer shadow-xs transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Slide-over Content (Scrollable) */}
                  <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                    
                    {/* General Overview Section */}
                    <div className="space-y-2">
                      <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500 font-mono flex items-center gap-1.5">
                        <Info className="h-4 w-4 text-nepal-blue" />
                        <span>Opportunity Overview</span>
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200/30 dark:border-slate-800/40">
                        {viewDetail.description}
                      </p>
                    </div>

                    {/* Metadata grid boxes */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200/30 dark:border-slate-800/40">
                        <span className="block text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 font-mono">
                          Duration
                        </span>
                        <span className="block text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-1">
                          {viewDetail.duration || "N/A"}
                        </span>
                      </div>

                      <div className="p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200/30 dark:border-slate-800/40">
                        <span className="block text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 font-mono">
                          Bond Required
                        </span>
                        <span className="block text-sm font-extrabold text-slate-700 dark:text-slate-200 mt-1">
                          {viewDetail.bondRequired === "Yes"
                            ? "Yes (Service Contract)"
                            : viewDetail.bondRequired === "No"
                            ? "No bond required"
                            : "Not specified"}
                        </span>
                      </div>
                    </div>

                    {/* Funding and Benefits Section */}
                    <div className="space-y-3.5">
                      <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500 font-mono flex items-center gap-1.5">
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                        <span>Funding Coverage & Benefits</span>
                      </h4>
                      <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl space-y-3.5">
                        <div>
                          <span className="text-[10px] uppercase font-extrabold text-slate-400 dark:text-slate-500 font-mono">
                            Total Value/Amount
                          </span>
                          <p className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                            {viewDetail.amount}
                          </p>
                        </div>
                        
                        <div className="border-t border-emerald-500/10 pt-3">
                          <span className="block text-[10px] uppercase font-extrabold text-slate-400 dark:text-slate-500 font-mono mb-2">
                            Included Items
                          </span>
                          <ul className="space-y-2">
                            {viewDetail.benefits.map((ben, idx) => (
                              <li key={idx} className="flex gap-2 text-xs text-slate-700 dark:text-slate-300">
                                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span className="leading-relaxed">{ben}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Eligibility Section */}
                    <div className="space-y-3.5">
                      <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500 font-mono flex items-center gap-1.5">
                        <Award className="h-4 w-4 text-nepal-crimson" />
                        <span>Eligibility Criteria</span>
                      </h4>
                      <ul className="space-y-2.5 bg-rose-500/2 border border-rose-500/5 p-4 rounded-2xl">
                        {viewDetail.eligibility.map((elig, idx) => (
                          <li key={idx} className="flex gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                            <CheckCircle className="h-4 w-4 text-nepal-crimson shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{elig}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Required Documents Checklist — hidden pending Schema v2, see SHOW_UNIMPLEMENTED_DETAIL_SECTIONS above */}
                    {SHOW_UNIMPLEMENTED_DETAIL_SECTIONS && viewDetail.requiredDocuments && viewDetail.requiredDocuments.length > 0 && (
                      <div className="space-y-3.5">
                        <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500 font-mono flex items-center gap-1.5">
                          <BookOpen className="h-4 w-4 text-indigo-500" />
                          <span>Required Application Documents</span>
                        </h4>
                        <ul className="space-y-2 bg-indigo-500/3 border border-indigo-500/10 p-4 rounded-2xl">
                          {viewDetail.requiredDocuments.map((doc, idx) => (
                            <li key={idx} className="flex gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                              <span className="font-mono text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-1.5 py-0.5 rounded h-5 flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <span className="leading-relaxed">{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Application Tips — hidden pending Schema v2, see SHOW_UNIMPLEMENTED_DETAIL_SECTIONS above */}
                    {SHOW_UNIMPLEMENTED_DETAIL_SECTIONS && viewDetail.applicationTips && viewDetail.applicationTips.length > 0 && (
                      <div className="space-y-3.5">
                        <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500 font-mono flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4 text-nepal-gold" />
                          <span>Success & Application Tips</span>
                        </h4>
                        <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl space-y-2.5">
                          {viewDetail.applicationTips.map((tip, idx) => (
                            <div key={idx} className="flex gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                              <span className="text-nepal-gold text-sm font-bold shrink-0">💡</span>
                              <p className="leading-relaxed font-semibold italic">{tip}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Calendar deadline info */}
                    <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200/30 dark:border-slate-800/80">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <Calendar className="h-4.5 w-4.5 text-nepal-gold" />
                        <span>Deadline:</span>
                      </span>
                      <span className="text-xs font-mono font-bold text-nepal-crimson dark:text-nepal-crimson-light bg-nepal-crimson/5 dark:bg-nepal-crimson-light/10 px-3.5 py-1 rounded-full">
                        {viewDetail.applicationDeadline}
                      </span>
                    </div>

                  </div>

                  {/* Slide-over Footer */}
                  <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/60 flex gap-3 shrink-0">
                    <button
                      onClick={() => setViewDetail(null)}
                      className="flex-grow py-3 bg-white hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer text-center"
                    >
                      Close Window
                    </button>
                    <a
                      href={viewDetail.officialWebsite || viewDetail.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-grow py-3 bg-gradient-to-r from-nepal-blue to-nepal-blue-light dark:from-nepal-crimson dark:to-nepal-crimson-light text-white text-center font-bold text-sm rounded-xl hover:opacity-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Apply on Official Website</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );

}