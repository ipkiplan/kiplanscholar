/**
 * Recommendation formatting — pure data hygiene on raw retrieval
 * results. Deduplicates, drops malformed records, normalizes optional
 * text fields. No scoring, no explanation text, no UI formatting.
 *
 * Deliberately outputs plain Scholarship[] — not a new wrapper type —
 * specifically so Ranking Engine's signature never has to change.
 */

import { Scholarship } from "../../lib/scholarships";
import { RecommendationResult } from "./recommendationTypes";
import { dedupeById, hasRequiredFields, normalizeScholarship } from "./recommendationUtilities";

export function formatRecommendationCandidates(result: RecommendationResult): Scholarship[] {
  return dedupeById(result.candidates)
    .map((candidate) => candidate.scholarship)
    .filter(hasRequiredFields)
    .map(normalizeScholarship);
}