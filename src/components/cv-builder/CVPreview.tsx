import React from "react";
import { CVData, CVTemplateId } from "./cvTypes";
import AcademicTemplate from "./templates/AcademicTemplate";
import ScholarshipTemplate from "./templates/ScholarshipTemplate";
import ProfessionalTemplate from "./templates/ProfessionalTemplate";

interface CVPreviewProps {
  data: CVData;
  template: CVTemplateId;
}

/**
 * Module B — Live Preview. Re-renders on every keystroke via normal
 * React state flow (useCVBuilder's state is the single source of
 * truth for both the form and this preview) — no debouncing, no
 * separate sync step, so "live" is structural rather than simulated.
 *
 * id="cv-print-area" is the exact node exportCV.ts targets for
 * PDF/Print (Module D).
 */
export default function CVPreview({ data, template }: CVPreviewProps) {
  const Template = template === "academic" ? AcademicTemplate : template === "professional" ? ProfessionalTemplate : ScholarshipTemplate;

  return (
    <div className="h-full overflow-y-auto bg-slate-100 dark:bg-slate-950 p-4 sm:p-6">
      <div id="cv-print-area" className="max-w-[720px] mx-auto shadow-lg rounded-sm overflow-hidden">
        <Template data={data} />
      </div>
    </div>
  );
}