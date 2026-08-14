/**
 * ES-005C — Applicant Profile Engine.
 *
 * Transforms information gathered through conversation into a
 * structured ApplicantProfile, per the Primary Objective. Two input
 * sources are combined:
 *
 *  1. Structured answers already collected by the Conversation Engine
 *     (ES-005B) — e.g. quick-reply answers to "What's your current or
 *     intended level of study?". These are higher-confidence: the
 *     question that produced them is known, so the mapping is exact.
 *
 *  2. Free-text scanning of the user's raw messages — deterministic
 *     pattern/keyword matching only (regex-based). This is NOT an AI
 *     model and makes no probabilistic judgment; it either finds an
 *     explicit, literal signal (e.g. "IELTS 6.5", "3 years of work
 *     experience") or it leaves the field null. This exists because a
 *     student may state several profile facts in one free-form message
 *     (per the Primary Objective's example) before or outside the
 *     Conversation Engine's own structured questions.
 *
 * Every extractor here is intentionally conservative: it only ever
 * sets a field when it found a literal, explicit textual signal, never
 * an inference. This mirrors the Product Constitution's Knowledge
 * Boundary Rule ("never invent... information") applied to profile
 * building itself, not just to scholarship search results.
 */

import {
  ApplicantProfile,
  EMPTY_APPLICANT_PROFILE,
  ConversationAnswers,
  ConversationMessageLike,
} from "./types";

// ---------------------------------------------------------------------------
// Structured-answer mapping (Source 1)
// ---------------------------------------------------------------------------

/**
 * Known ConversationContext.answers keys from ES-005B's journeys
 * (find-scholarships, understand-eligibility, improve-documents,
 * country-guidance), read here only as plain string data — this file
 * does not import conversationEngine.ts, so it has no dependency on
 * ES-005B's internals, only on the shape of the answers it produces.
 */
function applyStructuredAnswers(profile: ApplicantProfile, answers: ConversationAnswers): ApplicantProfile {
  const next = { ...profile };

  if (answers.educationLevel) {
    next.educationLevel = answers.educationLevel;
    if (!next.preferredDegree) next.preferredDegree = answers.educationLevel;
  }

  if (answers.field) {
    next.fieldOfStudy = answers.field;
  }

  if (answers.country && !isNonAnswer(answers.country)) {
    next.preferredCountry = answers.country;
  }

  if (answers.region && !isNonAnswer(answers.region) && !next.preferredCountry) {
    next.preferredCountry = answers.region;
  }

  if (answers.funding) {
    const normalized = normalizeFundingPreference(answers.funding);
    if (normalized) next.fundingPreference = normalized;
  }

  if (answers.background) {
    next.academicBackground = answers.background;
  }

  if (answers.target) {
    next.otherNotes = [...next.otherNotes, `Eligibility check target: ${answers.target}`];
  }

  if (answers.docType || answers.docStage) {
    const note = [answers.docType, answers.docStage].filter(Boolean).join(" — ");
    if (note) next.otherNotes = [...next.otherNotes, `Document guidance context: ${note}`];
  }

  if (answers.topic) {
    next.otherNotes = [...next.otherNotes, `Country guidance topic: ${answers.topic}`];
  }

  return next;
}

/** Quick-reply options that represent "no specific preference," not a literal value to filter on. */
function isNonAnswer(value: string): boolean {
  return /not sure|open to anywhere|help me compare|prefer not to say|still building/i.test(value);
}

function normalizeFundingPreference(raw: string): "Fully Funded" | "Partial Funding" | null {
  if (/fully funded/i.test(raw)) return "Fully Funded";
  if (/partial/i.test(raw)) return "Partial Funding";
  return null; // "Not sure yet" or anything unrecognized — leave unknown, not "no preference"
}

// ---------------------------------------------------------------------------
// Free-text extraction (Source 2) — deterministic regex only
// ---------------------------------------------------------------------------

const EDUCATION_LEVEL_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /\bpost\s*-?\s*doc(toral)?\b/i, label: "Postdoctoral" },
  { pattern: /\bphd\b|\bdoctorate\b|\bdoctoral\b/i, label: "PhD" },
  { pattern: /\bmaster'?s?\b|\bmsc\b|\bm\.?a\.?\b|\bmba\b/i, label: "Master's" },
  { pattern: /\bbachelor'?s?\b|\bundergraduate\b|\bbsc\b/i, label: "Bachelor's" },
  { pattern: /\bhigh school\b/i, label: "High School" },
];

const FIELD_OF_STUDY_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /engineering|technology|\btech\b/i, label: "Engineering & Technology" },
  { pattern: /computer science|software|\bai\b|artificial intelligence/i, label: "Computer Science" },
  { pattern: /medicine|medical|health(care)?/i, label: "Medicine & Health" },
  { pattern: /business|management|mba|finance|economics/i, label: "Business" },
  { pattern: /social science|sociology|political science/i, label: "Social Sciences" },
  { pattern: /agriculture|agricultural/i, label: "Agriculture" },
  { pattern: /climate|environment(al)?|sustainab/i, label: "Climate & Environment" },
  { pattern: /law\b|legal studies/i, label: "Law" },
  { pattern: /education\b|teaching/i, label: "Education" },
];

