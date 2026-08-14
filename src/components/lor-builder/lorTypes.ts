/**
 * ES-011 — LOR Builder: data model.
 *
 * New, independent module, same pattern as cv-builder/ and
 * sop-builder/. Not added to src/types.ts (ES-004-locked).
 *
 * Data model note: unlike CV Builder (many repeatable list entries),
 * LOR sections are all fixed, named fields — structurally closer to
 * SOP Builder's flat data shape. One generic, config-driven form
 * component (LORFieldGroupForm.tsx) renders all 9 sections from this
 * config, the same "config over duplication" principle established
 * by CV Builder's RepeatableEntryForm.
 */

export type LORStepId =
  | "applicant"
  | "recommender"
  | "relationship"
  | "academic"
  | "research"
  | "leadership"
  | "qualities"
  | "fit"
  | "closing"
  | "preview";

export type LORTypeId =
  | "academic-professor"
  | "research-supervisor"
  | "employer"
  | "internship-supervisor"
  | "scholarship-recommendation";

export interface LORData {
  // Applicant Information
  applicantFullName: string;
  applicantEmail: string;
  programmeApplyingFor: string;
  applicantUniversity: string;
  applicantCountry: string;
  degreeLevel: string;
  fieldOfStudy: string;
  careerGoal: string;

  // Recommender Information
  recommenderName: string;
  recommenderTitle: string;
  recommenderDepartment: string;
  recommenderInstitution: string;
  recommenderEmail: string;
  recommenderPhone: string;
  recommenderRelationshipNote: string;
  yearsKnown: string;

  // Relationship
  relationshipType: string;
  coursesTaught: string;
  projectsSupervised: string;
  researchCollaboration: string;

  // Academic Performance
  gpa: string;
  academicRanking: string;
  researchAbility: string;
  writingAbility: string;
  criticalThinking: string;
  problemSolving: string;
  classParticipation: string;
  achievements: string;

  // Research & Projects
  researchProjects: string;
  publications: string;
  conferences: string;
  laboratoryExperience: string;
  innovation: string;

  // Leadership & Activities
  studentLeadership: string;
  volunteerWork: string;
  communityService: string;
  clubs: string;
  awards: string;
  professionalActivities: string;

  // Personal Qualities
  integrity: string;
  communication: string;
  teamwork: string;
  leadershipQuality: string;
  adaptability: string;
  initiative: string;
  professionalism: string;
  responsibility: string;

  // Scholarship / Programme Fit
  whySuitable: string;
  potentialContribution: string;
  futureGoals: string;
  expectedImpact: string;

  // Closing Recommendation
  recommendationStrength: string;
  closingParagraph: string;
}

export interface LORFieldSchema {
  key: keyof LORData;
  label: string;
  type: "text" | "textarea" | "select";
  options?: string[];
  placeholder?: string;
}

export interface LORSectionMeta {
  id: LORStepId;
  label: string;
  fields: LORFieldSchema[];
}

const RELATIONSHIP_TYPES = ["Professor", "Supervisor", "Employer", "Mentor", "Research Guide", "Internship Supervisor"];
const RECOMMENDATION_STRENGTHS = ["Strongly Recommend", "Recommend", "Recommend with Confidence"];

