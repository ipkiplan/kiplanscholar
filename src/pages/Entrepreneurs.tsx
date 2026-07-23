import React, { useState } from "react";
import { Users, Sparkles, Award, ArrowRight, Lightbulb, TrendingUp, CheckCircle, Smartphone, Calculator, RefreshCw } from "lucide-react";
import { Scholarship } from "../types";
import { SCHOLARSHIPS } from "../data/scholarships";
import { motion, AnimatePresence } from "motion/react";

interface EntrepreneursProps {
  onSelectScholarship: (id: string) => void;
}

export default function Entrepreneurs({ onSelectScholarship }: EntrepreneursProps) {
  // Calculator state
  const [scale, setScale] = useState(3); // 1-5 scale
  const [stage, setStage] = useState<string>("Prototype");
  const [hasTech, setHasTech] = useState<boolean>(true);
  
  // Filter scholarships targeting Entrepreneurs
  const entrepreneurScholarships = SCHOLARSHIPS.filter(sch => sch.categories.includes("Entrepreneurs"));

  const calculateImpactScore = () => {
    let score = scale * 12;
    if (stage === "Active Venture") score += 25;
    else if (stage === "Pilot Testing") score += 15;
    else score += 5;

    if (hasTech) score += 15;
    return Math.min(score, 100);
  };

  const getFeasibilityFeedback = (score: number) => {
    if (score >= 75) return {
      title: "Excellent Standout Fit",
      desc: "Your venture shows high scalability and target clarity. You are a strong candidate for premium programs like the Thiel Fellowship or Halcyon Residencies in the US.",
      recommendation: "Focus on presenting your tech architecture and target market validation metrics."
    };
    if (score >= 50) return {
      title: "Strong Potential Fit",
      desc: "Good foundation. Your social venture fits standard global incubators or local seed grant programs funded by SAARC/UNDP.",
      recommendation: "Secure pilot feedback or user engagement proof in your Nepal operations before applying."
    };
    return {
      title: "Early Stage Development Needed",
      desc: "You are currently in the ideation phase. Focus on developing a strong minimum viable product (MVP) first.",
      recommendation: "Look for local Kathmandu accelerators or university-led business hackathons before global programs."
    };
  };

  const score = calculateImpactScore();
  const feedback = getFeasibilityFeedback(score);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Portal Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-emerald-950 text-white p-8 sm:p-12 shadow-xl border border-indigo-900/40">
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -z-1" />
        
        <div className="max-w-2xl space-y-6 relative">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-300 rounded-full text-xs font-extrabold uppercase tracking-wide font-mono">
            <Lightbulb className="h-3.5 w-3.5" /> Social Innovation Portal
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none text-white">
            Incubator Grants & <br />
            <span className="text-emerald-400">Equity-Free Seed Funds</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Helping young Nepali visionaries, tech founders, and social impact pioneers secure prestigious Silicon Valley Fellowships, D.C. residencies, and non-dilutive global startup capital.
          </p>
        </div>
      </div>

      {/* Main Grid: Finder + Feasibility score tool */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Entrepreneur Fellowships Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-nepal-blue dark:text-white tracking-tight">
              Curated Startup Grants
            </h2>
            <span className="text-xs text-slate-400 font-bold font-mono">
              {entrepreneurScholarships.length} DATABASE OPPORTUNITIES
            </span>
          </div>

          <div className="space-y-4">
            {entrepreneurScholarships.map((sch) => (
              <div
                key={sch.id}
                className="bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5.5 shadow-sm hover:border-emerald-500 transition-all duration-300"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-500 font-mono bg-emerald-500/5 px-2.5 py-1 rounded-md">
                      {sch.countries.join(", ")}
                    </span>
                    <h3 className="font-extrabold text-slate-800 dark:text-white text-base mt-2">
                      {sch.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-bold font-mono -mt-0.5 leading-none">
                      {sch.provider}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                      {sch.description}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex justify-between items-center">
                  <div>
                    <span className="block text-[9px] text-slate-400 font-bold uppercase font-mono">
                      Award Capital
                    </span>
                    <span className="text-xs font-black text-emerald-500 block">
                      {sch.amount}
                    </span>
                  </div>
                  <button
                    onClick={() => onSelectScholarship(sch.id)}
                    className="px-3.5 py-1.5 bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500 hover:text-white dark:text-emerald-400 dark:bg-emerald-400/10 dark:hover:bg-emerald-400 dark:hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>Analyze Scope</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Social Impact scoring tool (5 Cols) */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 space-y-6 shadow-sm">
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-slate-800 dark:text-white text-base flex items-center gap-2">
                <Calculator className="h-5 w-5 text-emerald-500" />
                <span>Impact Feasibility Matcher</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Adjust your venture variables below to evaluate your candidacy strength for global residency grants.
              </p>
            </div>

            {/* Scale Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Target Impact Audience</span>
                <span className="text-emerald-500">{scale === 5 ? "National-Wide Nepal" : `${scale * 10}+ Districts`}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={scale}
                onChange={(e) => setScale(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Stage Selector */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Venture Stage
              </span>
              <div className="grid grid-cols-3 gap-2">
                {["Ideation", "Pilot Testing", "Active Venture"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setStage(opt)}
                    className={`px-2 py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                      stage === opt
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Tech component Toggle */}
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800/60">
              <div>
                <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tech Scalability?
                </span>
                <span className="text-[10px] text-slate-400">Software, mobile app, or tech-enabled</span>
              </div>
              <button
                onClick={() => setHasTech(!hasTech)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  hasTech
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    : "bg-slate-200/50 text-slate-500 dark:bg-slate-800"
                }`}
              >
                {hasTech ? "Yes" : "No"}
              </button>
            </div>

            {/* Score Output */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-3.5 text-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Your Candidacy Strength
                </span>
                <div className="text-4xl font-black text-emerald-500 mt-1">
                  {score}%
                </div>
              </div>

              {/* Feedback Alert box */}
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 text-left rounded-xl space-y-1.5">
                <span className="block font-bold text-xs text-emerald-500">
                  {feedback.title}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  {feedback.desc}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">
                  <strong>Advice:</strong> {feedback.recommendation}
                </p>
              </div>
            </div>

          </div>

          {/* Social Pitch Deck essentials card */}
          <div className="bg-gradient-to-br from-indigo-950/50 to-slate-900 border border-indigo-900/40 text-white rounded-2xl p-5 space-y-4">
            <h3 className="font-extrabold text-base flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <span>Pitch Deck Checklist</span>
            </h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex gap-2 items-start">
                <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>The Nepal Problem:</strong> Concrete data validating local issues (e.g. lack of cold storage for mountain farmers).</span>
              </li>
              <li className="flex gap-2 items-start">
                <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Unit Economics:</strong> Cleary demonstrate how the business maintains margins without relying solely on grants.</span>
              </li>
              <li className="flex gap-2 items-start">
                <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Global Application Plan:</strong> Explicitly state how the Silicon Valley/DC network helps you scale back home.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
