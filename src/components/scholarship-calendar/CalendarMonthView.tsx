import React from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { CalendarScholarship, URGENCY_STYLES, MONTH_NAMES } from "./calendarUtils";

interface CalendarMonthViewProps {
  scholarships: CalendarScholarship[];
  visibleMonth: Date; // any date within the displayed month
  onChangeMonth: (next: Date) => void;
  onSelect: (id: string) => void;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_VISIBLE_PER_DAY = 3;

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function CalendarMonthView({
  scholarships,
  visibleMonth,
  onChangeMonth,
  onSelect,
}: CalendarMonthViewProps) {
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  // Rolling-admission scholarships (deadline === null) have no date to
  // plot and are intentionally excluded from the grid — surfaced as a
  // count below instead of silently dropped, so nothing looks "missing".
  const datedInView = scholarships.filter((s) => s.deadline !== null);
  const rollingCount = scholarships.length - datedInView.length;

  const eventsByDay = new Map<number, CalendarScholarship[]>();
  datedInView.forEach((s) => {
    const d = new Date(s.deadline as string);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      const list = eventsByDay.get(day) ?? [];
      list.push(s);
      eventsByDay.set(day, list);
    }
  });

  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to a full last week for a clean grid.
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-nepal-blue dark:text-white">
          {MONTH_NAMES[month]} {year}
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChangeMonth(new Date(year, month - 1, 1))}
            className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          </button>
          <button
            type="button"
            onClick={() => onChangeMonth(new Date())}
            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => onChangeMonth(new Date(year, month + 1, 1))}
            className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d} className="text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono py-1">
            {d}
          </div>
        ))}

        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="min-h-[92px] sm:min-h-[110px]" />;
          }
          const cellDate = new Date(year, month, day);
          const events = eventsByDay.get(day) ?? [];
          const overflow = events.length - MAX_VISIBLE_PER_DAY;
          const isToday = isSameDay(cellDate, today);

          return (
            <div
              key={day}
              className={`min-h-[92px] sm:min-h-[110px] p-1.5 rounded-xl border text-left ${
                isToday
                  ? "border-nepal-crimson/40 bg-nepal-crimson/5 dark:bg-nepal-crimson-light/5"
                  : "border-slate-100 dark:border-slate-800/50 bg-white dark:bg-nepal-dark"
              }`}
            >
              <span className={`text-[11px] font-bold ${isToday ? "text-nepal-crimson dark:text-nepal-crimson-light" : "text-slate-400"}`}>
                {day}
              </span>
              <div className="mt-1 space-y-1">
                {events.slice(0, MAX_VISIBLE_PER_DAY).map((ev) => {
                  const style = ev.urgency !== "none" ? URGENCY_STYLES[ev.urgency] : null;
                  return (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => onSelect(ev.id)}
                      title={`${ev.title} — ${ev.country}`}
                      className={`w-full flex items-center gap-1 text-left text-[9.5px] sm:text-[10px] font-bold px-1.5 py-1 rounded-md truncate cursor-pointer ${
                        style ? `${style.badgeBg} ${style.badgeText}` : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {ev.featured && <Star className="h-2.5 w-2.5 shrink-0" fill="currentColor" />}
                      <span className="truncate">{ev.title}</span>
                    </button>
                  );
                })}
                {overflow > 0 && (
                  <span className="block text-[9.5px] font-bold text-slate-400 px-1.5">
                    +{overflow} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {rollingCount > 0 && (
        <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
          {rollingCount} rolling-admission {rollingCount === 1 ? "scholarship has" : "scholarships have"} no fixed deadline and {rollingCount === 1 ? "isn't" : "aren't"} shown on the calendar grid — see List View.
        </p>
      )}
    </div>
  );
}