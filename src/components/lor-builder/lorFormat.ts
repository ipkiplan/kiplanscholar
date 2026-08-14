import { LORData } from "./lorTypes";

/** True if at least one of the given fields has content — used to skip empty paragraphs entirely. */
function anyFilled(data: LORData, keys: (keyof LORData)[]): boolean {
  return keys.some((k) => data[k]?.trim());
}

function joinFilled(data: LORData, keys: (keyof LORData)[]): string {
  return keys
    .map((k) => data[k]?.trim())
    .filter(Boolean)
    .join(" ");
}

export interface LORParagraph {
  key: string;
  text: string;
}

/**
 * Builds the letter's body paragraphs from whichever data is actually
 * filled in — every template calls this with a different `order` to
 * control emphasis, but none of them re-derive the paragraph text
 * themselves. Skips any paragraph with no underlying content, so a
 * partially-filled draft never renders a hollow paragraph.
 */
export function buildLORParagraphs(data: LORData, order: string[]): LORParagraph[] {
  const paragraphBuilders: Record<string, () => LORParagraph | null> = {
    relationship: () => {
      const keys: (keyof LORData)[] = ["coursesTaught", "projectsSupervised", "researchCollaboration"];
      if (!anyFilled(data, keys) && !data.relationshipType) return null;
      const relLine = data.relationshipType ? `As ${data.recommenderName || "I"}'s ${data.relationshipType.toLowerCase()}, ` : "";
      return { key: "relationship", text: `${relLine}${joinFilled(data, keys)}`.trim() };
    },
    academic: () => {
      const keys: (keyof LORData)[] = [
        "researchAbility", "writingAbility", "criticalThinking", "problemSolving", "classParticipation", "achievements",
      ];
      if (!anyFilled(data, keys) && !data.gpa && !data.academicRanking) return null;
      const stats = [data.gpa && `GPA of ${data.gpa}`, data.academicRanking].filter(Boolean).join(", ");
      const statsLine = stats ? `${data.applicantFullName || "The applicant"} maintained a ${stats}. ` : "";
      return { key: "academic", text: `${statsLine}${joinFilled(data, keys)}`.trim() };
    },
    research: () => {
      const keys: (keyof LORData)[] = ["researchProjects", "publications", "conferences", "laboratoryExperience", "innovation"];
      if (!anyFilled(data, keys)) return null;
      return { key: "research", text: joinFilled(data, keys) };
    },
    leadership: () => {
      const keys: (keyof LORData)[] = ["studentLeadership", "volunteerWork", "communityService", "clubs", "awards", "professionalActivities"];
      if (!anyFilled(data, keys)) return null;
      return { key: "leadership", text: joinFilled(data, keys) };
    },
    qualities: () => {
      const keys: (keyof LORData)[] = [
        "integrity", "communication", "teamwork", "leadershipQuality", "adaptability", "initiative", "professionalism", "responsibility",
      ];
      if (!anyFilled(data, keys)) return null;
      const listed = keys
        .filter((k) => data[k]?.trim())
        .map((k) => data[k])
        .join("; ");
      return { key: "qualities", text: listed ? `On a personal level, I have observed the following: ${listed}.` : "" };
    },
    fit: () => {
      const keys: (keyof LORData)[] = ["whySuitable", "potentialContribution", "futureGoals", "expectedImpact"];
      if (!anyFilled(data, keys)) return null;
      return { key: "fit", text: joinFilled(data, keys) };
    },
  };

  return order
    .map((key) => paragraphBuilders[key]?.())
    .filter((p): p is LORParagraph => p !== null && p.text.length > 0);
}