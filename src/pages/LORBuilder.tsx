import React, { useState } from "react";
import { ArrowLeft, Download, Printer, BookOpen, ClipboardCheck } from "lucide-react";
import { useLORBuilder } from "../components/lor-builder/useLORBuilder";
import LORBuilderForm from "../components/lor-builder/LORBuilderForm";
import LORPreview from "../components/lor-builder/LORPreview";
import LORTypeSelector from "../components/lor-builder/LORTypeSelector";
import HumanAssistantReviewPrompt from "../components/document-builder/HumanAssistantReviewPrompt";
import DocumentGuidancePanel from "../components/document-builder/DocumentGuidancePanel";
import ReviewDraftPanel from "../components/document-builder/ReviewDraftPanel";
import { exportDocumentAsPDF, printDocument } from "../components/document-builder/printExport";
import { RESOURCES } from "../data/scholarships";

const lorResource = RESOURCES.find((r) => r.id === "res-lor");

/**
 * ES-011 — LOR Builder (Version 1.0).
 *
 * New, independent page/module, third in the Application Preparation
 * Suite alongside CV Builder (ES-006A) and SOP Builder (ES-006B).
 * Reuses genuinely shared infrastructure (DocumentStepSidebar,
 * HumanAssistantReviewPrompt, printExport) introduced in this phase
 * specifically to avoid a third copy-pasted set of those files — see
 * the ES-011 Completion Report for the full reuse/architecture
 * rationale. CV Builder and SOP Builder's own files are untouched.
 *
 * Does not import from, and is not imported by, conversationEngine.ts,
 * assistantOrchestrator.ts, or any file in scholarshipIntelligence/ —
 * no locked module is touched by this file or anything under
 * src/components/lor-builder/ or src/components/document-builder/.
 */
interface LORBuilderPageProps {
  setCurrentTab: (tab: string) => void;
}

export default function LORBuilderPage({ setCurrentTab }: LORBuilderPageProps) {
  const builder = useLORBuilder();
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
            <h1 className="font-extrabold text-lg text-slate-800 dark:text-white">LOR Builder</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">Build a strong Letter of Recommendation, section by section</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LORTypeSelector value={builder.lorType} onChange={builder.setLORType} />
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
            onClick={() => printDocument("lor-print-area", builder.data.applicantFullName, "LOR")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>
          <button
            type="button"
            onClick={() => exportDocumentAsPDF("lor-print-area", builder.data.applicantFullName, "LOR")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-nepal-blue to-nepal-blue-light shadow-sm hover:opacity-95 transition-all cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-sm grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-220px)] min-h-[500px] overflow-hidden">
        <div className="min-h-0">
          <LORBuilderForm builder={builder} onFinish={handleFinish} />
        </div>
        <div className="min-h-0 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800/80">
          <LORPreview data={builder.data} lorType={builder.lorType} />
        </div>
      </div>

      <HumanAssistantReviewPrompt
        open={showHumanAssistantPrompt}
        onClose={() => setShowHumanAssistantPrompt(false)}
        documentLabel="LOR"
        storageKey="kiplan_lor_review_requested"
      />

      <DocumentGuidancePanel
        open={showGuidancePanel}
        onClose={() => setShowGuidancePanel(false)}
        docLabel="Letter of Recommendation"
        purpose="An LOR brings a third-party perspective — someone who knows your work vouching for you with specific, credible evidence."
        prepareItems={[
          "Who will write it, and how they know your work",
          "Specific examples of your abilities they've directly observed",
          "Context on the programme or opportunity, so the letter can speak to it",
          "Enough lead time for your recommender to write something genuine",
        ]}
        helpsWith={[
          "Structuring the letter so it reads naturally and credibly",
          "Making sure specific evidence, not vague praise, carries the letter",
          "Keeping the LOR consistent with the rest of your applicant story",
        ]}
        resourcePresetId="res-lor"
        setCurrentTab={setCurrentTab}
        contentStructure={lorResource?.contentStructure}
        tips={lorResource?.tips}
      />

      <ReviewDraftPanel
        open={showReviewPanel}
        onClose={() => setShowReviewPanel(false)}
        docType="lor"
        docLabel="Letter of Recommendation"
        storageKey="kiplan_lor_builder_draft"
        onNavigateToStep={(stepId) => builder.goToStep(stepId as Parameters<typeof builder.goToStep>[0])}
      />
    </div>
  );
}