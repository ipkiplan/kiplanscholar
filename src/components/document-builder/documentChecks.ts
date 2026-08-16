import { SOP_STEPS, SOPData, countWords } from "../sop-builder/sopTypes";
import { CV_STEPS } from "../cv-builder/emptyCV";
import { CVData } from "../cv-builder/cvTypes";
import { LOR_SECTIONS, LORData } from "../lor-builder/lorTypes";
import { ML_SECTIONS, MLData } from "../motivation-letter-builder/mlTypes";

/**
 * Review My Draft — deterministic check logic.
 *
 * IMPORTANT: these are structural/completeness checks only — word
 * counts, empty-section detection, suggested-range comparison. They
 * are NOT a writing-quality evaluation and must never be presented as
 * one. Nothing here reads for grammar, tone, coherence, or meaning;
 * it only looks at whether content exists and roughly how much.
 *
 * Pure functions, no React, no side effects, no localStorage access
 * (the caller reads storage and passes the parsed data in) — kept
 * separate from ReviewDraftPanel.tsx so the logic is independently
 * testable and the panel stays a thin rendering layer.
 */

export interface DocumentFinding {
  id: string;
  title: string;
  message: string;
  /** Present only when the finding can jump the user directly to that step in the open builder. */
  sectionId?: string;
  actionLabel?: string;
}

function isBlank(value: string | undefined | null): boolean {
  return !value || value.trim().length === 0;
}

// ---------------------------------------------------------------------
// SOP — six narrative sections, all expected, each with a suggested
// word range already defined in sopTypes.ts.
// ---------------------------------------------------------------------
export function checkSOPDraft(data: SOPData): DocumentFinding[] {
  const findings: DocumentFinding[] = [];
  for (const step of SOP_STEPS) {
    const value = data[step.id];
    const [min] = step.suggestedWordRange;
    if (isBlank(value)) {
      findings.push({
        id: `sop-${step.id}-empty`,
        title: `${step.label} needs your input`,
        message: `This section is still empty. Consider: ${step.guidingQuestion}`,
        sectionId: step.id,
        actionLabel: `Go to ${step.label}`,
      });
    } else {
      const words = countWords(value);
      if (words < min) {
        findings.push({
          id: `sop-${step.id}-short`,
          title: `${step.label} is quite short`,
          message: `${words} words so far — the suggested range is ${step.suggestedWordRange[0]}–${step.suggestedWordRange[1]}. There may be room to add more detail here.`,
          sectionId: step.id,
          actionLabel: `Go to ${step.label}`,
        });
      }
    }
  }
  return findings;
}

// ---------------------------------------------------------------------
// Motivation Letter — same pattern as SOP, using ML_SECTIONS' own
// recommendedWordRange.
// ---------------------------------------------------------------------
export function checkMLDraft(data: MLData): DocumentFinding[] {
  const findings: DocumentFinding[] = [];
  for (const section of ML_SECTIONS) {
    const value = data[section.id];
    const [min] = section.recommendedWordRange;
    if (isBlank(value)) {
      findings.push({
        id: `ml-${section.id}-empty`,
        title: `${section.label} needs your input`,
        message: `This section is still empty. ${section.objective}`,
        sectionId: section.id,
        actionLabel: `Go to ${section.label}`,
      });
    } else {
      const words = countWords(value);
      if (words < min) {
        findings.push({
          id: `ml-${section.id}-short`,
          title: `${section.label} is quite short`,
          message: `${words} words so far — the suggested range is ${section.recommendedWordRange[0]}–${section.recommendedWordRange[1]}. There may be room to add more detail here.`,
          sectionId: section.id,
          actionLabel: `Go to ${section.label}`,
        });
      }
    }
  }
  return findings;
}

// ---------------------------------------------------------------------
// LOR — section-level check: a section is flagged only if every one
// of its fields is blank, since fields within a section are mostly
// short factual entries rather than a single narrative block.
// ---------------------------------------------------------------------
export function checkLORDraft(data: LORData): DocumentFinding[] {
  const findings: DocumentFinding[] = [];
  for (const section of LOR_SECTIONS) {
    const allBlank = section.fields.every((f) => isBlank(data[f.key] as string));
    if (allBlank) {
      findings.push({
        id: `lor-${section.id}-empty`,
        title: `${section.label} needs your input`,
        message: `This section doesn't have any details yet. Consider adding what you can before your recommender finalizes the letter.`,
        sectionId: section.id,
        actionLabel: `Go to ${section.label}`,
      });
    }
  }
  return findings;
}

