import React from "react";
import { CheckCircle2 } from "lucide-react";
import { CVStepMeta } from "./emptyCV";
import { CVData } from "./cvTypes";

interface StepSidebarProps {
  steps: CVStepMeta[];
  activeStepIndex: number;
  data: CVData;
  onSelectStep: (index: number) => void;
}

/** True if the step has any content entered, used purely for the sidebar's completion checkmark — not a validation gate. */
function isStepStarted(step: CVStepMeta, data: CVData): boolean {
  switch (step.id) {
    case "personal":
      return Boolean(data.personalInfo.fullName.trim());
    case "summary":
      return Boolean(data.summary.trim());
    case "skills":
      return data.skills.length > 0;
    default:
      return Array.isArray((data as unknown as Record<string, unknown>)[step.id])
        ? ((data as unknown as Record<string, unknown[]>)[step.id]).length > 0
        : false;
  }
}

export default function StepSidebar({ steps, activeStepIndex, data, onSelectStep }: StepSidebarProps) {
  return (
    <nav className="w-full sm:w-56 shrink-0 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800/80">
      <ol className="flex sm:flex-col overflow-x-auto sm:overflow-visible gap-1 p-2 sm:p-3">
        {steps.map((step, index) => {
          const isActive = index === activeStepIndex;
          const started = isStepStarted(step, data);
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
                {started ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-slate-300 dark:border-slate-600 shrink-0" />
                )}
                <span>{step.label}</span>
                {!step.optional && <span className="text-nepal-crimson/60 dark:text-nepal-crimson-light/60">*</span>}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}