import React, { useState } from "react";
import { 
  ExternalLink, 
  Heart, 
  Share2, 
  ArrowRight, 
  ShieldCheck 
} from "lucide-react";
import { Scholarship } from "../types";

interface ScholarshipCardProps {
  scholarship: Scholarship;
  isSaved: boolean;
  onSaveToggle: (e: React.MouseEvent) => void;
  onExplore: () => void;
}

// Country flags lookup map
const COUNTRY_FLAGS: Record<string, string> = {
  "United Kingdom": "🇬🇧",
  "United States": "🇺🇸",
  "Germany": "🇩🇪",
  "Australia": "🇦🇺",
  "Europe": "🇪🇺",
  "Japan": "🇯🇵",
  "South Korea": "🇰🇷",
  "China": "🇨🇳",
  "India": "🇮🇳",
  "Any": "🌐",
  "Canada": "🇨🇦",
  "Italy": "🇮🇹",
  "Switzerland": "🇨🇭",
  "Netherlands": "🇳🇱",
  "Belgium": "🇧🇪",
  "France": "🇫🇷",
  "Singapore": "🇸🇬",
  "Hong Kong": "🇭🇰",
  "New Zealand": "🇳🇿",
  "Turkey": "🇹🇷"
};

// Academic level translations to fit the requested Degree Level Badges
const LEVEL_LABELS: Record<string, string> = {
  "Undergraduate": "Bachelor",
  "Graduate": "Master",
  "PhD": "PhD",
  "Research": "Research",
  "Any": "All Levels"
};

