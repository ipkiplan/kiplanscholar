/**
 * ES-006C — My Workspace: static card configuration.
 *
 * New, independent module. Every destination referenced below was
 * verified against the actual existing implementation before being
 * added here — see the ES-006C Completion Report for the specific
 * assumptions this required (CV Writing Guide has no existing
 * content). Visa Guide/Visa Preparation Hub's routing history is
 * covered in the ES-006D.1, ES-007A, and ES-007A.3 Completion Reports.
 *
 * This file holds configuration only — no logic, no state, no
 * duplication of anything already implemented in the builders,
 * Resources page, Visa Preparation Hub, or Navbar.
 */

export interface PlaceholderContent {
  title: string;
  category: string;
  description: string;
  comingSoonFeatures: string[];
}

export interface DocumentCardConfig {
  id: string;
  title: string;
  description: string;
  kind: "builder" | "placeholder";
  /** For kind "builder": the tab to navigate to (an already-existing, already-wired route). */
  targetTab?: string;
  /** For kind "builder": the localStorage key that builder already persists to — read-only, never written here. */
  storageKey?: string;
  /** For kind "placeholder": routed through the shared, already-standardized PlaceholderView. */
  placeholder?: PlaceholderContent;
}

export interface ResourceCardConfig {
  id: string;
  title: string;
  description: string;
  kind: "resource" | "tab" | "placeholder";
  /** For kind "resource": an id from the existing RESOURCES data array (src/data/scholarships.ts), routed the same way Navbar's existing "handleResourcePreset" already does. */
  resourcePresetId?: string;
  /** For kind "tab": the tab to navigate to directly (an already-existing, already-wired route) — same mechanism as DocumentCardConfig's "builder" kind above. */
  targetTab?: string;
  placeholder?: PlaceholderContent;
}

// ---------------------------------------------------------------------------
// My Documents (Version 1.0)
// ---------------------------------------------------------------------------

export const MY_DOCUMENTS: DocumentCardConfig[] = [
  {
    id: "cv",
    title: "CV / Resume",
    description: "Build a scholarship-ready academic CV, section by section.",
    kind: "builder",
    targetTab: "cv-builder",
    storageKey: "kiplan_cv_builder_draft",
  },
  {
    id: "sop",
    title: "Statement of Purpose",
    description: "Write your SOP with guided prompts for every section.",
    kind: "builder",
    targetTab: "sop-builder",
    storageKey: "kiplan_sop_builder_draft",
  },
  {
    id: "lor",
    title: "Letter of Recommendation",
    description: "Build a professional LOR with your recommender's details.",
    kind: "builder",
    targetTab: "lor-builder",
    storageKey: "kiplan_lor_builder_draft",
  },
  {
    id: "motivation-letter",
    title: "Motivation Letter",
    description: "Interactive writing coach, one section at a time.",
    kind: "builder",
    // ES-009 — now a real builder, matching CV/SOP/LOR Builder's
    // pattern. Previously a placeholder pointing at static blueprint
    // copy; see the ES-009 Completion Report.
    targetTab: "motivation-letter-builder",
    storageKey: "kiplan_ml_builder_draft",
  },
];

// ---------------------------------------------------------------------------
// Curated Resources (Version 1.0)
// ---------------------------------------------------------------------------

export const CURATED_RESOURCES: ResourceCardConfig[] = [
  {
    id: "cv-guide",
    title: "CV Writing Guide",
    description: "What to include, how to phrase achievements, and formatting standards.",
    kind: "resource",
    resourcePresetId: "res-cv",
  },
  {
    id: "sop-guide",
    title: "SOP Writing Guide",
    description: "Guidelines and a downloadable template for your Statement of Purpose.",
    kind: "resource",
    resourcePresetId: "res-sop",
  },
  {
    id: "lor-guide",
    title: "LOR Guide",
    description: "Guidelines and a downloadable template for a strong reference letter.",
    kind: "resource",
    resourcePresetId: "res-lor",
  },
  {
    id: "visa-prep-hub",
    title: "Visa Preparation Hub",
    description: "Country-by-country visa overview, categorized documents, and a downloadable PDF checklist.",
    kind: "tab",
    // ES-007A.3 — Workspace now leads to the same destination as the
    // Navbar's "Visa Preparation Hub" entry (visa-prep), replacing the
    // old resource-preset card. The legacy "res-visa-guide" resource
    // entry still exists in RESOURCES (src/data/scholarships.ts) and
    // remains reachable from the Resources page itself, but is no
    // longer the primary path to it from either Navbar or Workspace.
    targetTab: "visa-prep",
  },
  {
    id: "university-comparison",
    title: "University Comparison",
    description: "Compare universities side by side across key criteria.",
    kind: "tab",
    // ES-010 — new entry, same "tab" pattern established for Visa
    // Preparation Hub above. (Note: Scholarship Calendar, ES-008, was
    // never added to Workspace — that's a pre-existing gap in a prior
    // ES, not introduced or fixed here; flagged in the ES-010
    // Completion Report as a candidate follow-up, out of this ES's
    // scope to correct unprompted.)
    targetTab: "university-comparison",
  },
  {
    id: "scholarship-checklist",
    title: "Scholarship Checklist",
    description: "Document portfolio and preparation checklist for your applications.",
    kind: "resource",
    resourcePresetId: "res-checklist",
  },
  {
    id: "interview-prep",
    title: "Interview Preparation",
    description: "Common panel questions, the STAR technique, and remote-interview setup tips.",
    kind: "resource",
    resourcePresetId: "res-interview-prep",
  },
  {
    id: "blog",
    title: "Blog",
    description: "Success stories and step-by-step processing guides.",
    kind: "placeholder",
    // Identical content to the existing Navbar "Blog" entry.
    placeholder: {
      title: "KIPLANScholar Academic Blog",
      category: "Blog",
      description: "Expert articles, interview transcripts with Chevening and Fulbright alumni from Nepal, and visa attestation guides.",
      comingSoonFeatures: [
        "Success story interviews with Nepali scholars",
        "Kathmandu passport & visa processing walk-throughs",
        "English proficiency test (IELTS vs PTE) reviews",
        "Housing and bank blocked account tutorials",
      ],
    },
  },
];