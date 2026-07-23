import React, { useState, useRef, useEffect } from "react";
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Users, 
  ChevronDown, 
  Home, 
  Globe, 
  Lock, 
  HelpCircle,
  Briefcase,
  Layers,
  Sparkles,
  Calendar,
  Landmark,
  Compass,
  Clock,
  TrendingUp,
  Building2,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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
  const [activeDropdown, setActiveDropdown] = useState<"opportunities" | "resources" | "destinations" | null>(null);
  
  // Mobile accordions
  const [mobileOppOpen, setMobileOppOpen] = useState(false);
  const [mobileResOpen, setMobileResOpen] = useState(false);
  const [mobileDestOpen, setMobileDestOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Preset loading for Scholarships page
  const handleScholarshipPreset = (preset: { search?: string; level?: string; category?: string; country?: string }) => {
    (window as any).scholarshipFilterPreset = preset;
    handleNavClick("scholarships");
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

  // 1. Opportunities Mega Menu data grouped into logical categories
  const opportunitiesMegaGroups = [
    {
      title: "APPLICANTS",
      icon: Users,
      color: "text-blue-500 bg-blue-500/10",
      items: [
        { label: "All Applicants", action: () => handleScholarshipPreset({}) },
        { label: "Women", action: () => handleScholarshipPreset({ category: "Women" }) },
        { label: "Entrepreneurs", action: () => handleScholarshipPreset({ category: "Entrepreneurs" }) },
        { 
          label: "Persons with Disabilities", 
          action: () => handlePlaceholder(
            "Opportunities for Persons with Disabilities",
            "Disabilities",
            "Explore dedicated global funding, adaptive learning grants, and fully-accessible research residencies supporting individuals with disabilities.",
            ["DAAD special allowance for disabled students", "Fulbright accessibility support grants", "NGO-supported training stipends in Kathmandu", "Assistive technology procurement awards"],
            "opportunity"
          )
        },
        { label: "Researchers", action: () => handleScholarshipPreset({ category: "Researchers" }) },
        { label: "Professionals", action: () => handleScholarshipPreset({ category: "Professionals" }) },
        { 
          label: "School Students", 
          action: () => handlePlaceholder(
            "Scholarships for School Students",
            "School",
            "Find fully funded high school exchanges, science olympiads, and pre-university academic summer camps around the globe.",
            ["United World Colleges (UWC) Nepal selection", "Kennedy-Lugar Youth Exchange and Study (YES) program", "Global youth summer science camps", "Secondary education certification notary checklists"],
            "opportunity"
          )
        },
        { 
          label: "Recent Graduates", 
          action: () => handlePlaceholder(
            "Opportunities for Recent Graduates",
            "Graduates",
            "Kickstart your career with international early-career fellowships, graduate trainee schemes, and paid post-graduation internships.",
            ["UN Graduate Trainee Programs", "Erasmus Mundus joint master's pipelines", "Global corporate leadership training schemes", "MoEST NOC guides for early-career training"],
            "opportunity"
          )
        }
      ]
    },
    {
      title: "EDUCATION",
      icon: GraduationCap,
      color: "text-indigo-500 bg-indigo-500/10",
      items: [
        { label: "Undergraduate", action: () => handleScholarshipPreset({ level: "Undergraduate" }) },
        { 
          label: "Diploma", 
          action: () => handlePlaceholder(
            "Diploma Opportunities",
            "Diploma",
            "Access globally recognized vocational certificates, specialized technical diplomas, and polytechnic scholarships in Europe, Australia, and Canada.",
            ["Canadian college post-grad diploma pipelines", "Australian TAFE vocational funding", "German dual vocational training (Ausbildung)", "MOEST verification checklists for diploma records"],
            "opportunity"
          )
        },
        { 
          label: "Short Courses", 
          action: () => handlePlaceholder(
            "Fully Funded Short Courses",
            "Short Courses",
            "Gain career-enhancing skills with fully sponsored intensive short courses, summer study modules, and executive education tracks.",
            ["Chevening Professional Fellowships", "Sweden Institute Academy (SIA) training", "Japanese Government Sakura Science exchange", "Professional references (LOR) drafting support"],
            "opportunity"
          )
        },
        { 
          label: "Training & Certification", 
          action: () => handlePlaceholder(
            "Professional Training & Certification",
            "Training",
            "Enhance your technical expertise with subsidized bootcamps, certified professional courses, and international trade qualifications.",
            ["AWS and Google Cloud scholarship credits", "Project Management Professional (PMP) funding", "Kathmandu tech-hub subsidized courses", "Notarization checklists for corporate credentials"],
            "opportunity"
          )
        },
        { label: "Master's", action: () => handleScholarshipPreset({ level: "Graduate", search: "Master" }) },
        { label: "PhD", action: () => handleScholarshipPreset({ level: "PhD" }) },
        { label: "Research", action: () => handleScholarshipPreset({ level: "Research" }) },
        { 
          label: "Postdoctoral", 
          action: () => handlePlaceholder(
            "Postdoctoral Fellowships",
            "Postdoctoral",
            "Unlock advanced research funding, laboratory residency opportunities, and academic post-doc fellowships at elite international institutions.",
            ["Humboldt Research Fellowships (Germany)", "Marie Skłodowska-Curie Actions (MSCA)", "Fulbright Visiting Scholar programs", "Academic dossier notary guidelines in Kathmandu"],
            "opportunity"
          )
        }
      ]
    },
    {
      title: "FUNDING",
      icon: Award,
      color: "text-amber-500 bg-amber-500/10",
      items: [
        { label: "Fully Funded", action: () => handleScholarshipPreset({ search: "Fully Funded" }) },
        { label: "Partially Funded", action: () => handleScholarshipPreset({ search: "Partial" }) },
        { label: "Tuition Waiver", action: () => handleScholarshipPreset({ search: "Tuition" }) },
        { label: "Living Stipend", action: () => handleScholarshipPreset({ search: "Stipend" }) },
        { label: "Travel Grant", action: () => handleScholarshipPreset({ search: "Travel" }) },
        { label: "Research Grant", action: () => handleScholarshipPreset({ search: "Research Grant" }) },
        { 
          label: "Self-funded Opportunities", 
          action: () => handlePlaceholder(
            "Self-Funded Study Options",
            "Self-funded",
            "Learn how to structure self-funded or low-tuition study programs, including student jobs, credit transfers, and bank blocked account setups.",
            ["German university zero-tuition guides", "Blocked account setups for Nepal (Siddhartha, Nabil, etc.)", "On-campus work-study hour limitations and wages", "NOC & student visa financial proof templates"],
            "opportunity"
          )
        }
      ]
    },
    {
      title: "PROGRAMME TYPE",
      icon: Briefcase,
      color: "text-rose-500 bg-rose-500/10",
      items: [
        { label: "Scholarships", action: () => handleScholarshipPreset({ search: "Scholarship" }) },
        { label: "Fellowships", action: () => handleScholarshipPreset({ search: "Fellowship" }) },
        { label: "Grants", action: () => handleScholarshipPreset({ search: "Grant" }) },
        { 
          label: "Internships", 
          action: () => handlePlaceholder(
            "Global Internships & Trainee Programs",
            "Internships",
            "Step into professional and research training with fully compensated international internships at elite labs and organizations.",
            ["CERN Summer Student Program directory", "Google STEP and engineering internship tracks", "UN agency internships in Nepal & abroad", "Manager Reference Letter (LOR) frameworks"],
            "opportunity"
          )
        },
        { 
          label: "Exchange Programmes", 
          action: () => handlePlaceholder(
            "Fully Funded Exchange Programs",
            "Exchange",
            "Participate in international semester exchanges, cultural youth leadership programs, and short-term study visits.",
            ["US Department of State exchange programs", "Erasmus+ semester mobility opportunities", "Japanese Government JENESYS program", "Academic credit transfer guidelines"],
            "opportunity"
          )
        },
        { 
          label: "Conferences", 
          action: () => handlePlaceholder(
            "Fully Funded Conference Grants",
            "Conferences",
            "Present your research or participate in world-class academic and youth summits with fully sponsored travel and attendance.",
            ["IEEE travel support options", "One Young World Summit sponsorships", "MoFA travel passport recommendation letter checklist", "Scientific abstract outline builder"],
            "opportunity"
          )
        },
        { 
          label: "Competitions", 
          action: () => handlePlaceholder(
            "Global Student Competitions & Awards",
            "Competitions",
            "Win global recognition, capital funding, and fully-funded travel to finals by entering top hackathons and business challenges.",
            ["Hult Prize and Imagine Cup timetables", "Global climate & tech hackathons", "Abstract & pitch deck outline structures", "Collaborative team registry boards"],
            "opportunity"
          )
        },
        { 
          label: "Leadership Programmes", 
          action: () => handlePlaceholder(
            "Youth Leadership Programs",
            "Leadership",
            "Hone your public policy, social entrepreneurship, or community leadership skills in funded residential academies.",
            ["YSEALI Academic Fellowships", "Chevening Leadership short courses", "Kathmandu social entrepreneurship seed grants", "Outreach project pitch builders"],
            "opportunity"
          )
        },
        { 
          label: "Volunteer Programmes", 
          action: () => handlePlaceholder(
            "Fully Funded Volunteer Schemes",
            "Volunteer",
            "Join impactful international and regional development projects with complete flight, stipend, and medical coverage.",
            ["UN Volunteers (UNV) program options", "Red Cross Youth delegation calls", "Kathmandu social impact volunteering", "Volunteer certification verification"],
            "opportunity"
          )
        },
        { 
          label: "Summer Schools", 
          action: () => handlePlaceholder(
            "International Summer & Winter Schools",
            "Summer Schools",
            "Attend prestigious intensive summer/winter schools for high-level coursework, lab access, and intercultural networks.",
            ["DAAD summer school grants in Germany", "EU Erasmus+ winter schools", "Scientific research paper review tracks", "Short-term study visa application checklists"],
            "opportunity"
          )
        }
      ]
    },
    {
      title: "DEADLINES & ALERTS",
      icon: Clock,
      color: "text-emerald-500 bg-emerald-500/10",
      items: [
        { 
          label: "Closing This Week", 
          action: () => handlePlaceholder(
            "Closing This Week Alerts",
            "Closing Week",
            "Critical priority countdown for premier scholarships whose applications close within the current week.",
            ["Urgent document check list", "IELTS score upload guidelines", "Fast-track notary services in Kathmandu", "Real-time deadline timers"],
            "opportunity"
          )
        },
        { 
          label: "Closing This Month", 
          action: () => handlePlaceholder(
            "Closing This Month Alerts",
            "Closing Month",
            "A curation of fully funded programs with application submission windows closing within the next 30 days.",
            ["DAAD / Chevening / MEXT active checks", "SOP and LOR review checkpoints", "MOEST NOC processing schedule", "Embassy visa slot reservation guidance"],
            "opportunity"
          )
        },
        { 
          label: "Opening Soon", 
          action: () => handlePlaceholder(
            "Opening Soon - Pre-registration",
            "Opening Soon",
            "Get a headstart on next cycle's fully funded applications. Learn their opening timelines and draft documents early.",
            ["Fulbright / Chevening annual timetables", "Pre-writing SOP & LOR prompts", "Language test preparation calendars", "Official transcript procurement checklists"],
            "opportunity"
          )
        },
        { 
          label: "Recently Opened", 
          action: () => handlePlaceholder(
            "Recently Opened Programs",
            "Recently Opened",
            "Browse newly opened application portals for prestigious global scholarships and research programs.",
            ["New cycle portal links", "Updated eligibility criteria reviews", "SOP draft review frameworks", "Required document lists"],
            "opportunity"
          )
        },
        { label: "2026 Intake", action: () => handleScholarshipPreset({ search: "2026" }) },
        { 
          label: "2027 Intake", 
          action: () => handlePlaceholder(
            "2027 Scholarship Intake",
            "2027 Intake",
            "Strategic pre-application guidelines, timeline mappings, and structural preparation for the 2027 academic intake cycles.",
            ["2027 major scholarship calendars", "Standardized test schedules (GRE, TOEFL, IELTS)", "Document notary and apostille timelines", "Alumni mentorship connections"],
            "opportunity"
          )
        },
        { 
          label: "Rolling Admissions", 
          action: () => handlePlaceholder(
            "Rolling Admissions Options",
            "Rolling Admissions",
            "Explore programs that accept and review applications throughout the year, offering flexible starting dates.",
            ["Rolling fellowship listings", "Immediate vacancy research positions", "Year-round training grants", "Visa processing turnaround charts"],
            "opportunity"
          )
        }
      ]
    }
  ];

  // 2. Destinations Dropdown data grouped into logical geographical clusters
  const destinationsMegaGroups = [
    {
      title: "POPULAR STUDY HUBS",
      icon: Globe,
      color: "text-blue-500 bg-blue-500/10",
      items: [
        { label: "Australia", action: () => handleScholarshipPreset({ country: "Australia" }) },
        { label: "United Kingdom", action: () => handleScholarshipPreset({ country: "United Kingdom" }) },
        { label: "United States", action: () => handleScholarshipPreset({ country: "United States" }) },
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
        { label: "Germany", action: () => handleScholarshipPreset({ country: "Germany" }) },
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
        { label: "European Union", action: () => handleScholarshipPreset({ search: "Erasmus" }) }
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
        { label: "DAAD", action: () => handleScholarshipPreset({ search: "DAAD" }) },
        { label: "Chevening", action: () => handleScholarshipPreset({ search: "Chevening" }) },
        { label: "Fulbright", action: () => handleScholarshipPreset({ search: "Fulbright" }) },
        { label: "Erasmus+", action: () => handleScholarshipPreset({ search: "Erasmus" }) },
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
      label: "Scholarship Calendar", 
      action: () => handlePlaceholder(
        "Nepali Student Scholarship Calendar",
        "Calendar",
        "A consolidated timeline mapping out opening and closing dates for major annual scholarship schemes (Fulbright, Chevening, DAAD, MEXT).",
        ["Chronological opening/closing calendars", "Automatic Google Calendar syncing", "Keshar Mahal NOC queuing guidelines", "Document translation & stamp deadlines"],
        "resource"
      ),
      desc: "Chronological opening and deadline calendars." 
    },
    { 
      label: "SOP Builder", 
      action: () => handleResourcePreset("res-sop"), 
      desc: "Smart paragraph builder for Statements of Purpose." 
    },
    { 
      label: "LOR Builder", 
      action: () => handleResourcePreset("res-lor"), 
      desc: "Academic & Professional Reference letter frameworks." 
    },
    { 
      label: "CV Builder", 
      action: () => handlePlaceholder(
        "Academic CV & Resume Builder",
        "CV",
        "A structured, LaTeX-compatible resume outline optimized to meet the strict ATS scanning requirements of foreign scholarship review boards.",
        ["Harvard & MIT style resume templates", "Action verb guidelines for academic output", "Nepali grading system GPA converters", "Automatic PDF export with custom sections"],
        "resource"
      ),
      desc: "ATS-optimized curriculum vitae structures." 
    },
    { 
      label: "Motivation Letter Guide", 
      action: () => handlePlaceholder(
        "Motivation Letter Blueprint",
        "Motivation Letter",
        "Master the art of writing compelling motivation statements that demonstrate community leadership and academic merit.",
        ["Structuring successful narrative hooks", "Quantifying social impact achievements", "Addressing study gaps and backlogs in Nepal transcripts", "5 full-text approved samples of successful awardees"],
        "resource"
      ),
      desc: "Paragraph-by-paragraph narrative formulas." 
    },
    { 
      label: "Visa Guide", 
      action: () => handleResourcePreset("res-checklist"), 
      desc: "MoFA and MOEST Keshar Mahal attestation timelines." 
    },
    { 
      label: "Interview Tips", 
      action: () => handlePlaceholder(
        "Scholarship Interview Blueprints",
        "Interview",
        "Step-by-step prep guides, standard interview prompts, and communication techniques for Chevening/Fulbright boards.",
        ["Most common scholarship panel interview questions", "Mock answer templates for Nepali aspirants", "STAR technique storytelling worksheets", "Tips for clear audio-video setups for remote interviews"],
        "resource"
      ),
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
    }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 transition-colors duration-300">
      {/* Red & Blue Top Accent Strip (Nepali Flag Theme) */}
      <div className="h-1.5 w-full bg-gradient-to-r from-nepal-crimson via-nepal-blue to-nepal-gold" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Brand */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick("home")}>
            <div className="relative p-2 bg-gradient-to-tr from-nepal-crimson to-nepal-blue rounded-xl text-white shadow-md">
              <GraduationCap className="h-6 w-6" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-nepal-gold rounded-full animate-ping" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-nepal-gold rounded-full" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-nepal-blue dark:text-white flex items-center">
                KIPLAN<span className="text-nepal-crimson dark:text-nepal-crimson-light">Scholar</span>
              </span>
              <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 -mt-1 font-mono">
                Nepali Student Portal
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1" ref={dropdownRef}>
            
            {/* Home */}
            <button
              onClick={() => handleNavClick("home")}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                currentTab === "home"
                  ? "text-nepal-crimson dark:text-nepal-crimson-light bg-nepal-crimson/5 dark:bg-nepal-crimson-light/10"
                  : "text-slate-600 dark:text-slate-300 hover:text-nepal-blue dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40"
              }`}
            >
              <Home className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
              <span>Home</span>
            </button>

            {/* Opportunities Mega Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === "opportunities" ? null : "opportunities")}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                  currentTab === "opportunities" || currentTab === "scholarships" || currentTab === "women" || currentTab === "entrepreneurs"
                    ? "text-nepal-crimson dark:text-nepal-crimson-light bg-nepal-crimson/5 dark:bg-nepal-crimson-light/10"
                    : "text-slate-600 dark:text-slate-300 hover:text-nepal-blue dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                <Globe className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                <span>Opportunities</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === "opportunities" ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {activeDropdown === "opportunities" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute left-1/2 -translate-x-[38%] mt-2 w-[980px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl p-6 grid grid-cols-5 gap-5 z-50 text-left"
                  >
                    {opportunitiesMegaGroups.map((group, gIdx) => {
                      const IconComponent = group.icon;
                      return (
                        <div key={gIdx} className="space-y-4">
                          <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                            <div className={`p-1.5 rounded-lg ${group.color} shrink-0`}>
                              <IconComponent className="h-3.5 w-3.5 text-slate-700 dark:text-white" />
                            </div>
                            <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 dark:text-slate-500 font-mono">
                              {group.title}
                            </span>
                          </div>
                          <div className="flex flex-col space-y-1.5">
                            {group.items.map((item, itemIdx) => (
                              <button
                                key={itemIdx}
                                onClick={() => {
                                  item.action();
                                  setActiveDropdown(null);
                                }}
                                className="w-full text-left py-1 px-2 text-[11.5px] font-semibold text-slate-600 dark:text-slate-400 hover:text-nepal-crimson dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-lg transition-all cursor-pointer"
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* My Eligibility */}
            <button
              onClick={() => handleNavClick("eligibility")}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                currentTab === "eligibility"
                  ? "text-nepal-crimson dark:text-nepal-crimson-light bg-nepal-crimson/5 dark:bg-nepal-crimson-light/10"
                  : "text-slate-600 dark:text-slate-300 hover:text-nepal-blue dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40"
              }`}
            >
              <TrendingUp className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
              <span>My Eligibility</span>
            </button>

            {/* Organizations */}
            <button
              onClick={() => handleNavClick("organizations")}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                currentTab === "organizations"
                  ? "text-nepal-crimson dark:text-nepal-crimson-light bg-nepal-crimson/5 dark:bg-nepal-crimson-light/10"
                  : "text-slate-600 dark:text-slate-300 hover:text-nepal-blue dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40"
              }`}
            >
              <Building2 className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
              <span>Organizations</span>
            </button>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === "resources" ? null : "resources")}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                  currentTab === "resources" || currentTab === "faq"
                    ? "text-nepal-crimson dark:text-nepal-crimson-light bg-nepal-crimson/5 dark:bg-nepal-crimson-light/10"
                    : "text-slate-600 dark:text-slate-300 hover:text-nepal-blue dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
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
                    className="absolute right-[-80px] mt-2 w-[480px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl p-4 grid grid-cols-2 gap-2 z-50 text-left"
                  >
                    {resourcesItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          item.action();
                          setActiveDropdown(null);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-800/50 group"
                      >
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-nepal-crimson dark:group-hover:text-nepal-crimson-light">
                          {item.label}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-normal font-medium">
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
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                currentTab === "about"
                  ? "text-nepal-crimson dark:text-nepal-crimson-light bg-nepal-crimson/5 dark:bg-nepal-crimson-light/10"
                  : "text-slate-600 dark:text-slate-300 hover:text-nepal-blue dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40"
              }`}
            >
              <HelpCircle className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
              <span>About</span>
            </button>

            {/* Dashboard */}
            <button
              onClick={() => handleNavClick("dashboard")}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                currentTab === "dashboard"
                  ? "text-nepal-crimson dark:text-nepal-crimson-light bg-nepal-crimson/5 dark:bg-nepal-crimson-light/10"
                  : "text-slate-600 dark:text-slate-300 hover:text-nepal-blue dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40"
              }`}
            >
              <User className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
              <span>Dashboard</span>
            </button>

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

            {/* Supabase Ready Authentication Button */}
            <button
              onClick={() => alert("Supabase Student Authentication Portal launching in upcoming roadmap release. Join waitlist on our home page or placeholder pages.")}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#102B5C] to-[#1D4A93] dark:from-nepal-crimson dark:to-[#F42E56] hover:opacity-95 text-white font-semibold text-sm rounded-xl shadow-md transition-all duration-300 cursor-pointer transform active:scale-95 shrink-0"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Login / Register</span>
            </button>

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

      {/* Mobile Drawer (AnimatePresence) */}
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
              
              {/* Home */}
              <button
                onClick={() => handleNavClick("home")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all ${
                  currentTab === "home"
                    ? "text-nepal-crimson dark:text-nepal-crimson-light bg-nepal-crimson/5 dark:bg-nepal-crimson-light/10"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/40"
                }`}
              >
                <Home className="h-5 w-5 shrink-0 text-slate-400" />
                <span>Home</span>
              </button>

              {/* Opportunities Accordion Toggle */}
              <div className="space-y-1">
                <button
                  onClick={() => setMobileOppOpen(!mobileOppOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/40"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-slate-400 shrink-0" />
                    <span>Opportunities</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileOppOpen ? "rotate-180" : ""}`} />
                </button>
                {mobileOppOpen && (
                  <div className="pl-6 space-y-4 border-l border-slate-150 dark:border-slate-800 ml-6 py-2">
                    {opportunitiesMegaGroups.map((group, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 font-mono pl-2">
                          {group.title}
                        </div>
                        <div className="grid grid-cols-1 gap-1">
                          {group.items.map((item, itemIdx) => (
                            <button
                              key={itemIdx}
                              onClick={() => {
                                item.action();
                                setIsOpen(false);
                              }}
                              className="w-full text-left py-1.5 px-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-nepal-crimson dark:text-slate-400 dark:hover:text-white"
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* My Eligibility */}
              <button
                onClick={() => handleNavClick("eligibility")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all ${
                  currentTab === "eligibility"
                    ? "text-nepal-crimson dark:text-nepal-crimson-light bg-nepal-crimson/5 dark:bg-nepal-crimson-light/10"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/40"
                }`}
              >
                <TrendingUp className="h-5 w-5 shrink-0 text-slate-400" />
                <span>My Eligibility</span>
              </button>

              {/* Organizations */}
              <button
                onClick={() => handleNavClick("organizations")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all ${
                  currentTab === "organizations"
                    ? "text-nepal-crimson dark:text-nepal-crimson-light bg-nepal-crimson/5 dark:bg-nepal-crimson-light/10"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/40"
                }`}
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
                        className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-slate-500 hover:text-nepal-crimson dark:text-slate-400 dark:hover:text-white"
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all ${
                  currentTab === "about"
                    ? "text-nepal-crimson dark:text-nepal-crimson-light bg-nepal-crimson/5 dark:bg-nepal-crimson-light/10"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/40"
                }`}
              >
                <HelpCircle className="h-5 w-5 shrink-0 text-slate-400" />
                <span>About</span>
              </button>

              {/* Dashboard */}
              <button
                onClick={() => handleNavClick("dashboard")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all ${
                  currentTab === "dashboard"
                    ? "text-nepal-crimson dark:text-nepal-crimson-light bg-nepal-crimson/5 dark:bg-nepal-crimson-light/10"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/40"
                }`}
              >
                <User className="h-5 w-5 shrink-0 text-slate-400" />
                <span>Dashboard</span>
              </button>

              {/* Login / Register Mobile */}
              <div className="pt-4 px-4">
                <button
                  onClick={() => alert("Supabase Student Authentication Portal launching in upcoming roadmap release. Join waitlist on our home page or placeholder pages.")}
                  className="w-full py-3 bg-gradient-to-r from-nepal-blue to-[#1D4A93] text-white rounded-xl font-bold shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="h-4.5 w-4.5" />
                  <span>Login / Register Portal</span>
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
