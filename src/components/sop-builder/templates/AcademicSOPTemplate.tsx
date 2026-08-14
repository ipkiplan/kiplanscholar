import React from "react";
import { SOPData } from "../sopTypes";

interface TemplateProps {
  data: SOPData;
}

function Paragraph({ text }: { text: string }) {
  if (!text.trim()) return null;
  return <p className="mb-4">{text}</p>;
}

export default function AcademicSOPTemplate({ data }: TemplateProps) {
  return (
    <div className="font-serif text-slate-900 bg-white p-10 text-[13.5px] leading-[1.8]">
      <h1 className="text-lg font-bold text-center mb-6 tracking-wide uppercase">Statement of Purpose</h1>
      <Paragraph text={data.hook} />
      <Paragraph text={data.academicBackground} />
      <Paragraph text={data.motivation} />
      <Paragraph text={data.programFit} />
      <Paragraph text={data.goals} />
      <Paragraph text={data.conclusion} />
    </div>
  );
}