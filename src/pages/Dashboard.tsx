import React, { useState, useEffect } from "react";
import { 
  FolderCheck, 
  Sparkles, 
  Clock, 
  Trash2, 
  PlusCircle, 
  CheckSquare, 
  Square, 
  GraduationCap, 
  Compass, 
  FileText, 
  Bookmark, 
  Award, 
  BookOpen, 
  TrendingUp, 
  ChevronRight,
  Plus,
  Send,
  Calendar,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ALL_OPPORTUNITIES } from "../components/results/mockOpportunities";
import { EnrichedOpportunity } from "../components/results/types";

interface TrackedApplication {
  id: string;
  oppTitle: string;
  provider: string;
  status: "Draft" | "Submitted" | "Interview" | "Accepted" | "Rejected";
  notes: string;
  deadline: string;
}

export default function Dashboard() {
  // Sync Profile Completion Stats
  const [profile, setProfile] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("kiplan_user_profile");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sync Pinned Opportunities from the standard key: "saved_scholarships"
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("saved_scholarships");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Retrieve matching opportunities
  const savedOpps = ALL_OPPORTUNITIES.filter(opp => savedIds.includes(opp.id));

  // Dynamic Applications Timeline Tracker state
  const [applications, setApplications] = useState<TrackedApplication[]>(() => {
    try {
      const saved = localStorage.getItem("kiplan_tracked_applications");
      return saved ? JSON.parse(saved) : [
        { id: "app-1", oppTitle: "DAAD EPOS Scholarship", provider: "DAAD Germany", status: "Submitted", notes: "Submitted notarized documents and motivation letter via uni-assist.", deadline: "2026-08-15" },
        { id: "app-2", oppTitle: "Chevening Leadership Award", provider: "UK Foreign Office", status: "Draft", notes: "Working on the Leadership and Networking essays. IELTS done.", deadline: "2026-11-03" }
      ];
    } catch {
      return [];
    }
  });

  // Saving tracked apps
  useEffect(() => {
    localStorage.setItem("kiplan_tracked_applications", JSON.stringify(applications));
  }, [applications]);

  // Document dossier checklist
  const [dossier, setDossier] = useState<{ [key: string]: boolean }>(() => {
    try {
      const saved = localStorage.getItem("kiplan_dossier_checklist");
      return saved ? JSON.parse(saved) : {
        sop: false,
        lor1: false,
        lor2: false,
        transcripts: true,
        citizenship: true,
        noc: false,
        notary_stamps: false
      };
    } catch {
      return {
        sop: false,
        lor1: false,
        lor2: false,
        transcripts: true,
        citizenship: true,
        noc: false,
        notary_stamps: false
      };
    }
  });

  // Saving dossier
  useEffect(() => {
    localStorage.setItem("kiplan_dossier_checklist", JSON.stringify(dossier));
  }, [dossier]);

  // Interactive Adding of Tracked application
  const [showAddApp, setShowAddApp] = useState(false);
  const [newApp, setNewApp] = useState({
    oppTitle: "",
    provider: "",
    status: "Draft" as TrackedApplication["status"],
    notes: "",
    deadline: ""
  });

  // IELTS Milestones State
  const [ieltsMilestones, setIeltsMilestones] = useState({
    reading: "7.0",
    listening: "7.5",
    writing: "6.5",
    speaking: "7.0"
  });

  const handleAddTrackedApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApp.oppTitle.trim() || !newApp.provider.trim()) return;

    const added: TrackedApplication = {
      id: `app-${Date.now()}`,
      oppTitle: newApp.oppTitle,
      provider: newApp.provider,
      status: newApp.status,
      notes: newApp.notes,
      deadline: newApp.deadline || "TBD"
    };

    setApplications(prev => [...prev, added]);
    setNewApp({ oppTitle: "", provider: "", status: "Draft", notes: "", deadline: "" });
    setShowAddApp(false);
  };

  const handleDeleteTrackedApp = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  const handleStatusChange = (id: string, nextStatus: TrackedApplication["status"]) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status: nextStatus } : app));
  };

  const toggleDossierItem = (key: string) => {
    setDossier(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleUnsave = (id: string) => {
    setSavedIds(prev => {
      const next = prev.filter(item => item !== id);
      localStorage.setItem("saved_scholarships", JSON.stringify(next));
      return next;
    });
  };

  // Calculate overall profile strength score (out of 100)
  const calculateProfilePercentage = () => {
    let score = 20; // base registered
    if (profile) {
      if (profile.name) score += 10;
      if (profile.gpa > 2.0) score += 20;
      if (profile.ielts >= 5.0) score += 15;
      if (profile.experience > 0) score += 10;
    }
    // Dossier points
    const checkedCount = Object.values(dossier).filter(Boolean).length;
    score += checkedCount * 3.5;
    return Math.min(100, Math.round(score));
  };

  const profilePct = calculateProfilePercentage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 text-left border-b border-slate-200/50 dark:border-slate-800/50 pb-6">
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-nepal-crimson/10 text-nepal-crimson dark:text-nepal-crimson-light rounded-full text-[10px] font-bold uppercase tracking-wider font-mono mb-2">
            <Sparkles className="h-3 w-3" /> Student Command Center
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Hello, {profile?.name || "Aspirant Scholar"}!
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your documentation, manage pending applications, and audit deadlines.
          </p>
        </div>

        {/* Dynamic overall timeline stats */}
        <div className="flex gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3 shadow-sm min-w-36">
            <div className="p-2.5 bg-nepal-blue/10 text-nepal-blue rounded-xl">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-black text-slate-800 dark:text-white font-mono">{applications.length}</div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Applications</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3 shadow-sm min-w-36">
            <div className="p-2.5 bg-nepal-gold/10 text-nepal-gold rounded-xl">
              <Bookmark className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-black text-slate-800 dark:text-white font-mono">{savedOpps.length}</div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Saved Opps</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Columns (8-span): Applications Timeline & Saved Opportunities */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section A: Application Timeline Tracker */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm text-left">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-nepal-crimson" /> Application Timeline Tracker
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Track and update the live status of your global college submissions.</p>
              </div>
              <button
                onClick={() => setShowAddApp(!showAddApp)}
                className="px-3.5 py-2 bg-gradient-to-r from-nepal-blue to-[#1D4A93] text-white rounded-xl text-xs font-bold hover:opacity-95 shadow-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Plus className="h-4 w-4" /> Add Application
              </button>
            </div>

            {/* Add Tracked Application Form (Conditional view) */}
            <AnimatePresence>
              {showAddApp && (
                <motion.form
                  onSubmit={handleAddTrackedApp}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-slate-50 dark:bg-slate-800/20 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 mb-6 space-y-4"
                >
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">New Opportunity Submission</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Program Title (e.g. MEXT Tokyo Research)"
                      value={newApp.oppTitle}
                      onChange={(e) => setNewApp(prev => ({ ...prev, oppTitle: e.target.value }))}
                      className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:border-nepal-crimson"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Funding Body (e.g. Government of Japan)"
                      value={newApp.provider}
                      onChange={(e) => setNewApp(prev => ({ ...prev, provider: e.target.value }))}
                      className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:border-nepal-crimson"
                    />
                    <select
                      value={newApp.status}
                      onChange={(e: any) => setNewApp(prev => ({ ...prev, status: e.target.value }))}
                      className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:border-nepal-crimson"
                    >
                      <option value="Draft">Drafting Phase</option>
                      <option value="Submitted">Submitted / Pending Review</option>
                      <option value="Interview">Interview Scheduled</option>
                      <option value="Accepted">Accepted / Offer Letter Issued</option>
                      <option value="Rejected">Rejected / Try Next Cycle</option>
                    </select>
                    <input
                      type="date"
                      value={newApp.deadline}
                      onChange={(e) => setNewApp(prev => ({ ...prev, deadline: e.target.value }))}
                      className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-white focus:outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Short summary or comments (e.g., requested recommendation letter from head of department)"
                    value={newApp.notes}
                    onChange={(e) => setNewApp(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-white focus:outline-none"
                  />
                  <div className="flex justify-end gap-2 text-xs font-bold pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddApp(false)}
                      className="px-3 py-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-nepal-crimson text-white rounded-lg hover:opacity-95"
                    >
                      Save Track
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Application items rendering */}
            {applications.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-500 dark:text-slate-400 text-sm">No applications tracked yet. Start monitoring active pipelines now!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-5 bg-slate-50/50 dark:bg-slate-800/20 border border-slate-150 dark:border-slate-800/60 rounded-2xl hover:border-nepal-crimson transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div className="space-y-1 max-w-md">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm text-slate-800 dark:text-white">{app.oppTitle}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">• {app.provider}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{app.notes}</p>
                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-3">
                        <span>Closing: <strong className="text-slate-600 dark:text-slate-300">{app.deadline}</strong></span>
                      </div>
                    </div>

                    {/* Interactive state selectors */}
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800/80">
                      <select
                        value={app.status}
                        onChange={(e: any) => handleStatusChange(app.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border focus:outline-none ${
                          app.status === "Accepted" ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20" :
                          app.status === "Submitted" ? "bg-blue-500/5 text-blue-500 border-blue-500/20" :
                          app.status === "Interview" ? "bg-purple-500/5 text-purple-500 border-purple-500/20" :
                          app.status === "Rejected" ? "bg-rose-500/5 text-rose-500 border-rose-500/20" :
                          "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-800"
                        }`}
                      >
                        <option value="Draft">Drafting</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Interview">Interview</option>
                        <option value="Accepted">Accepted 🎉</option>
                        <option value="Rejected">Unsuccessful</option>
                      </select>

                      <button
                        onClick={() => handleDeleteTrackedApp(app.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-500/5 transition-all cursor-pointer"
                        title="Remove tracking"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section B: Saved/Pinned Scholarships */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm text-left">
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
              <Bookmark className="h-5 w-5 text-nepal-gold fill-nepal-gold" /> Bookmarked Opportunities
            </h3>
            
            {savedOpps.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-100 dark:border-slate-800 rounded-2xl p-6">
                <Bookmark className="h-6 w-6 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Your bookmarked scholarships will show up here. Explore the <strong className="text-nepal-crimson">Opportunities</strong> tab and tap the bookmark ribbon to save them!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedOpps.map((opp) => (
                  <div
                    key={opp.id}
                    className="p-5 bg-slate-50/40 dark:bg-slate-800/15 border border-slate-150 dark:border-slate-800/80 rounded-2xl shadow-sm hover:border-nepal-crimson transition-all flex justify-between items-start"
                  >
                    <div className="space-y-2">
                      <span className="inline-block text-[9px] font-bold font-mono text-emerald-500 bg-emerald-500/5 border border-emerald-500/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {opp.fundingType}
                      </span>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1">{opp.title}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">{opp.provider}</p>
                      <div className="text-xs text-slate-500 font-medium">
                        Deadline: <strong className="text-slate-700 dark:text-slate-300">{opp.applicationDeadline}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => handleUnsave(opp.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-500/5 transition-all cursor-pointer shrink-0"
                      title="Unsave"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (4-span): Documents Dossier & Test Milestone Tracker */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Widget 1: Profile Completeness Score Card */}
          <div className="bg-gradient-to-tr from-[#122A56] to-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-lg text-left">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] uppercase font-black tracking-widest font-mono text-slate-400">Profile Audit</span>
              <span className="text-xs font-bold text-nepal-gold font-mono">{profilePct}% Match Readiness</span>
            </div>
            
            <h3 className="font-bold text-base">Your Admission Dossier</h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Complete your student metrics and draft required verification documents to approach 100% acceptance readiness.
            </p>

            {/* Sleek CSS progress bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-4 mb-3">
              <div 
                className="bg-gradient-to-r from-nepal-crimson via-nepal-gold to-emerald-400 h-full transition-all duration-500" 
                style={{ width: `${profilePct}%` }}
              />
            </div>

            <div className="text-[10px] text-slate-400 flex items-center justify-between font-mono">
              <span>Sub-standard</span>
              <span>Competitive</span>
              <span>Elite Scholar</span>
            </div>
          </div>

          {/* Widget 2: Documents Dossier Checklist */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm text-left space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <FolderCheck className="h-4 w-4 text-nepal-blue" /> Document Dossier
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">Check off completed drafts or translation stamps below:</p>

            <div className="space-y-2.5 pt-2">
              {[
                { key: "sop", label: "Statement of Purpose (SOP)", desc: "Tailored to target subjects" },
                { key: "lor1", label: "Academic Recommendation (LOR 1)", desc: "From University HoD" },
                { key: "lor2", label: "Professional Reference (LOR 2)", desc: "Former corporate supervisor" },
                { key: "transcripts", label: "Certified Transcripts", desc: "Translated copy from controller" },
                { key: "citizenship", label: "Nepali Citizenship Certificate", desc: "English notarized copy" },
                { key: "noc", label: "MoEST Keshar Mahal NOC", desc: "No Objection Certificate issued" },
                { key: "notary_stamps", label: "Legal Notary Stamps", desc: "Certified and embossed" }
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => toggleDossierItem(item.key)}
                  className="w-full flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-left group"
                >
                  <div className="mt-0.5 shrink-0 text-slate-400 group-hover:text-nepal-crimson">
                    {dossier[item.key] ? (
                      <CheckSquare className="h-4.5 w-4.5 text-emerald-500 fill-emerald-500/10" />
                    ) : (
                      <Square className="h-4.5 w-4.5" />
                    )}
                  </div>
                  <div>
                    <span className={`text-xs font-bold ${dossier[item.key] ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-700 dark:text-slate-300"}`}>
                      {item.label}
                    </span>
                    <p className="text-[9px] text-slate-400 font-mono -mt-0.5">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Widget 3: Language exam planner */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm text-left space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-nepal-crimson" /> IELTS / PTE Milestones
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              Self-assess or log target scores to practice writing loops.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {Object.entries(ieltsMilestones).map(([key, val]) => (
                <div key={key} className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold font-mono">{key}</span>
                  <div className="text-base font-extrabold text-nepal-blue dark:text-sky-400 mt-1 font-mono">{val}</div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <a
                href="https://www.ielts.org/"
                target="_blank"
                referrerPolicy="no-referrer"
                className="inline-flex items-center gap-1 font-bold text-nepal-crimson hover:underline"
              >
                <span>Free IELTS practice links</span>
                <ChevronRight className="h-3 w-3" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
