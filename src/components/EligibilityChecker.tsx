import React, { useState } from "react";
import { Check, ArrowRight, ArrowLeft, RotateCcw, AlertCircle, Award, Compass, Heart, Landmark, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Scholarship } from "../types";
import { SCHOLARSHIPS } from "../data/scholarships";

interface EligibilityCheckerProps {
  onSelectScholarship: (id: string) => void;
}

export default function EligibilityChecker({ onSelectScholarship }: EligibilityCheckerProps) {
  const [step, setStep] = useState(1);
  const [level, setLevel] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [isWoman, setIsWoman] = useState<boolean | null>(null);
  const [field, setField] = useState<string>("");
  
  const resetQuiz = () => {
    setStep(1);
    setLevel("");
    setCountry("");
    setIsWoman(null);
    setField("");
  };

  const getMatchedScholarships = (): Scholarship[] => {
    return SCHOLARSHIPS.filter(sch => {
      // 1. Level Filter
      let levelMatch = false;
      if (!level) levelMatch = true;
      else {
        levelMatch = sch.levels.includes("Any") || sch.levels.some(l => l.toLowerCase() === level.toLowerCase());
      }

      // 2. Country Filter
      let countryMatch = false;
      if (!country || country === "Any") countryMatch = true;
      else {
        countryMatch = sch.countries.includes("Any") || sch.countries.some(c => c.toLowerCase() === country.toLowerCase());
      }

      // 3. Category Filter
      let categoryMatch = true;
      if (isWoman === true) {
        // If they are a woman, show all matching woman ones, plus standard ones
        categoryMatch = true; 
      } else if (isWoman === false) {
        // If not a woman, filter out those strictly meant ONLY for women
        categoryMatch = !sch.categories.includes("Women") || sch.categories.includes("Nepali Students") || sch.categories.includes("Professionals");
      }

      // 4. Special field/category logic
      let fieldMatch = true;
      if (field === "Business/Startup") {
        fieldMatch = sch.categories.includes("Entrepreneurs") || sch.tags.includes("Startup") || sch.tags.includes("Social Impact");
      } else if (field === "STEM/Engineering") {
        fieldMatch = sch.tags.includes("STEM") || sch.tags.includes("Research") || sch.levels.includes("PhD") || !sch.tags.includes("Startup");
      }

      return levelMatch && countryMatch && categoryMatch && fieldMatch;
    });
  };

  const matches = getMatchedScholarships();

  const renderProgress = () => {
    const percentage = ((step - 1) / 4) * 100;
    return (
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-8">
        <div 
          className="bg-gradient-to-r from-nepal-crimson via-nepal-blue to-nepal-gold h-full transition-all duration-500" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-premium dark:shadow-dark-premium transition-all">
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-nepal-crimson dark:text-nepal-crimson-light font-mono bg-nepal-crimson/5 dark:bg-nepal-crimson-light/10 px-3 py-1.5 rounded-full">
            Smart Matching
          </span>
          <h3 className="text-xl font-bold text-nepal-blue dark:text-white mt-2">
            Scholarship Eligibility Assessment
          </h3>
        </div>
        <button 
          onClick={resetQuiz}
          className="text-slate-400 hover:text-nepal-crimson dark:hover:text-nepal-crimson-light p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
          title="Reset Test"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>

      {renderProgress()}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              1. What is your current academic background or professional goal?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { value: "Undergraduate", label: "Undergraduate Aspirant (Bachelor's Degree)" },
                { value: "Graduate", label: "Graduate Aspirant (Master's Degree)" },
                { value: "PhD", label: "Doctorate/PhD Candidate" },
                { value: "Entrepreneur", label: "Startup / Social Entrepreneur" }
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setLevel(opt.value);
                    setStep(2);
                  }}
                  className={`p-4 text-left rounded-2xl border transition-all duration-300 cursor-pointer ${
                    level === opt.value
                      ? "border-nepal-crimson bg-nepal-crimson/5 text-nepal-crimson dark:border-nepal-crimson-light dark:text-nepal-crimson-light dark:bg-nepal-crimson-light/10 font-semibold"
                      : "border-slate-200 hover:border-nepal-blue hover:bg-slate-50/50 dark:border-slate-800 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.label}</span>
                    {level === opt.value && <Check className="h-4.5 w-4.5" />}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              2. What is your preferred study destination?
            </h4>
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { value: "United Kingdom", label: "🇬🇧 United Kingdom" },
                { value: "United States", label: "🇺🇸 United States" },
                { value: "Germany", label: "🇩🇪 Germany" },
                { value: "Australia", label: "🇦🇺 Australia" },
                { value: "Europe", label: "🇪🇺 Rest of Europe" },
                { value: "Any", label: "🌍 Global / No Preference" }
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setCountry(opt.value);
                    setStep(3);
                  }}
                  className={`p-4 text-left rounded-2xl border transition-all duration-300 cursor-pointer ${
                    country === opt.value
                      ? "border-nepal-crimson bg-nepal-crimson/5 text-nepal-crimson dark:border-nepal-crimson-light dark:text-nepal-crimson-light dark:bg-nepal-crimson-light/10 font-semibold"
                      : "border-slate-200 hover:border-nepal-blue hover:bg-slate-50/50 dark:border-slate-800 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.label}</span>
                    {country === opt.value && <Check className="h-4.5 w-4.5" />}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              3. Gender-Specific Opportunities: Are you a woman applicant?
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Choosing "Yes" will prioritize exclusive STEM and leadership fellowships reserved specifically for women from developing economies (including Nepal).
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                onClick={() => {
                  setIsWoman(true);
                  setStep(4);
                }}
                className={`p-6 text-center rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2 ${
                  isWoman === true
                    ? "border-nepal-crimson bg-nepal-crimson/5 text-nepal-crimson dark:border-nepal-crimson-light dark:text-nepal-crimson-light dark:bg-nepal-crimson-light/10 font-semibold"
                    : "border-slate-200 hover:border-nepal-blue hover:bg-slate-50/50 dark:border-slate-800 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                }`}
              >
                <Heart className="h-8 w-8 text-nepal-crimson" />
                <span className="text-base font-bold">Yes</span>
                <span className="text-xs text-slate-400">Include exclusive women's programs</span>
              </button>

              <button
                onClick={() => {
                  setIsWoman(false);
                  setStep(4);
                }}
                className={`p-6 text-center rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-2 ${
                  isWoman === false
                    ? "border-nepal-blue bg-nepal-blue/5 text-nepal-blue dark:border-sky-400 dark:text-sky-400 dark:bg-sky-400/10 font-semibold"
                    : "border-slate-200 hover:border-nepal-blue hover:bg-slate-50/50 dark:border-slate-800 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                }`}
              >
                <Compass className="h-8 w-8 text-nepal-blue dark:text-sky-400" />
                <span className="text-base font-bold">No / General</span>
                <span className="text-xs text-slate-400">Show general public programs only</span>
              </button>
            </div>
            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              4. What is your primary discipline or study area?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { value: "STEM/Engineering", label: "🔬 STEM / Science, Tech & Engineering" },
                { value: "Social Science/Arts", label: "📚 Social Sciences, Law, Arts & Humanities" },
                { value: "Business/Startup", label: "💼 Business, Marketing & Social Ventures" },
                { value: "Public Policy/Governance", label: "⚖️ Public Policy, Health & National Governance" }
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setField(opt.value);
                    setStep(5);
                  }}
                  className={`p-4 text-left rounded-2xl border transition-all duration-300 cursor-pointer ${
                    field === opt.value
                      ? "border-nepal-crimson bg-nepal-crimson/5 text-nepal-crimson dark:border-nepal-crimson-light dark:text-nepal-crimson-light dark:bg-nepal-crimson-light/10 font-semibold"
                      : "border-slate-200 hover:border-nepal-blue hover:bg-slate-50/50 dark:border-slate-800 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.label}</span>
                    {field === opt.value && <Check className="h-4.5 w-4.5" />}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <div className="text-center py-4">
              <div className="inline-flex p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-full mb-3">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h4 className="text-2xl font-extrabold text-slate-800 dark:text-white">
                Matching Results Complete!
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                We analyzed your profile and found <strong className="text-nepal-crimson dark:text-nepal-crimson-light">{matches.length}</strong> matching scholarship programs.
              </p>
            </div>

            {/* List of Matched Items */}
            <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
              {matches.length === 0 ? (
                <div className="text-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    No strict match found for this combo, but check out all general programs!
                  </p>
                </div>
              ) : (
                matches.map((sch) => (
                  <div 
                    key={sch.id}
                    className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:border-nepal-crimson dark:hover:border-nepal-crimson-light transition-all"
                  >
                    <div>
                      <h5 className="font-bold text-slate-800 dark:text-white text-sm">
                        {sch.title}
                      </h5>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                        {sch.provider}
                      </p>
                      <span className="inline-block text-[10px] font-bold text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded-full mt-1.5">
                        {sch.amount}
                      </span>
                    </div>
                    <button
                      onClick={() => onSelectScholarship(sch.id)}
                      className="p-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-nepal-crimson hover:text-white dark:hover:bg-nepal-crimson-light dark:hover:text-white transition-all cursor-pointer shadow-sm border border-slate-200/40 dark:border-slate-700/50"
                    >
                      <ArrowRight className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={resetQuiz}
                className="flex items-center gap-1.5 text-sm font-semibold text-nepal-crimson dark:text-nepal-crimson-light hover:underline cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" /> Restart Test
              </button>
              <button
                onClick={() => onSelectScholarship("all")}
                className="px-5 py-2.5 bg-gradient-to-r from-nepal-blue to-nepal-blue-light text-white rounded-xl font-bold text-sm shadow-md cursor-pointer hover:opacity-90"
              >
                View All Scholarships
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
