import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Loader2 } from "lucide-react";
import { getScholarships, Scholarship } from "../../lib/scholarships";

interface CreateApplicationModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (input: { application_name: string; scholarship_id: string | null; deadline: string | null }) => Promise<void>;
}

export default function CreateApplicationModal({ open, onClose, onCreate }: CreateApplicationModalProps) {
  const [name, setName] = useState("");
  const [scholarshipId, setScholarshipId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load the scholarship list once, only while the modal is open —
  // reuses the existing getScholarships() from src/lib/scholarships.ts
  // directly; no new scholarship data source is introduced.
  useEffect(() => {
    if (!open) return;
    getScholarships().then((res) => {
      if (res.data) setScholarships(res.data);
    });
  }, [open]);

  const reset = () => {
    setName("");
    setScholarshipId("");
    setDeadline("");
    setError(null);
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Application name is required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onCreate({
        application_name: name.trim(),
        scholarship_id: scholarshipId || null,
        deadline: deadline || null,
      });
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-md w-full p-6 relative"
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="font-extrabold text-base text-slate-800 dark:text-white mb-4">Create Application</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                  Application Name <span className="text-nepal-crimson">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Chevening 2027"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-nepal-crimson"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                  Scholarship <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <select
                  value={scholarshipId}
                  onChange={(e) => setScholarshipId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-nepal-crimson"
                >
                  <option value="">Not linked to a specific scholarship</option>
                  {scholarships.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} — {s.organization}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                  Deadline <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-nepal-crimson"
                />
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-nepal-blue to-nepal-blue-light text-white rounded-xl text-sm font-bold shadow-sm hover:opacity-95 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1.5"
                >
                  {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}