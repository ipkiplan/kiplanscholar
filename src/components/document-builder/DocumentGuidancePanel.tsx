import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass, Sparkles, ShieldCheck, ListOrdered, PenSquare, X, ArrowRight } from "lucide-react";

/**
 * Shared contextual guidance panel, used by all four document builders
 * (CV, SOP, LOR, Motivation Letter).
 *
 * Modeled directly on the existing MLGuidancePanel.tsx pattern — same
 * modal shell, same trigger convention (a "Guidance" button in the
 * builder's header toggles `open`). Parameterized so each builder
 * supplies its own content rather than four separately-maintained
 * copies of the same component.
 *
 * This does not replace any existing field-level guidance (guiding
 * questions, placeholders, suggested word ranges) inside each
 * builder's step form — those stay exactly as they are. This panel
 * only adds the orientation that was missing: what to prepare, what
 * this document is for, and what Scholar Assistant does and does not
 * do — available on the same page as the work itself.
 */
interface DocumentGuidancePanelProps {
  open: boolean;
  onClose: () => void;
  /** e.g. "CV / Resume", "Statement of Purpose" */
  docLabel: string;
  /** One or two sentences on what this specific document is for. */
  purpose: string;
  /** What the user should have ready before starting. */
  prepareItems: string[];
  /** What Scholar Assistant actually helps with, in this builder. */
  helpsWith: string[];
  /**
   * Optional — only set when a real, deeper Resource guide exists for
   * this document type (currently true for SOP and LOR only). When
   * omitted, no "Full Guide" link is shown, rather than linking to a
   * page with nothing specific to offer.
   */
  resourcePresetId?: string;
  setCurrentTab?: (tab: string) => void;
  /**
   * Optional — the authoritative recommended structure/paragraph
   * sequence for this document, sourced directly from the matching
   * RESOURCES entry (res-sop / res-lor) rather than retyped. When
   * provided, shown inline in this panel so the guidance is available
   * at the point of work, not only by navigating to Resources.
   */
  contentStructure?: string[];
  /** Optional — the authoritative writing tips from the same RESOURCES entry. */
  tips?: string[];
}

export default function DocumentGuidancePanel({
  open,
  onClose,
  docLabel,
  purpose,
  prepareItems,
  helpsWith,
  resourcePresetId,
  setCurrentTab,
  contentStructure,
  tips,
}: DocumentGuidancePanelProps) {
  const handleFullGuide = () => {
    if (!resourcePresetId || !setCurrentTab) return;
    (window as unknown as { resourcePreset?: string }).resourcePreset = resourcePresetId;
    setCurrentTab("resources");
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

            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-nepal-crimson dark:text-nepal-crimson-light font-mono flex items-center gap-1.5 mb-2">
                  <Compass className="h-4 w-4" /> Before You Begin
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {purpose}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-nepal-blue dark:text-nepal-blue-light font-mono flex items-center gap-1.5 mb-2">
                  <Sparkles className="h-4 w-4" /> What to Have Ready
                </span>
                <ul className="space-y-1.5">
                  {prepareItems.map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-3 relative before:content-['–'] before:absolute before:left-0 before:text-nepal-blue/60">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {contentStructure && contentStructure.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-nepal-gold font-mono flex items-center gap-1.5 mb-2">
                    <ListOrdered className="h-4 w-4" /> Recommended Structure
                  </span>
                  <ol className="space-y-1.5">
                    {contentStructure.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-5 relative">
                        <span className="absolute left-0 font-bold text-nepal-gold">{idx + 1}.</span>
                        {item}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {tips && tips.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-nepal-crimson dark:text-nepal-crimson-light font-mono flex items-center gap-1.5 mb-2">
                    <PenSquare className="h-4 w-4" /> Writing Tips
                  </span>
                  <ul className="space-y-1.5">
                    {tips.map((tip, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-3 relative before:content-['–'] before:absolute before:left-0 before:text-nepal-crimson/60">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1.5 mb-2">
                  <ShieldCheck className="h-4 w-4" /> How Scholar Assistant Helps
                </span>
                <ul className="space-y-1.5 mb-3">
                  {helpsWith.map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-3 relative before:content-['–'] before:absolute before:left-0 before:text-emerald-500/60">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                  Your genuine experience, ideas and qualifications are the foundation — Scholar Assistant helps you present them clearly and confidently. It won't invent achievements, experiences or qualifications on your behalf, and you stay in control of the final {docLabel}.
                </p>
              </div>

              {resourcePresetId && setCurrentTab && (
                <button
                  type="button"
                  onClick={handleFullGuide}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-[11px] font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  See this on the full Resources page
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}