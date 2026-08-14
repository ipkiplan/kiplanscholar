import React, { useState } from "react";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { useCVBuilder } from "../components/cv-builder/useCVBuilder";
import CVBuilderForm from "../components/cv-builder/CVBuilderForm";
import CVPreview from "../components/cv-builder/CVPreview";
import TemplateSelector from "../components/cv-builder/TemplateSelector";
import HumanAssistantCVPrompt from "../components/cv-builder/HumanAssistantCVPrompt";
import { exportCVAsPDF, printCV } from "../components/cv-builder/exportCV";

/**
 * ES-006A — CV Builder & Review (Version 1.0).
 *
 * New, independent page/module. Does not import from, or get imported
 * by, conversationEngine.ts, assistantOrchestrator.ts, or any file in
 * scholarshipIntelligence/ — no locked module is touched by this file
 * or anything under src/components/cv-builder/.
 */
interface CVBuilderPageProps {
  setCurrentTab: (tab: string) => void;
}

export default function CVBuilderPage({ setCurrentTab }: CVBuilderPageProps) {
  const builder = useCVBuilder();
  const [showHumanAssistantPrompt, setShowHumanAssistantPrompt] = useState(false);

  const handleFinish = () => {
    setShowHumanAssistantPrompt(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentTab("dashboard")}
            className="p-2 rounded-xl text-slate-500 hover:text-nepal-crimson hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <div>
            <h1 className="font-extrabold text-lg text-slate-800 dark:text-white">CV Builder</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">Build a scholarship-ready academic CV, section by section</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TemplateSelector value={builder.template} onChange={builder.setTemplate} />
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />
          <button
            type="button"
            onClick={() => printCV(builder.data.personalInfo.fullName)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>
          <button
            type="button"
            onClick={() => exportCVAsPDF(builder.data.personalInfo.fullName)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-nepal-blue to-nepal-blue-light shadow-sm hover:opacity-95 transition-all cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-sm grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-220px)] min-h-[500px] overflow-hidden">
        <div className="min-h-0">
          <CVBuilderForm builder={builder} onFinish={handleFinish} />
        </div>
        <div className="min-h-0 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800/80">
          <CVPreview data={builder.data} template={builder.template} />
        </div>
      </div>

      <HumanAssistantCVPrompt open={showHumanAssistantPrompt} onClose={() => setShowHumanAssistantPrompt(false)} />
    </div>
  );
}