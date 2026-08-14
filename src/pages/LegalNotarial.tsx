import React from "react";
import { ArrowLeft, Download, Languages, ShieldCheck, Stamp, Landmark, ClipboardList, Info } from "lucide-react";
import { exportDocumentAsPDF } from "../components/document-builder/printExport";

/**
 * Legal & Notarial Service — dedicated guidance page.
 *
 * Follows the same standalone-tab pattern as CV/SOP/LOR/Motivation
 * Letter Builder (see App.tsx: currentTab === "legal-notarial"), not
 * the Resources.tsx sidebar+detail-panel system. This keeps Resources
 * a directory of entry points rather than a place that holds every
 * tool's full instructional content.
 *
 * This is guidance/preparation content, not an active transactional
 * legal/notarial service — framed as "Guidance & Preparation"
 * throughout, consistent with the product's current positioning.
 * Content here is intentionally general (explains what these
 * processes commonly involve) rather than inventing specific fees,
 * office names, or processing times that would need independent
 * verification to be accurate.
 */
interface LegalNotarialPageProps {
  setCurrentTab: (tab: string) => void;
}

interface GuidanceSection {
  icon: React.ElementType;
  title: string;
  body: string;
  points: string[];
}

const SECTIONS: GuidanceSection[] = [
  {
    icon: Languages,
    title: "Certified Translation Guidance",
    body: "Universities and embassies outside Nepal typically require documents to be in the language of instruction (usually English), and often specifically require a certified translation rather than a plain one.",
    points: [
      "Certified translation is commonly required when your original documents are in Nepali — transcripts, mark sheets, character certificates, and citizenship/passport-related documents are the most frequent examples.",
      "Requirements vary by destination country and institution — always check the specific university or embassy's stated translation requirements before proceeding.",
      "KIPLANScholar currently provides guidance and information on this process. It does not yet offer certified translation as an active operational service.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Document Verification & Attestation Guidance",
    body: "Attestation is the process of having an authority confirm that a document is genuine, usually required before it will be accepted by a foreign institution or embassy.",
    points: [
      "In Nepal, this generally involves verification through the issuing institution first, followed by attestation through the relevant government authority.",
      "The exact sequence and required authority can differ depending on the destination country and the type of document — always confirm current requirements directly with the relevant office or your destination institution.",
      "This section is intended as general orientation, not a substitute for checking official, current procedures.",
    ],
  },
  {
    icon: Stamp,
    title: "Notarial / Document Certification Guidance",
    body: "Notarization is a distinct process from translation or attestation — a notary public certifies that a document, signature, or copy is authentic.",
    points: [
      "Notarization is sometimes requested for affidavits, sponsorship declarations, or certified copies of original documents.",
      "It is not the same as certified translation (converting language) or attestation (government-level verification) — some applications require more than one of these, so check exactly what's being asked for.",
      "KIPLANScholar's own notarial background (part of the founder's professional history) informs this guidance content, but this page does not represent an active notarial service being offered through the platform today.",
    ],
  },
  {
    icon: Landmark,
    title: "MoFA & Relevant Authority Procedures",
    body: "Nepal's Ministry of Foreign Affairs (MoFA) is one of the authorities commonly involved in attesting documents for use abroad, alongside other relevant government offices depending on the document type.",
    points: [
      "Nepal-side procedures (verification and attestation within Nepal) are separate from destination-country requirements (what the receiving embassy, university, or immigration authority expects) — both may apply, and the order usually matters.",
      "Processing steps and required offices can change — always confirm current procedures directly with MoFA or the relevant authority rather than relying solely on general guidance.",
      "This page does not list specific current fees, office locations, or processing times, since these are the details most likely to change and most important to get right from an official source.",
    ],
  },
  {
    icon: ClipboardList,
    title: "Document Requirements Checklist",
    body: "A practical starting point for the documents most applicants end up needing to verify, translate, or attest at some stage of an international application.",
    points: [
      "Academic transcripts and mark sheets",
      "Degree/provisional certificates",
      "Citizenship certificate or passport",
      "Character/conduct certificate, where required",
      "Any document requiring a certified translation into the language of instruction",
      "Confirm the exact list required for your specific application directly with the receiving institution or embassy — requirements are not identical across programs.",
    ],
  },
];

export default function LegalNotarialPage({ setCurrentTab }: LegalNotarialPageProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentTab("resources")}
            className="p-2 rounded-xl text-slate-500 hover:text-nepal-crimson hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Back to Resources"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-nepal-gold font-mono block">
              Guidance & Preparation
            </span>
            <h1 className="font-extrabold text-xl sm:text-2xl text-slate-800 dark:text-white">
              Legal & Notarial Service
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 max-w-2xl">
              Guidance on document preparation, certification, translation, verification, and attestation for scholarship and admission applications.
            </p>
          </div>
        </div>

        {/* Outside #legal-notarial-print-area — excluded from the
            printed output by the existing print stylesheet's
            "body * { visibility: hidden }" catch-all, same pattern as
            Resources.tsx's Download Guidelines button. */}
        <button
          type="button"
          onClick={() => exportDocumentAsPDF("legal-notarial-print-area", "Legal & Notarial Service", "Guidelines")}
          className="px-4 py-2 bg-gradient-to-r from-nepal-blue to-nepal-blue-light text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer hover:opacity-95 shrink-0"
        >
          <Download className="h-4 w-4" /> Download Guidelines
        </button>
      </div>

      {/* Everything the printed PDF should contain — a title heading
          plus the disclaimer and all five guidance sections. */}
      <div id="legal-notarial-print-area" className="space-y-8">
        <h2 className="font-extrabold text-lg text-nepal-blue dark:text-white">
          Legal & Notarial Service — Guidance & Preparation
        </h2>

        <div className="flex gap-3 p-4 bg-nepal-blue/5 dark:bg-nepal-blue/10 border border-nepal-blue/10 rounded-2xl">
          <Info className="h-5 w-5 text-nepal-blue shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            This page provides general guidance to help you understand and prepare for these processes. KIPLANScholar does not currently operate an active certified translation, notarial, or attestation service — always confirm current, official requirements directly with the relevant authority, embassy, or institution before proceeding.
          </p>
        </div>

        <div className="space-y-5">
          {SECTIONS.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-nepal-dark border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-nepal-crimson/10 dark:bg-nepal-crimson-light/10 shrink-0">
                    <Icon className="h-4.5 w-4.5 text-nepal-crimson dark:text-nepal-crimson-light" />
                  </span>
                  <h2 className="font-extrabold text-base text-slate-800 dark:text-white">
                    {section.title}
                  </h2>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {section.body}
                </p>
                <ul className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  {section.points.map((point, pIdx) => (
                    <li key={pIdx} className="flex gap-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      <span className="text-nepal-crimson dark:text-nepal-crimson-light font-bold shrink-0">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}