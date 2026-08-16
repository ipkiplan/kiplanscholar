import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  GraduationCap, 
  BookOpen, 
  ChevronDown, 
  Globe, 
  Lock, 
  HelpCircle,
  Layers,
  Sparkles,
  Calendar,
  Landmark,
  Compass,
  TrendingUp,
  Building2,
  User,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { notifySuccess } from "../lib/notifications";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  setPlaceholderMeta: (meta: any) => void;
}

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  isDarkMode, 
  setIsDarkMode,
  setPlaceholderMeta 
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"resources" | "destinations" | null>(null);
  
  // Mobile accordions
  const [mobileResOpen, setMobileResOpen] = useState(false);
  const [mobileDestOpen, setMobileDestOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setIsOpen(false);
    setActiveDropdown(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Preset loading for Resources page
  const handleResourcePreset = (preset: string) => {
    (window as any).resourcePreset = preset;
    handleNavClick("resources");
  };

  // Handle dynamic placeholder page triggers
  const handlePlaceholder = (
    title: string,
    category: string,
    description: string,
    comingSoonFeatures: string[],
    type: "opportunity" | "resource"
  ) => {
    setPlaceholderMeta({ title, category, description, comingSoonFeatures, type });
    handleNavClick("placeholder");
  };

  // 2. Destinations Dropdown data grouped into logical geographical clusters
  const destinationsMegaGroups = [
    {
      title: "POPULAR STUDY HUBS",
      icon: Globe,
      color: "text-blue-500 bg-blue-500/10",
      items: [
        { label: "Australia", action: () => handleNavClick("scholarships") },
        { label: "United Kingdom", action: () => handleNavClick("scholarships") },
        { label: "United States", action: () => handleNavClick("scholarships") },
        { 
          label: "Canada", 
          action: () => handlePlaceholder(
            "Canada Study Opportunities", 
            "Canada", 
            "Explore fully funded study pathways in Canada, including the Vanier Graduate Scholarships, IDRC Research Fellowships, and university-specific entrance awards.", 
            ["Vanier Graduate Scholarships guide", "IDRC Research Fellowships", "Study permit & financial proof instructions", "Educational transcript notary checklists"], 
            "opportunity"
          ) 
        },
        { label: "Germany", action: () => handleNavClick("scholarships") },
        { 
          label: "France", 
          action: () => handlePlaceholder(
            "France Study Opportunities", 
            "France", 
            "Discover prestigious French government scholarships, Eiffel Excellence awards, and campus-specific funding for international students.", 
            ["Eiffel Excellence Scholarships", "Charpak Scholarship programs", "Campus France Nepal attestation guides", "French visa blocked account guidelines"], 
            "opportunity"
          ) 
        },
        { 
          label: "Netherlands", 
          action: () => handlePlaceholder(
            "Netherlands Study Opportunities", 
            "Netherlands", 
            "Find fully funded master's and PhD programs in the Netherlands, including the Orange Tulip and NL Scholarships.", 
            ["NL Scholarship (formerly Holland Scholarship)", "Orange Tulip Scholarship pipelines", "VFS Global Kathmandu visa process", "Dutch municipality registration checks"], 
            "opportunity"
          ) 
        },
        { 
          label: "New Zealand", 
          action: () => handlePlaceholder(
            "New Zealand Study Opportunities", 
            "New Zealand", 
            "Find fully funded study grants, doctoral scholarships, and university entrance awards in New Zealand.", 
            ["Manaaki New Zealand Scholarships", "University of Otago doctoral funding", "New Zealand student visa guidelines", "NOC & funds verification guidelines"], 
            "opportunity"
          ) 
        }
      ]
    },
    {
      title: "EUROPE & NORDIC",
      icon: Layers,
      color: "text-purple-500 bg-purple-500/10",
      items: [
        { 
          label: "Switzerland", 
          action: () => handlePlaceholder(
            "Switzerland Study Opportunities", 
            "Switzerland", 
            "Access world-class Swiss government excellence scholarships, ETH Zurich fellowships, and EPFL doctoral funding.", 
            ["Swiss Government Excellence Scholarships", "ETH Zurich Excellence Opportunity", "Swiss student visa financial proof", "German/French translation notary guides"], 
            "opportunity"
          ) 
        },
        { 
          label: "Norway", 
          action: () => handlePlaceholder(
            "Norway Study Opportunities", 
            "Norway", 
            "Explore tuition-free and fully funded graduate and doctoral research pathways in beautiful Norway.", 
            ["Norwegian PhD research fellowships", "BI Norwegian Business School grants", "Norway student visa blocked account setup", "Kathmandu translation certifications"], 
            "opportunity"
          ) 
        },
        { 
          label: "Finland", 
          action: () => handlePlaceholder(
            "Finland Study Opportunities", 
            "Finland", 
            "Study in the happiest country. Discover fully funded master's and doctoral waiver schemes in Finland.", 
            ["Finnish Government Scholarship pool", "University of Helsinki waivers", "Finland residence permit processing guide", "Lump sum living cost bank criteria"], 
            "opportunity"
          ) 
        },
        { 
          label: "Sweden", 
          action: () => handlePlaceholder(
            "Sweden Study Opportunities", 
            "Sweden", 
            "Find fully funded master's scholarships and doctoral programs under the Swedish Institute.", 
            ["Swedish Institute Scholarships for Global Professionals", "KTH & Chalmers tuition waivers", "Sweden student residence visa guides", "Application portal document notary guides"], 
            "opportunity"
          ) 
        },
        { 
          label: "Denmark", 
          action: () => handlePlaceholder(
            "Denmark Study Opportunities", 
            "Denmark", 
            "Explore Danish government state scholarships and tuition waivers for international students.", 
            ["Danish Government State Scholarships", "University of Copenhagen fellowships", "Denmark student visa processing checklists", "Kathmandu legal translations"], 
            "opportunity"
          ) 
        },
        { 
          label: "Ireland", 
          action: () => handlePlaceholder(
            "Ireland Study Opportunities", 
            "Ireland", 
            "Access Irish Government scholarships, Irish research fellowships, and university-specific merit waivers.", 
            ["Government of Ireland International Education Scholarship", "Irish Research Council postgraduate scholarships", "Ireland student visa guidelines in Nepal", "SOP writing for Irish universities"], 
            "opportunity"
          ) 
        },
        { 
          label: "Italy", 
          action: () => handlePlaceholder(
            "Italy Study Opportunities", 
            "Italy", 
            "Learn about regional Italian DSU scholarships, university-specific fee waivers, and government grants.", 
            ["Italian Government (MAECI) Scholarships", "Regional DSU Scholarships (fully funded)", "VFS Global Kathmandu Italian student visa path", "DOV (Declaration of Value) procurement steps"], 
            "opportunity"
          ) 
        },
        { 
          label: "Spain", 
          action: () => handlePlaceholder(
            "Spain Study Opportunities", 
            "Spain", 
            "Discover fully funded language programmes, Spanish ministry grants, and Erasmus research placements in Spain.", 
            ["Spanish Ministry of Foreign Affairs (MAEC) Grants", "Carolina Foundation scholarships", "Spain student visa requirements in Kathmandu", "SOP translation guidelines"], 
            "opportunity"
          ) 
        },
        { label: "European Union", action: () => handleNavClick("scholarships") }
      ]
    },
    {
      title: "ASIA & PACIFIC",
      icon: Compass,
      color: "text-emerald-500 bg-emerald-500/10",
      items: [
        { 
          label: "Japan", 
          action: () => handlePlaceholder(
            "Japan Study Opportunities", 
            "Japan", 
            "Discover MEXT Japanese government scholarships, JASSO grants, and university recommendation tracks.", 
            ["MEXT Embassy & University Recommendation tracks", "JASSO short-term study support", "Japanese language prep schools in Kathmandu", "Certificate of Eligibility (COE) guidelines"], 
            "opportunity"
          ) 
        },
        { 
          label: "South Korea", 
          action: () => handlePlaceholder(
            "South Korea Study Opportunities", 
            "South Korea", 
            "Apply for the fully funded Global Korea Scholarship (GKS), Korean university waivers, and corporate fellowships.", 
            ["Global Korea Scholarship (GKS) Embassy & University tracks", "KAIST fully funded undergraduate/graduate grants", "South Korea student visa (D-2) document checklist", "Apostille guidelines for Kathmandu certificates"], 
            "opportunity"
          ) 
        },
        { 
          label: "China", 
          action: () => handlePlaceholder(
            "China Study Opportunities", 
            "China", 
            "Access fully funded Chinese Government Scholarships (CSC), provincial grants, and university-level waivers.", 
            ["Chinese Government Scholarship (CSC) Category A & B", "Confucius Institute scholarships", "China student visa (X1) requirements", "Medical examination form notary checklists"], 
            "opportunity"
          ) 
        },
        { 
          label: "India", 
          action: () => handlePlaceholder(
            "India Study Opportunities", 
            "India", 
            "Explore ICCR government scholarships, Study in India waivers, and premium technology institute fellowships.", 
            ["ICCR Indian Government Scholarships for Nepalis", "Study in India (SII) fully funded schemes", "Admissions guidelines for IITs/NITs", "Equivalence certificate (AIU) guidelines"], 
            "opportunity"
          ) 
        },
        { 
          label: "Singapore", 
          action: () => handlePlaceholder(
            "Singapore Study Opportunities", 
            "Singapore", 
            "Secure prestigious fully funded research fellowships, SINGA awards, and corporate grants in Singapore.", 
            ["Singapore International Graduate Award (SINGA)", "NUS & NTU research fellowship slots", "Singapore student pass application guides", "Transcript conversion and verification"], 
            "opportunity"
          ) 
        },
        { 
          label: "Malaysia", 
          action: () => handlePlaceholder(
            "Malaysia Study Opportunities", 
            "Malaysia", 
            "Find Malaysian International Scholarships (MIS) and research grants for elite private/public universities.", 
            ["Malaysian International Scholarship (MIS)", "University-specific research assistantships", "EMGS visa approval letter (VAL) process", "Kathmandu MoEST verification guides"], 
            "opportunity"
          ) 
        }
      ]
    },
    {
      title: "PRESTIGIOUS AGENCY SCHEMES",
      icon: Landmark,
      color: "text-amber-500 bg-amber-500/10",
      items: [
        { 
          label: "ADB", 
          action: () => handlePlaceholder(
            "ADB-Japan Scholarship Program", 
            "ADB", 
            "Fully funded master's degrees in economics, management, science, and technology at premier participating institutions.", 
            ["ADB-JSP fully-funded tuition and airfare", "Partner university list (NUS, Tokyo, etc.)", "Professional references guidelines", "Income tax proof and verification checklists"], 
            "opportunity"
          ) 
        },
        { 
          label: "United Nations", 
          action: () => handlePlaceholder(
            "United Nations Opportunities", 
            "United Nations", 
            "Secure prestigious UN fellowships, internships, and early-career associate professional officer (APO) programs.", 
            ["UN Volunteers (UNV) South Asia postings", "WHO, UNICEF, and UNDP Kathmandu office internships", "UN research training fellowships", "Motivation letter writing for international bodies"], 
            "opportunity"
          ) 
        },
        { 
          label: "World Bank", 
          action: () => handlePlaceholder(
            "World Bank Scholarships & Fellowships", 
            "World Bank", 
            "Fully funded graduate funding for development-related master's programs for outstanding mid-career professionals.", 
            ["Joint Japan/World Bank Graduate Scholarship Program (JJ/WBGSP)", "Robert S. McNamara Fellowship program", "Employer recommendation letter guidelines", "Required professional experience checklists"], 
            "opportunity"
          ) 
        },
        { 
          label: "Commonwealth", 
          action: () => handlePlaceholder(
            "Commonwealth Scholarships", 
            "Commonwealth", 
            "Unlock fully funded master's and doctoral scholarships at UK universities for outstanding citizens of Commonwealth countries.", 
            ["Commonwealth Shared and General Scholarships", "Full tuition, living stipend, and flight coverage", "Local agency nomination process in Nepal", "SOP prompts and essay review blueprints"], 
            "opportunity"
          ) 
        },
        { 
          label: "British Council", 
          action: () => handlePlaceholder(
            "British Council Scholarship Schemes", 
            "British Council", 
            "Discover scholarships for women in STEM, language teaching assistantships, and creative residency grants.", 
            ["British Council Scholarships for Women in STEM", "IELTS preparation support & test fee waivers", "Creative economy research fellowships", "UK university matching assistance"], 
            "opportunity"
          ) 
        },
        { 
          label: "USAID", 
          action: () => handlePlaceholder(
            "USAID Funded Program Guides", 
            "USAID", 
            "Explore professional development fellowships, localized training programs, and research grants supported by USAID.", 
            ["USAID local training grants in Kathmandu", "Development-related professional fellowships", "Reference letter (LOR) formats for NGO workers", "Project proposal design criteria"], 
            "opportunity"
          ) 
        },
        { label: "DAAD", action: () => handleNavClick("scholarships") },
        { label: "Chevening", action: () => handleNavClick("scholarships") },
        { label: "Fulbright", action: () => handleNavClick("scholarships") },
        { label: "Erasmus+", action: () => handleNavClick("scholarships") },
        { 
          label: "MEXT", 
          action: () => handlePlaceholder(
            "MEXT Japanese Government Scholarship", 
            "MEXT", 
            "Super-prestigious fully-funded MEXT scholarship index including Embassy and University recommendations.", 
            ["Fully-funded Japanese college and grad programs", "Embassy exam preparation guidelines in Kathmandu", "Required document notary checklists", "Japanese language prep guidance"], 
            "opportunity"
          ) 
        },
        { 
          label: "GKS", 
          action: () => handlePlaceholder(
            "Global Korea Scholarship (GKS)", 
            "GKS", 
            "All about South Korea's premier fully-funded government scholarship program for undergraduate and graduate levels.", 
            ["Embassy track vs University track checklists", "Apostille & notary requirements at MoFA Kathmandu", "Personal statement drafting blueprints", "TOPIK language test targets"], 
            "opportunity"
          ) 
        },
        { 
          label: "CSC", 
          action: () => handlePlaceholder(
            "Chinese Government Scholarship (CSC)", 
            "CSC", 
            "A comprehensive walkthrough for the Chinese Government Scholarship (CSC) for undergraduate and postgraduate students.", 
            ["Category A, B, and C application pathways", "Agency numbers list for top Chinese universities", "Physical Examination form stamp checklists", "SOP writing for Chinese supervisors"], 
            "opportunity"
          ) 
        },
        { 
          label: "ICCR", 
          action: () => handlePlaceholder(
            "ICCR Indian Government Scholarships", 
            "ICCR", 
            "The largest fully funded scholarship scheme for Nepali students studying in Indian universities.", 
            ["Complete tuition, hostel, and medical allowances", "ICCR Portal registration guides", "Aisect equivalence steps", "Kathmandu Indian Embassy interview prep"], 
            "opportunity"
          ) 
        },
        { 
          label: "Australia Awards", 
          action: () => handlePlaceholder(
            "Australia Awards Scholarships", 
            "Australia Awards", 
            "Fully funded master's level scholarships offering developmental study, leadership training, and professional network expansion in Australia.", 
            ["100% tuition, travel, and health insurance", "Detailed professional development plan prompts", "Kathmandu IELTS/PTE target indicators", "Re-integration project pitch structures"], 
            "opportunity"
          ) 
        }
      ]
    }
  ];

  // 3. Resources Dropdown data list
  const resourcesItems = [
    { 
      label: "Country Guides", 
      action: () => handleNavClick("countries"), 
      desc: "Visa and application guidelines mapped by country." 
    },
    { 
      label: "University Explorer", 
      action: () => handleNavClick("university-explorer"), 
      desc: "Browse verified universities with rankings and tuition." 
    },
    { 
      label: "Scholarship Calendar", 
      action: () => handleNavClick("scholarship-calendar"), 
      desc: "Chronological opening and deadline calendars." 
    },
    { 
      label: "University Comparison", 
      action: () => handleNavClick("university-comparison"), 
      desc: "Compare universities side by side across key criteria." 
    },
    { 
      label: "SOP Builder", 
      action: () => handleNavClick("sop-builder"), 
      desc: "Smart paragraph builder for Statements of Purpose." 
    },
    { 
      label: "LOR Builder", 
      action: () => handleNavClick("lor-builder"), 
      desc: "Academic & Professional Reference letter frameworks." 
    },
    { 
      label: "CV Builder", 
      action: () => handleNavClick("cv-builder"),
      desc: "ATS-optimized curriculum vitae structures." 
    },
    { 
      label: "CV Writing Guide", 
      action: () => handleResourcePreset("res-cv"),
      desc: "What to include, how to phrase achievements, and formatting standards." 
    },
    { 
      label: "Motivation Letter Builder", 
      action: () => handleNavClick("motivation-letter-builder"), 
      desc: "Interactive writing coach for scholarship and admission letters." 
    },
    { 
      label: "Visa Preparation Hub", 
      action: () => handleNavClick("visa-prep"), 
      desc: "Country-by-country visa overview, documents, and checklist." 
    },
    { 
      label: "Interview Preparation", 
      action: () => handleResourcePreset("res-interview-prep"),
      desc: "Chevening & Fulbright panel prep questions." 
    },
    { 
      label: "Blog", 
      action: () => handlePlaceholder(
        "KIPLANScholar Academic Blog",
        "Blog",
        "Expert articles, interview transcripts with Chevening and Fulbright alumni from Nepal, and visa attestation guides.",
        ["Success story interviews with Nepali scholars", "Kathmandu passport & visa processing walk-throughs", "English proficiency test (IELTS vs PTE) reviews", "Housing and bank blocked account tutorials"],
        "resource"
      ),
      desc: "Success stories and step-by-step processing guides." 
    },
    { 
      label: "Frequently Asked Questions", 
      action: () => handleNavClick("faq"), 
      desc: "Quick answers to NOC and blocked account queries." 
    },
    { 
      label: "Legal & Notarial Service", 
      action: () => handleNavClick("resources"), 
      desc: "Certified translation and attestation support — coming soon." 
    }
  ];

  // Shared class strings — kept in one place so nav-item styling never drifts
  // out of sync again. "Active" = gold accent (this is where you are).
  // "Hover" = navy (matches primary brand color, distinct from active state).
  const navItemClass = (active: boolean) =>
    `px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
      active
        ? "text-nepal-blue dark:text-nepal-gold bg-nepal-gold/10 dark:bg-nepal-gold/10"
        : "text-slate-600 dark:text-slate-300 hover:text-nepal-blue dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40"
    }`;

  const mobileNavItemClass = (active: boolean) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all ${
      active
        ? "text-nepal-blue dark:text-nepal-gold bg-nepal-gold/10 dark:bg-nepal-gold/10"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/40"
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 transition-colors duration-300">
      {/* Two-tone accent strip — navy to gold, matches the simplified brand palette */}
      <div className="h-1.5 w-full bg-gradient-to-r from-nepal-blue to-nepal-gold" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Brand */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick("home")}>
            <div className="relative p-2 bg-gradient-to-tr from-nepal-blue to-nepal-blue-light rounded-xl text-white shadow-md">
              <GraduationCap className="h-6 w-6" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-nepal-gold rounded-full animate-ping" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-nepal-gold rounded-full" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-nepal-blue dark:text-white flex items-center">
                KIPLAN<span className="text-nepal-gold-dark dark:text-nepal-gold">Scholar</span>
              </span>
              <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 -mt-1 font-mono">
                Nepali Student Portal
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1" ref={dropdownRef}>
            
            {/* Opportunities — direct link to the Opportunity Explorer page.
                Previously a mega-menu dropdown duplicating Applicants /
                Education / Funding / Programme Type / Deadlines filters
                that now live on that page itself via the horizontal
                FilterBar (Applicants, Education, Funding, Programme Type,
                Deadline, Search, More Filters). Single click, no dropdown. */}
            <button
              onClick={() => handleNavClick("scholarships")}
              className={navItemClass(
                currentTab === "opportunities" || currentTab === "scholarships" || currentTab === "women" || currentTab === "entrepreneurs"
              )}
            >
              <Globe className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
              <span>Opportunities</span>
            </button>

            {/* My Eligibility */}
            <button
              onClick={() => handleNavClick("eligibility")}
              className={navItemClass(currentTab === "eligibility")}
            >
              <TrendingUp className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
              <span>My Eligibility</span>
            </button>

            {/* Organizations */}
            <button
              onClick={() => handleNavClick("organizations")}
              className={navItemClass(currentTab === "organizations")}
            >
              <Building2 className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
              <span>Organizations</span>
            </button>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === "resources" ? null : "resources")}
                className={navItemClass(currentTab === "resources" || currentTab === "faq")}
              >
                <BookOpen className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                <span>Resources</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === "resources" ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === "resources" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-[-80px] mt-2 w-[640px] max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl p-5 grid grid-cols-3 gap-3 z-50 text-left"
                  >
                    {resourcesItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          item.action();
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left p-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-800/50 group"
                      >
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-nepal-blue dark:group-hover:text-nepal-gold leading-snug">
                          {item.label}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 leading-relaxed font-medium">
                          {item.desc}
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* About */}
            <button
              onClick={() => handleNavClick("about")}
              className={navItemClass(currentTab === "about")}
            >
              <HelpCircle className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
              <span>About</span>
            </button>

            {/* My Workspace — single concept replacing the former Dashboard/My Dashboard pair (ES-006C nav refinement) */}
            {user ? (
              <button
                onClick={() => handleNavClick("workspace")}
                className={navItemClass(currentTab === "workspace")}
              >
                <User className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                <span>My Workspace</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick("login")}
                className={navItemClass(currentTab === "login" || currentTab === "register")}
              >
                <Lock className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                <span>My Workspace</span>
              </button>
            )}

          </div>

          {/* Theme, Actions & Identity Portal on Far Right */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              id="theme-toggle-btn"
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-nepal-blue dark:hover:text-white transition-all border border-slate-200/40 dark:border-slate-800/40 cursor-pointer"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5 text-slate-500" />}
            </button>

            {/* Authentication Button(s) — Desktop */}
            {user ? (
              <div className="hidden md:flex items-center gap-2 shrink-0">
                <button
                  onClick={async () => {
                    await signOut();
                    notifySuccess("Logout successful. See you again!");
                    handleNavClick("home");
                  }}
                  className="btn-ghost !px-4 !py-2 !text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleNavClick("login")}
                  className="btn-ghost !border-0 !px-4 !py-2 !text-sm"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavClick("register")}
                  className="btn-primary !px-4 !py-2 !text-sm"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              id="mobile-menu-toggle-btn"
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-nepal-blue dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-slate-200/40 dark:border-slate-800/40 cursor-pointer"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (AnimatePresence) — Home item removed: the logo already
          navigates home, and low-res screens need the vertical space more
          than a redundant nav item. */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden border-t border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-950 overflow-y-auto max-h-[calc(100vh-4rem)]"
          >
            <div className="px-4 pt-2 pb-6 space-y-1.5 text-left">

              {/* Opportunities — direct link, same simplification as desktop.
                  No accordion, no mega menu: single tap to the Opportunity
                  Explorer page, where the FilterBar now handles filtering. */}
              <button
                onClick={() => handleNavClick("scholarships")}
                className={mobileNavItemClass(
                  currentTab === "opportunities" || currentTab === "scholarships" || currentTab === "women" || currentTab === "entrepreneurs"
                )}
              >
                <Globe className="h-5 w-5 shrink-0 text-slate-400" />
                <span>Opportunities</span>
              </button>

              {/* My Eligibility */}
              <button
                onClick={() => handleNavClick("eligibility")}
                className={mobileNavItemClass(currentTab === "eligibility")}
              >
                <TrendingUp className="h-5 w-5 shrink-0 text-slate-400" />
                <span>My Eligibility</span>
              </button>

              {/* Organizations */}
              <button
                onClick={() => handleNavClick("organizations")}
                className={mobileNavItemClass(currentTab === "organizations")}
              >
                <Building2 className="h-5 w-5 shrink-0 text-slate-400" />
                <span>Organizations</span>
              </button>

              {/* Resources Accordion Toggle */}
              <div className="space-y-1">
                <button
                  onClick={() => setMobileResOpen(!mobileResOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/40"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-slate-400 shrink-0" />
                    <span>Resources</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileResOpen ? "rotate-180" : ""}`} />
                </button>
                {mobileResOpen && (
                  <div className="pl-6 space-y-1 border-l border-slate-150 dark:border-slate-800 ml-6 py-1">
                    {resourcesItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          item.action();
                          setIsOpen(false);
                        }}
                        className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-slate-500 hover:text-nepal-blue dark:text-slate-400 dark:hover:text-nepal-gold"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* About */}
              <button
                onClick={() => handleNavClick("about")}
                className={mobileNavItemClass(currentTab === "about")}
              >
                <HelpCircle className="h-5 w-5 shrink-0 text-slate-400" />
                <span>About</span>
              </button>

              {/* My Workspace — single concept replacing the former Dashboard/My Dashboard pair (ES-006C nav refinement) */}
              {user ? (
                <button
                  onClick={() => handleNavClick("workspace")}
                  className={mobileNavItemClass(currentTab === "workspace")}
                >
                  <User className="h-5 w-5 shrink-0 text-slate-400" />
                  <span>My Workspace</span>
                </button>
              ) : (
                <button
                  onClick={() => handleNavClick("login")}
                  className={mobileNavItemClass(currentTab === "login" || currentTab === "register")}
                >
                  <Lock className="h-5 w-5 shrink-0 text-slate-400" />
                  <span>My Workspace</span>
                </button>
              )}

              {/* Authentication Button(s) — Mobile */}
              <div className="pt-4 px-4 space-y-2">
                {user ? (
                  <>
                    <button
                      onClick={async () => {
                        await signOut();
                        notifySuccess("Logout successful. See you again!");
                        handleNavClick("home");
                      }}
                      className="btn-ghost w-full !py-3 font-bold"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleNavClick("login")}
                    className="btn-primary w-full !py-3 font-bold"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Login / Register Portal</span>
                  </button>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}