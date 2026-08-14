import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Users, X } from "lucide-react";

/**
 * Module: Human Assistant review handoff after SOP completion.
 *
 * Same honesty standard as ES-006A's HumanAssistantCVPrompt and the
 * Scholar Assistant's own Human Assistant flow (ES-005G): captures
 * stated intent locally; no backend routes it to an actual person
 * yet. Copy is written to be accurate about that.
 */

const REQUEST_STORAGE_KEY = "kiplan_sop_review_requested";

interface HumanAssistantSOPPromptProps {
  open: boolean;
  onClose: () => void;
}

export default function HumanAssistantSOPPrompt({ open, onClose }: HumanAssistantSOPPromptProps) {
  const [confirmed, setConfirmed] = useState(false);

  const handleYes = () => {
    try {
      localStorage.setItem(REQUEST_STORAGE_KEY, JSON.stringify({ requestedAt: new Date().toISOString() }));
    } catch {
      // Non-critical — the confirmation still displays even if this can't persist.
    }
    setConfirmed(true);
  };

  const handleClose = () => {
    setConfirmed(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-sm w-full p-6 relative"
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-2.5 rounded-xl bg-nepal-crimson/10 text-nepal-crimson dark:text-nepal-crimson-light w-fit mb-4">
              <Users className="h-5 w-5" />
            </div>

            {!confirmed ? (
              <>
                <h3 className="font-extrabold text-base text-slate-800 dark:text-white mb-1.5">
                  Would you like our Human Assistant to review your SOP before you apply?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                  A second read often catches tone and clarity issues you can't see in your own draft.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleYes}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-nepal-blue to-nepal-blue-light text-white rounded-xl text-sm font-bold shadow-sm hover:opacity-95 transition-all cursor-pointer"
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    Later
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-extrabold text-base text-slate-800 dark:text-white mb-1.5">Noted, thank you.</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                  We've recorded your interest. In the meantime, you can also reach our Human Assistant directly through the Scholar Assistant chat.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}