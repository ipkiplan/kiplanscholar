import React from "react";
import { LORData } from "./lorTypes";
import { buildLORParagraphs } from "./lorFormat";
import LORLetterShell from "./LORLetterShell";

interface TemplateProps {
  data: LORData;
}

const ORDER = ["relationship", "leadership", "qualities", "fit", "academic"];

export default function EmployerTemplate({ data }: TemplateProps) {
  const name = data.applicantFullName || "the applicant";
  const opening = `I am writing to recommend ${name}, who worked under my supervision${data.yearsKnown ? ` for ${data.yearsKnown}` : ""}. During this time, I had the opportunity to observe their professional conduct, work ethic, and capabilities directly.`;
  return <LORLetterShell data={data} openingLine={opening} paragraphs={buildLORParagraphs(data, ORDER)} fontClass="font-sans" />;
}