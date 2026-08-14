import React from "react";
import { ExternalLink, ArrowRight, MapPin, Landmark } from "lucide-react";
import { University, naOr } from "../../lib/universities";

interface UniversityCardProps {
  university: University;
  onViewDetails: () => void;
}

/**
 * Small, local initials-logo generator — deliberately not importing
 * ScholarshipCard.tsx's OrgLogo (it isn't exported, and ScholarshipCard
 * is tied to the Opportunity Explorer, which this module must not
 * touch). Same visual idea, kept self-contained in this folder,
 * consistent with how every other builder/module folder in this
 * project already keeps its own small helpers rather than reaching
 * into another feature's files.
 */
function UniLogo({ name }: { name: string }) {
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradients = [
    "from-indigo-500/10 to-blue-600/10 text-indigo-600 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-800/40",
    "from-rose-500/10 to-red-600/10 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-800/40",
    "from-emerald-500/10 to-teal-600/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/40",
    "from-sky-500/10 to-blue-600/10 text-sky-600 dark:text-sky-400 border-sky-200/50 dark:border-sky-800/40",
    "from-amber-500/10 to-orange-600/10 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/40",
  ];
  const gradientClass = gradients[hash % gradients.length];
  const words = name.replace(/[^a-zA-Z0-9 ]/g, "").split(" ").filter((w) => w.length > 0);
  const initials =
    words.length >= 2 ? (words[0][0] + words[1][0]).toUpperCase() : (words[0] ?? "U").slice(0, 2).toUpperCase();

  return (
    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-xs bg-gradient-to-br ${gradientClass} shrink-0 shadow-xs font-mono`}>
      {initials}
    </div>
  );
}

export default function UniversityCard({ university, onViewDetails }: UniversityCardProps) {
  return (
    <div
      onClick={onViewDetails}
      className="group bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 hover:border-nepal-crimson dark:hover:border-nepal-crimson-light rounded-2xl p-5 shadow-premium hover:shadow-premium-hover transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-full cursor-pointer relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-nepal-blue via-nepal-crimson to-nepal-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="space-y-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <UniLogo name={university.name} />
          <div className="min-w-0">
            <div className="flex items-center gap-1 text-[10.5px] text-slate-400 dark:text-slate-500 font-bold">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{university.city}, {university.country}</span>
            </div>
            <h3
              className="font-extrabold text-sm text-slate-800 dark:text-white group-hover:text-nepal-crimson dark:group-hover:text-nepal-crimson-light transition-all line-clamp-2 leading-tight mt-0.5"
              title={university.name}
            >
              {university.name}
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 items-center">
          {university.publicPrivate && (
            <span className="inline-flex items-center gap-1 text-[9.5px] uppercase font-bold tracking-wider px-1.8 py-0.5 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 rounded font-mono border border-slate-200/40 dark:border-slate-700/50">
              <Landmark className="h-2.5 w-2.5" />
              {university.publicPrivate}
            </span>
          )}
          {university.qsRanking !== null && (
            <span className="inline-flex items-center gap-1 text-[9.5px] uppercase font-bold tracking-wider px-1.8 py-0.5 bg-nepal-gold/10 text-nepal-gold rounded font-mono border border-nepal-gold/20">
              QS #{university.qsRanking}
            </span>
          )}
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400 dark:text-slate-500 font-mono text-[9.5px] uppercase">Tuition</span>
            <span className="font-bold text-slate-600 dark:text-slate-300 text-right line-clamp-1 max-w-[65%]">{naOr(university.tuitionRange)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <a
          href={university.website ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`p-1.5 rounded-lg transition-all z-10 cursor-pointer flex items-center justify-center ${
            university.website
              ? "bg-gradient-to-r from-nepal-blue to-nepal-blue-light dark:from-nepal-crimson dark:to-nepal-crimson-light text-white hover:opacity-95"
              : "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 pointer-events-none"
          }`}
          title={university.website ? "Visit official website" : "Website not available"}
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails();
          }}
          className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200/50 dark:border-slate-800 transition-all cursor-pointer flex items-center justify-center gap-0.5 text-[10.5px] font-bold shrink-0"
        >
          <span>Details</span>
          <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}