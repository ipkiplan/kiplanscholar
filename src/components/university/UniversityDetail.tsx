import React from "react";
import {
  MapPin,
  Landmark,
  Trophy,
  Wallet,
  Languages,
  ExternalLink,
  BookOpen,
  GraduationCap,
  FileText,
  X,
} from "lucide-react";
import { University, naOr, naOrList } from "../../lib/universities";

interface UniversityDetailProps {
  university: University;
  onClose: () => void;
}

interface DetailRow {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}

/**
 * Overview/Location/Rankings/Tuition/Language rows are built from a
 * plain array rather than hand-laid-out JSX — a future ES phase that
 * needs to add a new field (e.g. a Scholarship-linking row in ES-010E)
 * only needs to push another entry into this list, not restructure the
 * component. The three prose sections below (disciplines, English
 * programmes, notes) follow the same "one block per concern" shape for
 * the same reason.
 */
export default function UniversityDetail({ university, onClose }: UniversityDetailProps) {
  const rows: DetailRow[] = [
    { icon: MapPin, label: "Location", value: `${naOr(university.city)}, ${naOr(university.country)}` },
    { icon: Landmark, label: "Public / Private", value: naOr(university.publicPrivate) },
    { icon: FileText, label: "Established", value: naOr(university.establishedYear) },
    { icon: Trophy, label: "QS World Ranking 2026", value: university.qsRanking !== null ? `#${university.qsRanking}` : "Not Available" },
    { icon: Trophy, label: "THE World Ranking", value: university.theRanking !== null ? `#${university.theRanking}` : "Not Available" },
    { icon: Wallet, label: "Tuition Range", value: naOr(university.tuitionRange) },
    { icon: Languages, label: "Language of Instruction", value: naOr(university.language) },
  ];

  return (
    <div className="bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-premium overflow-hidden">
      <div className="flex items-start justify-between gap-4 p-6 border-b border-slate-100 dark:border-slate-800/60">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-nepal-gold font-mono block">
            University Profile
          </span>
          <h2 className="text-xl font-extrabold text-nepal-blue dark:text-white mt-1">{university.name}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Overview / Location / Rankings / Tuition / Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {rows.map((row) => (
            <div key={row.label} className="flex gap-3 items-start">
              <div className="p-2 bg-nepal-blue/5 dark:bg-nepal-blue-light/10 text-nepal-blue dark:text-nepal-blue-light rounded-xl mt-0.5 shrink-0">
                <row.icon className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase font-mono">{row.label}</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{row.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Disciplines */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800/60 space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-nepal-crimson dark:text-nepal-crimson-light" /> Main Disciplines
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{naOrList(university.mainDisciplines)}</p>
        </div>

        {/* English Programmes */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800/60 space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-nepal-crimson dark:text-nepal-crimson-light" /> English-Taught Programmes
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{naOr(university.englishProgrammes)}</p>
        </div>

        {/* Application Portal */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 rounded-xl">
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase font-mono">Application Portal</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{naOr(university.applicationPortal)}</span>
          </div>
          {university.website && (
            <a
              href={university.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-nepal-blue to-nepal-blue-light dark:from-nepal-crimson dark:to-nepal-crimson-light text-white rounded-lg text-xs font-bold shadow-sm hover:opacity-95 transition-all cursor-pointer shrink-0"
            >
              Official Website <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        {/* Notes */}
        {university.notes && (
          <div className="p-3.5 bg-amber-500/5 border border-amber-500/10 rounded-xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block mb-1">Notes</span>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">{university.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}