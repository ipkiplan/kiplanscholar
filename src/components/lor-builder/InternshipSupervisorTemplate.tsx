import React from "react";
import { LORData } from "./lorTypes";
import { buildLORParagraphs } from "./lorFormat";
import LORLetterShell from "./LORLetterShell";

interface TemplateProps {
  data: LORData;
}

const ORDER = ["relationship", "qualities", "leadership", "fit", "academic"];

export default function InternshipSupervisorTemplate({ data }: TemplateProps) {
  const name = data.applicantFullName || "the applicant";
  const opening = `I had the pleasure of supervising ${name} during their internship${data.yearsKnown ? ` (${data.yearsKnown})` : ""}, and I am glad to recommend them for this opportunity based on what I observed during that time.`;
  return <LORLetterShell data={data} openingLine={opening} paragraphs={buildLORParagraphs(data, ORDER)} fontClass="font-sans" />;
}