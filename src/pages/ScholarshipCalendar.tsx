import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, List as ListIcon } from "lucide-react";
import { getScholarships } from "../lib/scholarships";
import { notifyError } from "../lib/notifications";
import {
  withCalendarFields,
  matchesFilters,
  distinctOptions,
  INITIAL_CALENDAR_FILTERS,
  CalendarFilterState,
  CalendarScholarship,
} from "../components/scholarship-calendar/calendarUtils";
import CalendarFilters from "../components/scholarship-calendar/CalendarFilters";
import CalendarMonthView from "../components/scholarship-calendar/CalendarMonthView";
import CalendarListView from "../components/scholarship-calendar/CalendarListView";
import UpcomingDeadlines from "../components/scholarship-calendar/UpcomingDeadlines";
import ApplicationTimeline from "../components/scholarship-calendar/ApplicationTimeline";
import CalendarEmptyState from "../components/scholarship-calendar/CalendarEmptyState";

/**
 * ES-008 — Scholarship Calendar.
 *
 * Reuses the same canonical data source and detail-view mechanism as
 * the (locked) Opportunity Explorer:
 *  - getScholarships() — src/lib/scholarships.ts, the real Supabase
 *    table, same source Scholarships.tsx already reads from.
 *  - onSelectScholarship — the same App.tsx handler already used by
 *    Home.tsx / Women.tsx / Entrepreneurs.tsx to open the existing
 *    scholarship detail panel inside the Opportunity Explorer.
 *
 * No new scholarship model, no duplicated records, no changes to the
 * locked Opportunity Explorer itself.
 */

interface ScholarshipCalendarProps {
  onSelectScholarship: (id: string) => void;
  setCurrentTab: (tab: string) => void;
}

type ViewMode = "month" | "list";

export default function ScholarshipCalendar({ onSelectScholarship, setCurrentTab }: ScholarshipCalendarProps) {
  const [rawScholarships, setRawScholarships] = useState<CalendarScholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [visibleMonth, setVisibleMonth] = useState(new Date());
  const [filters, setFilters] = useState<CalendarFilterState>(INITIAL_CALENDAR_FILTERS);

  useEffect(() => {
    const fetchScholarships = async () => {
      setLoading(true);
      // Same fetch + error-handling convention as Scholarships.tsx
      // (getScholarships() already filters to active=true internally).
      const { data, error } = await getScholarships();

      if (error) {
        console.error("Scholarship fetch error:", error);
        notifyError(error);
        setLoading(false);
        return;
      }

      setRawScholarships((data || []).map(withCalendarFields));
      setLoading(false);
    };

    fetchScholarships();
  }, []);

  const filterOptions = useMemo(() => distinctOptions(rawScholarships), [rawScholarships]);

  const filteredScholarships = useMemo(
    () => rawScholarships.filter((s) => matchesFilters(s, filters)),
    [rawScholarships, filters]
  );

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    // The Month filter is List-View-only (Month View's own prev/next
    // navigation already serves that purpose — showing both would let
    // a hidden filter silently empty the grid with no visible reason).
    if (mode === "month" && filters.month !== null) {
      setFilters({ ...filters, month: null });
    }
  };

  const handleViewVisaPrep = () => {
    setCurrentTab("visa-prep");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

      {/* Page Header */}
      <div className="space-y-3 text-center md:text-left">
        <span className="text-xs font-bold uppercase tracking-widest text-nepal-crimson dark:text-nepal-crimson-light font-mono bg-nepal-crimson/5 dark:bg-nepal-crimson-light/10 px-3 py-1.5 rounded-full">
          Scholarship Calendar
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-nepal-blue dark:text-white tracking-tight">
          Never Miss An Application Deadline
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl">
          A planning view of scholarship deadlines and application cycles — not a replacement for your own calendar, but a clear way to see what's coming up.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 border-3 border-nepal-crimson/20 border-t-nepal-crimson rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Upcoming Deadlines (30/60/90 days) */}
          <UpcomingDeadlines
            scholarships={rawScholarships}
            activeWindow={filters.deadlineWithinDays}
            onSelectWindow={setFilters}
            filters={filters}
          />

          {/* View toggle + Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl gap-1 w-fit">
              <button
                type="button"
                onClick={() => handleViewModeChange("month")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  viewMode === "month"
                    ? "bg-white dark:bg-nepal-dark text-nepal-crimson dark:text-nepal-crimson-light shadow-sm"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                <CalendarDays className="h-4 w-4" /> Month View
              </button>
              <button
                type="button"
                onClick={() => handleViewModeChange("list")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  viewMode === "list"
                    ? "bg-white dark:bg-nepal-dark text-nepal-crimson dark:text-nepal-crimson-light shadow-sm"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                <ListIcon className="h-4 w-4" /> List View
              </button>
            </div>

            <CalendarFilters
              filters={filters}
              onChange={setFilters}
              countries={filterOptions.countries}
              degreeLevels={filterOptions.degreeLevels}
              fundingTypes={filterOptions.fundingTypes}
              showMonthFilter={viewMode === "list"}
            />
          </div>

          {/* Calendar / List content */}
          <div className="bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 sm:p-7 shadow-premium">
            {filteredScholarships.length === 0 ? (
              <CalendarEmptyState onClearFilters={() => setFilters(INITIAL_CALENDAR_FILTERS)} />
            ) : viewMode === "month" ? (
              <CalendarMonthView
                scholarships={filteredScholarships}
                visibleMonth={visibleMonth}
                onChangeMonth={setVisibleMonth}
                onSelect={onSelectScholarship}
              />
            ) : (
              <CalendarListView scholarships={filteredScholarships} onSelect={onSelectScholarship} />
            )}
          </div>

          {/* Application Timeline (informational) */}
          <ApplicationTimeline onViewVisaPrep={handleViewVisaPrep} />
        </>
      )}
    </div>
  );
}