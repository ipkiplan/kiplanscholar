import React from "react";
import { CheckCircle2 } from "lucide-react";

/**
 * ES-011 — shared document-builder infrastructure.
 *
 * This is a genuinely generic version of the pattern CV Builder's
 * StepSidebar.tsx established, decoupled from any specific data type:
 * instead of an isStepStarted(step, data) function coupled to CVData,
 * the caller pre-computes each step's `started` boolean and passes it
 * in. This is what makes the same component usable by CV, SOP, LOR,
 * or any future document builder.
 *
 * CV Builder's own StepSidebar.tsx is intentionally left untouched —
 * this is a new, additional file, not a modification to already-
 * shipped work. Consolidating CV/SOP onto this shared component is a
 * reasonable future cleanup, not done here.
 */

export interface DocumentStep {
  id: string;
  label: string;
  started: boolean;
  /** Marks a required step with a visual asterisk, matching CV Builder's convention. */
  required?: boolean;
}

interface DocumentStepSidebarProps {
  steps: DocumentStep[];
  activeStepIndex: number;
  onSelectStep: (index: number) => void;
}

export default function DocumentStepSidebar({ steps, activeStepIndex, onSelectStep }: DocumentStepSidebarProps) {
  return (
    <nav className="w-full sm:w-56 shrink-0 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800/80">
      <ol className="flex sm:flex-col overflow-x-auto sm:overflow-visible gap-1 p-2 sm:p-3">
        {steps.map((step, index) => {
          const isActive = index === activeStepIndex;
          return (
            <li key={step.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onSelectStep(index)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap sm:whitespace-normal text-left transition-colors cursor-pointer ${
                  isActive
                    ? "bg-nepal-crimson/10 text-nepal-crimson dark:text-nepal-crimson-light"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {step.started ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-slate-300 dark:border-slate-600 shrink-0" />
                )}
                <span>{step.label}</span>
                {step.required && <span className="text-nepal-crimson/60 dark:text-nepal-crimson-light/60">*</span>}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}