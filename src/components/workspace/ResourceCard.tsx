import React from "react";
import { ExternalLink, Clock3 } from "lucide-react";

interface ResourceCardProps {
  title: string;
  description: string;
  isPlaceholder: boolean;
  onOpen: () => void;
}

export default function ResourceCard({ title, description, isPlaceholder, onOpen }: ResourceCardProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group text-left p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 hover:border-nepal-crimson/40 hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer flex flex-col gap-2"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">{title}</h3>
        {isPlaceholder ? (
          <Clock3 className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
        ) : (
          <ExternalLink className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600 group-hover:text-nepal-crimson transition-colors shrink-0 mt-0.5" />
        )}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
      {isPlaceholder && (
        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">Coming Soon</span>
      )}
    </button>
  );
}