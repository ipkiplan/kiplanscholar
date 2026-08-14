import React from "react";
import { LORData, LORTypeId } from "./lorTypes";
import AcademicProfessorTemplate from "./AcademicProfessorTemplate";
import ResearchSupervisorTemplate from "./ResearchSupervisorTemplate";
import EmployerTemplate from "./EmployerTemplate";
import InternshipSupervisorTemplate from "./InternshipSupervisorTemplate";
import ScholarshipRecommendationTemplate from "./ScholarshipRecommendationTemplate";

interface LORPreviewProps {
  data: LORData;
  lorType: LORTypeId;
}

const TEMPLATE_MAP: Record<LORTypeId, React.ComponentType<{ data: LORData }>> = {
  "academic-professor": AcademicProfessorTemplate,
  "research-supervisor": ResearchSupervisorTemplate,
  employer: EmployerTemplate,
  "internship-supervisor": InternshipSupervisorTemplate,
  "scholarship-recommendation": ScholarshipRecommendationTemplate,
};

/** Live preview — same state read directly, updates on every keystroke, no debounce/sync step. */
export default function LORPreview({ data, lorType }: LORPreviewProps) {
  const Template = TEMPLATE_MAP[lorType];

  return (
    <div className="h-full overflow-y-auto bg-slate-100 dark:bg-slate-950 p-4 sm:p-6">
      <div id="lor-print-area" className="max-w-[720px] mx-auto shadow-lg rounded-sm overflow-hidden">
        <Template data={data} />
      </div>
    </div>
  );
}