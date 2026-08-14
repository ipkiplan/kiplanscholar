import React, { useState } from "react";
import { ArrowLeft, GraduationCap, Calendar, FileText, Gauge, Settings, Trash2, Loader2 } from "lucide-react";
import { Application, ApplicationStatus, updateApplication } from "../../lib/applications";

interface ApplicationDetailProps {
  application: Application;
  scholarshipTitle?: string | null;
  onBack: () => void;
  onUpdated: (updated: Application) => void;
  onRequestDelete: () => void;
}

const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: "planning", label: "Planning" },
  { value: "in_preparation", label: "In Preparation" },
  { value: "ready_to_submit", label: "Ready to Submit" },
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under Review" },
  { value: "result", label: "Result" },
];

function toDateInputValue(iso: string | null): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export default function ApplicationDetail({ application, scholarshipTitle, onBack, onUpdated, onRequestDelete }: ApplicationDetailProps) {
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingDeadline, setSavingDeadline] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (status: ApplicationStatus) => {
    setSavingStatus(true);
    setError(null);
    const res = await updateApplication(application.id, { status });
    setSavingStatus(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    if (res.data) onUpdated(res.data);
  };

  const handleDeadlineChange = async (value: string) => {
    setSavingDeadline(true);
    setError(null);
    const res = await updateApplication(application.id, { deadline: value || null });
    setSavingDeadline(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    if (res.data) onUpdated(res.data);
  };

  return (
    <div>
      {/* Application Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl text-slate-500 hover:text-nepal-crimson hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0 mt-0.5"
            aria-label="Back to My Applications"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-nepal-crimson dark:text-nepal-crimson-light font-mono">
              Application
            </span>
            <h2 className="font-extrabold text-xl text-slate-800 dark:text-white">{application.application_name}</h2>
            {scholarshipTitle && (
              <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                {scholarshipTitle}
              </span>
            )}
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Overview — functional */}
        <div className="p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 space-y-4">
          <h3 className="font-extrabold text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Settings className="h-3.5 w-3.5" /> Overview
          </h3>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">Status</label>
            <div className="flex items-center gap-2">
              <select
                value={application.status}
                onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
                disabled={savingStatus}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-nepal-crimson disabled:opacity-60"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {savingStatus && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400 shrink-0" />}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Calendar className="h-3 w-3" /> Deadline
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={toDateInputValue(application.deadline)}
                onChange={(e) => handleDeadlineChange(e.target.value)}
                disabled={savingDeadline}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-nepal-crimson disabled:opacity-60"
              />
              {savingDeadline && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400 shrink-0" />}
            </div>
          </div>
        </div>

        {/* Documents — structural placeholder only, per Phase 2A scope */}
        <div className="p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 space-y-3">
          <h3 className="font-extrabold text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" /> Documents
          </h3>
          <div className="py-6 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500">Document Checklist coming next.</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-600 mt-1">
              CV, SOP, LOR, and other documents will connect to this application in a later phase.
            </p>
          </div>
        </div>

        {/* Readiness — explicitly not calculated yet */}
        <div className="p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 space-y-3">
          <h3 className="font-extrabold text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5" /> Readiness
          </h3>
          <div className="py-6 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Readiness will be calculated once required documents are connected to this application.
            </p>
          </div>
        </div>

        {/* Actions — basic only */}
        <div className="p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 space-y-3">
          <h3 className="font-extrabold text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Settings className="h-3.5 w-3.5" /> Actions
          </h3>
          <button
            type="button"
            onClick={onRequestDelete}
            className="w-full flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-red-500/10 text-red-500 hover:bg-red-500/20"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Application
          </button>
        </div>
      </div>
    </div>
  );
}