/**
 * ES-005C — Ranking Engine.
 *
 * Step 4 of the Intelligence Layer pipeline: "Rank the results."
 *
 * Scores each candidate scholarship (already retrieved by the Query
 * Builder) against the applicant's full profile, using fixed,
 * transparent weights — no external AI, no black-box scoring. Every
 * point awarded corresponds to a real, named, checkable match between
 * a profile field and a database column, which the Explanation Engine
 * then reads directly off `matchedCriteria` rather than re-deriving it.
 *
 * Expired scholarships (deadline already passed) are excluded outright
 * — recommending one would be actively misleading, not just
 * unpersonalized.
 */

import { Scholarship } from "../../lib/scholarships";
import { ApplicantProfile, RankedScholarship } from "./types";

const WEIGHTS = {
  degreeLevel: 3,
  fundingType: 2,
  country: 2,
  fieldOfStudy: 2,
  targetGroup: 2,
} as const;

function normalizedIncludes(haystack: string | null, needle: string | null): boolean {
  if (!haystack || !needle) return false;
  return haystack.toLowerCase().includes(needle.toLowerCase()) || needle.toLowerCase().includes(haystack.toLowerCase());
}

function isDeadlineValid(scholarship: Scholarship): boolean {
  if (!scholarship.deadline) return true; // rolling / no deadline — always valid
  const deadline = new Date(scholarship.deadline);
  if (isNaN(deadline.getTime())) return true; // malformed date — don't penalize the applicant for a data issue
  return deadline.getTime() >= Date.now();
}

/**
 * Scores one scholarship against the profile. Returns the score and
 * the human-readable list of criteria that actually matched, so the
 * Explanation Engine never has to re-derive what this function already
 * determined.
 */
function scoreScholarship(scholarship: Scholarship, profile: ApplicantProfile): { score: number; matchedCriteria: string[] } {
  let score = 0;
  const matchedCriteria: string[] = [];

  const degreeTarget = profile.preferredDegree ?? profile.educationLevel;
  if (normalizedIncludes(scholarship.degree_level, degreeTarget)) {
    score += WEIGHTS.degreeLevel;
    matchedCriteria.push("degree level");
  }

  if (profile.fundingPreference === "Fully Funded" && /fully/i.test(scholarship.funding_type ?? "")) {
    score += WEIGHTS.fundingType;
    matchedCriteria.push("funding preference");
  }

  if (normalizedIncludes(scholarship.country, profile.preferredCountry)) {
    score += WEIGHTS.country;
    matchedCriteria.push("preferred country");
  }

  if (normalizedIncludes(scholarship.field_of_study, profile.fieldOfStudy)) {
    score += WEIGHTS.fieldOfStudy;
    matchedCriteria.push("field of study");
  }

  const targetGroupCandidates = [...profile.targetGroups, profile.gender === "Woman" ? "Women" : null].filter(
    (v): v is string => Boolean(v)
  );
  if (targetGroupCandidates.some((tg) => normalizedIncludes(scholarship.target_group, tg))) {
    score += WEIGHTS.targetGroup;
    matchedCriteria.push("target group");
  }

  return { score, matchedCriteria };
}

/**
 * Ranks candidate scholarships against the profile. Excludes expired
 * scholarships. Sorted by score (descending), then by soonest deadline
 * as a tiebreaker among equally-scored results.
 *
 * `explanation` is left empty here — populated by the Explanation
 * Engine (explanationEngine.ts), which is intentionally a separate
 * module per the deliverables list, even though it consumes this
 * function's output directly.
 */
export function rankScholarships(scholarships: Scholarship[], profile: ApplicantProfile): RankedScholarship[] {
  return scholarships
    .filter(isDeadlineValid)
    .map((scholarship) => {
      const { score, matchedCriteria } = scoreScholarship(scholarship, profile);
      return { scholarship, score, matchedCriteria, explanation: "" };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const aDeadline = a.scholarship.deadline ? new Date(a.scholarship.deadline).getTime() : Infinity;
      const bDeadline = b.scholarship.deadline ? new Date(b.scholarship.deadline).getTime() : Infinity;
      return aDeadline - bDeadline;
    });
}