import React from "react";
import { MLData } from "./mlTypes";

interface MLLetterTemplateProps {
  data: MLData;
}

function Paragraph({ text }: { text: string }) {
  if (!text.trim()) return null;
  return <p className="mb-4">{text}</p>;
}

/**
 * One consistent professional letter format, regardless of which
 * template/mode is selected in the editor — per the ES's explicit
 * boundary that templates change guidance only, never the output.
 * Section order always matches ML_SECTIONS (mlTypes.ts).
 */
export default function MLLetterTemplate({ data }: MLLetterTemplateProps) {
  return (
    <div className="font-serif text-slate-900 bg-white p-10 text-[13.5px] leading-[1.8]">
      <h1 className="text-lg font-bold text-center mb-6 tracking-wide uppercase">Motivation Letter</h1>
      {data.greeting.trim() && <p className="mb-4">{data.greeting}</p>}
      <Paragraph text={data.introduction} />
      <Paragraph text={data.academicBackground} />
      <Paragraph text={data.motivation} />
      <Paragraph text={data.whyProgramme} />
      <Paragraph text={data.whyInstitution} />
      <Paragraph text={data.personalStrengths} />
      <Paragraph text={data.careerGoals} />
      <Paragraph text={data.closing} />
    </div>
  );
}