// ---------------------------------------------------------------------
// CV — array-based sections, type-aware. Only the two sections the
// builder itself marks as non-optional (personal, education) are
// flagged when empty; the rest (work experience, publications,
// awards, etc.) are genuinely optional for many applicants and are
// intentionally not flagged, to avoid a discouraging wall of findings
// for sections a first-time applicant may not have yet.
// ---------------------------------------------------------------------
export function checkCVDraft(data: CVData): DocumentFinding[] {
  const findings: DocumentFinding[] = [];

  const personalMissing = isBlank(data.personalInfo.fullName) || isBlank(data.personalInfo.email);
  if (personalMissing) {
    const step = CV_STEPS.find((s) => s.id === "personal");
    findings.push({
      id: "cv-personal-empty",
      title: "Personal Information needs your input",
      message: "Your name and email are still missing — these are needed for reviewers to know whose CV this is.",
      sectionId: "personal",
      actionLabel: `Go to ${step?.label ?? "Personal Information"}`,
    });
  }

  if (data.education.length === 0) {
    const step = CV_STEPS.find((s) => s.id === "education");
    findings.push({
      id: "cv-education-empty",
      title: "Education needs your input",
      message: "No education entries yet. This is one of the two sections every CV needs.",
      sectionId: "education",
      actionLabel: `Go to ${step?.label ?? "Education"}`,
    });
  }

  return findings;
}

// ---------------------------------------------------------------------
// "Does a real draft exist" detection — type-aware, because not every
// builder tracks an explicit save the same way. SOP/LOR/Motivation
// Letter Builder all have a distinct "Save Draft" action with its own
// lastSavedAt timestamp, which is the clearest signal that the user
// has genuinely saved something (as opposed to the silent, continuous
// auto-persist effect every builder runs on every render, which would
// otherwise make an untouched, empty draft look identical to a real
// one). CV Builder currently has no equivalent explicit-save concept
// at all, so for CV specifically this checks for any genuine,
// non-default content instead.
// ---------------------------------------------------------------------
export function hasMeaningfulSOPDraft(lastSavedAt: string | null | undefined): boolean {
  return lastSavedAt != null;
}

export function hasMeaningfulLORDraft(lastSavedAt: string | null | undefined): boolean {
  return lastSavedAt != null;
}

export function hasMeaningfulMLDraft(lastSavedAt: string | null | undefined): boolean {
  return lastSavedAt != null;
}

export function hasMeaningfulCVDraft(data: CVData): boolean {
  return (
    !isBlank(data.personalInfo?.fullName) ||
    !isBlank(data.summary) ||
    data.education.length > 0 ||
    data.workExperience.length > 0 ||
    data.researchExperience.length > 0 ||
    data.publications.length > 0 ||
    data.awards.length > 0 ||
    data.skills.length > 0
  );
}

// ---------------------------------------------------------------------
// Pasted external text — no structural mapping to a builder's fields
// exists, so checks stay honestly general: overall length only.
// ---------------------------------------------------------------------
export function checkPastedText(text: string, docLabel: string): DocumentFinding[] {
  const words = countWords(text);
  if (words === 0) {
    return [
      {
        id: "paste-empty",
        title: "Nothing to check yet",
        message: `Paste your ${docLabel} draft above to see a few general checks.`,
      },
    ];
  }
  if (words < 50) {
    return [
      {
        id: "paste-short",
        title: "This looks quite short",
        message: `${words} words total. A complete ${docLabel} is usually considerably longer — there may be more to add.`,
      },
    ];
  }
  return [
    {
      id: "paste-ok",
      title: "Basic length check passed",
      message: `${words} words total. This is only a general length check — pasted text can't be checked section by section the way a KIPLANScholar draft can.`,
    },
  ];
}