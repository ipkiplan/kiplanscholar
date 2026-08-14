import React, { useState } from "react";
import {
  ShieldAlert,
  Globe,
  Clock,
  DollarSign,
  Landmark,
  Compass,
  Download,
  ExternalLink,
  CheckSquare,
  IdCard,
  GraduationCap,
  Languages,
  Wallet,
  Briefcase,
  ClipboardList,
  Users,
  FileText,
  Lock,
} from "lucide-react";
import { COUNTRIES } from "../data/scholarships";
import {
  VISA_PREPARATION,
  DocumentCategoryName,
  CONSULTANCY_INTRO,
  CONSULTANCY_GUIDANCE,
  DOCUMENT_PROTECTION_GUIDANCE,
  UNIVERSAL_NEPAL_GUIDANCE,
} from "../data/visaPreparation";
import { generateVisaChecklistPdf } from "../utils/visaChecklistPdf";

// Countries this Foundation release covers — matches ES-007A scope
// exactly (the 12 countries already in Country Guide). Adding a
// country here later only requires a new VISA_PREPARATION entry; no
// UI change needed.
const SUPPORTED_CODES = Object.keys(VISA_PREPARATION);

const CATEGORY_ICONS: Record<DocumentCategoryName, React.ElementType> = {
  Identity: IdCard,
  Academic: GraduationCap,
  Language: Languages,
  Financial: Wallet,
  Employment: Briefcase,
  "Additional Country Requirements": ClipboardList,
};

