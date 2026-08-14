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

/**
 * Shared application type contracts — restored (Phase 2 shared-type
 * repair). These are NOT the same as the raw Supabase row shape in
 * src/lib/scholarships.ts (snake_case, matches DB columns exactly,
 * used as mapScholarship.ts's *input* type). The `Scholarship` below
 * is the UI/application-facing legacy contract that
 * src/components/results/types.ts's `EnrichedOpportunity` extends —
 * i.e. mapScholarship.ts's *output* foundation. The two are related
 * only through that transformation (Supabase Scholarship ->
 * mapScholarship.ts -> EnrichedOpportunity -> UI), deliberately not
 * merged into one type.
 *
 * Every field below was verified against the actual active
 * construction sites before being added — not invented to silence
 * TypeScript:
 *   - src/utils/mapScholarship.ts's return object (the live Supabase
 *     path feeding Scholarships.tsx/Home.tsx/ScholarshipCalendar.tsx)
 *   - src/data/scholarships.ts's own `SCHOLARSHIPS = rawScholarships.map(...)`
 *     construction (feeds mockOpportunities.ts's `enrichedFromOriginal`)
 *   - src/components/results/mockOpportunities.ts's `extraOpportunities`
 *     object literals (feeds Dashboard.tsx / Eligibility.tsx)
 * All three independently agree on the same field set, with exactly
 * two exceptions — `stipend` and `lastUpdated` — which only the newer
 * mapScholarship.ts construction provides (added in SDM-001 Track 1,
 * after src/data/scholarships.ts's construction site was written).
 * Both are marked optional for exactly that reason: making them
 * required would break the older, still-active construction site,
 * which is real, active code, not something to force-fit around.
 */
export interface Scholarship {
  id: string;
  slug: string;
  title: string;
  provider: string;
  organization: string;
  org: string;
  description: string;
  desc: string;
  amount: string;
  deadline: string | null;
  applicationDeadline: string | null;
  country: string;
  countries: string[];
  level: string;
  levels: string[];
  academicLevel: string;
  field: string;
  fieldOfStudy: string;
  link: string | null;
  officialWebsite: string | null;
  tags: string[];
  eligibility: string[];
  benefits: string[];
  featured: boolean;
  categories: string[];
  fundingType: string;
  fullyFunded: string;
  bondRequired: "Yes" | "No" | "Not specified";
  duration: string;
  requiredDocuments: string[];
  applicationTips: string[];
  /** Only mapScholarship.ts's construction (SDM-001 Track 1+) provides this — see file header. */
  stipend?: string;
  /** Only mapScholarship.ts's construction (SDM-001 Track 1+) provides this — see file header. */
  lastUpdated?: string | null;
}

/** Verified against src/data/scholarships.ts's COUNTRIES array construction. */
export interface Country {
  code: string;
  name: string;
  flag: string;
  description: string;
  popularScholarshipsCount: number;
  visaGuidance: string;
  averageCostOfLiving: string;
  languageRequirements: string;
  featuredScholarships: string[];
  image: string;
}

/** Verified against src/data/scholarships.ts's TESTIMONIALS array construction. */
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  scholarshipName: string;
  text: string;
  location: string;
  avatar: string;
}

/** Verified against src/data/scholarships.ts's FAQS array construction. */
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

/** Verified against src/data/scholarships.ts's RESOURCES array construction. */
export interface ResourceTemplate {
  id: string;
  title: string;
  description: string;
  type: string;
  downloadUrl: string;
  contentStructure: string[];
  tips: string[];
  /** True only for future/placeholder resources with no real content yet. */
  comingSoon?: boolean;
  /**
   * If set, clicking this resource in the Resources sidebar navigates
   * to a dedicated standalone tab/page (via setCurrentTab) instead of
   * selecting it into this page's own detail panel. Matches the
   * existing CV/SOP/LOR/Motivation Letter Builder pattern.
   */
  routeTo?: string;
}