import React from "react";
import { LORData } from "./lorTypes";
import { buildLORParagraphs } from "./lorFormat";
import LORLetterShell from "./LORLetterShell";

interface TemplateProps {
  data: LORData;
}

const ORDER = ["research", "relationship", "academic", "qualities", "fit"];

export default function ResearchSupervisorTemplate({ data }: TemplateProps) {
  const name = data.applicantFullName || "the applicant";
  const opening = `As ${name}'s research supervisor, I am pleased to write in support of their application. I have observed their work firsthand${data.yearsKnown ? ` for ${data.yearsKnown}` : ""} and can speak directly to their research capabilities.`;
  return <LORLetterShell data={data} openingLine={opening} paragraphs={buildLORParagraphs(data, ORDER)} fontClass="font-sans" />;
}