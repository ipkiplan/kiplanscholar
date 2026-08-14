import React from "react";
import { LORData, LORFieldSchema } from "./lorTypes";

interface LORFieldGroupFormProps {
  sectionLabel: string;
  fields: LORFieldSchema[];
  data: LORData;
  onChange: (key: keyof LORData, value: string) => void;
}

/**
 * The single form component used for all 9 non-preview LOR sections —
 * driven entirely by the field schema in lorTypes.ts, the same
 * "one generic form + config" principle CV Builder established with
 * RepeatableEntryForm.tsx. Avoids 9 near-identical section files.
 */
export default function LORFieldGroupForm({ sectionLabel, fields, data, onChange }: LORFieldGroupFormProps) {
  return (
    <div>
      <h3 className="font-extrabold text-base text-slate-800 dark:text-white mb-4">{sectionLabel}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field) => {
          const value = data[field.key];
          const isWide = field.type === "textarea" || field.type === "select";
          return (
            <div key={field.key} className={isWide ? "sm:col-span-2" : ""}>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">{field.label}</label>

              {field.type === "select" && field.options ? (
                <div className="flex flex-wrap gap-2">
                  {field.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => onChange(field.key, option)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                        value === option
                          ? "bg-nepal-crimson text-white border-nepal-crimson"
                          : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-nepal-crimson/40"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : field.type === "textarea" ? (
                <textarea
                  value={value}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={4}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-nepal-crimson/20 focus:border-nepal-crimson transition-all resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-nepal-crimson/20 focus:border-nepal-crimson transition-all"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}