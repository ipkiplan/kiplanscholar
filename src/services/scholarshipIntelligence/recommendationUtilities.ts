/**
 * Recommendation Utilities — small, pure helpers shared by
 * recommendationService.ts and recommendationFormatter.ts. No
 * orchestration, no I/O, no business decision. Exists only so those
 * two files don't each reimplement the same few lines.
 */

import { Scholarship } from "../../lib/scholarships";
import { RecommendationCandidate } from "./recommendationTypes";

/** Removes duplicate records by id, keeping the first occurrence. */
export function dedupeById(candidates: RecommendationCandidate[]): RecommendationCandidate[] {
  const seen = new Set<string>();
  const result: RecommendationCandidate[] = [];
  for (const candidate of candidates) {
    if (seen.has(candidate.scholarship.id)) continue;
    seen.add(candidate.scholarship.id);
    result.push(candidate);
  }
  return result;
}

/**
 * True only if the record has the minimum fields needed to be shown
 * or reasoned about at all. This is a data-integrity check, not an
 * eligibility or quality judgment — those remain Ranking Engine's job.
 */
export function hasRequiredFields(scholarship: Scholarship): boolean {
  return Boolean(
    scholarship.id &&
      scholarship.title &&
      scholarship.title.trim().length > 0 &&
      scholarship.organization &&
      scholarship.degree_level
  );
}

/**
 * Normalizes optional text fields so downstream consumers (Ranking
 * Engine, Explanation Engine) always see either a real string or
 * `null` — never `undefined`, empty-but-whitespace, or inconsistent
 * casing artifacts from the database. Changes formatting only, never
 * the substance of a field's value.
 */
export function normalizeScholarship(scholarship: Scholarship): Scholarship {
  const cleanNullable = (value: string | null): string | null => {
    if (value === null || value === undefined) return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  };

  return {
    ...scholarship,
    field_of_study: cleanNullable(scholarship.field_of_study),
    target_group: cleanNullable(scholarship.target_group),
    eligibility: cleanNullable(scholarship.eligibility),
    benefits: cleanNullable(scholarship.benefits),
    description: cleanNullable(scholarship.description),
    application_url: cleanNullable(scholarship.application_url),
  };
}