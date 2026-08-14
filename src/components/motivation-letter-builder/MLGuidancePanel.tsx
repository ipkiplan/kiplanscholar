import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldAlert, Sparkles, X } from "lucide-react";
import { NEPAL_SPECIFIC_GUIDANCE, WRITING_TIPS } from "./mlTypes";

interface MLGuidancePanelProps {
  open: boolean;
  onClose: () => void;
}

export default function MLGuidancePanel({ open, onClose }: MLGuidancePanelProps) {
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
                  <ShieldAlert className="h-4 w-4" /> Nepal-Specific Guidance
                </span>
                <ul className="space-y-1.5">
                  {NEPAL_SPECIFIC_GUIDANCE.map((tip, idx) => (
                    <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-3 relative before:content-['–'] before:absolute before:left-0 before:text-nepal-crimson/60">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-nepal-blue dark:text-nepal-blue-light font-mono flex items-center gap-1.5 mb-2">
                  <Sparkles className="h-4 w-4" /> Writing Tips
                </span>
                <ul className="space-y-1.5">
                  {WRITING_TIPS.map((tip, idx) => (
                    <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-3 relative before:content-['–'] before:absolute before:left-0 before:text-nepal-blue/60">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}