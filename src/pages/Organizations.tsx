import React, { useState } from "react";
import { 
  Building2, 
  Search, 
  MapPin, 
  Globe, 
  Mail, 
  Layers, 
  Award, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Building
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { notifySuccess } from "../lib/notifications";

interface Organization {
  id: string;
  name: string;
  acronym: string;
  type: "Government" | "University" | "Trust/Agency" | "Development Bank";
  country: string;
  headquarters: string;
  kathmanduOffice?: string;
  description: string;
  majorSchemes: string[];
  activeScholarshipsCount: number;
  contactEmail: string;
  website: string;
  notaryTips: string;
}

const ORGANIZATIONS: Organization[] = [
  {
    id: "org-daad",
    name: "German Academic Exchange Service",
    acronym: "DAAD",
    type: "Government",
    country: "Germany",
    headquarters: "Bonn, Germany",
    kathmanduOffice: "Goethe-Zentrum Kathmandu (GZK), Sanepa",
    description: "The world's largest funding organization for international students and researchers. DAAD supports outstanding research, post-graduate specialized courses (EPOS), and bilateral university partnerships.",
    majorSchemes: ["DAAD EPOS Postgraduate Scholarships", "Helmut-Schmidt Programme (Public Policy)", "Bilateral Exchange of Academics"],
    activeScholarshipsCount: 5,
    contactEmail: "info@daad-delhi.org",
    website: "https://www.daad.de",
    notaryTips: "Requires certified translations of Nepalese certificates into German or English, verified by the German Embassy in Kathmandu."
  },
  {
    id: "org-chevening",
    name: "Foreign, Commonwealth & Development Office",
    acronym: "FCDO",
    type: "Government",
    country: "United Kingdom",
    headquarters: "London, UK",
    kathmanduOffice: "British Embassy Kathmandu, Lainchaur",
    description: "The UK Government's international awards scheme. It funds outstanding future leaders from across the world to pursue one-year master's degrees in the United Kingdom, focusing on public policy and climate change.",
    majorSchemes: ["Chevening Scholarships", "Chevening Fellowships", "British Council Women in STEM"],
    activeScholarshipsCount: 3,
    contactEmail: "kathmandu.reception@fcdo.gov.uk",
    website: "https://www.chevening.org",
    notaryTips: "No translation needed if transcripts are already in English. Requires 2 years of work experience proof (at least 2,800 hours)."
  },
  {
    id: "org-fulbright",
    name: "United States Department of State",
    acronym: "USEFC",
    type: "Government",
    country: "United States",
    headquarters: "Washington D.C., USA",
    kathmanduOffice: "USEF-Nepal, Gyaneswor, Kathmandu",
    description: "Promoting mutual understanding through international educational exchange. In Nepal, Fulbright provides fully funded master's and PhD programs, researcher fellowships, and specialized teacher development grants.",
    majorSchemes: ["Fulbright Foreign Student Program", "Humphrey Fellowship", "Fulbright Visiting Scholar Program"],
    activeScholarshipsCount: 4,
    contactEmail: "fulbright@usefnepal.org",
    website: "https://usefnepal.org",
    notaryTips: "Requires certified copy validations done directly at the USEF-Nepal office in Gyaneswor, Kathmandu."
  },
  {
    id: "org-csc",
    name: "Commonwealth Scholarship Commission",
    acronym: "CSC",
    type: "Trust/Agency",
    country: "United Kingdom",
    headquarters: "London, UK",
    kathmanduOffice: "Ministry of Education (MOEST), Keshar Mahal",
    description: "Fostering sustainable development by offering scholarships and fellowships for citizens of developing Commonwealth countries, focusing on engineering, science, and governance.",
    majorSchemes: ["Commonwealth Shared Scholarships", "Commonwealth General Scholarships", "Commonwealth PhD Fellowships"],
    activeScholarshipsCount: 4,
    contactEmail: "info@cscuk.org.uk",
    website: "https://cscuk.fcdo.gov.uk",
    notaryTips: "Requires local agency nominations in Kathmandu via the Ministry of Education, Science and Technology."
  },
  {
    id: "org-mext",
    name: "Ministry of Education, Culture, Sports, Science and Technology",
    acronym: "MEXT",
    type: "Government",
    country: "Japan",
    headquarters: "Tokyo, Japan",
    kathmanduOffice: "Embassy of Japan, Panipokhari, Kathmandu",
    description: "The Government of Japan's flagship program supporting undergraduate, research, and specialized vocational study. It covers full tuition, roundtrip airfare, and a generous monthly stipend.",
    majorSchemes: ["MEXT Research Scholarships", "MEXT Undergraduate Scholarships", "MEXT College of Technology awards"],
    activeScholarshipsCount: 3,
    contactEmail: "education@kt.mofa.go.jp",
    website: "https://www.mext.go.jp",
    notaryTips: "Requires passing a strict paper-and-pen written exam in Japanese/English at the Japanese Embassy in Panipokhari."
  },
  {
    id: "org-adb",
    name: "Asian Development Bank",
    acronym: "ADB",
    type: "Development Bank",
    country: "Japan / Regional",
    headquarters: "Manila, Philippines",
    kathmanduOffice: "ADB Nepal Resident Mission, Metro Park, Lazimpat",
    description: "Financing sustainable socio-economic development across Asia and the Pacific. The ADB-Japan Scholarship Program provides full funding for economics, science, and public policy master's degrees.",
    majorSchemes: ["ADB-Japan Scholarship Program (ADB-JSP)", "ADB Research Internships"],
    activeScholarshipsCount: 2,
    contactEmail: "adbjsp@adb.org",
    website: "https://www.adb.org",
    notaryTips: "Requires submitting income verification certified copies and returning back to Nepal to serve the nation after graduation."
  },
  {
    id: "org-worldbank",
    name: "World Bank Group",
    acronym: "WBG",
    type: "Development Bank",
    country: "United States / Regional",
    headquarters: "Washington D.C., USA",
    kathmanduOffice: "World Bank Nepal Mission, Yak & Yeti Complex, Durbar Marg",
    description: "Providing financial and technical assistance to developing countries. WBG offers mid-career professional master's sponsorships, Robert McNamara PhD fellowships, and climate policy grants.",
    majorSchemes: ["Joint Japan/World Bank Graduate Scholarships", "Robert S. McNamara Fellowship"],
    activeScholarshipsCount: 2,
    contactEmail: "scholarships@worldbank.org",
    website: "https://www.worldbank.org",
    notaryTips: "Requires 3+ years of development-related professional experience inside Nepal or other developing economies."
  },
  {
    id: "org-erasmus",
    name: "European Commission",
    acronym: "Erasmus+",
    type: "Trust/Agency",
    country: "European Union",
    headquarters: "Brussels, Belgium",
    kathmanduOffice: "Delegation of the EU to Nepal, Uttar Dhoka, Lazimpat",
    description: "The European Union's joint-master degree programs, which allow outstanding students to study in at least 2 or 3 different EU countries, with fully-funded premium travel grants.",
    majorSchemes: ["Erasmus Mundus Joint Master Degrees (EMJM)", "Erasmus+ Credit Mobility Schemes"],
    activeScholarshipsCount: 4,
    contactEmail: "delegation-nepal@eeas.europa.eu",
    website: "https://erasmus-plus.ec.europa.eu",
    notaryTips: "Each partner university has custom notary requirements. Keep your university degrees notarized in English by the Tribhuvan Exam controller."
  }
];

export default function Organizations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"All" | "Government" | "Trust/Agency" | "Development Bank">("All");

  const filteredOrgs = ORGANIZATIONS.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          org.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          org.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          org.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === "All" || org.type === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Copies the support email to the clipboard so there's always visible
  // confirmation, even if the visitor's browser/OS has no default mail
  // client configured (in which case a mailto: link alone produces no
  // visible feedback at all). The mailto: href is left intact below so
  // it still opens a mail client for anyone who has one.
  const handleRequestSupportClick = () => {
    navigator.clipboard.writeText("kiplanscholar@gmail.com").then(() => {
      notifySuccess("Email copied: kiplanscholar@gmail.com");
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-nepal-blue/10 text-nepal-blue dark:text-sky-400 rounded-full text-xs font-bold uppercase tracking-wider font-mono mb-4">
          <Building2 className="h-3.5 w-3.5" /> Global Partner Registry
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Sponsoring Organizations & Foundations
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-base leading-relaxed">
          Discover the elite international agencies, government ministries, and development banks that provide fully funded opportunities for Nepalese scholars. Explore local office locations in Kathmandu, guidelines, and notarization tips.
        </p>
      </div>

      {/* Control Bar: Search and Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-4 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
        
        {/* Search input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by organization, country or acronym..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white text-sm focus:outline-none focus:border-nepal-crimson transition-all"
          />
        </div>

        {/* Filters Tabs */}
        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 font-sans">
          {(["All", "Government", "Trust/Agency", "Development Bank"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all shrink-0 cursor-pointer ${
                activeFilter === filter
                  ? "bg-gradient-to-r from-nepal-blue to-[#1D4A93] text-white shadow-md"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

      </div>

      {/* Organizations Grid */}
      {filteredOrgs.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm max-w-xl mx-auto">
          <ShieldAlert className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">No Organizations Found</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">We couldn't find matching agencies. Try clearing or expanding your query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredOrgs.map((org, index) => (
              <motion.div
                key={org.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Upper block */}
                <div className="space-y-4 text-left">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 shrink-0">
                        <Building className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-sm text-nepal-blue dark:text-sky-400">{org.acronym}</span>
                          <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full font-mono">{org.type}</span>
                        </div>
                        <h3 className="text-base font-black text-slate-800 dark:text-white mt-1">{org.name}</h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/5 border border-emerald-500/15 px-3 py-1 rounded-full font-mono shrink-0">
                        {org.activeScholarshipsCount} Active Programs
                      </span>
                    </div>
                  </div>

                  {/* Core description */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {org.description}
                  </p>

                  {/* Funding Scheme bullet items */}
                  <div className="space-y-2 pt-2 border-t border-slate-50 dark:border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold font-mono">Major Sponsorship Channels</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {org.majorSchemes.map((scheme, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium leading-tight">
                          <Award className="h-3.5 w-3.5 text-nepal-crimson shrink-0" />
                          <span className="line-clamp-1">{scheme}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Address block */}
                  <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/40 text-xs text-slate-600 dark:text-slate-400 space-y-2">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-700 dark:text-slate-300">Kathmandu Presence: </strong>
                        <span>{org.kathmanduOffice || "No local office (apply online/regional desk)"}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Globe className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-700 dark:text-slate-300">Headquarters: </strong>
                        <span>{org.headquarters}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notary checklist guidelines */}
                  <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl flex items-start gap-2 text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                    <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <p>{org.notaryTips}</p>
                  </div>
                </div>

                {/* Footer action links */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-50 dark:border-slate-800/80 mt-4">
                  <span className="text-[10px] font-bold text-slate-400 font-mono">Mail: {org.contactEmail}</span>
                  <a
                    href={org.website}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-nepal-crimson hover:text-nepal-blue transition-colors"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}