export const LOR_SECTIONS: LORSectionMeta[] = [
  {
    id: "applicant",
    label: "Applicant Information",
    fields: [
      { key: "applicantFullName", label: "Full Name", type: "text" },
      { key: "applicantEmail", label: "Email", type: "text" },
      { key: "programmeApplyingFor", label: "Programme Applying For", type: "text" },
      { key: "applicantUniversity", label: "University", type: "text" },
      { key: "applicantCountry", label: "Country", type: "text" },
      { key: "degreeLevel", label: "Degree Level", type: "text", placeholder: "e.g. Master's" },
      { key: "fieldOfStudy", label: "Field of Study", type: "text" },
      { key: "careerGoal", label: "Career Goal", type: "textarea" },
    ],
  },
  {
    id: "recommender",
    label: "Recommender Information",
    fields: [
      { key: "recommenderName", label: "Name", type: "text" },
      { key: "recommenderTitle", label: "Title", type: "text", placeholder: "e.g. Associate Professor" },
      { key: "recommenderDepartment", label: "Department", type: "text" },
      { key: "recommenderInstitution", label: "Institution", type: "text" },
      { key: "recommenderEmail", label: "Email", type: "text" },
      { key: "recommenderPhone", label: "Phone", type: "text" },
      { key: "recommenderRelationshipNote", label: "Relationship (short label)", type: "text", placeholder: "e.g. Thesis Supervisor" },
      { key: "yearsKnown", label: "Years Known", type: "text" },
    ],
  },
  {
    id: "relationship",
    label: "Relationship",
    fields: [
      { key: "relationshipType", label: "Relationship Type", type: "select", options: RELATIONSHIP_TYPES },
      { key: "coursesTaught", label: "Courses Taught", type: "textarea" },
      { key: "projectsSupervised", label: "Projects Supervised", type: "textarea" },
      { key: "researchCollaboration", label: "Research Collaboration", type: "textarea" },
    ],
  },
  {
    id: "academic",
    label: "Academic Performance",
    fields: [
      { key: "gpa", label: "GPA", type: "text" },
      { key: "academicRanking", label: "Academic Ranking", type: "text", placeholder: "e.g. Top 5% of cohort" },
      { key: "researchAbility", label: "Research Ability", type: "text" },
      { key: "writingAbility", label: "Writing Ability", type: "text" },
      { key: "criticalThinking", label: "Critical Thinking", type: "text" },
      { key: "problemSolving", label: "Problem Solving", type: "text" },
      { key: "classParticipation", label: "Class Participation", type: "text" },
      { key: "achievements", label: "Achievements", type: "textarea" },
    ],
  },
  {
    id: "research",
    label: "Research & Projects",
    fields: [
      { key: "researchProjects", label: "Research Projects", type: "textarea" },
      { key: "publications", label: "Publications", type: "textarea" },
      { key: "conferences", label: "Conferences", type: "textarea" },
      { key: "laboratoryExperience", label: "Laboratory Experience", type: "textarea" },
      { key: "innovation", label: "Innovation", type: "textarea" },
    ],
  },
  {
    id: "leadership",
    label: "Leadership & Activities",
    fields: [
      { key: "studentLeadership", label: "Student Leadership", type: "textarea" },
      { key: "volunteerWork", label: "Volunteer Work", type: "textarea" },
      { key: "communityService", label: "Community Service", type: "textarea" },
      { key: "clubs", label: "Clubs", type: "textarea" },
      { key: "awards", label: "Awards", type: "textarea" },
      { key: "professionalActivities", label: "Professional Activities", type: "textarea" },
    ],
  },
  {
    id: "qualities",
    label: "Personal Qualities",
    fields: [
      { key: "integrity", label: "Integrity", type: "text" },
      { key: "communication", label: "Communication", type: "text" },
      { key: "teamwork", label: "Teamwork", type: "text" },
      { key: "leadershipQuality", label: "Leadership", type: "text" },
      { key: "adaptability", label: "Adaptability", type: "text" },
      { key: "initiative", label: "Initiative", type: "text" },
      { key: "professionalism", label: "Professionalism", type: "text" },
      { key: "responsibility", label: "Responsibility", type: "text" },
    ],
  },
  {
    id: "fit",
    label: "Scholarship / Programme Fit",
    fields: [
      { key: "whySuitable", label: "Why the applicant is suitable", type: "textarea" },
      { key: "potentialContribution", label: "Potential Contribution", type: "textarea" },
      { key: "futureGoals", label: "Future Goals", type: "textarea" },
      { key: "expectedImpact", label: "Expected Impact", type: "textarea" },
    ],
  },
  {
    id: "closing",
    label: "Closing Recommendation",
    fields: [
      { key: "recommendationStrength", label: "Recommendation Strength", type: "select", options: RECOMMENDATION_STRENGTHS },
      { key: "closingParagraph", label: "Closing Paragraph", type: "textarea" },
    ],
  },
];

export const LOR_TYPES: Array<{ id: LORTypeId; label: string }> = [
  { id: "academic-professor", label: "Academic Professor" },
  { id: "research-supervisor", label: "Research Supervisor" },
  { id: "employer", label: "Employer" },
  { id: "internship-supervisor", label: "Internship Supervisor" },
  { id: "scholarship-recommendation", label: "Scholarship Recommendation" },
];

/**
 * Closing-paragraph starter text — a guided, editable template, not
 * AI-generated content. Deterministic lookup by recommendation
 * strength, consistent with the "no AI writing/rewriting" boundary
 * already established for CV/SOP Builder. The recommender is expected
 * to edit/complete this, not use it verbatim.
 */
export function suggestClosingParagraph(strength: string, applicantName: string): string {
  const name = applicantName.trim() || "the applicant";
  if (strength === "Strongly Recommend") {
    return `It is with my strongest and most enthusiastic recommendation that I put forward ${name} for this opportunity. In my years of experience working with students, ${name} stands out as one of the most capable and dedicated individuals I have had the privilege to work with. I am confident ${name} will excel in this programme and make a lasting contribution.`;
  }
  if (strength === "Recommend with Confidence") {
    return `I recommend ${name} with genuine confidence for this opportunity. Based on my direct experience working with ${name}, I am confident in their abilities, work ethic, and potential to succeed in this programme.`;
  }
  return `I am pleased to recommend ${name} for this opportunity. Based on my experience working with ${name}, I believe they possess the qualities and preparation needed to succeed in this programme.`;
}

export function createEmptyLOR(): LORData {
  return {
    applicantFullName: "", applicantEmail: "", programmeApplyingFor: "", applicantUniversity: "",
    applicantCountry: "", degreeLevel: "", fieldOfStudy: "", careerGoal: "",
    recommenderName: "", recommenderTitle: "", recommenderDepartment: "", recommenderInstitution: "",
    recommenderEmail: "", recommenderPhone: "", recommenderRelationshipNote: "", yearsKnown: "",
    relationshipType: "", coursesTaught: "", projectsSupervised: "", researchCollaboration: "",
    gpa: "", academicRanking: "", researchAbility: "", writingAbility: "", criticalThinking: "",
    problemSolving: "", classParticipation: "", achievements: "",
    researchProjects: "", publications: "", conferences: "", laboratoryExperience: "", innovation: "",
    studentLeadership: "", volunteerWork: "", communityService: "", clubs: "", awards: "", professionalActivities: "",
    integrity: "", communication: "", teamwork: "", leadershipQuality: "", adaptability: "",
    initiative: "", professionalism: "", responsibility: "",
    whySuitable: "", potentialContribution: "", futureGoals: "", expectedImpact: "",
    recommendationStrength: "", closingParagraph: "",
  };
}