export default function VisaPreparationHub() {
  const availableCountries = COUNTRIES.filter((c) => SUPPORTED_CODES.includes(c.code));
  const [selectedCode, setSelectedCode] = useState(availableCountries[0]?.code ?? "");

  const selectedCountry = availableCountries.find((c) => c.code === selectedCode);
  const profile = VISA_PREPARATION[selectedCode];

  if (!selectedCountry || !profile) {
    return null;
  }

  const handleDownloadChecklist = () => {
    generateVisaChecklistPdf(
      { name: selectedCountry.name, flag: selectedCountry.flag },
      profile
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

      {/* Page Header */}
      <div className="space-y-3 text-center md:text-left">
        <span className="text-xs font-bold uppercase tracking-widest text-nepal-crimson dark:text-nepal-crimson-light font-mono bg-nepal-crimson/5 dark:bg-nepal-crimson-light/10 px-3 py-1.5 rounded-full">
          Visa Preparation Hub
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-nepal-blue dark:text-white tracking-tight">
          Prepare Your Visa Application, Step by Step
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl">
          Select your destination to see the visa overview, categorized document checklist, and Nepal-specific preparation guidance — all in one place.
        </p>
      </div>

      {/* Country Selector */}
      <div className="flex flex-wrap gap-2">
        {availableCountries.map((c) => (
          <button
            key={c.code}
            onClick={() => setSelectedCode(c.code)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
              selectedCode === c.code
                ? "bg-nepal-crimson text-white border-nepal-crimson shadow-md"
                : "bg-white dark:bg-nepal-dark text-slate-600 dark:text-slate-300 border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }`}
          >
            <span className="text-base" role="img" aria-label={c.name}>{c.flag}</span>
            <span>{c.name}</span>
          </button>
        ))}
      </div>

      {/* Visa Overview */}
      <div className="bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-premium space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/60">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-nepal-gold font-mono block">
              Visa Overview
            </span>
            <h2 className="text-xl font-extrabold text-nepal-blue dark:text-white mt-1 flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label={selectedCountry.name}>{selectedCountry.flag}</span>
              {selectedCountry.name}
            </h2>
          </div>
          <button
            onClick={handleDownloadChecklist}
            className="px-4 py-2 bg-gradient-to-r from-nepal-blue to-nepal-blue-light dark:from-nepal-crimson dark:to-nepal-crimson-light text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer hover:opacity-95"
          >
            <Download className="h-4 w-4" /> Download PDF Checklist
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <OverviewItem icon={Globe} iconWrapClass="bg-blue-500/10 text-blue-500" label="Visa Type" value={profile.overview.visaType} />
          <OverviewItem icon={Clock} iconWrapClass="bg-purple-500/10 text-purple-500" label="Processing Time" value={profile.overview.processingTime} />
          <OverviewItem icon={DollarSign} iconWrapClass="bg-emerald-500/10 text-emerald-500" label="Visa Fee" value={profile.overview.visaFee} />
          <OverviewItem icon={Compass} iconWrapClass="bg-cyan-500/10 text-cyan-500" label="Application Method" value={profile.overview.applicationMethod} />
          <OverviewItem icon={Landmark} iconWrapClass="bg-rose-500/10 text-rose-500" label="Embassy / VFS" value={profile.overview.embassyOrVfs} />
          <OverviewItem
            icon={ExternalLink}
            iconWrapClass="bg-nepal-gold/10 text-nepal-gold"
            label="Official Website"
            value={
              <a
                href={profile.overview.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {profile.overview.officialWebsite.replace(/^https?:\/\//, "")}
              </a>
            }
          />
        </div>
      </div>

      {/* Categorized Document Checklist */}
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold text-nepal-blue dark:text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-nepal-crimson" /> Required Documents
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {profile.documentCategories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.category];
            return (
              <div
                key={cat.category}
                className="bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 space-y-3 shadow-sm"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5">
                  <Icon className="h-4 w-4 text-nepal-crimson dark:text-nepal-crimson-light shrink-0" />
                  {cat.category}
                </span>
                <div className="space-y-2">
                  {cat.items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <CheckSquare className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nepal-Specific Preparation Guidance */}
      <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800/40 space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-nepal-crimson dark:text-nepal-crimson-light font-mono flex items-center gap-1.5">
          <ShieldAlert className="h-4 w-4 shrink-0" /> Nepal-Specific Preparation
        </span>
        <div className="space-y-2.5">
          {[...UNIVERSAL_NEPAL_GUIDANCE, ...profile.nepalGuidance].map((tip, idx) => (
            <div key={idx} className="flex gap-2.5 text-xs text-slate-600 dark:text-slate-300">
              <CheckSquare className="h-4 w-4 text-nepal-crimson dark:text-nepal-crimson-light shrink-0 mt-0.5" />
              <span className="leading-relaxed">{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Official Resources */}
      <div className="space-y-3">
        <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 font-mono">
          Official Resources
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {profile.officialResources.map((r) => (
            <a
              key={r.url}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-nepal-crimson/40 dark:hover:border-nepal-crimson-light/40 transition-all"
            >
              <span>{r.label}</span>
              <ExternalLink className="h-4 w-4 text-nepal-crimson dark:text-nepal-crimson-light shrink-0" />
            </a>
          ))}
        </div>
      </div>

      {/* Education Consultancy Guidance — general, not country-specific */}
      <div className="bg-gradient-to-r from-nepal-crimson/5 via-nepal-blue/5 to-nepal-gold/5 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-nepal-crimson/5 dark:bg-nepal-crimson-light/10 text-nepal-crimson dark:text-nepal-crimson-light rounded-2xl shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-base">
              Considering an Education Consultancy?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
              {CONSULTANCY_INTRO}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pl-0 sm:pl-14">
          {CONSULTANCY_GUIDANCE.map((point, idx) => (
            <div key={idx} className="flex gap-2 text-xs text-slate-600 dark:text-slate-300">
              <CheckSquare className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                <span className="font-bold text-slate-700 dark:text-slate-200">{point.label}: </span>
                {point.description}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Protect Your Original Documents — companion guidance to the consultancy section above */}
      <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800/40 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-nepal-blue/5 dark:bg-nepal-blue-light/10 text-nepal-blue dark:text-nepal-blue-light rounded-xl shrink-0">
            <Lock className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-sm">
              {DOCUMENT_PROTECTION_GUIDANCE.heading}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
              {DOCUMENT_PROTECTION_GUIDANCE.intro}
            </p>
          </div>
        </div>
        <div className="space-y-2.5 pl-0 sm:pl-12">
          {DOCUMENT_PROTECTION_GUIDANCE.points.map((point, idx) => (
            <div key={idx} className="flex gap-2.5 text-xs text-slate-600 dark:text-slate-300">
              <CheckSquare className="h-4 w-4 text-nepal-blue dark:text-nepal-blue-light shrink-0 mt-0.5" />
              <span className="leading-relaxed">{point}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-0 sm:pl-12 italic">
          {DOCUMENT_PROTECTION_GUIDANCE.closing}
        </p>
      </div>

    </div>
  );
}

function OverviewItem({
  icon: Icon,
  iconWrapClass,
  label,
  value,
}: {
  icon: React.ElementType;
  iconWrapClass: string;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 items-start">
      <div className={`p-2 ${iconWrapClass} rounded-xl mt-0.5 shrink-0`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <span className="block text-[10px] text-slate-400 font-bold uppercase font-mono">
          {label}
        </span>
        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
          {value}
        </span>
      </div>
    </div>
  );
}