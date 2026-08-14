import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { useSOPBuilder } from "./useSOPBuilder";
import SOPStepTracker from "./SOPStepTracker";
import SOPStepForm from "./SOPStepForm";

interface SOPBuilderFormProps {
  builder: ReturnType<typeof useSOPBuilder>;
  onFinish: () => void;
}

function formatSavedAt(iso: string | null): string {
  if (!iso) return "Not saved yet";
  const date = new Date(iso);
  return `Saved ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

export default function SOPBuilderForm({ builder, onFinish }: SOPBuilderFormProps) {
  const { data, steps, activeStep, activeStepIndex, isFirstStep, isLastStep, goToStep, goNext, goBack, lastSavedAt } = builder;
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (!savedFlash) return;
    const timeout = setTimeout(() => setSavedFlash(false), 1800);
    return () => clearTimeout(timeout);
  }, [savedFlash]);

  const handleSaveDraft = () => {
    builder.saveDraft();
    setSavedFlash(true);
  };

  return (
    <div className="flex flex-col h-full">
      <SOPStepTracker steps={steps} activeStepIndex={activeStepIndex} data={data} onSelectStep={(i) => goToStep(steps[i].id)} />

      <div className="flex-1 overflow-y-auto p-5">
        <SOPStepForm step={activeStep} value={data[activeStep.id]} onChange={(text) => builder.updateSection(activeStep.id, text)} />
      </div>

      <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 dark:border-slate-800/80 shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goBack}
            disabled={isFirstStep}
            className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Back
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="Save Draft — Continue Later"
          >
            <Save className="h-3.5 w-3.5" />
            {savedFlash ? "Saved!" : "Save Draft"}
          </button>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:inline">{formatSavedAt(lastSavedAt)}</span>
        </div>

        {isLastStep ? (
          <button
            type="button"
            onClick={onFinish}
            className="px-5 py-2.5 bg-gradient-to-r from-nepal-blue to-nepal-blue-light text-white rounded-xl text-xs font-bold shadow-sm hover:opacity-95 transition-all cursor-pointer"
          >
            Finish SOP
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold text-white bg-nepal-crimson hover:opacity-90 transition-colors cursor-pointer"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}