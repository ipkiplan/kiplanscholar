import React, { useState } from "react";
import { Heart, Sparkles, Award, ArrowRight, CheckCircle2, User, Mail, Send, Compass, Users } from "lucide-react";
import { Scholarship } from "../types";
import { SCHOLARSHIPS } from "../data/scholarships";
import { motion, AnimatePresence } from "motion/react";

interface WomenProps {
  onSelectScholarship: (id: string) => void;
}

export default function Women({ onSelectScholarship }: WomenProps) {
  const [formData, setFormData] = useState({ name: "", email: "", discipline: "STEM/Engineering", comment: "" });
  const [submitted, setSubmitted] = useState(false);

  // Filter scholarships targeting Women
  const womenScholarships = SCHOLARSHIPS.filter(sch => sch.categories.includes("Women"));

  const handleMentorshipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", discipline: "STEM/Engineering", comment: "" });
      }, 4000);
    }
  };

  const advicePoints = [
    { title: "Highlighting Leadership", desc: "Most women-centric fellowships (like AAUW) evaluate candidates based on their dedication to public service and the promotion of other women and girls in Nepal." },
    { title: "STEM Focus & Research Proposals", desc: "For Schlumberger or British Council programs, detail how your specific engineering or science major helps solve clean energy, environmental, or healthcare challenges in South Asia." },
    { title: "Overcoming Adversity Narrative", desc: "Don't shy away from explaining the socio-cultural hurdles you overcame in Nepal to pursue a high-tech or scientific degree. Reviewers value resilience." }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Page Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-rose-950 via-slate-900 to-rose-900 border border-rose-800/20 text-white p-8 sm:p-12 shadow-xl">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-2xl space-y-6 relative">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 text-rose-300 rounded-full text-xs font-extrabold uppercase font-mono">
            <Heart className="h-3.5 w-3.5 text-rose-400 fill-rose-400" /> Women Applicants Portal
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none text-white">
            Empowering Nepali <br />
            <span className="text-rose-400">Women in STEM & Leadership</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Connecting aspiring women scientists, engineers, researchers, and public leaders from Nepal with prestigious international fellowships that offer 100% full funding, childcare stipends, and professional mentoring networks.
          </p>
        </div>
      </div>

      {/* Two Column Layout: Curated Database & Advice */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Curated Women Scholarships (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-nepal-blue dark:text-white tracking-tight">
              Exclusive Fellowships for Women
            </h2>
            <span className="text-xs text-slate-400 font-bold font-mono">
              {womenScholarships.length} DIRECT MATCHES
            </span>
          </div>

          <div className="space-y-4">
            {womenScholarships.map((sch) => (
              <div
                key={sch.id}
                className="bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm hover:border-rose-400 dark:hover:border-rose-400/80 transition-all duration-300"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500 font-mono bg-rose-500/5 px-2.5 py-1 rounded-md">
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
                      Funding & Support
                    </span>
                    <span className="text-xs font-black text-emerald-500">
                      {sch.amount.split(" (")[0]}
                    </span>
                  </div>
                  <button
                    onClick={() => onSelectScholarship(sch.id)}
                    className="px-3.5 py-1.5 bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white dark:text-rose-400 dark:bg-rose-400/10 dark:hover:bg-rose-400 dark:hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>View Benefits</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Essay Tips & Mentorship Form (5 Cols) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Professional Essay Advice Card */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/30 dark:to-slate-900/10 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-5 space-y-4">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-base flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-rose-500" />
              <span>SOP Strategy for Women</span>
            </h3>
            <div className="space-y-4">
              {advicePoints.map((point, i) => (
                <div key={i} className="space-y-1">
                  <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">
                    {point.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {point.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mentorship Sign-up Form */}
          <div className="bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-800 dark:text-white text-base">
                Women Scholarship Mentorship
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Register to match with successful Nepali alumni from Oxford, Harvard, or Munich for a free 1-on-1 SOP structural review.
              </p>
            </div>

            {submitted ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <div className="text-xs">
                  <span className="block font-bold">Registration Confirmed!</span>
                  <span className="text-slate-400">An email with meeting schedules and alumni matches is on the way.</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleMentorshipSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 font-mono mb-1">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Shristi Thapa"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-rose-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 font-mono mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g., shristi@email.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-rose-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 font-mono mb-1">
                    Academic Field
                  </label>
                  <select
                    value={formData.discipline}
                    onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-rose-400 cursor-pointer"
                  >
                    <option value="STEM/Engineering">🔬 STEM / High Tech Engineering</option>
                    <option value="Research & PhD">🧪 Scientific Research & PhD</option>
                    <option value="Public Policy & Health">⚖️ Public Policy / Health Care</option>
                    <option value="Arts & Humanities">🎨 Fine Arts / Liberal Arts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 font-mono mb-1">
                    Specific goals or comments (Optional)
                  </label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    rows={2}
                    placeholder="Briefly state your desired universities or programs..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-rose-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold text-xs rounded-xl shadow-md hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="h-4 w-4" />
                  <span>Register For Free Mentorship</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
