import React from "react";
import { MapPin, Building2, GraduationCap, Wallet, Star, ChevronRight } from "lucide-react";
import { CalendarScholarship, URGENCY_STYLES, formatDeadline } from "./calendarUtils";

interface CalendarListViewProps {
  scholarships: CalendarScholarship[];
  onSelect: (id: string) => void;
}

export default function CalendarListView({ scholarships, onSelect }: CalendarListViewProps) {
  // Three groups, in priority order for a planning tool:
  //  1. Open, dated deadlines (soonest first — already sorted upstream by
  //     getScholarships()'s own "deadline ascending" order)
  //  2. Rolling admission (no fixed deadline)
  //  3. Closed — deadline already passed. Still shown (not silently
  //     dropped — the record may still be `active` in the database even
  //     after its date passes), but clearly separated and labelled so a
  //     student can't mistake an already-closed date for an upcoming one.
  const open = scholarships.filter((s) => s.deadline !== null && s.daysRemaining !== null && s.daysRemaining >= 0);
  const rolling = scholarships.filter((s) => s.deadline === null);
  const closed = scholarships.filter((s) => s.deadline !== null && s.daysRemaining !== null && s.daysRemaining < 0);

  const renderRow = (s: CalendarScholarship) => {
    const style = s.urgency !== "none" ? URGENCY_STYLES[s.urgency] : null;
    const isClosed = s.deadline !== null && s.daysRemaining !== null && s.daysRemaining < 0;
    return (
      <button
        key={s.id}
        type="button"
        onClick={() => onSelect(s.id)}
        className={`w-full flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 rounded-2xl text-left hover:border-nepal-crimson/40 dark:hover:border-nepal-crimson-light/40 transition-all cursor-pointer ${
          isClosed ? "opacity-60" : ""
        }`}
      >
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-white truncate">{s.title}</h4>
            {s.featured && <Star className="h-3.5 w-3.5 text-nepal-gold shrink-0" fill="currentColor" />}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1"><Building2 className="h-3 w-3 shrink-0" /> {s.organization}</span>
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3 shrink-0" /> {s.country}</span>
            <span className="flex items-center gap-1"><GraduationCap className="h-3 w-3 shrink-0" /> {s.degree_level}</span>
            <span className="flex items-center gap-1"><Wallet className="h-3 w-3 shrink-0" /> {s.funding_type}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="block text-xs font-bold text-slate-700 dark:text-slate-200">{formatDeadline(s.deadline)}</span>
            {isClosed ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                Closed
              </span>
            ) : style ? (
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${style.badgeBg} ${style.badgeText}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                {s.daysRemaining} {s.daysRemaining === 1 ? "day" : "days"} left
              </span>
            ) : null}
          </div>
          <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600 shrink-0" />
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {open.length > 0 && (
        <div className="space-y-3">
          {open.map(renderRow)}
        </div>
      )}

      {rolling.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 font-mono pt-2">
            Rolling Admission — No Fixed Deadline
          </h4>
          {rolling.map(renderRow)}
        </div>
      )}

      {closed.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 font-mono pt-2">
            Closed — Deadline Passed
          </h4>
          {closed.map(renderRow)}
        </div>
      )}
    </div>
  );
}