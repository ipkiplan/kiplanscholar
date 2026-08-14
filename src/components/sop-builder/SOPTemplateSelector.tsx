import React from "react";
import { SOPTemplateId } from "./sopTypes";

interface SOPTemplateSelectorProps {
  value: SOPTemplateId;
  onChange: (template: SOPTemplateId) => void;
}

const TEMPLATES: Array<{ id: SOPTemplateId; label: string; description: string }> = [
  { id: "academic", label: "Academic", description: "Leads with academic background, formal tone" },
  { id: "research", label: "Research", description: "Leads with motivation & research interest" },
  { id: "professional", label: "Professional", description: "Leads with career trajectory & goals" },
];

export default function SOPTemplateSelector({ value, onChange }: SOPTemplateSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {TEMPLATES.map((t) => (
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