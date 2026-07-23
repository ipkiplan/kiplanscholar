import React from "react";
import { 
  Compass, Award, ArrowDown 
} from "lucide-react";
import { motion } from "motion/react";

interface AboutProps {
  setCurrentTab?: (tab: string) => void;
}

export default function About({ setCurrentTab }: AboutProps) {
  const handleScrollToJourney = () => {
    const section = document.getElementById("my-journey-section");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavClick = (tab: string) => {
    if (setCurrentTab) {
      setCurrentTab(tab);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Timeline items
  const timelineItems = [
    { year: "Pre-2008", title: "Nepal", desc: "Laying the foundation of academic and legal ambition in Kathmandu, Nepal..." },
    { year: "2008", title: "Applied for international scholarship", desc: "Personally navigated the complex, scattered application directories..." },
    { year: "2008-2009", title: "Awarded Endeavour Award Australia", desc: "Selected for the prestigious Endeavour Award..." },
    { year: "2009", title: "Studied at the University of Canberra", desc: "Completed advanced legal and professional studies..." },
    { year: "2010", title: "Returned to Nepal", desc: "Repatriated to Nepal with a vision..." },
    { year: "2010-Present", title: "Professional legal career", desc: "Advocated for education, corporate transparency..." },
    { year: "2018", title: "Founded KIPLAN Law & Notary", desc: "Established a trusted legal and notary office..." },
    { year: "2024", title: "Created KIPLANScholar", desc: "Synthesized educational passion and legal integrity..." }
  ];

  return (
    <div className="bg-slate-50 dark:bg-[#071126] transition-colors duration-300">

      {/* HERO - Keep your original hero section here if you want */}

      {/* SECTION 2 — MEET THE FOUNDER */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5 relative group">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-950 p-3">
              <img
                src="/assets/images/Founder-2008.jpg"
                alt="Adv. Kamal Khadka"
                className="rounded-2xl object-cover w-full aspect-[4/4.5] transition-all duration-700 hover:scale-105"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-nepal-crimson dark:text-nepal-crimson-light font-mono">LEADERSHIP & VISION</p>
              <h2 className="text-4xl font-black text-slate-950 dark:text-white tracking-tight">Meet the Founder</h2>
              <p className="text-2xl font-semibold text-nepal-blue">Adv. Kamal Khadka</p>
            </div>

            <div className="text-slate-600 dark:text-slate-300 text-[15px] leading-relaxed space-y-4">
              <p>Adv. Kamal Khadka is a distinguished legal practitioner and advocate in Kathmandu, Nepal, whose life was profoundly transformed by international education.</p>
              <p>As a recipient of the prestigious Endeavour Award (2008–2009), he pursued postgraduate studies at the University of Canberra.</p>
              <p>Upon returning to Nepal, he founded KIPLANScholar to empower Nepali students with verified global opportunities.</p>
            </div>

            <button
              onClick={handleScrollToJourney}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-nepal-blue to-[#1a4080] hover:opacity-95 text-white font-bold text-sm rounded-xl shadow-lg transition-all duration-300"
            >
              <span>My Journey</span>
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3 — MY JOURNEY (Bigger Photo) */}
      <section id="my-journey-section" className="py-20 bg-white dark:bg-slate-950 border-y border-slate-200/50 dark:border-slate-800/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-nepal-crimson">FROM KATHMANDU TO CANBERRA AND BACK</span>
            <h2 className="text-4xl font-black">My Journey</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            {/* Bigger Endeavour Award Photo */}
            <div className="md:col-span-5">
              <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-xl">
                <img
                  src="/assets/images/endeavour_award.jpg"
                  alt="Endeavour Award"
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="md:col-span-7 space-y-10 relative pl-8 border-l-2 border-nepal-crimson/30">
              {timelineItems.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[33px] top-1 w-5 h-5 bg-white border-4 border-nepal-crimson rounded-full" />
                  <div>
                    <span className="text-xs font-bold text-nepal-crimson">{item.year}</span>
                    <h3 className="font-bold text-lg mt-1">{item.title}</h3>
                    <p className="text-slate-600 mt-2">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTIONS 4 TO 7 — Keep as they are */}

      {/* SECTION 8 — FAMILY INSPIRATION (Bigger Photo) */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-nepal-crimson">THE CORE DRIVE</span>
            <h2 className="text-4xl font-black">The Inspiration Behind the Mission</h2>
            
            <div className="text-slate-600 leading-relaxed space-y-4 text-[15px]">
              <p>The foundations of KIPLANScholar are rooted in the timeless values of <strong>academic perseverance, integrity, and profound family support</strong>.</p>
              <p>Just as families support their sons and daughters through the grueling stages of competitive national examinations...</p>
              <p>By building KIPLANScholar as a free public service, we carry forward this spirit of selfless mentorship...</p>
            </div>
          </div>

          {/* Bigger Family Photo */}
          <div className="md:col-span-5">
            <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-2xl">
              <img
                src="/assets/images/family.jpg"
                alt="Family Inspiration"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9 — CALL TO ACTION (Keep your original) */}

    </div>
  );
}