/**
 * Recommendation retrieval — calls the existing, unchanged Query
 * Builder and wraps its result. This is the only I/O in this module
 * set. It does not rank, explain, make conversation decisions, format
 * UI messages, or touch chat state — per Chief Architect review, this
 * is infrastructure inside the Intelligence Engine, not a new
 * business-facing layer.
 */

import { queryScholarships } from "./queryBuilder";
import { SearchContext } from "./types";
import { RecommendationResult } from "./recommendationTypes";

export async function retrieveRecommendationCandidates(context: SearchContext): Promise<RecommendationResult> {
  const { data, error } = await queryScholarships(context);

  if (error) {
    return { candidates: [], error };
  }

  const retrievedAt = new Date().toISOString();
  return {
    candidates: (data ?? []).map((scholarship) => ({ scholarship, retrievedAt })),
    error: null,
  };
}