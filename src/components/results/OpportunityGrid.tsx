import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { FolderX, RefreshCw, Sparkles } from "lucide-react";
import { EnrichedOpportunity } from "./types";
import OpportunityCard from "./OpportunityCard";

interface OpportunityGridProps {
  opportunities: EnrichedOpportunity[];
  savedIds: string[];
  onSaveToggle: (id: string, e: React.MouseEvent) => void;
  onExplore: (opp: EnrichedOpportunity) => void;
  onResetFilters: () => void;
}

export default function OpportunityGrid({
  opportunities,
  savedIds,
  onSaveToggle,
  onExplore,
  onResetFilters,
}: OpportunityGridProps) {
  if (opportunities.length === 0) {
    return (
      <div
        className="text-center py-16 px-6 bg-white dark:bg-nepal-dark border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-10 space-y-5 shadow-xs"
        id="empty-results-container"
      >
        <div className="inline-flex p-4 bg-rose-500/5 dark:bg-rose-500/2 rounded-full text-rose-500 border border-rose-500/10">
          <FolderX className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-800 dark:text-white">
            No Opportunities Match Your Filters
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 max-w-sm mx-auto leading-relaxed">
            We couldn't find any opportunities matching your precise filter criteria. Try widening your filters or clearing search queries.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onResetFilters}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-nepal-crimson to-nepal-crimson-light hover:opacity-95 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 duration-100"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Clear Filter Criteria</span>
          </button>
          <button
            onClick={onResetFilters}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs rounded-xl border border-slate-200/40 dark:border-slate-800 transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 duration-100"
          >
            <Sparkles className="h-4 w-4 text-nepal-gold" />
            <span>Browse All Opportunities</span>
          </button>
        </div>
      </div>
    );
  }

  // Animation configuration for cards grid staggered load
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 150, damping: 20 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      id="opportunity-grid"
    >
      <AnimatePresence mode="popLayout">
        {opportunities.map((opp) => (
          <motion.div
            key={opp.id}
            variants={itemVariants}
            layout
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            className="h-full"
          >
            <OpportunityCard
              opportunity={opp}
              isSaved={savedIds.includes(opp.id)}
              onSaveToggle={(e) => onSaveToggle(opp.id, e)}
              onExplore={() => onExplore(opp)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
