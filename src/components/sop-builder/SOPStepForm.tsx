import React from "react";
import { SOPStepMeta, countWords } from "./sopTypes";

interface SOPStepFormProps {
  step: SOPStepMeta;
  value: string;
  onChange: (text: string) => void;
}

/**
 * Module: Guided multi-step SOP Builder.
 *
 * "Guided" here means a fixed, pre-written question the student
 * reflects on before writing, plus a suggested word range — both
 * static content, not generated per response. Nothing here writes,
 * rewrites, or scores the student's text; the word counter is a
 * simple deterministic count, not a quality judgment.
 */
export default function SOPStepForm({ step, value, onChange }: SOPStepFormProps) {
  const wordCount = countWords(value);
  const [minWords, maxWords] = step.suggestedWordRange;
  const inRange = wordCount >= minWords && wordCount <= maxWords;

  return (
    <div>
      <h3 className="font-extrabold text-base text-slate-800 dark:text-white mb-1.5">{step.label}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{step.guidingQuestion}</p>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={step.placeholder}
        rows={10}
        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-nepal-crimson/20 focus:border-nepal-crimson transition-all resize-none leading-relaxed"
      />

      <div className="flex items-center justify-between mt-2">
        <span className={`text-[11px] font-bold ${inRange ? "text-emerald-500" : "text-slate-400 dark:text-slate-500"}`}>
          {wordCount} words
        </span>
        <span className="text-[11px] text-slate-400 dark:text-slate-500">
          Suggested: {minWords}–{maxWords} words
        </span>
      </div>
    </div>
  );
}