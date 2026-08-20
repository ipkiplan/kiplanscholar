import React from "react";
import { 
  Map, 
  MapPin, 
  Navigation, 
  GraduationCap, 
  Globe, 
  User, 
  Briefcase, 
  BookOpen, 
  Info, 
  Mail, 
  Phone, 
  Lock, 
  FileText, 
  Search, 
  FileCheck, 
  Clock, 
  HelpCircle, 
  MessageSquare, 
  ShieldCheck, 
  ExternalLink 
} from "lucide-react";
import { motion } from "motion/react";

interface SitemapProps {
  setCurrentTab: (tab: string) => void;
}

export default function Sitemap({ setCurrentTab }: SitemapProps) {
  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const mainPages = [
    { name: "Home", tab: "home", icon: Navigation, desc: "Explore featured scholarships, eligibility quick checker, and success metrics." },
    { name: "Scholarships", tab: "scholarships", icon: GraduationCap, desc: "Search and filter fully-funded global scholarships by country, level, and category." },
    { name: "Countries", tab: "countries", icon: Globe, desc: "Discover tailored educational opportunities and scholarship lists by destination." },
    { name: "Women Applicants", tab: "women", icon: User, desc: "Exclusively compiled fellowships and leadership programs for female scholars from Nepal." },
    { name: "Entrepreneurs", tab: "entrepreneurs", icon: Briefcase, desc: "Incubators, business grants, and research funding for startup founders and creators." },
    { name: "Resources", tab: "resources", icon: BookOpen, desc: "Comprehensive step-by-step application guides, SOP/LOR templates, and helpful articles." },
    { name: "About", tab: "about", icon: Info, desc: "Our core values, founding vision, and strategic goals." },
    { name: "Contact", tab: "contact", icon: Mail, desc: "Get in touch with KIPLANScholar's educational consultants in Kathmandu." },
  ];

  const scholarshipResources = [
    { name: "Scholarship Search", tab: "scholarships", icon: Search, desc: "Advanced dynamic search engine for educational opportunities." },
    { name: "Country Guides", tab: "countries", icon: Globe, desc: "In-depth study-abroad pathways and cost-of-living insights." },
    { name: "SOP Guide", tab: "resources", icon: FileText, desc: "Master template for crafting winning Statement of Purpose essays." },
    { name: "LOR Guide", tab: "resources", icon: FileCheck, desc: "Step-by-step tips for requesting impactful Letters of Recommendation." },
    { name: "Scholarship Deadlines", tab: "scholarships", icon: Clock, desc: "Chronological lists of impending grant applications." },
    { name: "FAQs", tab: "resources", icon: HelpCircle, desc: "Frequently Asked Questions regarding international admissions." },
    { name: "Blog", tab: "resources", icon: MessageSquare, desc: "Insights, articles, and advice written by experienced global alumni." },
  ];

  const legalPages = [
    { name: "Privacy Policy", tab: "privacy", icon: ShieldCheck },
    { name: "Terms of Use", tab: "terms", icon: FileText },
    { name: "Sitemap", tab: "sitemap", icon: Map }
  ];

  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
        
        {/* Decorative Badge */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D7263D] dark:text-[#F42E56] font-mono bg-[#D7263D]/5 dark:bg-[#F42E56]/10 px-3.5 py-1.5 rounded-full">
            <Map className="h-3.5 w-3.5" />
            Website Index
          </span>
        </div>

        {/* Page Header */}
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#102B5C] dark:text-white tracking-tight">
            Sitemap
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed font-medium">
            Everything available on KIPLANScholar in one place.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-[#D7263D] to-[#102B5C] mx-auto rounded-full" />
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          
          {/* Main Pages Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-[#071126] border border-slate-100 dark:border-slate-800/60 rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(16,43,92,0.03)] space-y-5"
          >
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-4">
              <div className="p-2.5 rounded-xl bg-[#102B5C]/5 text-[#102B5C] dark:bg-sky-500/10 dark:text-sky-300">
                <Navigation className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-[#102B5C] dark:text-white tracking-tight">Main Pages</h2>
            </div>
            
            <div className="space-y-3">
              {mainPages.map((page) => {
                const Icon = page.icon;
                return (
                  <button
                    key={page.name}
                    onClick={() => handleNavigate(page.tab)}
                    className="w-full text-left p-3 rounded-xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 group transition-all duration-200 cursor-pointer flex items-start gap-3.5"
                  >
                    <Icon className="h-4.5 w-4.5 text-slate-400 group-hover:text-[#D7263D] mt-0.5 shrink-0 transition-colors" />
                    <div>
                      <div className="font-semibold text-sm text-[#102B5C] dark:text-slate-200 group-hover:text-[#D7263D] transition-colors flex items-center gap-1.5">
                        {page.name}
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{page.desc}</p>
                    </div>
                  </button>
                );
              })}

              {/* Login & Register simulations as buttons to demonstrate interactive flow */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button 
                  onClick={() => alert("Welcome to KIPLANScholar. The unified Secure Login and Registration flow is available on the Navbar.")}
                  className="p-2.5 bg-[#102B5C]/5 dark:bg-slate-800 text-center rounded-xl text-xs font-semibold text-[#102B5C] dark:text-slate-300 hover:bg-[#102B5C] hover:text-white transition-all cursor-pointer border border-transparent"
                >
                  Log In
                </button>
                <button 
                  onClick={() => alert("Join KIPLANScholar. Create a free account directly from the top navigation bar registration portal.")}
                  className="p-2.5 bg-[#D7263D]/5 text-center rounded-xl text-xs font-semibold text-[#D7263D] hover:bg-[#D7263D] hover:text-white transition-all cursor-pointer border border-transparent"
                >
                  Register
                </button>
              </div>
            </div>
          </motion.div>

          {/* Scholarship Resources & Guides */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white dark:bg-[#071126] border border-slate-100 dark:border-slate-800/60 rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(16,43,92,0.03)] space-y-5"
          >
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-4">
              <div className="p-2.5 rounded-xl bg-[#D7263D]/5 text-[#D7263D] dark:bg-[#F42E56]/10 dark:text-[#F42E56]">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-[#102B5C] dark:text-white tracking-tight">Scholarship Resources</h2>
            </div>
            
            <div className="space-y-3">
              {scholarshipResources.map((page) => {
                const Icon = page.icon;
                return (
                  <button
                    key={page.name}
                    onClick={() => handleNavigate(page.tab)}
                    className="w-full text-left p-3 rounded-xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 group transition-all duration-200 cursor-pointer flex items-start gap-3.5"
                  >
                    <Icon className="h-4.5 w-4.5 text-slate-400 group-hover:text-[#D7263D] mt-0.5 shrink-0 transition-colors" />
                    <div>
                      <div className="font-semibold text-sm text-[#102B5C] dark:text-slate-200 group-hover:text-[#D7263D] transition-colors flex items-center gap-1.5">
                        {page.name}
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{page.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>

        </div>

        {/* Address and Legal Sections in beautiful bento structure */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          
          {/* Office Information */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white dark:bg-[#071126] border border-slate-100 dark:border-slate-800/60 rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(16,43,92,0.03)] space-y-4 md:col-span-1"
          >
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/40 pb-3">
              <MapPin className="h-4.5 w-4.5 text-[#D7263D]" />
              <h3 className="font-bold text-sm text-[#102B5C] dark:text-white uppercase tracking-wider">Office</h3>
            </div>
            <div className="space-y-1.5 text-slate-600 dark:text-slate-300 text-sm font-medium leading-relaxed">
              <p>Civil Trade Centre (CTC) Mall</p>
              <p>Sundhara</p>
              <p>Kathmandu 44600</p>
              <p>Nepal</p>
            </div>
          </motion.div>

          {/* Legal Pages Index */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="bg-white dark:bg-[#071126] border border-slate-100 dark:border-slate-800/60 rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(16,43,92,0.03)] space-y-4 md:col-span-1"
          >
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/40 pb-3">
              <Lock className="h-4.5 w-4.5 text-[#102B5C] dark:text-sky-300" />
              <h3 className="font-bold text-sm text-[#102B5C] dark:text-white uppercase tracking-wider">Legal Pages</h3>
            </div>
            <div className="flex flex-col gap-2.5">
              {legalPages.map((page) => {
                const Icon = page.icon;
                return (
                  <button
                    key={page.name}
                    onClick={() => handleNavigate(page.tab)}
                    className="flex items-center gap-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#D7263D] transition-colors text-left cursor-pointer group"
                  >
                    <Icon className="h-4 w-4 text-slate-400 group-hover:text-[#D7263D] transition-colors" />
                    <span>{page.name}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Contact Details */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white dark:bg-[#071126] border border-slate-100 dark:border-slate-800/60 rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(16,43,92,0.03)] space-y-4 md:col-span-1"
          >
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/40 pb-3">
              <Mail className="h-4.5 w-4.5 text-[#D7263D]" />
              <h3 className="font-bold text-sm text-[#102B5C] dark:text-white uppercase tracking-wider">Contact</h3>
            </div>
            <div className="space-y-3.5 text-slate-600 dark:text-slate-300 text-sm">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="h-3 w-3 text-[#D7263D]" /> Phone:
                </p>
                <div className="font-semibold text-slate-700 dark:text-slate-200">
                  <a href="tel:+97715312040" className="hover:text-[#D7263D] transition-colors">+977 1 5312040</a>
                  <span className="block"><a href="tel:+9779849530970" className="hover:text-[#D7263D] transition-colors">+977 9849530970</a></span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-[#102B5C]" /> Email:
                </p>
                <p className="font-semibold text-slate-700 dark:text-slate-200">
                  <a href="mailto:kiplanscholar@gmail.com" className="hover:text-[#D7263D] transition-colors">kiplanscholar@gmail.com</a>
                </p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Elegant Footer Notice matching homepage style */}
        <div className="border-t border-slate-100 dark:border-slate-800/40 pt-8 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            © 2026 KIPLANScholar.
          </p>
        </div>

      </div>
    </div>
  );
}