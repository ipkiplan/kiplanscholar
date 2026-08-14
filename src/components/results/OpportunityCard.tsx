import React, { useState } from "react";
import {
  Calendar,
  DollarSign,
  Briefcase,
  CheckCircle,
  ExternalLink,
  Heart,
  Share2,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock,
  Layers,
} from "lucide-react";
import { EnrichedOpportunity } from "./types";
import StatusBadge, { OpportunityStatus } from "./StatusBadge";
import CountryBadge from "./CountryBadge";
import EducationBadge from "./EducationBadge";
import FundingBadge from "./FundingBadge";

interface OpportunityCardProps {
  opportunity: EnrichedOpportunity;
  isSaved: boolean;
  onSaveToggle: (e: React.MouseEvent) => void;
  onExplore: () => void;
}

export default function OpportunityCard({
  opportunity,
  isSaved,
  onSaveToggle,
  onExplore,
}: OpportunityCardProps) {
  const [copied, setCopied] = useState<boolean>(false);

  // Copy official link helper
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = opportunity.officialWebsite || opportunity.link || window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Generate beautiful initials logo
  const getInitials = (name: string) => {
    const words = name.replace(/[^a-zA-Z0-9 ]/g, "").split(" ").filter(Boolean);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return "OP";
  };

  // Generate consistent light background colors for organization placeholder logos
  const hash = opportunity.organization.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const gradients = [
    "from-blue-500/10 to-indigo-600/10 text-blue-600 dark:text-blue-400 border-blue-200/40 dark:border-blue-900/40",
    "from-emerald-500/10 to-teal-600/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/40 dark:border-emerald-900/40",
    "from-rose-500/10 to-red-600/10 text-rose-600 dark:text-rose-400 border-rose-200/40 dark:border-rose-900/40",
    "from-amber-500/10 to-orange-600/10 text-amber-600 dark:text-amber-400 border-amber-200/40 dark:border-amber-900/40",
    "from-violet-500/10 to-fuchsia-600/10 text-violet-600 dark:text-violet-400 border-violet-200/40 dark:border-violet-900/40",
  ];
  const bgGradient = gradients[hash % gradients.length];

  return (
    <div
      onClick={onExplore}
      className="group bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/80 hover:border-nepal-crimson dark:hover:border-nepal-crimson-light rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between h-full relative overflow-hidden"
      id={`opportunity-card-${opportunity.id}`}
    >
      {/* Visual indicator bar */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-nepal-blue via-nepal-crimson to-nepal-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="space-y-4">
        {/* Header: Logo, Org, Title, Actions */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Org Logo */}
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-xs bg-gradient-to-br ${bgGradient} shrink-0 font-mono shadow-xs`}>
              {getInitials(opportunity.organization)}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold font-mono text-slate-400 dark:text-slate-500 truncate max-w-[150px]">
                  {opportunity.organization}
                </span>
                <span className="inline-flex items-center gap-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[8.5px] font-extrabold px-1 rounded border border-emerald-500/15 uppercase font-mono tracking-wide shrink-0">
                  <ShieldCheck className="h-2.5 w-2.5" />
                  <span>Verified</span>
                </span>
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-white group-hover:text-nepal-crimson dark:group-hover:text-nepal-crimson-light transition-all line-clamp-1 mt-0.5">
                {opportunity.title}
              </h4>
            </div>
          </div>

          {/* Share & Saved Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Share link with tooltip */}
            <div className="relative">
              {copied && (
                <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold py-1 px-1.5 rounded shadow-xs whitespace-nowrap z-20">
                  Copied!
                </span>
              )}
              <button
                onClick={handleShare}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-400 hover:text-nepal-blue dark:hover:text-sky-400 hover:border-nepal-blue/30 transition-all cursor-pointer"
                title="Copy portal link"
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
                  : "bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-300 dark:bg-slate-950 dark:border-slate-800"
              }`}
              title={isSaved ? "Saved" : "Save Opportunity"}
            >
              <Heart className={`h-3.5 w-3.5 ${isSaved ? "fill-rose-500 stroke-rose-500" : ""}`} />
            </button>
          </div>
        </div>

        {/* Badges Row: Country, Type, Education Level, Funding */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <CountryBadge country={opportunity.country} />
          <span className="inline-flex items-center gap-1 text-[9.5px] uppercase font-black tracking-wider px-2 py-0.5 bg-nepal-blue/5 text-nepal-blue dark:text-sky-400 border border-nepal-blue/10 rounded font-mono">
            <Layers className="h-2.5 w-2.5" />
            <span>{opportunity.opportunityType}</span>
          </span>
          <EducationBadge level={opportunity.educationLevel} />
          <FundingBadge funding={opportunity.funding} />
          <StatusBadge status={opportunity.status as OpportunityStatus} daysRemaining={opportunity.daysRemaining} />
        </div>

        {/* Brief description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {opportunity.description}
        </p>

        {/* Benefits & Eligibility Summaries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-50 dark:border-slate-900/40">
          {/* Key Benefits */}
          <div className="space-y-1.5">
            <span className="block text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 tracking-wider font-mono">
              Key Benefits
            </span>
            <ul className="space-y-1">
              {opportunity.benefits.slice(0, 3).map((ben, idx) => (
                <li key={idx} className="flex items-start gap-1 text-[11px] text-slate-600 dark:text-slate-300 min-w-0">
                  <CheckCircle className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="truncate" title={ben}>{ben}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Eligibility Criteria */}
          <div className="space-y-1.5">
            <span className="block text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 tracking-wider font-mono">
              Eligibility Summary
            </span>
            <ul className="space-y-1">
              {opportunity.eligibility.slice(0, 3).map((elig, idx) => (
                <li key={idx} className="flex items-start gap-1 text-[11px] text-slate-600 dark:text-slate-300 min-w-0">
                  <CheckCircle className="h-3 w-3 text-nepal-blue dark:text-sky-400 mt-0.5 shrink-0" />
                  <span className="truncate" title={elig}>{elig}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tag pills */}
        <div className="flex flex-wrap gap-1 pt-1.5">
          {opportunity.tags.slice(0, 4).map((tag, idx) => (
            <span
              key={idx}
              className="text-[9.5px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950 border border-slate-200/30 dark:border-slate-800/80 px-2 py-0.5 rounded-lg"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Row: Deadline, Intake, Action */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-[11px] text-slate-400 dark:text-slate-500 font-mono">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-slate-400" />
            <span>Intake: <strong>{opportunity.intake}</strong></span>
          </span>
          <span className="hidden sm:inline text-slate-200 dark:text-slate-800">|</span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-slate-400" />
            <span>Deadline: <strong>{opportunity.applicationDeadline}</strong></span>
          </span>
        </div>

        {/* Action Details Trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExplore();
          }}
          className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200/50 dark:border-slate-800 transition-all cursor-pointer flex items-center justify-center gap-0.5 text-xs font-black shrink-0"
        >
          <span>View Details</span>
          <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}