const COUNTRY_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /united states|\busa\b|\bus\b(?!\w)/i, label: "United States" },
  { pattern: /united kingdom|\buk\b/i, label: "United Kingdom" },
  { pattern: /\baustralia\b/i, label: "Australia" },
  { pattern: /\bgermany\b/i, label: "Germany" },
  { pattern: /\bcanada\b/i, label: "Canada" },
  { pattern: /\bjapan\b/i, label: "Japan" },
  { pattern: /new zealand/i, label: "New Zealand" },
  { pattern: /netherlands|holland/i, label: "Netherlands" },
  { pattern: /\beurope\b/i, label: "Europe" },
];

const TARGET_GROUP_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /\bwomen\b|\bfemale applicants?\b/i, label: "Women" },
  { pattern: /entrepreneur/i, label: "Entrepreneurs" },
  { pattern: /researcher/i, label: "Researchers" },
  { pattern: /professional/i, label: "Professionals" },
  { pattern: /nepali|nepal\b/i, label: "Nepali Students" },
];

function extractWorkExperienceYears(text: string): number | null {
  const match = text.match(/(\d+(?:\.\d+)?)\s*\+?\s*years?\s*(?:of\s*)?(?:work\s*|professional\s*)?experience/i);
  if (!match) return null;
  const years = parseFloat(match[1]);
  return Number.isFinite(years) ? years : null;
}

function extractEnglishProficiency(text: string): { test: "IELTS" | "TOEFL"; score: number } | null {
  const ielts = text.match(/ielts\D{0,5}(\d(?:\.\d)?)/i);
  if (ielts) {
    const score = parseFloat(ielts[1]);
    if (Number.isFinite(score)) return { test: "IELTS", score };
  }
  const toefl = text.match(/toefl\D{0,5}(\d{2,3})/i);
  if (toefl) {
    const score = parseFloat(toefl[1]);
    if (Number.isFinite(score)) return { test: "TOEFL", score };
  }
  return null;
}

/**
 * Gender is only ever captured from an explicit, first-person
 * self-statement — never inferred from name, phrasing, or any other
 * indirect signal. This is a sensitive attribute used solely to
 * surface target-group-specific scholarships (e.g. women-only grants);
 * absence of a match simply leaves it unknown.
 */
function extractGender(text: string): string | null {
  if (/\bi(?:'m| am)\s+a\s+woman\b|\bi(?:'m| am)\s+female\b/i.test(text)) return "Woman";
  if (/\bi(?:'m| am)\s+a\s+man\b|\bi(?:'m| am)\s+male\b/i.test(text)) return "Man";
  return null;
}

function matchFirst(text: string, patterns: Array<{ pattern: RegExp; label: string }>): string | null {
  const hit = patterns.find((p) => p.pattern.test(text));
  return hit ? hit.label : null;
}

function matchAll(text: string, patterns: Array<{ pattern: RegExp; label: string }>): string[] {
  return patterns.filter((p) => p.pattern.test(text)).map((p) => p.label);
}

function applyFreeTextExtraction(profile: ApplicantProfile, messages: ConversationMessageLike[]): ApplicantProfile {
  const next = { ...profile };
  const userText = messages
    .filter((m) => m.role === "user")
    .map((m) => m.text)
    .join(" \n ");

  if (!userText.trim()) return next;

  if (!next.educationLevel) {
    const level = matchFirst(userText, EDUCATION_LEVEL_PATTERNS);
    if (level) {
      next.educationLevel = level;
      if (!next.preferredDegree) next.preferredDegree = level;
    }
  }

  if (!next.fieldOfStudy) {
    const field = matchFirst(userText, FIELD_OF_STUDY_PATTERNS);
    if (field) next.fieldOfStudy = field;
  }

  if (!next.preferredCountry) {
    const country = matchFirst(userText, COUNTRY_PATTERNS);
    if (country) next.preferredCountry = country;
  }

  if (next.workExperienceYears === null) {
    next.workExperienceYears = extractWorkExperienceYears(userText);
  }

  if (!next.englishProficiency) {
    next.englishProficiency = extractEnglishProficiency(userText);
  }

  if (!next.fundingPreference) {
    if (/fully funded|full funding/i.test(userText)) next.fundingPreference = "Fully Funded";
    else if (/partial(ly)? fund/i.test(userText)) next.fundingPreference = "Partial Funding";
  }

  if (!next.gender) {
    next.gender = extractGender(userText);
  }

  const targetGroups = matchAll(userText, TARGET_GROUP_PATTERNS);
  if (targetGroups.length > 0) {
    next.targetGroups = Array.from(new Set([...next.targetGroups, ...targetGroups]));
  }

  return next;
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

/**
 * Builds a structured ApplicantProfile from the Conversation Engine's
 * collected answers plus the raw message history. Structured answers
 * are applied first (higher confidence, since the originating question
 * is known); free-text extraction then fills in anything still
 * missing without ever overwriting a structured answer.
 */
export function buildApplicantProfile(
  answers: ConversationAnswers,
  messages: ConversationMessageLike[]
): ApplicantProfile {
  let profile: ApplicantProfile = { ...EMPTY_APPLICANT_PROFILE, otherNotes: [] };
  profile = applyStructuredAnswers(profile, answers);
  profile = applyFreeTextExtraction(profile, messages);
  return profile;
}

/** True if the profile has at least one field a search could reasonably act on. */
export function hasActionableProfile(profile: ApplicantProfile): boolean {
  return Boolean(
    profile.educationLevel ||
      profile.preferredDegree ||
      profile.fieldOfStudy ||
      profile.preferredCountry ||
      profile.fundingPreference ||
      profile.targetGroups.length > 0 ||
      profile.researchInterests.length > 0
  );
}