import React from "react";
import { AlarmClock } from "lucide-react";
import { CalendarScholarship, CalendarFilterState } from "./calendarUtils";

interface UpcomingDeadlinesProps {
  scholarships: CalendarScholarship[];
  activeWindow: 30 | 60 | 90 | null;
  onSelectWindow: (filters: CalendarFilterState) => void;
  filters: CalendarFilterState;
}

const WINDOWS: { days: 30 | 60 | 90; label: string; dot: string; ring: string }[] = [
  { days: 30, label: "Next 30 Days", dot: "bg-red-500", ring: "border-red-500/30 bg-red-500/5" },
  { days: 60, label: "Next 60 Days", dot: "bg-amber-500", ring: "border-amber-500/30 bg-amber-500/5" },
  { days: 90, label: "Next 90 Days", dot: "bg-emerald-500", ring: "border-emerald-500/30 bg-emerald-500/5" },
];

export default function UpcomingDeadlines({
  scholarships,
  activeWindow,
  onSelectWindow,
  filters,
}: UpcomingDeadlinesProps) {
  const countWithin = (days: number) =>
    scholarships.filter((s) => s.daysRemaining !== null && s.daysRemaining >= 0 && s.daysRemaining <= days).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {WINDOWS.map((w) => {
        const isActive = activeWindow === w.days;
        const count = countWithin(w.days);
        return (
          <button
            key={w.days}
            type="button"
            onClick={() =>
              onSelectWindow({ ...filters, deadlineWithinDays: isActive ? null : w.days })
            }
            className={`text-left p-5 rounded-2xl border transition-all cursor-pointer ${
              isActive
                ? `${w.ring} ring-2 ring-offset-1 ring-offset-transparent`
                : "bg-white dark:bg-nepal-dark border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-900/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                <AlarmClock className="h-3.5 w-3.5" /> {w.label}
              </span>
              <span className={`h-2.5 w-2.5 rounded-full ${w.dot}`} />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-800 dark:text-white">{count}</span>
              <span className="text-xs font-bold text-slate-400">
                {count === 1 ? "scholarship" : "scholarships"}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}