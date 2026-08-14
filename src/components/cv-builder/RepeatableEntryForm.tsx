import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { CVEntry, CVFieldSchema, CVListSectionKey } from "./cvTypes";

interface RepeatableEntryFormProps {
  section: CVListSectionKey;
  sectionLabel: string;
  fields: CVFieldSchema[];
  entries: CVEntry[];
  onAdd: () => void;
  onUpdate: (id: string, field: string, value: string) => void;
  onRemove: (id: string) => void;
}

export default function RepeatableEntryForm({
  sectionLabel,
  fields,
  entries,
  onAdd,
  onUpdate,
  onRemove,
}: RepeatableEntryFormProps) {
  return (
    <div className="space-y-4">
      {entries.length === 0 && (
        <p className="text-sm text-slate-400 dark:text-slate-500">
          No {sectionLabel.toLowerCase()} added yet. This section is optional — add an entry if it applies to you.
        </p>
      )}

      {entries.map((entry, index) => (
        <div
          key={entry.id}
          className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              {sectionLabel} #{index + 1}
            </span>
            <button
              type="button"
              onClick={() => onRemove(entry.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
              aria-label={`Remove this ${sectionLabel.toLowerCase()} entry`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fields.map((field) => (
              <div key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                  {field.label} {field.required && <span className="text-nepal-crimson">*</span>}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    value={(entry[field.key] as string) ?? ""}
                    onChange={(e) => onUpdate(entry.id, field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-nepal-crimson/20 focus:border-nepal-crimson transition-all resize-none"
                  />
                ) : (
                  <input
                    type={field.type === "month" ? "month" : "text"}
                    value={(entry[field.key] as string) ?? ""}
                    onChange={(e) => onUpdate(entry.id, field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-nepal-crimson/20 focus:border-nepal-crimson transition-all"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-nepal-crimson dark:text-nepal-crimson-light border border-dashed border-nepal-crimson/40 hover:bg-nepal-crimson/5 transition-colors cursor-pointer"
      >
        <Plus className="h-3.5 w-3.5" />
        Add {sectionLabel}
      </button>
    </div>
  );
}