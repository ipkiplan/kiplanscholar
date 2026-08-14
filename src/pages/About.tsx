import React, { useState } from "react";
import { ArrowDown, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "motion/react";
import { FOUNDER_CHAPTERS, type ChapterImage } from "../data/founderChapters";

interface AboutProps {
  setCurrentTab?: (tab: string) => void;
}

function ChapterCard({
  number,
  title,
  preview,
  fullText,
  images,
  imageSide = "left",
  index,
}: {
  number: number;
  title: string;
  preview: string;
  fullText: string[];
  images?: ChapterImage[];
  imageSide?: "left" | "right";
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasImages = images && images.length > 0;
  const [primaryImage, ...supportingImages] = images ?? [];

  // Text column, shared between the image-and-text and text-only layouts.
  const textColumn = (
    <div className={hasImages ? "flex flex-col h-full" : ""}>
      <div className="flex items-start gap-4">
        <span className="shrink-0 mt-1 flex items-center justify-center w-9 h-9 rounded-full bg-nepal-crimson/10 dark:bg-nepal-crimson-light/10 text-nepal-crimson dark:text-nepal-crimson-light font-black text-sm font-mono">
          {number}
        </span>
        <div className="min-w-0">
          <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight">
            {title}
          </h3>
        </div>
      </div>

      <div className="mt-5 text-slate-600 dark:text-slate-300 text-[15px] leading-relaxed space-y-4">
        <p>{preview}</p>

        {expanded && (
          <div className="space-y-4 pt-1 border-t border-slate-100 dark:border-slate-800/60 mt-2">
            {fullText.map((paragraph, i) => (
              <p key={i} className="pt-3 first:pt-4">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-nepal-blue dark:text-sky-400 hover:text-nepal-crimson dark:hover:text-nepal-crimson-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-nepal-blue/50 rounded-md px-1 -mx-1"
      >
        {expanded ? (
          <>
            Show less <ChevronUp className="h-4 w-4" />
          </>
        ) : (
          <>
            Read more <ChevronDown className="h-4 w-4" />
          </>
        )}
      </button>
    </div>
  );

  // Image column: single hero-style photo filling the full column height
  // (matching the text column via items-stretch on the parent grid), or
  // (Chapter 9 only) a primary photo that grows to fill available space
  // with two smaller supporting photos fixed beneath it. object-cover
  // crops to fill without distorting the subject.
  const imageColumn = hasImages && (
    <div className="flex flex-col h-full min-h-[280px] lg:min-h-0 gap-3">
      <div className="flex-1 overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-800 shadow-lg min-h-0">
        <img
          src={primaryImage.src}
          alt={primaryImage.alt}
          className="w-full h-full object-cover"
        />
      </div>
      {supportingImages.length > 0 && (
        <div className="grid grid-cols-2 gap-3 h-24 sm:h-28 shrink-0">
          {supportingImages.map((img, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-slate-200/70 dark:border-slate-800 shadow-sm"
            >
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
      className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm p-6 sm:p-8"
    >
      {hasImages ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">
          {/* Mobile: image always first, regardless of desktop side.
              Desktop: order + column-span follow the approved

              alternating imageSide. col-span must live on these direct
              grid children, not on nested content divs. */}
          <div
            className={`lg:col-span-5 ${imageSide === "left" ? "order-1 lg:order-1" : "order-1 lg:order-2"}`}
          >
            {imageColumn}
          </div>
          <div
            className={`lg:col-span-7 ${imageSide === "left" ? "order-2 lg:order-2" : "order-2 lg:order-1"}`}
          >
            {textColumn}
          </div>
        </div>
      ) : (
        textColumn
      )}
    </motion.div>
  );
}

export default function About({ setCurrentTab }: AboutProps) {
  const handleScrollToJourney = () => {
    const section = document.getElementById("my-journey-section");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-slate-50 dark:bg-[#071126] transition-colors duration-300">

      {/* HERO - Keep your original hero section here if you want */}

      {/* SECTION 2 — MEET THE FOUNDER */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5 relative group">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-950 p-3">
              <img
                src="/assets/images/founder-2010.png"
                alt="Kamal Khadka"
                className="rounded-2xl object-cover w-full aspect-[4/4.5] transition-all duration-700 hover:scale-105"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-nepal-crimson dark:text-nepal-crimson-light font-mono">FOUNDER'S STORY</p>
              <h2 className="text-4xl font-black text-slate-950 dark:text-white tracking-tight">Meet the Founder</h2>
              <p className="text-2xl font-semibold text-nepal-blue">Kamal Khadka</p>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
                AI Practitioner | HRM Specialist
              </p>
            </div>

            <div className="text-slate-600 dark:text-slate-300 text-[15px] leading-relaxed space-y-4">
              <p>Today's AI technology is opening new opportunities for hundreds of thousands of people who previously had limited access to information, learning and connection.</p>
              <p>I first saw a computer screen in 1995 while working with United Mission to Nepal. My own journey since then — from a remote district in Bhojpur, through an international scholarship in Australia, to a career spent building HR systems and national health workforce plans in Nepal — is the reason I understand how much reliable information and preparation can matter to a student's future.</p>
              <p>KIPLANScholar is my attempt to bring that same reliable information closer to Nepali students, professionals and entrepreneurs today.</p>
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

      {/* SECTION 3 — MY JOURNEY: 15-chapter founder story */}
      <section id="my-journey-section" className="py-20 bg-white dark:bg-slate-950 border-y border-slate-200/50 dark:border-slate-800/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-nepal-crimson">FROM KATHMANDU TO CANBERRA AND BACK</span>
            <h2 className="text-4xl font-black">My Journey</h2>
          </div>

          <div className="space-y-6">
            {FOUNDER_CHAPTERS.map((chapter, index) => (
              <ChapterCard
                key={chapter.number}
                number={chapter.number}
                title={chapter.title}
                preview={chapter.preview}
                fullText={chapter.fullText}
                images={chapter.images}
                imageSide={chapter.imageSide}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTIONS 4 TO 7 — Keep as they are */}

      {/* SECTION 9 — CALL TO ACTION (Keep your original) */}

    </div>
  );
}