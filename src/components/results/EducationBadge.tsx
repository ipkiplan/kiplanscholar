import React from "react";
import { GraduationCap } from "lucide-react";

interface EducationBadgeProps {
  level: string;
}

export default function EducationBadge({ level }: EducationBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[9.5px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 rounded font-mono border border-slate-200/40 dark:border-slate-700/50"
      id={`education-badge-${level.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <GraduationCap className="h-3 w-3 text-slate-400" />
      <span>{level}</span>
    </span>
  );
}
