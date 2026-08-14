/**
 * ES-006B — SOP Builder: data model.
 *
 * New, independent module — same pattern as cv-builder/. Not added to
 * src/types.ts (ES-004-locked); the SOP Builder has its own
 * self-contained types.
 *
 * Unlike the CV Builder's structured, repeatable entries, an SOP is
 * six narrative paragraphs — the guidance offered per section is
 * static, fixed prompt text (a question to think about), never
 * AI-generated or AI-rewritten content, per this phase's explicit
 * scope boundary.
 */

export type SOPStepId =
  | "hook"
  | "academicBackground"
  | "motivation"
  | "programFit"
  | "goals"
  | "conclusion";

export interface SOPData {
  hook: string;
  academicBackground: string;
  motivation: string;
  programFit: string;
  goals: string;
  conclusion: string;
}

export type SOPTemplateId = "academic" | "research" | "professional";

export interface SOPStepMeta {
  id: SOPStepId;
  label: string;
  guidingQuestion: string;
  placeholder: string;
  suggestedWordRange: [number, number];
}

export const SOP_STEPS: SOPStepMeta[] = [
  {
    id: "hook",
    label: "Opening Hook",
    guidingQuestion: "What moment, realization, or experience first drew you to this field? Start with something specific and true, not a general statement.",
    placeholder: "e.g. The first time I saw a solar-powered water pump running in my village, I realized engineering could solve problems I'd grown up watching my community face...",
    suggestedWordRange: [50, 120],
  },
  {
    id: "academicBackground",
    label: "Academic Background",
    guidingQuestion: "What in your academic history — coursework, projects, research, a turning-point class — prepared you for this next step?",
    placeholder: "Describe the academic path that led you here, including specific courses, projects, or achievements relevant to this field.",
    suggestedWordRange: [100, 200],
  },
  {
    id: "motivation",
    label: "Motivation & Field Interest",
    guidingQuestion: "Why this specific field, not a related one? What sustains your interest beyond the initial spark?",
    placeholder: "Explain what genuinely draws you to this field and how your interest has deepened or evolved over time.",
    suggestedWordRange: [100, 200],
  },
  {
    id: "programFit",
    label: "Why This Program",
    guidingQuestion: "What specifically about this program, university, or scholarship makes it the right fit — faculty, curriculum, resources, values?",
    placeholder: "Be specific: name what about this particular program aligns with your goals, not generic praise.",
    suggestedWordRange: [100, 200],
  },
  {
    id: "goals",
    label: "Career Goals",
    guidingQuestion: "What do you plan to do with this degree, concretely, in the short and long term — and how does it connect back to where you're from?",
    placeholder: "Describe your career trajectory and, where relevant, how you intend to give back or apply this work.",
    suggestedWordRange: [80, 150],
  },
  {
    id: "conclusion",
    label: "Conclusion",
    guidingQuestion: "How do you want to leave the reader feeling? Reconnect briefly to your opening hook.",
    placeholder: "A short closing paragraph that ties your story together and reaffirms your readiness for this opportunity.",
    suggestedWordRange: [40, 100],
  },
];

export function createEmptySOP(): SOPData {
  return {
    hook: "",
    academicBackground: "",
    motivation: "",
    programFit: "",
    goals: "",
    conclusion: "",
  };
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}