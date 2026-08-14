import React from "react";
import { LORData } from "./lorTypes";
import { buildLORParagraphs } from "./lorFormat";
import LORLetterShell from "./LORLetterShell";

interface TemplateProps {
  data: LORData;
}

const ORDER = ["fit", "academic", "relationship", "leadership", "qualities", "research"];

export default function ScholarshipRecommendationTemplate({ data }: TemplateProps) {
  const name = data.applicantFullName || "the applicant";
  const programme = data.programmeApplyingFor ? ` for the ${data.programmeApplyingFor} programme` : "";
  const opening = `It is my privilege to recommend ${name} for this scholarship${programme}. Having known them${data.yearsKnown ? ` for ${data.yearsKnown}` : ""}, I am confident they are an outstanding candidate deserving of this support.`;
  return <LORLetterShell data={data} openingLine={opening} paragraphs={buildLORParagraphs(data, ORDER)} fontClass="font-serif" />;
}