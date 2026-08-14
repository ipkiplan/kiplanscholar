import React from "react";
import { LORData } from "./lorTypes";
import { buildLORParagraphs } from "./lorFormat";
import LORLetterShell from "./LORLetterShell";

interface TemplateProps {
  data: LORData;
}

const ORDER = ["academic", "relationship", "research", "qualities", "fit"];

export default function AcademicProfessorTemplate({ data }: TemplateProps) {
  const name = data.applicantFullName || "the applicant";
  const opening = `I am writing to provide my strongest academic recommendation for ${name}, who I have had the pleasure of teaching and mentoring${data.yearsKnown ? ` over the past ${data.yearsKnown}` : ""}.`;
  return <LORLetterShell data={data} openingLine={opening} paragraphs={buildLORParagraphs(data, ORDER)} fontClass="font-serif" />;
}