import React, { useState } from "react";
import { BookOpen, FileText, Download, CheckSquare, Sparkles, ChevronRight, HelpCircle, Info, RefreshCw, PenTool } from "lucide-react";
import { RESOURCES } from "../data/scholarships";

export default function Resources() {
  const [selectedTemplate, setSelectedTemplate] = useState(RESOURCES[0]);
  const [sopPart, setSopPart] = useState("Hook");
  const [userDraft, setUserDraft] = useState("");

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

  const sopBuilderStructures: Record<string, { title: string; target: string; template: string; tips: string }> = {
    Hook: {
      title: "1. The Hook (Introduction)",
      target: "Create an emotional, authentic narrative connecting your childhood or academic spark in Nepal with your field.",
      template: "Growing up in [Your City/Village in Nepal], I witnessed firsthand the impact of [Local Problem e.g. frequent load-shedding / agricultural soil degradation]. This early exposure triggered a profound interest in [Your Field], driving me to...",
      tips: "Never start with 'My name is...'. Start directly with a powerful real-world observation or a personal story."
    },
    Academic: {
      title: "2. Academic/Professional Foundation",
      target: "Briefly explain high-impact undergraduate projects, leadership clubs, or professional achievements in Nepal.",
      template: "During my Bachelor’s degree in [Your Major] at [Your University in Nepal], I spearheaded a research project on [Project Topic], which successfully resolved [Outcome]. This experience refined my skills in...",
      tips: "Avoid repeating your CV transcripts. Focus on the analytical skills you acquired from these challenges."
    },
    WhyThisUni: {
      title: "3. Why This Host University?",
      target: "Pinpoint specific professors, research labs, or syllabus modules that align with your research thesis.",
      template: "I am specifically drawn to [Host University] due to the pioneering research conducted at the [Lab Name]. Working under Professor [Prof Name]’s guidance on [Topic] will directly empower me to...",
      tips: "Browse the actual syllabus of the host school and name 1-2 modules that you can't find in Nepal."
    },
    ReturnPlan: {
      title: "4. The Return-to-Nepal Plan (CRITICAL)",
      target: "Most scholarship committees (Chevening, Fulbright) prioritize applicants who show a sustainable national giveback plan.",
      template: "Upon graduation, I intend to return to Nepal and join [Target organization e.g. Ministry of Environment / Local Startups]. Leveraging the advanced methodologies studied abroad, I plan to spearhead initiatives that address [Specific National Challenge] by...",
      tips: "Be highly specific. Name actual organizations, government entities, or tech startups in Nepal where you aim to apply your skills."
    }
  };

  const activeSopHelper = sopBuilderStructures[sopPart];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
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

      {/* Interactive SOP Paragraph Builder (Dynamic App Tool) */}
      <div className="bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-premium space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 dark:border-slate-800/50 pb-5 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-nepal-crimson dark:text-nepal-crimson-light font-mono flex items-center gap-1">
              <PenTool className="h-4 w-4" /> Interactive Writing Coach
            </span>
            <h2 className="text-xl font-extrabold text-nepal-blue dark:text-white mt-1">
              Smart SOP Essay Segment Outliner
            </h2>
          </div>
          {/* Sub parts switcher */}
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(sopBuilderStructures).map((key) => (
              <button
                key={key}
                onClick={() => {
                  setSopPart(key);
                  setUserDraft("");
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
                  sopPart === key
                    ? "bg-nepal-crimson text-white border-nepal-crimson"
                    : "bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/40 dark:border-slate-800"
                }`}
              >
                {key === "WhyThisUni" ? "Why Host School?" : key === "ReturnPlan" ? "Return to Nepal Plan" : key}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Structuring advice & templates (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="font-extrabold text-base text-slate-800 dark:text-white">
              {activeSopHelper.title}
            </h3>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/60 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono flex items-center gap-1.5">
                <Info className="h-4 w-4 text-nepal-blue" /> Section Objective
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeSopHelper.target}
              </p>
            </div>

            {/* Structured Template Copy-Box */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
                Recommended Structure Blueprint
              </span>
              <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl relative">
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-serif italic whitespace-pre-line">
                  {activeSopHelper.template}
                </p>
              </div>
            </div>

            {/* Expert tips warning box */}
            <div className="p-3 bg-red-500/5 dark:bg-red-500/10 border border-red-500/10 text-red-500 rounded-xl text-xs">
              <strong>Writing Advice:</strong> {activeSopHelper.tips}
            </div>
          </div>

          {/* Right Column: Interactive Writing Sandbox (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                SOP Sandbox Playground
              </h4>
              {userDraft && (
                <button
                  onClick={() => setUserDraft("")}
                  className="text-[11px] text-slate-400 hover:text-nepal-crimson flex items-center gap-1 cursor-pointer font-bold"
                >
                  <RefreshCw className="h-3 w-3" /> Clear Draft
                </button>
              )}
            </div>

            <div className="space-y-4">
              <textarea
                value={userDraft}
                onChange={(e) => setUserDraft(e.target.value)}
                rows={6}
                placeholder="Type or paste your essay draft paragraph here to organize your ideas based on the guide..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-nepal-crimson leading-relaxed"
              />
              <div className="p-3 bg-slate-100 dark:bg-slate-800/40 rounded-xl flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold">
                <span>WORD COUNT: {userDraft.trim() ? userDraft.trim().split(/\s+/).length : 0} WORDS</span>
                <span>RECOMMENDED: 150-200 WORDS</span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">
                Note: This sandbox acts as an offline writing scratchpad. Please make sure to copy your final drafts to Google Docs or MS Word before closing the page.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Structural Templates List */}
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
                onClick={() => setSelectedTemplate(res)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                  selectedTemplate.id === res.id
                    ? "bg-nepal-crimson/5 text-nepal-crimson border border-nepal-crimson/20 dark:bg-nepal-crimson-light/10 dark:text-nepal-crimson-light"
                    : "bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300 border border-transparent"
                }`}
              >
                <span>{res.title}</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Selected Template Details View (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/60">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-nepal-gold font-mono block">
                {selectedTemplate.type} GUIDE
              </span>
              <h2 className="text-xl font-extrabold text-nepal-blue dark:text-white mt-1">
                {selectedTemplate.title}
              </h2>
            </div>
            <button
              onClick={() => alert(`Your ${selectedTemplate.type} template is ready for offline editing. Copy structure to Word.`)}
              className="px-4 py-2 bg-gradient-to-r from-nepal-blue to-nepal-blue-light text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer hover:opacity-95"
            >
              <Download className="h-4 w-4" /> Download Guide
            </button>
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

    </div>
  );
}
