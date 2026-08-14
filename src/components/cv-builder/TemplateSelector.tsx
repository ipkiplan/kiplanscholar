import React from "react";
import { CVTemplateId } from "./cvTypes";

interface TemplateSelectorProps {
  value: CVTemplateId;
  onChange: (template: CVTemplateId) => void;
}

const TEMPLATES: Array<{ id: CVTemplateId; label: string; description: string }> = [
  { id: "academic", label: "Academic CV", description: "Publications & research-forward, formal serif style" },
  { id: "scholarship", label: "Scholarship CV", description: "Achievements-forward, warm accent header" },
  { id: "professional", label: "Professional CV", description: "Plain, single-column, ATS-friendly" },
];

export default function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
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