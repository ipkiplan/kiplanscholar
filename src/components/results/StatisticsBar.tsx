import React from "react";
import { Layers, CalendarCheck, AlertTriangle, Globe } from "lucide-react";

interface StatisticsBarProps {
  totalCount: number;
  openCount: number;
  closingSoonCount: number;
  countriesCount: number;
}

export default function StatisticsBar({
  totalCount,
  openCount,
  closingSoonCount,
  countriesCount,
}: StatisticsBarProps) {
  const stats = [
    {
      id: "stat-total",
      label: "Total Opportunities",
      value: totalCount,
      icon: Layers,
      color: "text-nepal-blue dark:text-sky-400 bg-nepal-blue/5 dark:bg-sky-400/5 border-nepal-blue/10 dark:border-sky-400/10",
    },
    {
      id: "stat-open",
      label: "Open Today",
      value: openCount,
      icon: CalendarCheck,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 border-emerald-500/10",
    },
    {
      id: "stat-closing",
      label: "Closing Soon",
      value: closingSoonCount,
      icon: AlertTriangle,
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/5 border-amber-500/10",
    },
    {
      id: "stat-countries",
      label: "Countries Supported",
      value: countriesCount,
      icon: Globe,
      color: "text-nepal-crimson dark:text-nepal-crimson-light bg-nepal-crimson/5 dark:bg-nepal-crimson-light/5 border-nepal-crimson/10 dark:border-nepal-crimson-light/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="statistics-bar">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            id={stat.id}
            className={`p-4 bg-white dark:bg-nepal-dark rounded-2xl border ${stat.color} shadow-xs flex items-center gap-3.5 transition-all hover:scale-[1.02] duration-200`}
          >
            <div className={`p-2.5 rounded-xl border bg-white dark:bg-slate-900 shrink-0`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="block text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono truncate">
                {stat.label}
              </span>
              <span className="block text-xl sm:text-2xl font-black text-slate-800 dark:text-white mt-0.5 leading-none font-mono">
                {stat.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
