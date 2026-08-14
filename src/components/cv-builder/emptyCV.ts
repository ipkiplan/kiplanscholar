import { CVData, CVStepId } from "./cvTypes";

export function createEmptyCV(): CVData {
  return {
    personalInfo: { fullName: "", email: "", phone: "", location: "", linkedIn: "", portfolio: "" },
    summary: "",
    education: [],
    workExperience: [],
    researchExperience: [],
    publications: [],
    conferences: [],
    awards: [],
    scholarships: [],
    leadership: [],
    volunteering: [],
    certifications: [],
    skills: [],
    languages: [],
    references: [],
  };
}

export function generateEntryId(): string {
  return `entry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export interface CVStepMeta {
  id: CVStepId;
  label: string;
  /** True for sections we don't require the student to fill before allowing them to finish (most CV sections are optional/additive). */
  optional: boolean;
}

export const CV_STEPS: CVStepMeta[] = [
  { id: "personal", label: "Personal Information", optional: false },
  { id: "summary", label: "Professional Summary", optional: true },
  { id: "education", label: "Education", optional: false },
  { id: "workExperience", label: "Work Experience", optional: true },
  { id: "researchExperience", label: "Research Experience", optional: true },
  { id: "publications", label: "Publications", optional: true },
  { id: "conferences", label: "Conferences", optional: true },
  { id: "awards", label: "Awards", optional: true },
  { id: "scholarships", label: "Scholarships", optional: true },
  { id: "leadership", label: "Leadership", optional: true },
  { id: "volunteering", label: "Volunteering", optional: true },
  { id: "certifications", label: "Certifications", optional: true },
  { id: "skills", label: "Skills", optional: true },
  { id: "languages", label: "Languages", optional: true },
  { id: "references", label: "References", optional: true },
];