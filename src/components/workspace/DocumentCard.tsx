import React from "react";
import { ArrowRight, Circle, PenLine, Clock } from "lucide-react";
import { DocumentStatus } from "./documentStatus";

interface DocumentCardProps {
  title: string;
  description: string;
  status: DocumentStatus | "coming-soon";
  lastUpdated: string | null;
  onAction: () => void;
}

const STATUS_LABEL: Record<string, string> = {
  "not-started": "Not Started",
  "in-progress": "In Progress",
  "coming-soon": "Coming Soon",
};

const STATUS_STYLE: Record<string, string> = {
  "not-started": "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400",
  "in-progress": "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400",
  "coming-soon": "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400",
};

function formatLastUpdated(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (isNaN(date.getTime())) return null;
  return `Updated ${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}

export default function DocumentCard({ title, description, status, lastUpdated, onAction }: DocumentCardProps) {
  const isComingSoon = status === "coming-soon";
  const formattedDate = formatLastUpdated(lastUpdated);

  return (
    <div className="p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">{title}</h3>
        <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_STYLE[status]}`}>
          {STATUS_LABEL[status]}
        </span>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-1">{description}</p>

      {formattedDate && (
        <span className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
          <Clock className="h-3 w-3" />
          {formattedDate}
        </span>
      )}

      <button
        type="button"
        onClick={onAction}
        disabled={isComingSoon}
        className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-nepal-blue to-nepal-blue-light text-white hover:opacity-95 shadow-sm"
      >
        {isComingSoon ? (
          <>
            <Circle className="h-3.5 w-3.5" />
            Coming Soon
          </>
        ) : status === "in-progress" ? (
          <>
            Continue
            <ArrowRight className="h-3.5 w-3.5" />
          </>
        ) : (
          <>
            <PenLine className="h-3.5 w-3.5" />
            Start
          </>
        )}
      </button>
    </div>
  );
}