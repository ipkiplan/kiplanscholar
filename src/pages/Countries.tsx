import React from "react";
import { Landmark, Compass, DollarSign, Languages, ShieldAlert, ArrowRight, CheckCircle2, FileText } from "lucide-react";
import { COUNTRIES } from "../data/scholarships";

interface CountriesProps {
  setCurrentTab: (tab: string) => void;
  setSelectedScholarshipId: (id: string | null) => void;
  // Let's allow passing trigger filters to parent
  onSelectCountryFilter: (countryName: string) => void;
}

export default function Countries({ setCurrentTab, setSelectedScholarshipId, onSelectCountryFilter }: CountriesProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Page Header */}
      <div className="space-y-3 text-center md:text-left">
        <span className="text-xs font-bold uppercase tracking-widest text-nepal-crimson dark:text-nepal-crimson-light font-mono bg-nepal-crimson/5 dark:bg-nepal-crimson-light/10 px-3 py-1.5 rounded-full">
          Destination Guides
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-nepal-blue dark:text-white tracking-tight">
          Where Do You Want To Study?
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl">
          Get verified, step-by-step visa structures, language score metrics, and cost of living estimates tailored for Nepali nationals.
        </p>
      </div>

      {/* Main Grid showing countries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {COUNTRIES.map((country) => (
          <div
            key={country.code}
            className="bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300"
          >
            {/* Banner Image */}
            <div className="h-56 relative overflow-hidden">
              <img
                src={country.image}
                alt={country.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              
              {/* Floating Country Name & Flag */}
              <div className="absolute bottom-5 left-5 flex items-center gap-3">
                <span className="text-4xl" role="img" aria-label={country.name}>
                  {country.flag}
                </span>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    {country.name}
                  </h2>
                  <span className="inline-block text-[10px] font-bold text-nepal-gold font-mono uppercase bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md mt-0.5">
                    {country.popularScholarshipsCount} Verified Scholarships
                  </span>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {country.description}
              </p>

              {/* Data Badges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                {/* Cost of Living */}
                <div className="flex gap-2.5 items-start">
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl mt-0.5 shrink-0">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase font-mono">
                      Living Expenses
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {country.averageCostOfLiving}
                    </span>
                  </div>
                </div>

                {/* Language Proof */}
                <div className="flex gap-2.5 items-start">
                  <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl mt-0.5 shrink-0">
                    <Languages className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase font-mono">
                      English Criteria
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {country.languageRequirements}
                    </span>
                  </div>
                </div>
              </div>

              {/* Nepali Student Specific Visa Guidance */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/40 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-nepal-crimson dark:text-nepal-crimson-light font-mono flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 shrink-0" /> Kathmandu Embassy & Visa Rules
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {country.visaGuidance}
                </p>
              </div>

              {/* Featured scholarships tags */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
                  Primary Scholarship Opportunities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {country.featuredScholarships.map((sch, i) => (
                    <span key={i} className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/60 px-3 py-1 rounded-full">
                      {sch}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50">
                <button
                  onClick={() => onSelectCountryFilter(country.name)}
                  className="w-full py-3 bg-gradient-to-r from-nepal-blue to-nepal-blue-light dark:from-nepal-crimson dark:to-nepal-crimson-light text-white font-extrabold text-xs rounded-xl shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Explore All {country.name} Scholarships</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Cultural Info Alert Strip */}
      <div className="bg-gradient-to-r from-nepal-crimson/5 via-nepal-blue/5 to-nepal-gold/5 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="p-4 bg-nepal-crimson/5 dark:bg-nepal-crimson-light/10 text-nepal-crimson dark:text-nepal-crimson-light rounded-2xl shrink-0">
          <FileText className="h-8 w-8" />
        </div>
        <div className="space-y-1.5 text-center md:text-left">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-base">
            No Objection Letter (NOC) Required For All Transfers
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
            Under Ministry of Education, Science and Technology (MOEST) guidelines, all Nepali nationals pursuing foreign study MUST apply for an online NOC certificate before remitting semester tuition or buying international airfare. We advise applying as soon as you receive your visa/scholarship letter.
          </p>
        </div>
      </div>

    </div>
  );
}
