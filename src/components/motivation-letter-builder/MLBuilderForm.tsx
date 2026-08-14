import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { useMotivationLetterBuilder } from "./useMotivationLetterBuilder";
import { DocumentStep } from "../document-builder/DocumentStepSidebar";
import { countWords } from "./mlTypes";
import MLStepTracker from "./MLStepTracker";
import MLStepForm from "./MLStepForm";

interface MLBuilderFormProps {
  builder: ReturnType<typeof useMotivationLetterBuilder>;
  onFinish: () => void;
}

function formatSavedAt(iso: string | null): string {
  if (!iso) return "Not saved yet";
  const date = new Date(iso);
  return `Saved ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

export default function MLBuilderForm({ builder, onFinish }: MLBuilderFormProps) {
  const { data, template, sections, activeSection, activeStepIndex, isFirstStep, isLastStep, goToStep, goNext, goBack, lastSavedAt } = builder;
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

  const steps: DocumentStep[] = sections.map((s) => ({
    id: s.id,
    label: s.label,
    started: countWords(data[s.id]) > 0,
  }));

  return (
    <div className="flex flex-col h-full">
      <MLStepTracker steps={steps} activeStepIndex={activeStepIndex} onSelectStep={(i) => goToStep(sections[i].id)} />

      <div className="flex-1 overflow-y-auto p-5">
        <MLStepForm
          section={activeSection}
          template={template}
          value={data[activeSection.id]}
          onChange={(text) => builder.updateSection(activeSection.id, text)}
        />
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
            Finish Motivation Letter
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