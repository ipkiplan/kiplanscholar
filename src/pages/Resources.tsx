import React, { useState } from "react";
import { BookOpen, FileText, Download, CheckSquare, Sparkles, ChevronRight, HelpCircle } from "lucide-react";
import { RESOURCES } from "../data/scholarships";
import { exportDocumentAsPDF } from "../components/document-builder/printExport";

interface ResourcesProps {
  setCurrentTab: (tab: string) => void;
}

export default function Resources({ setCurrentTab }: ResourcesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(RESOURCES[0]);

  // Handle resource presets from Navbar dropdown selections
  React.useEffect(() => {
    const preset = (window as any).resourcePreset;
    if (preset) {
      const found = RESOURCES.find(r => r.id === preset || r.type === preset);
      if (found) {
        setSelectedTemplate(found);
      }
      delete (window as any).resourcePreset;
    }
  }, []);

  const normalDetailPanel = (
    <div className="lg:col-span-8 bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm space-y-6 relative">
      {/* Download button is a sibling OUTSIDE #resource-print-area, so
          it's naturally excluded from the printed output by the
          existing print stylesheet's "body * { visibility: hidden }"
          catch-all — no separate print-only styling needed. Positioned
          absolutely so the visible on-screen layout is unchanged from
          before (title/type + button on the same row). */}
      <button
        onClick={() => exportDocumentAsPDF("resource-print-area", selectedTemplate.title, "Guidelines")}
        className="absolute top-6 right-6 px-4 py-2 bg-gradient-to-r from-nepal-blue to-nepal-blue-light text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer hover:opacity-95 z-10"
      >
        <Download className="h-4 w-4" /> Download Guidelines
      </button>

      {/* Everything the printed PDF should contain — title, type,
          description, structure, and tips. Matches the existing
          project pattern (MLPreview.tsx) of reusing already-visible
          content directly as the print target. */}
      <div id="resource-print-area" className="space-y-6">
        <div className="pr-32 pb-4 border-b border-slate-100 dark:border-slate-800/60">
          <span className="text-[10px] font-bold uppercase tracking-widest text-nepal-gold font-mono block">
            {selectedTemplate.type} GUIDE
          </span>
          <h2 className="text-xl font-extrabold text-nepal-blue dark:text-white mt-1">
            {selectedTemplate.title}
          </h2>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          {selectedTemplate.description}
        </p>

      {/* Structure Breakdown */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 font-mono">
          Recommended Paragraph Sequence
        </h4>
        <div className="space-y-3">
          {selectedTemplate.contentStructure.map((step, idx) => (
            <div key={idx} className="flex gap-3 text-xs text-slate-600 dark:text-slate-300 items-start">
              <span className="font-black text-nepal-crimson dark:text-nepal-crimson-light font-mono bg-nepal-crimson/5 px-2.5 py-0.5 rounded-md">
                {idx + 1}
              </span>
              <span className="leading-relaxed mt-0.5">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expert Tips */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/40 space-y-2.5">
        <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 font-mono">
          Pro Writing Advice
        </h4>
        <div className="space-y-2">
          {selectedTemplate.tips.map((tip, idx) => (
            <div key={idx} className="flex gap-2 text-xs text-slate-600 dark:text-slate-400">
              <CheckSquare className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{tip}</span>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-nepal-crimson dark:text-nepal-crimson-light font-mono bg-nepal-crimson/5 dark:bg-nepal-crimson-light/10 px-3 py-1.5 rounded-full">
          Resource Center
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-nepal-blue dark:text-white tracking-tight">
          Application Blueprint & Toolkits
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl">
          Craft standout essays and reference letters. Access certified checklists for document attestation at Keshar Mahal, MoFA, and foreign ministries.
        </p>
      </div>

      {/* Structural Templates List: sidebar for the read-only reference
          guides this page actually owns (SOP/LOR/Checklist/Visa Guide).
          Legal & Notarial routes to its own dedicated page instead of
          selecting into this detail panel. */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Templates selector sidebar (4 Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-base text-slate-800 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/60">
            <BookOpen className="h-5 w-5 text-nepal-crimson" />
            <span>Document Blueprints</span>
          </h3>
          <div className="space-y-2">
            {RESOURCES.map((res) => (
              <button
                key={res.id}
                onClick={() => {
                  if (res.routeTo) {
                    setCurrentTab(res.routeTo);
                    return;
                  }
                  setSelectedTemplate(res);
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                  !res.routeTo && selectedTemplate.id === res.id
                    ? "bg-nepal-crimson/5 text-nepal-crimson border border-nepal-crimson/20 dark:bg-nepal-crimson-light/10 dark:text-nepal-crimson-light"
                    : "bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300 border border-transparent"
                }`}
              >
                <span className="flex items-center gap-2">
                  {res.title}
                  {res.comingSoon && (
                    <span className="text-[9px] bg-amber-400/20 text-amber-600 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider font-mono shrink-0">
                      Guidance
                    </span>
                  )}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {normalDetailPanel}

      </div>

    </div>
  );
}