import React, { useState } from "react";
import { ArrowLeft, Download, Printer, BookOpen, ClipboardCheck } from "lucide-react";
import { useMotivationLetterBuilder } from "../components/motivation-letter-builder/useMotivationLetterBuilder";
import MLBuilderForm from "../components/motivation-letter-builder/MLBuilderForm";
import MLPreview from "../components/motivation-letter-builder/MLPreview";
import MLTemplateSelector from "../components/motivation-letter-builder/MLTemplateSelector";
import DocumentGuidancePanel from "../components/document-builder/DocumentGuidancePanel";
import ReviewDraftPanel from "../components/document-builder/ReviewDraftPanel";
import HumanAssistantReviewPrompt from "../components/document-builder/HumanAssistantReviewPrompt";
import { exportDocumentAsPDF, printDocument } from "../components/document-builder/printExport";

/**
 * ES-009 — Motivation Letter Builder (Version 1.0).
 *
 * Fourth tool in the Application Preparation Suite, alongside CV
 * Builder (ES-006A), SOP Builder (ES-006B), and LOR Builder (ES-011).
 * Reuses the shared document-builder infrastructure LOR Builder
 * established (HumanAssistantReviewPrompt, printExport) rather than
 * adding a fourth copy of either — see the ES-009 Completion Report
 * for the full reuse/architecture rationale. CV/SOP/LOR Builder's own
 * files are untouched.
 *
 * Split-screen layout (editor left, live preview right) matches SOP
 * Builder's proven layout for this exact use case, per the ES's
 * explicit instruction not to redesign the UI unless technically
 * necessary.
 *
 * Does not import from, and is not imported by, conversationEngine.ts,
 * assistantOrchestrator.ts, or any file in scholarshipIntelligence/ —
 * no locked module is touched by this file or anything under
 * src/components/motivation-letter-builder/.
 */
interface MotivationLetterBuilderPageProps {
  setCurrentTab: (tab: string) => void;
}

export default function MotivationLetterBuilderPage({ setCurrentTab }: MotivationLetterBuilderPageProps) {
  const builder = useMotivationLetterBuilder();
  const [showHumanAssistantPrompt, setShowHumanAssistantPrompt] = useState(false);
  const [showGuidancePanel, setShowGuidancePanel] = useState(false);
  const [showReviewPanel, setShowReviewPanel] = useState(false);

  const handleFinish = () => {
    builder.saveDraft();
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
            <h1 className="font-extrabold text-lg text-slate-800 dark:text-white">Motivation Letter Builder</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">Write a structured, authentic motivation letter, one section at a time</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <MLTemplateSelector value={builder.template} onChange={builder.setTemplate} />
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />
          <button
            type="button"
            onClick={() => setShowGuidancePanel(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Guidance</span>
          </button>
          <button
            type="button"
            onClick={() => setShowReviewPanel(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <ClipboardCheck className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Review My Draft</span>
          </button>
          <button
            type="button"
            onClick={() => printDocument("ml-print-area", "", "Motivation Letter")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>
          <button
            type="button"
            onClick={() => exportDocumentAsPDF("ml-print-area", "", "Motivation Letter")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-nepal-blue to-nepal-blue-light shadow-sm hover:opacity-95 transition-all cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-sm grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-220px)] min-h-[500px] overflow-hidden">
        <div className="min-h-0">
          <MLBuilderForm builder={builder} onFinish={handleFinish} />
        </div>
        <div className="min-h-0 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800/80">
          <MLPreview data={builder.data} />
        </div>
      </div>

      <DocumentGuidancePanel
        open={showGuidancePanel}
        onClose={() => setShowGuidancePanel(false)}
        docLabel="Motivation Letter"
        purpose="A Motivation Letter explains why this specific opportunity matters to you, why you're drawn to it, and how it fits where you're headed."
        prepareItems={[
          "What specifically drew you to this opportunity, not opportunities in general",
          "How it connects to your goals and past experience",
          "Concrete examples that show your motivation, not just statements of it",
          "How it's different from your SOP, so the two don't repeat each other",
        ]}
        helpsWith={[
          "Structuring your motivation into clear, focused paragraphs",
          "Making sure specific examples carry the letter, not general statements",
          "Keeping this letter consistent with your CV, SOP, and LOR — the same authentic story, told through a different lens",
        ]}
        setCurrentTab={setCurrentTab}
      />

      <ReviewDraftPanel
        open={showReviewPanel}
        onClose={() => setShowReviewPanel(false)}
        docType="ml"
        docLabel="Motivation Letter"
        storageKey="kiplan_ml_builder_draft"
        onNavigateToStep={(stepId) => builder.goToStep(stepId as Parameters<typeof builder.goToStep>[0])}
      />

      <HumanAssistantReviewPrompt
        open={showHumanAssistantPrompt}
        onClose={() => setShowHumanAssistantPrompt(false)}
        documentLabel="Motivation Letter"
        storageKey="kiplan_ml_review_requested"
      />
    </div>
  );
}