import React from "react";
import { Check } from "lucide-react";
import { DocumentStep } from "../document-builder/DocumentStepSidebar";

/**
 * Deliberately not the shared vertical DocumentStepSidebar (used by
 * LOR Builder) — this builder's split-screen layout only gives the
 * editor half the page width, and a fixed w-56 vertical sidebar would
 * crowd it. SOP Builder solved this identical layout constraint with
 * a horizontal pill row; this mirrors that proven pattern. Still
 * typed against the shared `DocumentStep` shape so the data flowing
 * in is consistent with the rest of the document-builder suite.
 */
interface MLStepTrackerProps {
  steps: DocumentStep[];
  activeStepIndex: number;
  onSelectStep: (index: number) => void;
}

export default function MLStepTracker({ steps, activeStepIndex, onSelectStep }: MLStepTrackerProps) {
  return (
    <ol className="flex overflow-x-auto gap-1 px-4 sm:px-5 py-3 border-b border-slate-100 dark:border-slate-800/80">
      {steps.map((step, index) => {
        const isActive = index === activeStepIndex;
        return (
          <li key={step.id} className="shrink-0">
            <button
              type="button"
              onClick={() => onSelectStep(index)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? "bg-nepal-crimson text-white"
                  : step.started
                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              {step.started && !isActive && <Check className="h-3 w-3" />}
              <span>{index + 1}. {step.label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}