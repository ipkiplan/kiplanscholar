import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Search, Mail, Phone, MapPin } from "lucide-react";
import { FAQS } from "../data/scholarships";
import { motion, AnimatePresence } from "motion/react";

export default function Faq() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const filteredFaqs = FAQS.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
        
        {/* Navigation Indicator */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D7263D] dark:text-[#F42E56] font-mono bg-[#D7263D]/5 dark:bg-[#F42E56]/10 px-3.5 py-1.5 rounded-full">
            <HelpCircle className="h-3.5 w-3.5" />
            Support Knowledge Base
          </span>
        </div>

        {/* Page Header */}
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#102B5C] dark:text-white tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Quick solutions to the most common queries about Nepali NOC, transcript attestation, blocked accounts, and application essays.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-[#D7263D] to-[#102B5C] mx-auto rounded-full" />
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs (e.g. NOC, LOR, attestation)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-nepal-crimson transition-all"
          />
        </div>

        {/* FAQs Accordion Stack */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800 rounded-2xl p-6">
              <p className="text-xs text-slate-500">No results match your search. Feel free to contact our support desk directly!</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = activeId === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className="bg-white dark:bg-[#071126] border border-slate-100 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-[0_2px_12px_-4px_rgba(16,43,92,0.02)]"
                >
                  <button
                    onClick={() => setActiveId(isOpen ? null : faq.id)}
                    className="w-full px-5 py-4 text-left flex justify-between items-center gap-4 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-[#0c1c3c]/30 transition-all cursor-pointer"
                  >
                    <span className="font-extrabold text-sm sm:text-base leading-snug">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-[#D7263D] shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 border-t border-slate-50 dark:border-slate-800/40 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Contact info card */}
        <div className="bg-[#102B5C]/5 dark:bg-[#071126] border border-slate-100 dark:border-slate-800/60 rounded-3xl p-6 sm:p-8 space-y-4 text-center">
          <h3 className="text-base font-bold text-[#102B5C] dark:text-white">
            Still have questions about scholarship eligibility?
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Our expert team at Sundhara head office is ready to help you attest transcripts and build standout essays.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-xs text-slate-400 mt-2">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-[#D7263D]" /> Sundhara, Kathmandu</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-emerald-500" /> +977 1 5312040</span>
          </div>
        </div>

      </div>
    </div>
  );
}
