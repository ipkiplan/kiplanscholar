import React from "react";
import { LORTypeId, LOR_TYPES } from "./lorTypes";

interface LORTypeSelectorProps {
  value: LORTypeId;
  onChange: (type: LORTypeId) => void;
}

export default function LORTypeSelector({ value, onChange }: LORTypeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {LOR_TYPES.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
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