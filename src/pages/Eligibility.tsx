import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  TrendingUp, 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  Globe, 
  Calendar, 
  ArrowLeft, 
  RefreshCw, 
  Search, 
  Send,
  HelpCircle,
  FileCheck,
  User,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ALL_OPPORTUNITIES } from "../components/results/mockOpportunities";
import { EnrichedOpportunity } from "../components/results/types";

// User profile interface
interface UserProfile {
  name: string;
  level: string; // Undergraduate, Master's, PhD, Research
  gpa: number; // Max 4.0
  ielts: number; // Max 9.0
  hasSOP: boolean;
  hasLOR: boolean;
  isWoman: boolean;
  field: string; // Engineering, Business, Humanities, etc.
  experience: number; // Years of experience
  hasResearch: boolean;
  hasVolunteer: boolean;
  preferredCountry: string;
}

interface EligibilityProps {
  setCurrentTab: (tab: string) => void;
}

export default function Eligibility({ setCurrentTab }: EligibilityProps) {
  const { user } = useAuth();
  // ProtectedRoute guarantees a non-null user by the time this component
  // renders, but a defensive fallback is used instead of a non-null
  // assertion in case that guarantee is ever changed elsewhere.
  const storageKey = `kiplan_user_profile_${user?.id ?? "anonymous"}`;

  const [profile, setProfile] = useState<UserProfile>(() => {
    const defaults: UserProfile = {
      name: "",
      level: "Master's",
      gpa: 3.5,
      ielts: 6.5,
      hasSOP: false,
      hasLOR: false,
      isWoman: false,
      field: "Engineering",
      experience: 0,
      hasResearch: false,
      hasVolunteer: true,
      preferredCountry: "Any"
    };
    try {
      // User-scoped data takes priority if it already exists.
      const scoped = localStorage.getItem(storageKey);
      if (scoped) return JSON.parse(scoped);

      // One-time migration: an older, pre-authentication-scoped profile
      // may exist under the original global key. Copy it forward into
      // the user-scoped key so it isn't lost, without deleting the
      // original — a purely additive, non-destructive migration.
      const legacy = localStorage.getItem("kiplan_user_profile");
      if (legacy) {
        localStorage.setItem(storageKey, legacy);
        return JSON.parse(legacy);
      }

      return defaults;
    } catch {
      return defaults;
    }
  });

  const [activeStep, setActiveStep] = useState<"form" | "results">("form");
  const [calculating, setCalculating] = useState(false);
  const [results, setResults] = useState<{
    overallScore: number;
    matchedOpps: { opp: EnrichedOpportunity; score: number; status: "highly_eligible" | "eligible" | "borderline" | "ineligible" }[];
    strengths: string[];
    weaknesses: string[];
    missingDocs: string[];
    recommendations: string[];
  } | null>(null);

  // AI Counselor state
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiChat, setAiChat] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "Hello! I am your KIPLAN AI Scholarship Mentor. Complete your profile and run the eligibility assessment first, and I will give you personalized guidance on overcoming gaps or selecting your best-fit programs." }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [nextStepDismissed, setNextStepDismissed] = useState(false);

  // Save profile to localstorage when changed
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(profile));
  }, [profile, storageKey]);

  // Run dynamic match analysis
  const handleCalculate = () => {
    setCalculating(true);
    
    // Simulate calculating animation
    setTimeout(() => {
      // Calculate individual opportunity scores
      const matchedOpps = ALL_OPPORTUNITIES.map(opp => {
        let score = 70; // Base score

        // 1. Level Match
        const oppLevel = opp.educationLevel.toLowerCase();
        const userLevel = profile.level.toLowerCase();
        
        if (oppLevel.includes("phd") && userLevel === "phd") score += 15;
        else if (oppLevel.includes("master") && userLevel === "master's") score += 15;
        else if (oppLevel.includes("bachelor") && userLevel === "undergraduate") score += 15;
        else if (oppLevel.includes("postdoc") && userLevel === "research") score += 15;
        else if (oppLevel.includes("any")) score += 10;
        else score -= 25; // mismatch

        // 2. GPA Match
        if (profile.gpa >= 3.8) score += 15;
        else if (profile.gpa >= 3.5) score += 10;
        else if (profile.gpa >= 3.0) score += 5;
        else score -= 15;

        // Check if opportunity has strict GPA requirements in description or eligibility
        const descText = (opp.description + opp.eligibility.join(" ")).toLowerCase();
        if (descText.includes("gpa 3.5") || descText.includes("3.5 gpa")) {
          if (profile.gpa < 3.5) score -= 20;
        }
        if (descText.includes("gpa 3.7") || descText.includes("3.7 gpa") || descText.includes("first class")) {
          if (profile.gpa < 3.7) score -= 30;
        }

        // 3. Language Requirement (IELTS)
        if (profile.ielts >= 7.5) score += 12;
        else if (profile.ielts >= 6.5) score += 8;
        else if (profile.ielts >= 6.0) score += 3;
        else score -= 20;

        if (descText.includes("ielts 7") || descText.includes("7.0 ielts")) {
          if (profile.ielts < 7.0) score -= 25;
        }
        if (descText.includes("ielts 6.5") || descText.includes("6.5 ielts")) {
          if (profile.ielts < 6.5) score -= 15;
        }

        // 4. Gender (Women in STEM / exclusive programs)
        const isWomenExclusive = opp.gender === "Women" || opp.categories.includes("Women") || opp.title.toLowerCase().includes("women") || opp.tags.some(t => t.toLowerCase() === "women");
        if (isWomenExclusive) {
          if (profile.isWoman) score += 20;
          else score -= 60; // strictly ineligible
        }

        // 5. Subject Alignment
        const oppSubject = opp.subjectArea.toLowerCase();
        const userField = profile.field.toLowerCase();
        if (userField.includes("engineering") || userField.includes("stem") || userField.includes("science")) {
          if (oppSubject === "engineering" || oppSubject === "computer science" || oppSubject === "data science" || oppSubject === "ai" || oppSubject === "medicine") score += 10;
        } else if (userField.includes("business") || userField.includes("management") || userField.includes("entrepreneur")) {
          if (oppSubject === "business" || oppSubject === "social impact" || opp.categories.includes("Entrepreneurs")) score += 15;
        } else if (userField.includes("humanities") || userField.includes("social") || userField.includes("law")) {
          if (oppSubject === "humanities" || oppSubject === "public policy") score += 10;
        }

        // 6. Documents bonus
        if (profile.hasSOP) score += 5;
        if (profile.hasLOR) score += 5;

        // 7. Experience & Research
        if (profile.hasResearch && oppLevel.includes("phd") || oppLevel.includes("research")) score += 15;
        if (profile.experience >= 2) score += 5;

        // Cap score
        score = Math.min(100, Math.max(0, score));

        let status: "highly_eligible" | "eligible" | "borderline" | "ineligible" = "eligible";
        if (score >= 85) status = "highly_eligible";
        else if (score >= 70) status = "eligible";
        else if (score >= 50) status = "borderline";
        else status = "ineligible";

        return { opp, score, status };
      }).filter(item => item.status !== "ineligible" || item.opp.featured) // keep all but ineligible, unless featured
        .sort((a, b) => b.score - a.score);

      // Strengths & Weaknesses Generator
      const strengths: string[] = [];
      const weaknesses: string[] = [];
      const missingDocs: string[] = [];
      const recommendations: string[] = [];

      // Academic pedigree
      if (profile.gpa >= 3.8) {
        strengths.push("Excellent Academic Profile (GPA 3.8+ / Top 5% standing)");
      } else if (profile.gpa >= 3.5) {
        strengths.push("Strong Academic Standing (GPA 3.5+ suitable for major UK & European scholarships)");
      } else {
        weaknesses.push("GPA is below the highly competitive threshold (3.5+) for elite awards");
        recommendations.push("Consider applying to universities with high acceptance rates or look into German tuition-free programs where language or subject-specific entry exams can offset a lower GPA.");
      }

      // Language capability
      if (profile.ielts >= 7.5) {
        strengths.push("Superior English Language Proficiency (IELTS 7.5+ satisfies all top-tier international institutions)");
      } else if (profile.ielts >= 6.5) {
        strengths.push("Satisfactory English Language Score (IELTS 6.5+ meeting standard entry criteria)");
      } else {
        weaknesses.push("English test score (IELTS < 6.5) acts as a bottleneck for premier scholarship funding");
        recommendations.push("Plan a retake of the IELTS or PTE exam. Target scoring at least 7.0 overall with no band below 6.5 to unlock ADB, Commonwealth, and Fulbright pipelines.");
      }

      // Gender specific strengths
      if (profile.isWoman) {
        strengths.push("Eligible for exclusive Global Women in STEM and Leadership initiatives (British Council, etc.)");
      }

      // Documents check
      if (!profile.hasSOP) {
        missingDocs.push("Draft Statement of Purpose (SOP)");
        recommendations.push("Utilize KIPLANScholar's built-in SOP Builder under the 'Resources' tab to draft your academic narrative.");
      } else {
        strengths.push("Completed Statement of Purpose draft");
      }

      if (!profile.hasLOR) {
        missingDocs.push("Academic & Professional Recommendation Letters (LORs)");
        recommendations.push("Reach out to at least two former college professors or employers. Use KIPLANScholar LOR templates to pre-structure their reference letters.");
      } else {
        strengths.push("Letters of Recommendation secured");
      }

      if (profile.hasResearch) {
        strengths.push("Active Research Profile (highly valued for PhD/Mundus fellowships)");
      } else if (profile.level === "PhD" || profile.level === "Research") {
        weaknesses.push("Lack of peer-reviewed publications or academic research portfolio");
        recommendations.push("Co-author a research paper with university faculty, or outline an original, highly structured 3-page Research Proposal before applying.");
      }

      if (profile.hasVolunteer) {
        strengths.push("Strong community engagement & volunteer records (key differentiator for Chevening and Fulbright)");
      }

      // Overall Score Calculation
      const highlyEligibleCount = matchedOpps.filter(o => o.status === "highly_eligible").length;
      const eligibleCount = matchedOpps.filter(o => o.status === "eligible").length;
      let overallScore = Math.round((profile.gpa / 4 * 40) + ((profile.ielts - 4.5) / 4.5 * 30) + (profile.hasSOP ? 10 : 0) + (profile.hasLOR ? 10 : 0) + (profile.hasResearch ? 10 : 0));
      overallScore = Math.min(98, Math.max(30, overallScore));

      setResults({
        overallScore,
        matchedOpps,
        strengths,
        weaknesses,
        missingDocs,
        recommendations
      });
      setActiveStep("results");
      setCalculating(false);

      // Auto-update counselor chat introduction
      setAiChat([
        { role: "assistant", text: `Profile analyzed successfully! I calculated an overall Match Score of **${overallScore}%**. You are **Highly Eligible** for ${highlyEligibleCount} programs and **Eligible** for ${eligibleCount} other options.\n\nYour primary strength is your ${profile.gpa >= 3.5 ? "stellar GPA" : "academic determination"} paired with your ${profile.ielts >= 7.0 ? "high English test proficiency" : "study objectives"}.\n\nHow can I help you optimize your application? You can ask me how to draft your SOP, how to contact professors, or how to set up a blocked bank account in Kathmandu.` }
      ]);
    }, 1500);
  };

  // Simulated AI counselor response with high quality templates or real-time query
  const handleAskCounselor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    const userMsg = aiQuestion.trim();
    setAiChat(prev => [...prev, { role: "user", text: userMsg }]);
    setAiQuestion("");
    setIsAiTyping(true);

    // Dynamic, structured rule-based responses that look incredibly authentic and helpful
    setTimeout(() => {
      let aiResponse = "";
      const query = userMsg.toLowerCase();

      if (query.includes("sop") || query.includes("statement of purpose") || query.includes("essay")) {
        aiResponse = `Drafting a compelling **Statement of Purpose (SOP)** is critical for Nepali applicants. Since you are targeting a **${profile.level}** in **${profile.field}**, follow this paragraph formula:

1. **The Hook (10%):** Start with a specific local problem in Nepal (e.g., infrastructural bottlenecks, lack of digital health trackers, or micro-finance access issues) and how that inspired your study objectives.
2. **Academic Foundation (20%):** Discuss your Bachelor's work, highlighting projects where you scored highly (or your GPA of **${profile.gpa}**).
3. **Professional/Research Value (20%):** Connect your ${profile.experience} years of experience or research background.
4. **Why This Specific University (25%):** Name 2 modules, 1 lab, and 1 professor's publication. Do not write general flattery.
5. **Re-integration Project (25%):** This is the key to winning scholarships! Explain how you will return to Nepal and apply this knowledge (e.g., launching an engineering consultancy in Kathmandu, or joining the MoEST development taskforce).

Would you like me to generate a tailored outline for your fields?`;
      } else if (query.includes("blocked") || query.includes("bank") || query.includes("financial") || query.includes("money") || query.includes("fund")) {
        aiResponse = `Setting up a **Blocked Account (Sperrkonto)** is a major requirement for destinations like Germany. Here is the process for Nepali students:

1. **Current Amount:** For the 2026/2027 intake, the required amount is **€11,904 EUR** (~Rs. 1.7 Million NPR) per year.
2. **Approved Providers:** You can set this up online using **Expatrio, Fintiba, or Coracle** in about 48 hours.
3. **Nepali Bank Remittance:** Once you get your blocked account IBAN, take your **Offer Letter (Admission)** and **No Objection Certificate (NOC)** from the Ministry of Education (MOEST) in Keshar Mahal to any class 'A' commercial bank in Kathmandu (e.g., Nabil Bank, Siddhartha Bank, Nepal Investment Mega Bank).
4. **Fund Transfer:** The bank will convert NPR to EUR and wire-transfer the blocked amount. They require a tax payment clearance.

Do you have your admission letter or NOC ready to initiate this?`;
      } else if (query.includes("noc") || query.includes("no objection") || query.includes("keshar mahal") || query.includes("moest")) {
        aiResponse = `The **No Objection Certificate (NOC)** is mandatory for all Nepali students studying abroad to send tuition fees or exchange currencies. 

**Steps to get your NOC from MOEST (Keshar Mahal, Kathmandu):**
1. **Online Application:** Register on the official MOEST NOC portal (\`noc.moest.gov.np\`).
2. **Required Uploads:**
   - Academic transcripts & character certificates (notarized/stamped).
   - Citizenship certificate.
   - Exact admission/offer letter indicating tuition details.
3. **Payment & Appointment:** Pay the Rs. 2,000 application fee online, and schedule an appointment.
4. **Verification:** Visit the Keshar Mahal office with your original documents for final stamp approval.

*KIPLAN Advice:* Get your transcript notarized at sundhara near CTC mall (just opposite our office) for fast turnaround!`;
      } else if (query.includes("ielts") || query.includes("english") || query.includes("pte") || query.includes("toefl")) {
        aiResponse = `For **${profile.field}** opportunities, your current IELTS estimate is **${profile.ielts}**. Here is how to boost it or apply with it:

1. **IELTS 6.5:** Satisfies 80% of European and Canadian colleges, but elite programs like Chevening, Fulbright, or ADB prefer a minimum of **7.0 overall with 6.5 in each band**.
2. **PTE Alternative:** PTE Academic is highly popular in Nepal now due to faster results (48 hours). A PTE score of **65+** is equivalent to IELTS 7.0.
3. **English Proficiency Certificate (EPC):** Some German and Swedish universities waive IELTS entirely if your Bachelor's degree medium of instruction was 100% English. You can obtain this EPC letter from your university's exam controller (e.g., Tribhuvan University Balkhu, KU Dhulikhel, or Pokhara University).

Do you need list of scholarships waiving IELTS for Nepalis?`;
      } else {
        aiResponse = `I understand you are looking into scholarship pathways! For a student targeting **${profile.level}** study in **${profile.field}** with a GPA of **${profile.gpa}**, the most structured route is:

1. **Focus on fully funded government programs:** Like MEXT (Japan), DAAD (Germany), or GKS (South Korea) which don't require high personal wealth.
2. **Draft early drafts of essays:** Over 90% of failures are due to rushed Statement of Purposes submitted in November/December.
3. **Get transcripts notarized early:** Ensure Tribal/Kathmandu educational transcripts are translated and stamped beforehand.

Feel free to ask more specific questions about recommendations, visa processing, or professor cold-email templates!`;
      }

      setAiChat(prev => [...prev, { role: "assistant", text: aiResponse }]);
      setIsAiTyping(false);
    }, 1200);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-500 dark:text-emerald-400";
    if (score >= 70) return "text-nepal-blue dark:text-sky-400";
    if (score >= 50) return "text-amber-500 dark:text-amber-400";
    return "text-rose-500 dark:text-rose-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return "bg-emerald-500/10 border-emerald-500/20";
    if (score >= 70) return "bg-blue-500/10 border-blue-500/20";
    if (score >= 50) return "bg-amber-500/10 border-amber-500/20";
    return "bg-rose-500/10 border-rose-500/20";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-nepal-crimson/10 to-nepal-blue/10 text-nepal-crimson dark:text-nepal-crimson-light rounded-full text-xs font-bold uppercase tracking-wider font-mono mb-4">
          <Sparkles className="h-3.5 w-3.5 animate-spin" /> Signature Matching Engine
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          AI Eligibility Assessment & Match Score
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-base leading-relaxed">
          Create your verified student profile once. Our algorithmic matching engine computes real-time Match Scores against every global funding program in our system.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Profile Form or Match Summary Results */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {activeStep === "form" ? (
              <motion.div
                key="form-view"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="p-2.5 bg-nepal-blue/10 dark:bg-sky-400/10 text-nepal-blue dark:text-sky-400 rounded-xl">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Build Your Academic Profile</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Provide accurate details to calculate precise eligibility match scores.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Student Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Aarav Sharma"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-nepal-crimson transition-colors"
                    />
                  </div>

                  {/* Academic Level */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">Target Academic Level</label>
                    <select
                      value={profile.level}
                      onChange={(e) => setProfile(prev => ({ ...prev, level: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-nepal-crimson transition-colors"
                    >
                      <option value="Undergraduate">Undergraduate (Bachelor's Degree)</option>
                      <option value="Master's">Master's Degree (Graduate)</option>
                      <option value="PhD">Doctoral Candidates (PhD)</option>
                      <option value="Research">Postdoctoral Research Fellowship</option>
                    </select>
                  </div>

                  {/* CGPA */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">Undergrad/High-School CGPA</label>
                      <span className="text-sm font-bold text-nepal-crimson dark:text-nepal-crimson-light">{profile.gpa} / 4.0</span>
                    </div>
                    <input
                      type="range"
                      min="2.0"
                      max="4.0"
                      step="0.05"
                      value={profile.gpa}
                      onChange={(e) => setProfile(prev => ({ ...prev, gpa: parseFloat(e.target.value) }))}
                      className="w-full accent-nepal-crimson"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>2.0 (Pass)</span>
                      <span>3.0 (First Div)</span>
                      <span>4.0 (Outstanding)</span>
                    </div>
                  </div>

                  {/* IELTS Equivalent */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">IELTS (or Equivalent TOEFL/PTE)</label>
                      <span className="text-sm font-bold text-nepal-blue dark:text-sky-400">{profile.ielts} Band</span>
                    </div>
                    <input
                      type="range"
                      min="5.0"
                      max="9.0"
                      step="0.5"
                      value={profile.ielts}
                      onChange={(e) => setProfile(prev => ({ ...prev, ielts: parseFloat(e.target.value) }))}
                      className="w-full accent-nepal-blue"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>5.0 (Moderate)</span>
                      <span>7.0 (Highly Proficient)</span>
                      <span>9.0 (Native)</span>
                    </div>
                  </div>

                  {/* Major Discipline */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">Field of Study</label>
                    <select
                      value={profile.field}
                      onChange={(e) => setProfile(prev => ({ ...prev, field: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-nepal-crimson transition-colors"
                    >
                      <option value="Engineering">Engineering, Tech & IT</option>
                      <option value="Business">Business, Finance & Entrepreneurship</option>
                      <option value="Medicine">Medicine & Public Health</option>
                      <option value="Humanities">Social Sciences & Humanities</option>
                      <option value="Agriculture">Agriculture & Forestry Development</option>
                    </select>
                  </div>

                  {/* Work Experience */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">Work/Internship Experience</label>
                    <select
                      value={profile.experience}
                      onChange={(e) => setProfile(prev => ({ ...prev, experience: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-nepal-crimson transition-colors"
                    >
                      <option value="0">No Experience / Fresh Graduate</option>
                      <option value="1">1 Year Experience</option>
                      <option value="2">2 - 3 Years (Ideal for Chevening)</option>
                      <option value="5">5+ Years (Senior / Leadership)</option>
                    </select>
                  </div>
                </div>

                {/* Additional Toggles (Boolean parameters) */}
                <div className="bg-slate-50 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50 space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Additional Merits & Checklist</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Woman applicant */}
                    <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.isWoman}
                        onChange={(e) => setProfile(prev => ({ ...prev, isWoman: e.target.checked }))}
                        className="rounded text-nepal-crimson focus:ring-nepal-crimson h-4.5 w-4.5 border-slate-300 dark:border-slate-700"
                      />
                      <div>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> Woman Applicant
                        </span>
                        <p className="text-[10px] text-slate-400">Unlock female-only STEM fellowships.</p>
                      </div>
                    </label>

                    {/* SOP drafted */}
                    <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.hasSOP}
                        onChange={(e) => setProfile(prev => ({ ...prev, hasSOP: e.target.checked }))}
                        className="rounded text-nepal-blue focus:ring-nepal-blue h-4.5 w-4.5 border-slate-300 dark:border-slate-700"
                      />
                      <div>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">SOP Statement Drafted</span>
                        <p className="text-[10px] text-slate-400">Draft Statement of Purpose is ready.</p>
                      </div>
                    </label>

                    {/* LOR drafts */}
                    <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.hasLOR}
                        onChange={(e) => setProfile(prev => ({ ...prev, hasLOR: e.target.checked }))}
                        className="rounded text-nepal-blue focus:ring-nepal-blue h-4.5 w-4.5 border-slate-300 dark:border-slate-700"
                      />
                      <div>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">LOR References Secured</span>
                        <p className="text-[10px] text-slate-400">Academic references are pre-arranged.</p>
                      </div>
                    </label>

                    {/* Research published */}
                    <label className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.hasResearch}
                        onChange={(e) => setProfile(prev => ({ ...prev, hasResearch: e.target.checked }))}
                        className="rounded text-nepal-gold focus:ring-nepal-gold h-4.5 w-4.5 border-slate-300 dark:border-slate-700"
                      />
                      <div>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Published Research</span>
                        <p className="text-[10px] text-slate-400">Journal publication or final year thesis.</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Calculate Trigger */}
                <button
                  onClick={handleCalculate}
                  disabled={calculating}
                  className="w-full py-4 bg-gradient-to-r from-nepal-crimson to-nepal-blue hover:opacity-95 text-white rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {calculating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Running Smart Alignment Model...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      <span>Calculate Profile Match Strength</span>
                    </>
                  )}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="results-view"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {/* Back button */}
                <button
                  onClick={() => setActiveStep("form")}
                  className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" /> Edit Profile
                </button>

                {/* Score Summary Panel */}
                {results && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                      {/* Radial Meter representation */}
                      <div className="md:col-span-5 flex flex-col items-center text-center">
                        <div className="relative flex items-center justify-center w-40 h-40">
                          {/* Circular progress SVG */}
                          <svg className="w-full h-full transform -rotate-90">
                            <circle
                              cx="80"
                              cy="80"
                              r="68"
                              className="stroke-slate-100 dark:stroke-slate-800"
                              strokeWidth="12"
                              fill="transparent"
                            />
                            <circle
                              cx="80"
                              cy="80"
                              r="68"
                              className="stroke-nepal-crimson"
                              strokeWidth="12"
                              fill="transparent"
                              strokeDasharray={2 * Math.PI * 68}
                              strokeDashoffset={2 * Math.PI * 68 * (1 - results.overallScore / 100)}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-4xl font-extrabold text-slate-800 dark:text-white font-mono">
                              {results.overallScore}%
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Match Score</span>
                          </div>
                        </div>
                        <div className={`mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold ${getScoreBg(results.overallScore)}`}>
                          <Award className="h-4 w-4" />
                          <span className={getScoreColor(results.overallScore)}>
                            {results.overallScore >= 85 ? "Excellent Match Strength" : results.overallScore >= 70 ? "Competitively Aligned" : "Development Profile"}
                          </span>
                        </div>
                      </div>

                      {/* Descriptive breakdown of score */}
                      <div className="md:col-span-7 space-y-4">
                        <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">Profile Evaluation</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                          Hi {profile.name || "Scholar"}! Your student profile represents a highly robust foundation. You possess strong parameters aligned to international standards, but can secure higher acceptance odds by addressing the critical gap recommendations generated below.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Verified Match List</span>
                            <div className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">
                              {results.matchedOpps.length} <span className="text-xs font-semibold text-slate-400">Programs</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Missing Core Docs</span>
                            <div className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">
                              {results.missingDocs.length} <span className="text-xs font-semibold text-slate-400">Critical files</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SWOT Diagnostic Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-md space-y-4">
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest font-mono flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Key Strengths
                    </h4>
                    <ul className="space-y-3">
                      {results?.strengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 leading-normal font-semibold">
                          <span className="text-emerald-500 shrink-0 font-bold">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Gaps/Weaknesses */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-md space-y-4">
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest font-mono flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-500" /> Profile Gap Areas
                    </h4>
                    <ul className="space-y-3">
                      {results?.weaknesses.length === 0 ? (
                        <li className="text-xs text-slate-400 italic">No major profile weaknesses found! Outstanding preparation.</li>
                      ) : (
                        results?.weaknesses.map((weak, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 leading-normal font-semibold">
                            <span className="text-amber-500 shrink-0 font-bold">•</span>
                            <span>{weak}</span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>

                {/* Missing documentation warning */}
                {results && results.missingDocs.length > 0 && (
                  <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex items-start gap-3">
                    <FileCheck className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300">Missing Application Enablers</h4>
                      <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-1 leading-relaxed">
                        To successfully apply to global scholarships from Nepal, you must draft your document dossier. You are missing: <strong className="text-amber-900 dark:text-amber-200">{results.missingDocs.join(", ")}</strong>.
                      </p>
                    </div>
                  </div>
                )}

                {/* Direct Actionable Recommendations */}
                <div className="bg-gradient-to-r from-nepal-blue/5 to-nepal-blue-light/5 border border-nepal-blue/10 dark:border-sky-400/10 rounded-3xl p-6 sm:p-8 space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-widest font-mono flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-nepal-blue" /> Recommended Improvements Plan
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results?.recommendations.map((rec, idx) => (
                      <div key={idx} className="p-4 bg-white/50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengthen Your Application — honest next step, optional,
                    no pressure. Does not claim documents will change the
                    Match Score; only that presentation can be strengthened. */}
                {!nextStepDismissed && (
                  <div className="bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 sm:p-8 space-y-4">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-widest font-mono flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-nepal-crimson dark:text-nepal-crimson-light" /> Strengthen Your Application
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                      Some factors, like a completed GPA, can't be changed. But how your genuine experience, achievements and qualifications are presented in your CV, SOP and other documents can always be reviewed and strengthened.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setCurrentTab("workspace")}
                        className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-nepal-blue to-nepal-blue-light text-white font-bold text-xs rounded-xl shadow-md hover:opacity-95 transition-all cursor-pointer"
                      >
                        Review & Improve My Documents
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setNextStepDismissed(true)}
                        className="px-5 py-2.5 text-slate-500 dark:text-slate-400 font-bold text-xs rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        Not Now
                      </button>
                    </div>
                  </div>
                )}

                {/* Best Fit Matched Opportunities */}
                <div className="space-y-4">
                  <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">Recommended Opportunities</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {results?.matchedOpps.slice(0, 4).map(({ opp, score, status }) => (
                      <div
                        key={opp.id}
                        className="p-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm hover:border-nepal-crimson transition-all flex justify-between items-start"
                      >
                        <div className="space-y-2">
                          <span className={`inline-block text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${opp.fullyFunded === "Yes" ? "text-emerald-500 bg-emerald-500/5" : "text-amber-500 bg-amber-500/5"}`}>
                            {opp.fullyFunded === "Yes" ? "Fully Funded" : "Partial Waiver"}
                          </span>
                          <h4 className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1">
                            {opp.title}
                          </h4>
                          <p className="text-xs text-slate-400 font-mono">{opp.provider}</p>
                          <div className="text-xs text-slate-500 font-medium">
                            Deadline: <strong className="text-slate-700 dark:text-slate-300">{opp.applicationDeadline}</strong>
                          </div>
                        </div>
                        <div className="flex flex-col items-end shrink-0 pl-3">
                          <span className="text-lg font-black text-nepal-crimson font-mono">{score}%</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase font-mono tracking-wider">Match</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Smart AI Counselor and Mentoring Panel */}
        <div className="lg:col-span-4">
          <div className="bg-gradient-to-br from-[#0F1B2D] to-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden flex flex-col h-[740px]">
            {/* Top Accent Graphic */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-nepal-crimson/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-nepal-blue/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3 shrink-0">
              <div className="p-2 bg-gradient-to-tr from-nepal-crimson to-nepal-blue rounded-xl text-white">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="font-bold text-sm flex items-center gap-1">
                  KIPLAN AI Mentor
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider font-mono">Live</span>
                </h3>
                <p className="text-[10px] text-slate-400">Tailored study advice for Nepali aspirants.</p>
              </div>
            </div>

            {/* Chat list area */}
            <div className="flex-grow overflow-y-auto py-4 space-y-3 pr-1 text-xs leading-relaxed">
              {aiChat.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`p-3 rounded-2xl max-w-[85%] font-medium ${
                    msg.role === "user" 
                      ? "bg-nepal-crimson text-white rounded-br-none" 
                      : "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-800/80"
                  }`}>
                    {/* Preserve line breaks and render bold markdown tags simple parser */}
                    {msg.text.split("\n").map((para, pIdx) => {
                      // basic parser for bold tags **bold**
                      const parts = para.split("**");
                      return (
                        <p key={pIdx} className={pIdx > 0 ? "mt-1.5" : ""}>
                          {parts.map((part, ptIdx) => ptIdx % 2 === 1 ? <strong key={ptIdx} className="text-white font-extrabold">{part}</strong> : part)}
                        </p>
                      );
                    })}
                  </div>
                </div>
              ))}
              {isAiTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 border border-slate-800 text-slate-400 p-3 rounded-2xl rounded-bl-none flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts helper */}
            <div className="py-2 flex gap-1.5 flex-wrap shrink-0 border-t border-slate-800">
              {[
                "How to write my SOP?",
                "Keshar Mahal NOC guide",
                "Germany Blocked Account"
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setAiQuestion(q);
                  }}
                  className="px-2.5 py-1.5 bg-slate-800/40 border border-slate-800 text-[10px] font-bold text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input form */}
            <form onSubmit={handleAskCounselor} className="flex gap-2 shrink-0 pt-2 border-t border-slate-800">
              <input
                type="text"
                placeholder="Ask counselor a question..."
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                className="flex-grow px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-nepal-crimson transition-colors"
              />
              <button
                type="submit"
                className="p-2.5 bg-nepal-crimson text-white rounded-xl hover:opacity-95 transition-all shrink-0 cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}