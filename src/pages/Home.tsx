import React, { useEffect, useState } from "react";
import { Search, Award, Heart, Users, ArrowRight, ChevronRight, CheckCircle2, Star, Sparkles, BookOpen, ShieldCheck, HelpCircle } from "lucide-react";
import { motion } from "motion/react";
import { FAQS, TESTIMONIALS } from "../data/scholarships";
import EligibilityChecker from "../components/EligibilityChecker";
import ScholarshipCard from "../components/ScholarshipCard";
import { notifySuccess, notifyError, notifyInfo } from "../lib/notifications";
import { getFeaturedScholarships, getScholarships, Scholarship } from "../lib/scholarships";

interface HomeProps {
  setCurrentTab: (tab: string) => void;
  onSelectScholarship: (id: string) => void;
}

export default function Home({ setCurrentTab, onSelectScholarship }: HomeProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  // Manage saved scholarships with persistence
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("saved_scholarships");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleSaveToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedIds(prev => {
      const isSaving = !prev.includes(id);
      const next = isSaving ? [...prev, id] : prev.filter(item => item !== id);
      localStorage.setItem("saved_scholarships", JSON.stringify(next));
      if (isSaving) {
        notifySuccess("Scholarship saved!");
      } else {
        notifyInfo("Scholarship removed.");
      }
      return next;
    });
  };

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadFeaturedScholarships() {
      setLoading(true);
      const { data, error } = await getFeaturedScholarships();

      if (!isMounted) return;

      if (error) {
        notifyError(error);
      } else {
        setScholarships(data ?? []);
      }
      setLoading(false);
    }

    loadFeaturedScholarships();

    return () => {
      isMounted = false;
    };
  }, []);

  // Separate fetch of ALL active scholarships (not just featured), used
  // only to compute live statistics below. Kept independent from the
  // featured-scholarships fetch above so that existing, working code is
  // not touched by this change.
  const [allScholarships, setAllScholarships] = useState<Scholarship[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadAllScholarships() {
      const { data, error } = await getScholarships();

      if (!isMounted) return;

      if (error) {
        notifyError(error);
      } else {
        setAllScholarships(data ?? []);
      }
    }

    loadAllScholarships();

    return () => {
      isMounted = false;
    };
  }, []);

  // Live statistics, derived from the real scholarships table.
  //
  // Only 2 of the original 4 stat cards can be honestly backed by the
  // locked schema — "Total Scholarships Matched" (a monetary sum) and
  // "Nepali Recipients Active" (an applicant count) have no
  // corresponding column or table anywhere in the schema. Those two
  // remain as their previous static values below rather than being
  // silently faked as "live." See project report for the decision this
  // needs from the Production Owner.
  const uniqueCountriesCount = new Set(allScholarships.map((s) => s.country)).size;
  const partnerOrganizationsCount = new Set(allScholarships.map((s) => s.organization)).size;
  const fullyFundedCount = allScholarships.filter((s) =>
    s.funding_type?.toLowerCase().includes("fully")
  ).length;

  const stats = [
    { value: `${allScholarships.length}+`, label: "Total Scholarships Listed", color: "from-blue-600 to-indigo-600" },
    { value: `${uniqueCountriesCount}+`, label: "Host Countries Included", color: "from-amber-500 to-yellow-600" },
    { value: `${partnerOrganizationsCount}+`, label: "Partner Organizations", color: "from-nepal-crimson to-rose-600" },
    { value: `${fullyFundedCount}+`, label: "Fully Funded Opportunities", color: "from-emerald-500 to-teal-600" }
  ];

  const categoriesList = [
    { id: "women", name: "Women in STEM", count: 8, desc: "Exclusive fellowships, mentorships & child-care grants.", icon: Heart, color: "text-rose-500 bg-rose-500/10" },
    { id: "entrepreneurs", name: "Entrepreneurs", count: 4, desc: "Equity-free seed grants, residencies & incubator hubs.", icon: Users, color: "text-amber-500 bg-amber-500/10" },
    { id: "scholarships", name: "Graduate Research", count: 12, desc: "Master's & PhD funding for future scientists & academics.", icon: Award, color: "text-blue-500 bg-blue-500/10" },
    { id: "resources", name: "IELTS/SOP Prep", count: 3, desc: "Step-by-step master checklists & letter of recommendation builders.", icon: BookOpen, color: "text-emerald-500 bg-emerald-500/10" }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Pass the search term to Scholarships tab
      setCurrentTab("scholarships");
    }
  };

  const toggleFaq = (id: string) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  return (
    <div className="space-y-20 pb-20">

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pb-28">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-nepal-crimson/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-nepal-blue/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Culture Badge */}
              <div className="animate-pulse inline-flex items-center gap-1.5 px-3 py-1.5 bg-nepal-crimson/10 text-nepal-crimson dark:text-nepal-crimson-light rounded-full text-[14px] font-extrabold tracking-wider uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                AI-Powered Scholarship Discovery Platform
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-nepal-blue dark:text-white">
                Discover Opportunities
                <br />
                <span className="bg-gradient-to-r from-nepal-blue via-nepal-crimson to-nepal-gold bg-clip-text text-transparent">
                  Shape Your Future
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Explore AI-curated scholarships, fellowships, grants, internships, exchange programs, and research opportunities from leading universities and organizations worldwide—all in one trusted platform.
              </p>

              {/* Dynamic Search Bar + Scholar Assistant CTA */}
              <div className="flex flex-col sm:flex-row items-stretch gap-3 max-w-2xl mx-auto lg:mx-0">
                <form onSubmit={handleSearchSubmit} className="flex-1">
                  <div className="relative flex items-center p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(30,58,138,0.15)] focus-within:border-nepal-crimson focus-within:ring-4 focus-within:ring-nepal-crimson/10">
                    <div className="pl-3.5">
                      <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search e.g. Chevening, UK, Women STEM..."
                      className="w-full pl-3 pr-4 py-4 bg-transparent text-base font-medium focus:outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                    />
                    <button
                      type="submit"
                      className="px-8 py-4 bg-gradient-to-r from-nepal-blue to-nepal-blue-light text-white font-bold rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer whitespace-nowrap"
                    >
                      Explore Opportunities
                    </button>
                  </div>
                </form>

                <button
                  type="button"
                  onClick={() => setCurrentTab("ai-assistant")}
                  className="px-8 py-4 bg-gradient-to-r from-nepal-blue to-nepal-blue-light text-white font-bold rounded-2xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer whitespace-nowrap"
                >
                  Ask Scholar Assistant
                </button>
              </div>

              {/* Quick trust proofs */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-500 pt-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  No Mock Data - 100% Authentic Grants
                </span>

                <span className="hidden sm:inline">•</span>

                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-nepal-gold" />
                  Personalized Filter Matching
                </span>
              </div>

              {/* Global Opportunities */}
              <div className="pt-6">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">
                  Explore opportunities in{" "}
                  <span className="text-nepal-crimson font-bold">30+ countries</span>
                </p>

                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 text-3xl">
                  <span className="hover:scale-125 transition-transform duration-300">🇬🇧</span>
                  <span className="hover:scale-125 transition-transform duration-300">🇺🇸</span>
                  <span className="hover:scale-125 transition-transform duration-300">🇨🇦</span>
                  <span className="hover:scale-125 transition-transform duration-300">🇦🇺</span>
                  <span className="hover:scale-125 transition-transform duration-300">🇩🇪</span>
                  <span className="hover:scale-125 transition-transform duration-300">🇯🇵</span>
                  <span className="hover:scale-125 transition-transform duration-300">🇰🇷</span>
                  <span className="hover:scale-125 transition-transform duration-300">🇫🇷</span>
                  <span className="hover:scale-125 transition-transform duration-300">🇳🇱</span>
                  <span className="hover:scale-125 transition-transform duration-300">🇸🇪</span>
                </div>
              </div>
            </div>

            {/* Right Column Graphic / Highlight Widget */}
            <div className="lg:col-span-5 relative">
              <div className="relative bg-slate-900/5 dark:bg-white/5 p-4 rounded-3xl border border-slate-200/40 dark:border-slate-800/40">

                <img
                  src="/assets/images/global_sucess.png"
                  alt="Nepali Scholar celebrating success"
                  className="w-full h-[500px] object-cover rounded-2xl shadow-xl"
                />

                {/* Floating Overlay Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xl flex items-center gap-3 animate-bounce">
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
                    <Star className="h-5 w-5 fill-emerald-500" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-slate-800 dark:text-white">Verified Opportunities</h5>
                    <p className="text-[11px] text-slate-400 font-medium">Scholarships • Grants • Fellowships</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Real-Time Success Statistics */}
      <section className="bg-slate-50 dark:bg-slate-900/40 py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white dark:bg-nepal-dark rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 text-center shadow-sm">
                <span className="block text-2xl sm:text-3xl font-black text-nepal-blue dark:text-white">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1 block">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Browse By Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-black text-nepal-blue dark:text-white tracking-tight">
            Tailored Pathways For Every Aspirant
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm">
            We categorize grants and fellowships specifically to meet the distinct aspirations of our Nepali academic community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoriesList.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div
                key={i}
                onClick={() => setCurrentTab(cat.id)}
                className="group relative bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 hover:border-nepal-crimson dark:hover:border-nepal-crimson-light rounded-2xl p-6 shadow-premium hover:shadow-premium-hover transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`p-3 rounded-xl inline-block ${cat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 dark:text-white group-hover:text-nepal-crimson dark:group-hover:text-nepal-crimson-light transition-all text-base">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-nepal-blue dark:text-sky-400 mt-6 group-hover:translate-x-1.5 transition-all">
                  <span>Explore Database</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Interactive Matching (Split Screen) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Left instructions block */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-nepal-crimson dark:text-nepal-crimson-light font-mono">
              Find Your Fit
            </span>
            <h2 className="text-3xl font-extrabold text-nepal-blue dark:text-white tracking-tight leading-tight">
              Let Our Quiz Match Your Eligibility
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Navigating hundreds of criteria from global trusts is exhausting. Fill out our simple, quick profile matcher. It automatically evaluates host universities, visa guidelines, and scholarship requirements.
            </p>
            <div className="space-y-3 pt-2 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>Filters by exact GPA & study requirements</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>Includes specialized women & STEM pathways</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>Generates customized advice instantly</span>
              </div>
            </div>
          </div>

          {/* Right Quiz block */}
          <div className="lg:col-span-7">
            <EligibilityChecker onSelectScholarship={onSelectScholarship} />
          </div>

        </div>
      </section>

      {/* 5. Featured Scholarships Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-nepal-blue dark:text-sky-400 font-mono">
              Highly Competitive
            </span>
            <h2 className="text-3xl font-black text-nepal-blue dark:text-white mt-1">
              Featured Global Fellowships
            </h2>
          </div>
          <button
            onClick={() => setCurrentTab("scholarships")}
            className="flex items-center gap-1 text-sm font-bold text-nepal-crimson dark:text-nepal-crimson-light hover:underline cursor-pointer"
          >
            Explore all 10+ databases <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeleton — same grid, same card footprint, no layout shift once data arrives
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 h-64 space-y-4"
              >
                <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded mt-auto" />
              </div>
            ))
          ) : scholarships.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400 text-sm font-medium">
              No featured scholarships available.
            </div>
          ) : (
            scholarships.map((sch) => (
              <ScholarshipCard
                key={sch.id}
                scholarship={sch}
                isSaved={savedIds.includes(sch.id)}
                onSaveToggle={(e) => handleSaveToggle(sch.id, e)}
                onExplore={() => onSelectScholarship(sch.id)}
              />
            ))
          )}
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="bg-slate-50 dark:bg-slate-900/40 py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl font-black text-nepal-blue dark:text-white">
              Sourced From Successful Alumni
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm">
              Read how fellow Nepali students secured fully funded scholarships in the UK, USA, and Europe with KIPLANScholar guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((test) => (
              <div key={test.id} className="bg-white dark:bg-nepal-dark rounded-2xl p-6 border border-slate-200/40 dark:border-slate-800/40 shadow-sm space-y-4">
                <div className="flex items-center gap-1 text-nepal-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "{test.text}"
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="h-11 w-11 rounded-full object-cover border-2 border-nepal-crimson"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">
                      {test.name}
                    </h4>
                    <p className="text-[11px] text-nepal-crimson dark:text-nepal-crimson-light font-bold">
                      {test.role}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {test.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQs Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl font-black text-nepal-blue dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Everything you need to know about NOCs, Blocked Accounts, and the MOEST attestation queue.
          </p>
        </div>

        <div className="space-y-3.5">
          {FAQS.map((faq) => {
            const isOpen = activeFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex justify-between items-center p-5 text-left text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                >
                  <span>{faq.question}</span>
                  <HelpCircle className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-nepal-crimson" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-50 dark:border-slate-800/60 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. Call To Action Footer Panel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-nepal-blue to-nepal-blue-light text-white p-8 sm:p-12 text-center shadow-xl">
          {/* Subtle gold decoration */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-nepal-gold/10 rounded-full blur-2xl" />

          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Ready to Secure Your Scholarship?
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              Don't wait for deadlines to creep in. Access our 100% free document checklists, view verified country requirements, and prepare your application the premium way.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={() => setCurrentTab("scholarships")}
                className="px-6 py-3 bg-nepal-crimson hover:bg-nepal-crimson-light text-white font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer"
              >
                Search Scholarships
              </button>
              <button
                onClick={() => setCurrentTab("resources")}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition-all border border-white/20 cursor-pointer"
              >
                Download Templates
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}