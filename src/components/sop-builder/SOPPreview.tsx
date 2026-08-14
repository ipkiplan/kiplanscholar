import React from "react";
import { SOPData, SOPTemplateId } from "./sopTypes";
import AcademicSOPTemplate from "./templates/AcademicSOPTemplate";
import ResearchSOPTemplate from "./templates/ResearchSOPTemplate";
import ProfessionalSOPTemplate from "./templates/ProfessionalSOPTemplate";

interface SOPPreviewProps {
  data: SOPData;
  template: SOPTemplateId;
}

/** Module: Live Preview — same state, re-rendered on every keystroke via normal React data flow, no separate sync step. */
export default function SOPPreview({ data, template }: SOPPreviewProps) {
  const Template = template === "academic" ? AcademicSOPTemplate : template === "professional" ? ProfessionalSOPTemplate : ResearchSOPTemplate;

  return (
    <div className="h-full overflow-y-auto bg-slate-100 dark:bg-slate-950 p-4 sm:p-6">
      <div id="sop-print-area" className="max-w-[720px] mx-auto shadow-lg rounded-sm overflow-hidden">
        <Template data={data} />
      </div>
    </div>
  );
}