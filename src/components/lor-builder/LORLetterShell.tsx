import React from "react";
import { LORData } from "./lorTypes";
import { LORParagraph } from "./lorFormat";

interface LORLetterShellProps {
  data: LORData;
  openingLine: string;
  paragraphs: LORParagraph[];
  fontClass: string;
}

function formatToday(): string {
  return new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

/**
 * The professional recommendation-letter structure (letterhead, date,
 * greeting, body, closing, signature) — written once here, not
 * duplicated across the 5 template files. Each template only supplies
 * its own opening framing line and paragraph order; this component
 * owns the actual letter shape.
 */
export default function LORLetterShell({ data, openingLine, paragraphs, fontClass }: LORLetterShellProps) {
  const hasRecommenderHeader = data.recommenderName || data.recommenderInstitution;

  return (
    <div className={`${fontClass} text-slate-900 bg-white p-10 text-[13px] leading-[1.8]`}>
      {/* Letterhead area */}
      {hasRecommenderHeader && (
        <div className="mb-6 pb-4 border-b border-slate-300">
          <div className="font-bold text-sm">{data.recommenderName || "Recommender Name"}</div>
          <div className="text-slate-600 text-[12px]">
            {[data.recommenderTitle, data.recommenderDepartment, data.recommenderInstitution].filter(Boolean).join(", ")}
          </div>
          <div className="text-slate-500 text-[11px]">
            {[data.recommenderEmail, data.recommenderPhone].filter(Boolean).join(" | ")}
          </div>
        </div>
      )}

      {/* Date */}
      <div className="mb-4 text-slate-600">{formatToday()}</div>

      {/* Greeting */}
      <div className="mb-4">To the Admissions / Scholarship Committee,</div>

      {/* Body */}
      <p className="mb-4">{openingLine}</p>
      {paragraphs.map((p) => (
        <p key={p.key} className="mb-4">
          {p.text}
        </p>
      ))}

      {/* Closing */}
      {data.closingParagraph && <p className="mb-6">{data.closingParagraph}</p>}

      {/* Signature block */}
      <div className="mt-8">
        <div className="mb-8">Sincerely,</div>
        <div className="font-bold">{data.recommenderName || "Recommender Name"}</div>
        <div className="text-slate-600 text-[12px]">
          {[data.recommenderTitle, data.recommenderInstitution].filter(Boolean).join(", ")}
        </div>
      </div>
    </div>
  );
}