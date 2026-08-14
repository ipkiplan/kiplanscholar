/**
 * ES-006C — reads the CV and SOP builders' own localStorage drafts to
 * compute a simple status for the workspace cards. This is read-only
 * inspection of already-existing, already-persisted data — it does
 * not modify, import, or duplicate any logic from useCVBuilder.ts or
 * useSOPBuilder.ts. If either builder's storage shape ever changes,
 * only this file needs updating, not the builders themselves.
 */

export type DocumentStatus = "not-started" | "in-progress";

export interface DocumentStatusInfo {
  status: DocumentStatus;
  lastUpdated: string | null;
}

const NOT_STARTED: DocumentStatusInfo = { status: "not-started", lastUpdated: null };

function safeParse(raw: string | null): Record<string, unknown> | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function hasNonEmptyString(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function getCVStatus(): DocumentStatusInfo {
  const parsed = safeParse(localStorage.getItem("kiplan_cv_builder_draft"));
  const data = parsed?.data as Record<string, unknown> | undefined;
  if (!data) return NOT_STARTED;

  const personalInfo = data.personalInfo as Record<string, unknown> | undefined;
  const listSectionKeys = [
    "education", "workExperience", "researchExperience", "publications", "conferences",
    "awards", "scholarships", "leadership", "volunteering", "certifications", "languages", "references",
  ];
  const hasListContent = listSectionKeys.some((key) => Array.isArray(data[key]) && (data[key] as unknown[]).length > 0);
  const hasSkills = Array.isArray(data.skills) && (data.skills as unknown[]).length > 0;
  const hasContent =
    hasNonEmptyString(personalInfo?.fullName) || hasNonEmptyString(data.summary) || hasListContent || hasSkills;

  // CV Builder does not currently persist a "last saved at" timestamp
  // (unlike SOP Builder) — lastUpdated is honestly reported as
  // unavailable rather than guessed.
  return { status: hasContent ? "in-progress" : "not-started", lastUpdated: null };
}

function getSOPStatus(): DocumentStatusInfo {
  const parsed = safeParse(localStorage.getItem("kiplan_sop_builder_draft"));
  const data = parsed?.data as Record<string, unknown> | undefined;
  if (!data) return NOT_STARTED;

  const hasContent = Object.values(data).some((v) => hasNonEmptyString(v));
  const lastUpdated = typeof parsed?.lastSavedAt === "string" ? (parsed.lastSavedAt as string) : null;

  return { status: hasContent ? "in-progress" : "not-started", lastUpdated };
}

function getLORStatus(): DocumentStatusInfo {
  const parsed = safeParse(localStorage.getItem("kiplan_lor_builder_draft"));
  const data = parsed?.data as Record<string, unknown> | undefined;
  if (!data) return NOT_STARTED;

  const hasContent = Object.values(data).some((v) => hasNonEmptyString(v));
  const lastUpdated = typeof parsed?.lastSavedAt === "string" ? (parsed.lastSavedAt as string) : null;

  return { status: hasContent ? "in-progress" : "not-started", lastUpdated };
}

export function getDocumentStatus(storageKey: string): DocumentStatusInfo {
  try {
    if (storageKey === "kiplan_cv_builder_draft") return getCVStatus();
    if (storageKey === "kiplan_sop_builder_draft") return getSOPStatus();
    if (storageKey === "kiplan_lor_builder_draft") return getLORStatus();
    return NOT_STARTED;
  } catch {
    // localStorage unavailable (e.g. private browsing quota) — treat
    // as not started rather than throwing.
    return NOT_STARTED;
  }
}