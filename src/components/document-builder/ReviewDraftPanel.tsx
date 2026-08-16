import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ClipboardCheck, X, CheckCircle2, ArrowRight, MessageCircle, Info } from "lucide-react";
import {
  DocumentFinding,
  checkSOPDraft,
  checkCVDraft,
  checkLORDraft,
  checkMLDraft,
  checkPastedText,
  hasMeaningfulSOPDraft,
  hasMeaningfulCVDraft,
  hasMeaningfulLORDraft,
  hasMeaningfulMLDraft,
} from "./documentChecks";
import type { SOPData } from "../sop-builder/sopTypes";
import type { CVData } from "../cv-builder/cvTypes";
import type { LORData } from "../lor-builder/lorTypes";
import type { MLData } from "../motivation-letter-builder/mlTypes";

/**
 * Review My Draft — shared panel for all four document builders.
 *
 * Read-only with respect to the existing builder draft: reads the
 * builder's own localStorage key to check it, never writes back to
 * it. The builder itself remains the single source of truth and the
 * only place actual edits happen — this panel only surfaces findings
 * and, where possible, jumps the user to the relevant step in the
 * already-open builder via onNavigateToStep.
 *
 * Presents deterministic structural/completeness checks only —
 * explicitly not a writing-quality evaluation. See documentChecks.ts.
 */
export type ReviewDocType = "cv" | "sop" | "lor" | "ml";

interface ReviewDraftPanelProps {
  open: boolean;
  onClose: () => void;
  docType: ReviewDocType;
  docLabel: string;
  storageKey: string;
  /** Jumps the open builder to that step/section and closes the panel. Omit if the builder has no matching navigation. */
  onNavigateToStep?: (sectionId: string) => void;
}

function runChecksForExistingDraft(docType: ReviewDocType, actualData: unknown): DocumentFinding[] {
  switch (docType) {
    case "sop":
      return checkSOPDraft(actualData as SOPData);
    case "cv":
      return checkCVDraft(actualData as CVData);
    case "lor":
      return checkLORDraft(actualData as LORData);
    case "ml":
      return checkMLDraft(actualData as MLData);
  }
}

export default function ReviewDraftPanel({
  open,
  onClose,
  docType,
  docLabel,
  storageKey,
  onNavigateToStep,
}: ReviewDraftPanelProps) {
  const [hasDraft, setHasDraft] = useState(false);
  const [findings, setFindings] = useState<DocumentFinding[]>([]);
  const [pastedText, setPastedText] = useState("");
  const [pasteChecked, setPasteChecked] = useState(false);

  // Re-read storage fresh every time the panel opens, so it always
  // reflects the latest saved state — never cached stale.
  //
  // Each builder's own hook wraps its actual data as
  // { data: <ActualData>, template/lorType, lastSavedAt } and
  // auto-persists this wrapper to localStorage on every render (not
  // just on an explicit save) — so the key existing is NOT a valid
  // "has a real draft" signal; it's present the moment the builder is
  // ever opened, even with nothing filled in. "Has a meaningful
  // draft" is therefore determined per-type: SOP/LOR/Motivation
  // Letter Builder all have an explicit lastSavedAt set only by the
  // "Save Draft" button; CV Builder has no such field at all, so it's
  // judged by whether any real content exists instead.
  useEffect(() => {
    if (!open) return;
    setPasteChecked(false);
    setPastedText("");
    const raw = localStorage.getItem(storageKey);
    let parsed: { data?: unknown; lastSavedAt?: string | null } | null = null;
    try {
      parsed = raw ? JSON.parse(raw) : null;
    } catch {
      parsed = null;
    }

    const data = parsed?.data;
    let draftExists = false;
    if (data) {
      switch (docType) {
        case "sop":
          draftExists = hasMeaningfulSOPDraft(parsed?.lastSavedAt);
          break;
        case "lor":
          draftExists = hasMeaningfulLORDraft(parsed?.lastSavedAt);
          break;
        case "ml":
          draftExists = hasMeaningfulMLDraft(parsed?.lastSavedAt);
          break;
        case "cv":
          draftExists = hasMeaningfulCVDraft(data as CVData);
          break;
      }
    }

    if (draftExists && data) {
      setHasDraft(true);
      setFindings(runChecksForExistingDraft(docType, data));
    } else {
      setHasDraft(false);
      setFindings([]);
    }
  }, [open, docType, storageKey]);

  const handleCheckPaste = () => {
    setFindings(checkPastedText(pastedText, docLabel));
    setPasteChecked(true);
  };

  const handleNavigate = (sectionId?: string) => {
    if (sectionId && onNavigateToStep) {
      onNavigateToStep(sectionId);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-lg w-full p-6 relative max-h-[85vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <ClipboardCheck className="h-4.5 w-4.5 text-nepal-blue dark:text-sky-400" />
              <h3 className="font-extrabold text-base text-slate-800 dark:text-white">Review My Draft</h3>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-5 leading-relaxed flex items-start gap-1.5">
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              These are structural checks — missing sections, short answers, suggested lengths — not a writing-quality review. You decide what to change.
            </p>

            {hasDraft ? (
              <div className="space-y-3">
                {findings.length === 0 ? (
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-start gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Every section has content and the suggested lengths look reasonable. Take another look whenever you'd like — you're the best judge of whether it's ready.
                    </p>
                  </div>
                ) : (
                  findings.map((f) => (
                    <div key={f.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">{f.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-2">{f.message}</p>
                      {f.sectionId && onNavigateToStep && (
                        <button
                          type="button"
                          onClick={() => handleNavigate(f.sectionId)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-nepal-blue dark:text-sky-400 hover:underline cursor-pointer"
                        >
                          {f.actionLabel ?? "Go there"}
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No existing {docLabel} draft found in your KIPLANScholar builder yet. If you already have one written elsewhere, paste it below for a general check.
                </p>
                <textarea
                  value={pastedText}
                  onChange={(e) => {
                    setPastedText(e.target.value);
                    setPasteChecked(false);
                  }}
                  rows={8}
                  placeholder={`Paste your ${docLabel} draft here...`}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-nepal-crimson/20 focus:border-nepal-crimson transition-all resize-none leading-relaxed"
                />
                <button
                  type="button"
                  onClick={handleCheckPaste}
                  disabled={!pastedText.trim()}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-nepal-blue to-nepal-blue-light text-white rounded-xl text-xs font-bold shadow-sm hover:opacity-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Check My Draft
                </button>

                {pasteChecked && (
                  <div className="space-y-3 pt-1">
                    {findings.map((f) => (
                      <div key={f.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">{f.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                  Prefer to build it here instead? Close this panel and use the {docLabel} Builder form — nothing you paste above is saved.
                </p>
              </div>
            )}

            <a
              href="https://wa.me/9779849530970"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Want a closer look? Ask our Human Assistant
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}