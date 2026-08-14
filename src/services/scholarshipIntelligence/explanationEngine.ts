/**
 * ES-005C — Explanation Engine.
 *
 * Step 5 of the Intelligence Layer pipeline: "Explain why each
 * scholarship matches the applicant's profile."
 *
 * Every sentence produced here is built by substituting real database
 * field values and real `matchedCriteria` labels (from the Ranking
 * Engine) into fixed templates — there is no free generation, so
 * nothing can be invented. Language is deliberately hedged ("may be a
 * good fit," never "you are eligible" or "you will be accepted") per
 * the Product Constitution's Knowledge Boundary Rule: the Assistant
 * must never promise scholarship approval, admission, funding, or
 * success, and must never present unavailable details as facts.
 */

import { ApplicantProfile, RankedScholarship, SearchContext } from "./types";

const CRITERION_PHRASES: Record<string, string> = {
  "degree level": "your intended degree level",
  "funding preference": "your preference for fully-funded support",
  "preferred country": "your preferred study destination",
  "field of study": "your field of study",
  "target group": "the group this opportunity is designed for",
};

function describeCriteria(matchedCriteria: string[]): string {
  const phrases = matchedCriteria.map((c) => CRITERION_PHRASES[c] ?? c);
  if (phrases.length === 0) return "";
  if (phrases.length === 1) return phrases[0];
  if (phrases.length === 2) return `${phrases[0]} and ${phrases[1]}`;
  return `${phrases.slice(0, -1).join(", ")}, and ${phrases[phrases.length - 1]}`;
}

/**
 * Builds the explanation for one ranked scholarship. Only ever
 * references fields actually present on the row and criteria the
 * Ranking Engine actually matched — nothing here is inferred or
 * assumed beyond what's in `scholarship` and `matchedCriteria`.
 */
export function explainMatch(ranked: RankedScholarship): string {
  const { scholarship, matchedCriteria } = ranked;
  const name = scholarship.title;
  const org = scholarship.organization;

  if (matchedCriteria.length === 0) {
    // Included as a general/candidate result, not a profile match —
    // say so honestly rather than inventing a reason.
    return `${name} (${org}) is a currently open opportunity, shown here as a general option since it didn't specifically match the details you've shared so far. Please check the official eligibility criteria before applying.`;
  }

  const criteriaText = describeCriteria(matchedCriteria);
  return `${name} (${org}) may be a good fit based on ${criteriaText}. As always, please verify the exact eligibility requirements and deadline on the official listing before applying.`;
}

export function explainAllMatches(ranked: RankedScholarship[]): RankedScholarship[] {
  return ranked.map((r) => ({ ...r, explanation: explainMatch(r) }));
}

/**
 * Per the Primary Objective: "If no suitable scholarship exists, it
 * must clearly say so." No hedging into a fabricated near-match, no
 * silent empty state — a direct, honest statement plus a concrete,
 * real next step (the existing Explore Opportunities / Countries
 * features), matching the Product Constitution's honesty and UX
 * principles.
 */
export function explainNoMatches(profile: ApplicantProfile, searchContext: SearchContext, dbError: string | null): string {
  if (dbError) {
    return `I wasn't able to search verified scholarship data just now (${dbError}). I don't want to guess, so please try again shortly, or explore opportunities directly using Explore Opportunities.`;
  }

  const knownCriteria = [
    searchContext.degreeLevel ? `degree level (${searchContext.degreeLevel})` : null,
    searchContext.fieldOfStudy ? `field of study (${searchContext.fieldOfStudy})` : null,
    searchContext.country ? `country (${searchContext.country})` : null,
    searchContext.fundingType ? "fully-funded preference" : null,
    searchContext.targetGroup ? `target group (${searchContext.targetGroup})` : null,
  ].filter((v): v is string => Boolean(v));

  if (knownCriteria.length === 0) {
    return "I don't currently have enough information from our conversation to search for specific matches, and I couldn't find any general open opportunities to show right now. You're welcome to explore verified scholarships directly using Explore Opportunities.";
  }

  return `I couldn't find a verified scholarship in our database that matches ${knownCriteria.join(
    ", "
  )} right now. That doesn't necessarily mean nothing is available — our database may not yet have a matching listing, or the right opportunity may use slightly different criteria. I'd recommend browsing Explore Opportunities directly, and checking back as new scholarships are added.`;
}