/**
 * ES-006A — CV Builder & Review: data model.
 *
 * New, independent module. Deliberately not added to src/types.ts
 * (ES-004-locked) — the CV Builder has its own self-contained type
 * system, same pattern as scholarshipIntelligence/types.ts.
 */

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  portfolio: string;
}

/** Shared shape for every repeatable, multi-entry CV section (education, work experience, awards, etc.). */
export interface CVEntry {
  id: string;
  [field: string]: string | boolean;
}

export interface SkillEntry {
  id: string;
  name: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  education: CVEntry[];
  workExperience: CVEntry[];
  researchExperience: CVEntry[];
  publications: CVEntry[];
  conferences: CVEntry[];
  awards: CVEntry[];
  scholarships: CVEntry[];
  leadership: CVEntry[];
  volunteering: CVEntry[];
  certifications: CVEntry[];
  skills: SkillEntry[];
  languages: CVEntry[];
  references: CVEntry[];
}

/** The multi-entry sections, i.e. every CVData key backed by CVEntry[] except `skills` (its own simpler shape). */
export type CVListSectionKey =
  | "education"
  | "workExperience"
  | "researchExperience"
  | "publications"
  | "conferences"
  | "awards"
  | "scholarships"
  | "leadership"
  | "volunteering"
  | "certifications"
  | "languages"
  | "references";

export type CVStepId =
  | "personal"
  | "summary"
  | "education"
  | "workExperience"
  | "researchExperience"
  | "publications"
  | "conferences"
  | "awards"
  | "scholarships"
  | "leadership"
  | "volunteering"
  | "certifications"
  | "skills"
  | "languages"
  | "references";

export type CVTemplateId = "academic" | "scholarship" | "professional";

export interface CVFieldSchema {
  key: string;
  label: string;
  type: "text" | "textarea" | "month";
  placeholder?: string;
  required?: boolean;
}

/** Config-driven field schema per list section — drives the generic RepeatableEntryForm without a dedicated file per section. */
export const LIST_SECTION_FIELDS: Record<CVListSectionKey, CVFieldSchema[]> = {
  education: [
    { key: "institution", label: "Institution", type: "text", required: true },
    { key: "degree", label: "Degree", type: "text", required: true, placeholder: "e.g. Bachelor of Science" },
    { key: "field", label: "Field of Study", type: "text" },
    { key: "startDate", label: "Start Date", type: "month" },
    { key: "endDate", label: "End Date (or Expected)", type: "month" },
    { key: "gpa", label: "GPA / Grade", type: "text" },
    { key: "description", label: "Details (honors, relevant coursework)", type: "textarea" },
  ],
  workExperience: [
    { key: "role", label: "Job Title", type: "text", required: true },
    { key: "organization", label: "Organization", type: "text", required: true },
    { key: "startDate", label: "Start Date", type: "month" },
    { key: "endDate", label: "End Date", type: "month", placeholder: "Leave blank if current" },
    { key: "description", label: "Responsibilities & achievements", type: "textarea" },
  ],
  researchExperience: [
    { key: "title", label: "Project / Research Title", type: "text", required: true },
    { key: "institution", label: "Institution / Lab", type: "text" },
    { key: "startDate", label: "Start Date", type: "month" },
    { key: "endDate", label: "End Date", type: "month" },
    { key: "description", label: "Description", type: "textarea" },
  ],
  publications: [
    { key: "title", label: "Title", type: "text", required: true },
    { key: "venue", label: "Journal / Venue", type: "text" },
    { key: "authors", label: "Authors", type: "text" },
    { key: "year", label: "Year", type: "text" },
    { key: "link", label: "Link (DOI/URL)", type: "text" },
  ],
  conferences: [
    { key: "name", label: "Conference Name", type: "text", required: true },
    { key: "role", label: "Role (Presenter, Attendee, Panelist...)", type: "text" },
    { key: "location", label: "Location", type: "text" },
    { key: "date", label: "Date", type: "month" },
  ],
  awards: [
    { key: "title", label: "Award / Honor", type: "text", required: true },
    { key: "issuer", label: "Issuing Organization", type: "text" },
    { key: "year", label: "Year", type: "text" },
    { key: "description", label: "Details", type: "textarea" },
  ],
  scholarships: [
    { key: "name", label: "Scholarship Name", type: "text", required: true },
    { key: "issuer", label: "Issuing Organization", type: "text" },
    { key: "year", label: "Year", type: "text" },
  ],
  leadership: [
    { key: "role", label: "Role / Position", type: "text", required: true },
    { key: "organization", label: "Organization", type: "text" },
    { key: "startDate", label: "Start Date", type: "month" },
    { key: "endDate", label: "End Date", type: "month" },
    { key: "description", label: "Description", type: "textarea" },
  ],
  volunteering: [
    { key: "role", label: "Role", type: "text", required: true },
    { key: "organization", label: "Organization", type: "text" },
    { key: "startDate", label: "Start Date", type: "month" },
    { key: "endDate", label: "End Date", type: "month" },
    { key: "description", label: "Description", type: "textarea" },
  ],
  certifications: [
    { key: "name", label: "Certification", type: "text", required: true },
    { key: "issuer", label: "Issuing Body", type: "text" },
    { key: "year", label: "Year", type: "text" },
  ],
  languages: [
    { key: "name", label: "Language", type: "text", required: true },
    { key: "proficiency", label: "Proficiency (e.g. Native, Fluent, Intermediate)", type: "text" },
  ],
  references: [
    { key: "name", label: "Full Name", type: "text", required: true },
    { key: "title", label: "Title / Position", type: "text" },
    { key: "organization", label: "Organization", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "phone", label: "Phone", type: "text" },
  ],
};