import React from "react";
import { SOPData } from "../sopTypes";

interface TemplateProps {
  data: SOPData;
}

function Paragraph({ text }: { text: string }) {
  if (!text.trim()) return null;
  return <p className="mb-4">{text}</p>;
}

export default function ProfessionalSOPTemplate({ data }: TemplateProps) {
  return (
    <div className="font-sans text-black bg-white p-10 text-[13px] leading-[1.75]">
      <h1 className="text-base font-bold mb-6 border-b border-black pb-2">Statement of Purpose</h1>
      <Paragraph text={data.hook} />
      <Paragraph text={data.goals} />
      <Paragraph text={data.academicBackground} />
      <Paragraph text={data.motivation} />
      <Paragraph text={data.programFit} />
      <Paragraph text={data.conclusion} />
    </div>
  );
}