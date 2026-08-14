import React from "react";
import { Target, Lightbulb, Quote, AlertTriangle } from "lucide-react";
import { MLSectionMeta, MLTemplateId, countWords } from "./mlTypes";

interface MLStepFormProps {
  section: MLSectionMeta;
  template: MLTemplateId;
  value: string;
  onChange: (text: string) => void;
}

/**
 * The interactive writing coach. Every piece of guidance here is
 * static, pre-written reference content — the "Example Blueprint" is
 * a sentence starter/pattern to think from, never text inserted into
 * the student's letter. Nothing in this component writes, rewrites,
 * or scores the student's actual words; the word counter is a simple
 * deterministic count, not a quality judgment. Matches the "teaches,
 * doesn't generate" boundary stated in the ES.
 */
export default function MLStepForm({ section, template, value, onChange }: MLStepFormProps) {
  const wordCount = countWords(value);
  const [minWords, maxWords] = section.recommendedWordRange;
  const inRange = wordCount >= minWords && wordCount <= maxWords;
  const guidance = section.guidance[template];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-extrabold text-base text-slate-800 dark:text-white mb-1.5 flex items-center gap-2">
          <Target className="h-4 w-4 text-nepal-crimson shrink-0" />
          {section.label}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{section.objective}</p>
      </div>

      <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800/60 space-y-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase font-mono flex items-center gap-1.5">
          <Lightbulb className="h-3.5 w-3.5 text-nepal-blue dark:text-nepal-blue-light" /> Writing Advice
        </span>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{guidance.writingAdvice}</p>
      </div>

      <div className="p-3.5 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase font-mono flex items-center gap-1.5">
          <Quote className="h-3.5 w-3.5 text-nepal-gold" /> Example Blueprint
        </span>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-serif italic">{guidance.exampleBlueprint}</p>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write this section in your own words — use the blueprint above as a starting pattern, not text to copy."
        rows={8}
        className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-nepal-crimson/20 focus:border-nepal-crimson transition-all resize-none leading-relaxed"
      />

      <div className="flex items-center justify-between">
        <span className={`text-[11px] font-bold ${inRange ? "text-emerald-500" : "text-slate-400 dark:text-slate-500"}`}>
          {wordCount} words
        </span>
        <span className="text-[11px] text-slate-400 dark:text-slate-500">
          Recommended: {minWords}–{maxWords} words
        </span>
      </div>

      <div className="p-3 bg-red-500/5 dark:bg-red-500/10 border border-red-500/10 rounded-xl">
        <span className="text-[10px] font-bold text-red-500 uppercase font-mono flex items-center gap-1.5 mb-1.5">
          <AlertTriangle className="h-3.5 w-3.5" /> Common Mistakes to Avoid
        </span>
        <ul className="space-y-1">
          {section.commonMistakes.map((mistake, idx) => (
            <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-3 relative before:content-['–'] before:absolute before:left-0 before:text-red-400">
              {mistake}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}