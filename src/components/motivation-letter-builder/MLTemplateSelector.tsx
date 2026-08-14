import React from "react";
import { MLTemplateId, ML_TEMPLATES } from "./mlTypes";

interface MLTemplateSelectorProps {
  value: MLTemplateId;
  onChange: (template: MLTemplateId) => void;
}

/**
 * Unlike SOP Builder's template selector (which changes the preview's
 * visual style and paragraph order), these modes only change which
 * per-section writing advice and example blueprints are shown — the
 * letter's structure and the student's own words never change when
 * switching. Each button's title attribute makes this explicit.
 */
export default function MLTemplateSelector({ value, onChange }: MLTemplateSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {ML_TEMPLATES.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          title={t.description}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
            value === t.id
              ? "bg-nepal-crimson text-white border-nepal-crimson"
              : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-nepal-crimson/40"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}