/**
 * ES-005C — Scholarship Intelligence Layer: shared types.
 *
 * This module (and everything under scholarshipIntelligence/) is
 * intentionally independent of the Chat UI (ES-005A) and the
 * Conversation Engine (ES-005B). It does not import from either —
 * only from the locked Supabase schema (src/lib/scholarships.ts,
 * src/lib/supabase.ts), which it reads but never modifies.
 *
 * Where this layer needs conversation data, it accepts plain,
 * duck-typed inputs (see ConversationAnswers / ConversationMessageLike
 * below) instead of importing ConversationContext/Message from
 * ES-005B/A directly. That keeps the dependency direction one-way
 * (Intelligence Layer → nothing UI-related) so a future AI provider
 * can replace the internals here without the Chat UI or Conversation
 * Engine ever needing to change.
 */

/** Duck-typed mirror of ConversationEngine's ConversationContext.answers — not imported, just shape-compatible. */
export type ConversationAnswers = Record<string, string>;

/** Duck-typed mirror of a single chat message — role/text only, nothing else needed. */
export interface ConversationMessageLike {
  role: "assistant" | "user";
  text: string;
}

// ---------------------------------------------------------------------------
// 1. Applicant Profile
// ---------------------------------------------------------------------------

export interface EnglishProficiency {
  test: "IELTS" | "TOEFL" | "Other";
  score: number;
}

/**
 * Structured applicant profile. Every field is nullable/empty by
 * default — the engine never guesses a value it did not actually see
 * in the conversation. A null/empty field means "unknown," not "no
 * preference" and not "false" — downstream engines must not treat
 * missing data as a negative signal.
 */
export interface ApplicantProfile {
  educationLevel: string | null;
  fieldOfStudy: string | null;
  academicBackground: string | null;
  workExperienceYears: number | null;
  englishProficiency: EnglishProficiency | null;
  preferredCountry: string | null;
  preferredDegree: string | null;
  fundingPreference: "Fully Funded" | "Partial Funding" | null;
  researchInterests: string[];
  gender: string | null;
  targetGroups: string[];
  /** Raw fragments captured but not confidently classified into a field above — kept for transparency, never surfaced to the user as fact. */
  otherNotes: string[];
}

export const EMPTY_APPLICANT_PROFILE: ApplicantProfile = {
  educationLevel: null,
  fieldOfStudy: null,
  academicBackground: null,
  workExperienceYears: null,
  englishProficiency: null,
  preferredCountry: null,
  preferredDegree: null,
  fundingPreference: null,
  researchInterests: [],
  gender: null,
  targetGroups: [],
  otherNotes: [],
};

// ---------------------------------------------------------------------------
// 2. Search Context
// ---------------------------------------------------------------------------

/**
 * Translates the applicant profile into database-shaped search intent.
 * Fields here map directly to columns on the locked `scholarships`
 * table (src/lib/scholarships.ts) — this is the seam between "what we
 * understand about the applicant" and "what we ask the database."
 */
export interface SearchContext {
  degreeLevel: string | null;
  country: string | null;
  fieldOfStudy: string | null;
  fundingType: "Fully Funded" | null;
  targetGroup: string | null;
  /** Free-text keywords (e.g. research interests) used for a broad ilike search across title/description/eligibility, since these have no dedicated column. */
  freeTextTerms: string[];
}

// ---------------------------------------------------------------------------
// 3–5. Query / Ranking / Explanation results
// ---------------------------------------------------------------------------

export interface RankedScholarship {
  scholarship: import("../../lib/scholarships").Scholarship;
  score: number;
  matchedCriteria: string[];
  explanation: string;
}

export interface IntelligenceResult {
  profile: ApplicantProfile;
  searchContext: SearchContext;
  matches: RankedScholarship[];
  /** Assistant-facing summary text — either a framed list of matches or an honest "no suitable scholarship" statement. Never fabricated. */
  summaryMessage: string;
  /** Surfaced verbatim if the database query itself failed — never silently swallowed and replaced with invented data. */
  error: string | null;
}