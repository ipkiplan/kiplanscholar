import React from "react";

interface SummaryFormProps {
  value: string;
  onChange: (text: string) => void;
}

export default function SummaryForm({ value, onChange }: SummaryFormProps) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
        Professional Summary
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        placeholder="A short paragraph introducing your academic background, goals, and what makes you a strong scholarship candidate..."
        className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-nepal-crimson/20 focus:border-nepal-crimson transition-all resize-none leading-relaxed"
      />
      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
        Optional, but recommended — 2 to 4 sentences is usually enough.
      </p>
    </div>
  );
}