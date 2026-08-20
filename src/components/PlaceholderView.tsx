import React, { useState } from "react";
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ArrowUpRight, 
  Calendar, 
  CheckSquare, 
  Users, 
  Landmark, 
  GraduationCap 
} from "lucide-react";
import { motion } from "motion/react";

interface PlaceholderViewProps {
  title: string;
  category: string;
  description: string;
  comingSoonFeatures: string[];
  type: "opportunity" | "resource";
}

export default function PlaceholderView({ 
  title, 
  category, 
  description, 
  comingSoonFeatures,
  type 
}: PlaceholderViewProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      // Persist waitlist email locally
      try {
        const key = `waitlist_${title.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
        localStorage.setItem(key, email);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
        
        {/* Navigation Indicator */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D7263D] dark:text-[#F42E56] font-mono bg-[#D7263D]/5 dark:bg-[#F42E56]/10 px-3.5 py-1.5 rounded-full">
            <Sparkles className="h-3.5 w-3.5 text-[#D7263D] dark:text-[#F42E56] animate-pulse" />
            Strategic Roadmap Curation
          </span>
        </div>

        {/* Header */}
        <div className="space-y-4 text-center max-w-xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase text-slate-400">
            {type === "opportunity" ? "Global Discovery Portal" : "Academic Success Toolkit"}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#102B5C] dark:text-white tracking-tight">
            {title}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            {description}
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-[#D7263D] to-[#102B5C] mx-auto rounded-full" />
        </div>

        {/* Content Box */}
        <div className="bg-slate-50 dark:bg-[#071126] border border-slate-100 dark:border-slate-800/60 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start pb-5 border-b border-slate-200/50 dark:border-slate-800/60">
            <div className="p-3 bg-[#102B5C]/5 text-[#102B5C] dark:bg-sky-500/10 dark:text-sky-300 rounded-xl">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#102B5C] dark:text-white">
                Under Curatorial Development
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                KIPLANScholar's academic relations desk is currently indexing authentic government registries and templates for this module.
              </p>
            </div>
          </div>

          {/* List of Features to be added */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500 font-mono">
              Features Included in Upcoming Expansion
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {comingSoonFeatures.map((feat, idx) => (
                <div key={idx} className="flex gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <CheckSquare className="h-4 w-4 text-[#D7263D] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Alert Form */}
        <div className="bg-white dark:bg-[#071126] border border-slate-100 dark:border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(16,43,92,0.03)] space-y-4">
          <div className="space-y-1.5 text-center">
            <h3 className="text-lg font-bold text-[#102B5C] dark:text-white">
              Get notified when this section launches
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter your email to receive direct application alert links once we go live with this curation stream.
            </p>
          </div>

          {subscribed ? (
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 rounded-2xl flex items-center gap-3 justify-center text-sm">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span className="font-bold">Waitlist registration successful!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Type your email address..."
                className="flex-grow px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-nepal-crimson"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-nepal-blue to-nepal-blue-light dark:from-nepal-crimson dark:to-nepal-crimson-light text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 hover:opacity-95 cursor-pointer whitespace-nowrap"
              >
                <span>Notify Me</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Neutral location badge — no developer/company attribution claim */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-slate-100 dark:border-slate-800/40 rounded-2xl text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-slate-400" />
            <span>KIPLANScholar</span>
          </div>
          <span>Kathmandu, Nepal</span>
        </div>

      </div>
    </div>
  );
}