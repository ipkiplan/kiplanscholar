/**
 * ES-005C — Scholarship Intelligence Layer: public entry point.
 *
 * Composes the pipeline:
 *   Applicant Profile Engine → Search Context → Query Builder →
 *   Recommendation Service (retrieval) → Recommendation Formatter
 *   (data hygiene) → Ranking Engine → Explanation Engine.
 *
 * ES-005E note: Recommendation Service/Formatter are internal
 * infrastructure additions to this existing pipeline (per Chief
 * Architect review) — not a new peer architectural layer. They sit
 * between Query Builder and Ranking Engine exactly as Query Builder
 * and Ranking Engine already did; nothing downstream of this file
 * (Assistant Orchestrator, Conversation Engine) is aware they exist,
 * and Ranking Engine's input type is unchanged (still plain
 * Scholarship[]).
 *
 * This module is the intended integration seam for a future caller
 * (chat UI, a later ES-005 phase, or a different AI provider).
 * Everything below takes plain data in (answers + messages) and
 * returns plain data out (IntelligenceResult) — no dependency on
 * React, the Chat UI, or the Conversation Engine's internal types.
 */

import { buildApplicantProfile, hasActionableProfile } from "./applicantProfileEngine";
import { buildSearchContext } from "./searchContext";
import { queryScholarships } from "./queryBuilder";
import { retrieveRecommendationCandidates } from "./recommendationService";
import { formatRecommendationCandidates } from "./recommendationFormatter";
import { rankScholarships } from "./rankingEngine";
import { explainAllMatches, explainNoMatches } from "./explanationEngine";
import { ConversationAnswers, ConversationMessageLike, IntelligenceResult } from "./types";

function buildSummaryMessage(matchCount: number, personalized: boolean): string {
  if (matchCount === 0) {
    // Caller should prefer explainNoMatches() for the detailed version;
    // this is only a fallback label if matches is empty for any reason.
    return "I couldn't find any scholarships to show right now.";
  }
  const qualifier = personalized ? "that may fit what you've shared" : "currently open";
  return `Here ${matchCount === 1 ? "is" : "are"} ${matchCount} verified scholarship${
    matchCount === 1 ? "" : "s"
  } ${qualifier}. Please always confirm the details on the official listing before applying.`;
}

export async function findScholarshipsForApplicant(
  answers: ConversationAnswers,
  messages: ConversationMessageLike[]
): Promise<IntelligenceResult> {
  // 1. Applicant Profile Engine
  const profile = buildApplicantProfile(answers, messages);

  // 2. Search Context
  const searchContext = buildSearchContext(profile);

  // 3. Query Builder → Recommendation Service (retrieval) → Recommendation Formatter (data hygiene)
  const recommendationResult = await retrieveRecommendationCandidates(searchContext);

  if (recommendationResult.error) {
    return {
      profile,
      searchContext,
      matches: [],
      summaryMessage: explainNoMatches(profile, searchContext, recommendationResult.error),
      error: recommendationResult.error,
    };
  }

  const candidates = formatRecommendationCandidates(recommendationResult);

  // 4. Ranking Engine
  const ranked = rankScholarships(candidates, profile);

  // Personalized results are those that actually matched at least one
  // profile criterion; if the profile had nothing actionable at all,
  // whatever came back is a general/unfiltered list, not a match set —
  // label it honestly rather than presenting it as tailored guidance.
  const personalized = hasActionableProfile(profile) && ranked.some((r) => r.score > 0);
  const relevant = personalized ? ranked.filter((r) => r.score > 0) : ranked;

  if (relevant.length === 0) {
    return {
      profile,
      searchContext,
      matches: [],
      summaryMessage: explainNoMatches(profile, searchContext, null),
      error: null,
    };
  }

  // 5. Explanation Engine
  const explained = explainAllMatches(relevant);

  return {
    profile,
    searchContext,
    matches: explained,
    summaryMessage: buildSummaryMessage(explained.length, personalized),
    error: null,
  };
}

// Re-export the individual engines and types so a future caller (or
// tests) can use any stage independently without going through the
// full pipeline.
export * from "./types";
export { buildApplicantProfile, hasActionableProfile } from "./applicantProfileEngine";
export { buildSearchContext } from "./searchContext";
export { queryScholarships } from "./queryBuilder";
export { retrieveRecommendationCandidates } from "./recommendationService";
export { formatRecommendationCandidates } from "./recommendationFormatter";
export { rankScholarships } from "./rankingEngine";
export { explainMatch, explainAllMatches, explainNoMatches } from "./explanationEngine";