// Beautiful initials-based organization logo generator with a consistent hash-based premium soft gradient
function OrgLogo({ name }: { name: string }) {
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradients = [
    "from-indigo-500/10 to-blue-600/10 text-indigo-600 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-800/40",
    "from-rose-500/10 to-red-600/10 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-800/40",
    "from-emerald-500/10 to-teal-600/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/40",
    "from-sky-500/10 to-blue-600/10 text-sky-600 dark:text-sky-400 border-sky-200/50 dark:border-sky-800/40",
    "from-amber-500/10 to-orange-600/10 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/40",
    "from-violet-500/10 to-fuchsia-600/10 text-violet-600 dark:text-violet-400 border-violet-200/50 dark:border-violet-800/40"
  ];
  const gradientClass = gradients[hash % gradients.length];
  
  // Extract clean initials
  const cleanName = name.replace(/[^a-zA-Z0-9 ]/g, "");
  const words = cleanName.split(" ").filter(w => w.length > 0);
  let initials = "";
  if (words.length >= 2) {
    initials = (words[0][0] + words[1][0]).toUpperCase();
  } else if (words.length === 1) {
    initials = words[0].slice(0, 2).toUpperCase();
  } else {
    initials = "SL";
  }

  return (
    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-xs bg-gradient-to-br ${gradientClass} shrink-0 shadow-xs font-mono`}>
      {initials}
    </div>
  );
}

// Calculate colored status for the application deadline relative to the active reference date: July 15, 2026
function getDeadlineStatus(deadlineStr: string) {
  if (!deadlineStr || deadlineStr.toLowerCase().includes("rolling")) {
    return {
      status: "green",
      text: "Rolling",
      colorClass: "text-emerald-600 bg-emerald-50 border-emerald-200/50 dark:text-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-800/30",
      dotClass: "bg-emerald-500"
    };
  }

  const referenceDate = new Date("2026-07-15");
  const deadlineDate = new Date(deadlineStr);
  
  if (isNaN(deadlineDate.getTime())) {
    return {
      status: "green",
      text: "Active",
      colorClass: "text-emerald-600 bg-emerald-50 border-emerald-200/50 dark:text-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-800/30",
      dotClass: "bg-emerald-500"
    };
  }

  const diffTime = deadlineDate.getTime() - referenceDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      status: "red",
      text: "Closed",
      colorClass: "text-rose-600 bg-rose-50 border-rose-200/50 dark:text-rose-400 dark:bg-rose-950/30 dark:border-rose-800/30",
      dotClass: "bg-rose-500"
    };
  } else if (diffDays < 30) {
    return {
      status: "red",
      text: `${diffDays} days left`,
      colorClass: "text-rose-600 bg-rose-50 border-rose-200/50 dark:text-rose-400 dark:bg-rose-950/30 dark:border-rose-800/30",
      dotClass: "bg-rose-500"
    };
  } else if (diffDays < 90) {
    return {
      status: "orange",
      text: `${diffDays} days left`,
      colorClass: "text-amber-600 bg-amber-50 border-amber-200/50 dark:text-amber-400 dark:bg-amber-950/30 dark:border-amber-800/30",
      dotClass: "bg-amber-500"
    };
  } else {
    return {
      status: "green",
      text: `${diffDays} days left`,
      colorClass: "text-emerald-600 bg-emerald-50 border-emerald-200/50 dark:text-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-800/30",
      dotClass: "bg-emerald-500"
    };
  }
}

export default function ScholarshipCard({
  scholarship,
  isSaved,
  onSaveToggle,
  onExplore
}: ScholarshipCardProps) {
  const [copied, setCopied] = useState<boolean>(false);

  // Handle Share callback securely with a non-blocking UI copy indicator
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = scholarship.officialWebsite || window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const deadlineInfo = getDeadlineStatus(scholarship.applicationDeadline);

  return (
    <div
      onClick={onExplore}
      className="group bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 hover:border-nepal-crimson dark:hover:border-nepal-crimson-light rounded-2xl p-5 shadow-premium hover:shadow-premium-hover transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between h-full cursor-pointer relative overflow-hidden"
    >
      {/* Decorative accent on hover */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-nepal-blue via-nepal-crimson to-nepal-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="space-y-3.5">
        
        {/* Header Row: Org Logo, Verified Badge, Title & Interactive Action Icons */}
        <div className="flex justify-between items-start gap-3">
          
          {/* Logo & Org Details */}
          <div className="flex items-center gap-2.5 min-w-0">
            <OrgLogo name={scholarship.organization} />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-bold font-mono truncate max-w-[130px]" title={scholarship.organization}>
                  {scholarship.organization}
                </span>
                
                {/* Verified Badge */}
                <span className="inline-flex items-center gap-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[8.5px] font-extrabold px-1 py-0.2 rounded border border-emerald-500/15 shrink-0 uppercase font-mono">
                  <ShieldCheck className="h-2.5 w-2.5" />
                  <span>Verified</span>
                </span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-white group-hover:text-nepal-crimson dark:group-hover:text-nepal-crimson-light transition-all line-clamp-1 leading-tight mt-0.5" title={scholarship.title}>
                {scholarship.title}
              </h3>
            </div>
          </div>

          {/* Share & Save Action Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Share Button with Tooltip Confirmation */}
            <div className="relative">
              {copied && (
                <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold py-1 px-1.5 rounded shadow-sm whitespace-nowrap z-20">
                  Copied!
                </span>
              )}
              <button
                onClick={handleShare}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-nepal-blue dark:hover:text-sky-400 hover:border-nepal-blue/30 dark:hover:border-sky-800 transition-all cursor-pointer"
                title="Share link"
              >
                <Share2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Save Heart Button */}
            <button
              onClick={onSaveToggle}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isSaved
                  ? "bg-rose-500/10 border-rose-400 text-rose-500 dark:bg-rose-950/30 dark:border-rose-900"
                  : "bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-300 dark:bg-slate-900 dark:border-slate-800"
              }`}
              title={isSaved ? "Saved" : "Save Opportunity"}
            >
              <Heart className={`h-3.5 w-3.5 ${isSaved ? "fill-rose-500 stroke-rose-500" : ""}`} />
            </button>
          </div>

        </div>

        {/* Badges Row: Country Flag, Funding Level, Degree level pills */}
        <div className="flex flex-wrap gap-1 items-center">
          
          {/* Country Badge with Flag */}
          <span className="inline-flex items-center gap-1 text-[9.5px] uppercase font-bold tracking-wider px-1.8 py-0.5 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 rounded font-mono border border-slate-200/40 dark:border-slate-700/50">
            <span className="text-[11px]" role="img" aria-label={scholarship.country}>
              {COUNTRY_FLAGS[scholarship.country] || "🌐"}
            </span>
            <span>{scholarship.country}</span>
          </span>

          {/* Funding Badge */}
          <span className={`inline-flex items-center gap-1 text-[9.5px] uppercase font-bold tracking-wider px-1.8 py-0.5 rounded font-mono border ${
            scholarship.fullyFunded === "Yes"
              ? "text-emerald-600 bg-emerald-50 border-emerald-200/50 dark:text-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-800/30"
              : "text-blue-600 bg-blue-50 border-blue-200/50 dark:text-blue-400 dark:bg-blue-950/30 dark:border-blue-800/30"
          }`}>
            <span>{scholarship.fullyFunded === "Yes" ? "Fully Funded" : "Partially Funded"}</span>
          </span>

          {/* Degree Level Badges */}
          {scholarship.levels.map((level, idx) => (
            <span key={idx} className="inline-flex items-center gap-1 text-[9.5px] uppercase font-bold tracking-wider px-1.8 py-0.5 bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 rounded font-mono border border-slate-200/40 dark:border-slate-700/50">
              <span>{LEVEL_LABELS[level] || level}</span>
            </span>
          ))}

        </div>

        {/* Content Body: SNUG description for height preservation */}
        <p className="text-[11.5px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {scholarship.description}
        </p>

      </div>

      {/* Snug Footer Row: Deadline Status Badge & Clickable Details Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        
        {/* Left: Deadline Relative Colored status */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-slate-400 dark:text-slate-500 font-bold font-mono text-[9px] uppercase tracking-wider shrink-0">Deadline:</span>
          <span className={`inline-flex items-center gap-1 px-1.8 py-0.5 rounded-full text-[9.5px] font-mono font-bold border shrink-0 ${deadlineInfo.colorClass}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${deadlineInfo.dotClass} animate-pulse`} />
            <span className="truncate">{deadlineInfo.text}</span>
          </span>
        </div>

        {/* Right: Apply & Details Actions (with propagation guards) */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Apply button link */}
          <a
            href={scholarship.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 bg-gradient-to-r from-nepal-blue to-nepal-blue-light dark:from-nepal-crimson dark:to-nepal-crimson-light hover:opacity-95 text-white rounded-lg transition-all z-10 cursor-pointer flex items-center justify-center"
            title="Apply on official website"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          {/* Details toggle button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExplore();
            }}
            className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200/50 dark:border-slate-800 transition-all cursor-pointer flex items-center justify-center gap-0.5 text-[10.5px] font-bold shrink-0"
          >
            <span>Details</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>

    </div>
  );
}
