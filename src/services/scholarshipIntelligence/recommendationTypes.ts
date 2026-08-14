/**
 * Recommendation Types — internal infrastructure types for the
 * retrieval stage of the Intelligence Engine pipeline.
 *
 * Per Chief Architect review (ES-005E): this is NOT a new peer
 * architectural layer alongside Conversation Engine / Intelligence
 * Engine / Assistant Orchestrator. It is data-preparation
 * infrastructure inside the existing, locked Intelligence Engine —
 * the same conceptual tier as Query Builder. It owns no business
 * decision (no ranking, no explanation, no conversation logic).
 */

import { Scholarship } from "../../lib/scholarships";

/**
 * A single retrieved-but-not-yet-evaluated record. Carries only
 * retrieval metadata — no score, no explanation, no rank. Ranking and
 * Explanation remain the only modules that ever add those.
 */
export interface RecommendationCandidate {
  scholarship: Scholarship;
  retrievedAt: string;
}

/**
 * The raw output of the retrieval step, before data hygiene
 * (dedup/validation) is applied. `error` is surfaced verbatim from
 * the Query Builder — never swallowed, never replaced with invented
 * data, consistent with the rest of this pipeline.
 */
export interface RecommendationResult {
  candidates: RecommendationCandidate[];
  error: string | null;
}