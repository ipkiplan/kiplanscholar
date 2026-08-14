import React, { useState } from "react";
import { motion } from "motion/react";
import {
  MessageCircle,
  Lightbulb,
  ListChecks,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { notifyInfo } from "../lib/notifications";
import ScholarAssistantChat from "../components/scholar-assistant/ScholarAssistantChat";

interface AIAssistantProps {
  setCurrentTab: (tab: string) => void;
}

/**
 * Action card configuration.
 *
 * Deliberately data-driven (rather than hand-written JSX per card) so
 * future phases can plug in real functionality — Scholarship Matching,
 * SOP/CV/LOR Review, Country/University Guidance — by simply changing
 * `targetTab` or swapping the onClick handler for a real feature route,
 * without touching the layout below.
 */
interface ActionCardConfig {
  id: string;
  emoji: string;
  label: string;
  description: string;
  // If set, clicking the card navigates to an existing, already-working
  // tab. If null, the feature isn't built yet — clicking shows a
  // "Coming Soon" notice instead of navigating anywhere.
  targetTab: string | null;
}

const ACTION_CARDS: ActionCardConfig[] = [
  {
    id: "find-scholarships",
    emoji: "🎓",
    label: "Find Scholarships",
    description: "Browse fully funded grants matched to your profile.",
    targetTab: "scholarships",
  },
  {
    id: "sop-review",
    emoji: "📝",
    label: "SOP Review",
    description: "Get feedback on your Statement of Purpose.",
    targetTab: "sop-builder",
  },
  {
    id: "cv-review",
    emoji: "📄",
    label: "CV Review",
    description: "Polish your academic CV for scholarship panels.",
    targetTab: "cv-builder",
  },
  {
    id: "lor-review",
    emoji: "✉️",
    label: "LOR Review",
    description: "Structure strong Letters of Recommendation.",
    targetTab: "lor-builder",
  },
  {
    id: "motivation-letter-review",
    emoji: "💌",
    label: "Motivation Letter Review",
    description: "Craft a compelling motivation letter, section by section.",
    targetTab: "motivation-letter-builder",
  },
  {
    id: "explore-countries",
    emoji: "🌍",
    label: "Explore Countries",
    description: "Compare visa rules, costs, and study destinations.",
    targetTab: "countries",
  },
  {
    id: "explore-universities",
    emoji: "🏛️",
    label: "Explore Universities",
    description: "Research host institutions and their programs.",
    targetTab: "university-explorer",
  },
  {
    id: "application-timeline",
    emoji: "📅",
    label: "Application Timeline",
    description: "Track deadlines across all your applications.",
    targetTab: "dashboard",
  },
];

export default function AIAssistant({ setCurrentTab }: AIAssistantProps) {
  // ES-005-A: local, in-memory view toggle only — no persistence, per
  // "local session state only" scope. Resets on unmount/refresh.
  const [activeView, setActiveView] = useState<"dashboard" | "chat">("dashboard");

  const handleCardClick = (card: ActionCardConfig) => {
    if (card.targetTab) {
      setCurrentTab(card.targetTab);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      notifyInfo(`${card.label} is coming soon.`);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-nepal-dark min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-2"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-nepal-crimson/10 text-nepal-crimson dark:text-nepal-crimson-light rounded-full text-xs font-extrabold tracking-wider uppercase font-mono">
            <Sparkles className="h-3.5 w-3.5" /> Scholar Assistant
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-nepal-blue dark:text-white">
            My Education Journey
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base">
            Welcome back! Let's continue your education journey.
          </p>
        </motion.div>

        {/* ES-005-A: Scholar Assistant conversation entry point — new
            addition, existing dashboard below is otherwise untouched */}
        {activeView === "dashboard" && (
          <motion.button
            type="button"
            onClick={() => setActiveView("chat")}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="w-full flex items-center justify-between gap-4 bg-gradient-to-r from-nepal-blue to-nepal-blue-light text-white rounded-2xl p-5 shadow-md hover:opacity-95 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="p-2.5 rounded-xl bg-white/15 shrink-0">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base">Start a Conversation with Scholar Assistant</h3>
                <p className="text-xs text-white/80 mt-0.5">Ask a question and get guided step by step</p>
              </div>
            </div>
            <ArrowRight className="h-4.5 w-4.5 shrink-0" />
          </motion.button>
        )}

        {activeView === "chat" ? (
          <ScholarAssistantChat onBack={() => setActiveView("dashboard")} />
        ) : (
          <>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ACTION_CARDS.map((card, i) => (
            <motion.button
              key={card.id}
              onClick={() => handleCardClick(card)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="group relative text-left bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 hover:border-nepal-crimson dark:hover:border-nepal-crimson-light rounded-2xl p-6 shadow-premium hover:shadow-premium-hover transition-all duration-300 cursor-pointer flex flex-col justify-between h-full"
            >
              <div className="space-y-3">
                <div className="text-3xl">{card.emoji}</div>
                <div>
                  <h3 className="font-extrabold text-slate-800 dark:text-white group-hover:text-nepal-crimson dark:group-hover:text-nepal-crimson-light transition-colors text-sm sm:text-base">
                    {card.label}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-50 dark:border-slate-800/60">
                {card.targetTab ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-nepal-blue dark:text-sky-400 group-hover:translate-x-1 transition-transform">
                    <span>Open</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full font-mono">
                    Coming Soon
                  </span>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Lower Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Scholarship Tips */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Lightbulb className="h-4 w-4" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">
                Scholarship Tips
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex gap-2">
                <span className="text-nepal-crimson font-bold shrink-0">•</span>
                <span>Start your Statement of Purpose at least 6 weeks before the deadline.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-nepal-crimson font-bold shrink-0">•</span>
                <span>Ask referees for your Letters of Recommendation early — they need time too.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-nepal-crimson font-bold shrink-0">•</span>
                <span>Double-check every scholarship's specific eligibility criteria before applying.</span>
              </li>
            </ul>
          </motion.div>

          {/* Recommended Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: 0.16 }}
            className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ListChecks className="h-4 w-4" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">
                Recommended Next Steps
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex gap-2">
                <span className="text-nepal-crimson font-bold shrink-0">•</span>
                <span>Browse Featured Scholarships to find opportunities that fit your background.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-nepal-crimson font-bold shrink-0">•</span>
                <span>Save scholarships you're interested in so you can compare deadlines later.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-nepal-crimson font-bold shrink-0">•</span>
                <span>Check the Country Guides for visa and cost-of-living details.</span>
              </li>
            </ul>
          </motion.div>

        </div>
          </>
        )}

      </div>
    </div>
  );
}