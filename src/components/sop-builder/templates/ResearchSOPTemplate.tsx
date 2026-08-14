import React from "react";
import { SOPData } from "../sopTypes";

interface TemplateProps {
  data: SOPData;
}

function Section({ label, text }: { label: string; text: string }) {
  if (!text.trim()) return null;
  return (
    <div className="mb-5">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-nepal-crimson mb-1">{label}</span>
      <p>{text}</p>
    </div>
  );
}

export default function ResearchSOPTemplate({ data }: TemplateProps) {
  return (
    <div className="font-sans text-slate-800 bg-white p-10 text-[13px] leading-[1.75]">
      <h1 className="text-lg font-extrabold mb-6">Statement of Purpose</h1>
      <Section label="Introduction" text={data.hook} />
      <Section label="Research Interest & Motivation" text={data.motivation} />
      <Section label="Academic Background" text={data.academicBackground} />
      <Section label="Why This Program" text={data.programFit} />
      <Section label="Goals" text={data.goals} />
      <Section label="Conclusion" text={data.conclusion} />
    </div>
  );
}