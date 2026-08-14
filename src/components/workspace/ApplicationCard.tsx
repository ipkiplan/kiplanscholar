import React from "react";
import { ArrowRight, Calendar, GraduationCap } from "lucide-react";
import { Application, ApplicationStatus } from "../../lib/applications";

interface ApplicationCardProps {
  application: Application;
  scholarshipTitle?: string | null;
  onOpen: () => void;
}

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  planning: "Planning",
  in_preparation: "In Preparation",
  ready_to_submit: "Ready to Submit",
  submitted: "Submitted",
  under_review: "Under Review",
  result: "Result",
};

const STATUS_STYLE: Record<ApplicationStatus, string> = {
  planning: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400",
  in_preparation: "bg-nepal-blue/10 dark:bg-nepal-blue/20 text-nepal-blue dark:text-sky-400",
  ready_to_submit: "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400",
  submitted: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400",
  under_review: "bg-nepal-crimson/10 dark:bg-nepal-crimson-light/10 text-nepal-crimson dark:text-nepal-crimson-light",
  result: "bg-nepal-gold/10 text-nepal-gold",
};

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function ApplicationCard({ application, scholarshipTitle, onOpen }: ApplicationCardProps) {
  const deadline = formatDate(application.deadline);
  const updated = formatDate(application.updated_at);

  return (
    <div className="p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">{application.application_name}</h3>
        <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${STATUS_STYLE[application.status]}`}>
          {STATUS_LABEL[application.status]}
        </span>
      </div>

      {scholarshipTitle && (
        <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <GraduationCap className="h-3.5 w-3.5 shrink-0" />
          {scholarshipTitle}
        </span>
      )}

      <div className="flex-1 flex flex-col gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
        {deadline && (
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            Deadline: {deadline}
          </span>
        )}
        {updated && <span>Last updated {updated}</span>}
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-gradient-to-r from-nepal-blue to-nepal-blue-light text-white hover:opacity-95 shadow-sm"
      >
        Open
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}