/**
 * ES-009 — Motivation Letter Builder: data model.
 *
 * New, independent module — same self-contained pattern as
 * cv-builder/, sop-builder/, lor-builder/. Not added to src/types.ts
 * (ES-004-locked).
 *
 * Reuses `countWords` from sop-builder/sopTypes.ts rather than
 * redefining it — it's a generic, content-free utility with nothing
 * SOP-specific about it, so importing it is genuine reuse, not a
 * cross-module coupling risk.
 *
 * Coaching content below (objective / writing advice / example
 * blueprint / common mistakes) is static, hand-authored guidance —
 * never generated, scored, or rewritten by this module. Templates
 * (MLTemplateId) change WHICH guidance is shown per section — never
 * the letter's structure, section order, or any inserted text. This
 * mirrors the ES's explicit "templates adjust guidance only" boundary,
 * which is a deliberate difference from SOP Builder's templates
 * (which vary the *preview's* visual style/section order) — see the
 * ES-009 Completion Report for the reasoning.
 */

export { countWords } from "../sop-builder/sopTypes";

export type MLSectionId =
  | "greeting"
  | "introduction"
  | "academicBackground"
  | "motivation"
  | "whyProgramme"
  | "whyInstitution"
  | "personalStrengths"
  | "careerGoals"
  | "closing";

export type MLData = Record<MLSectionId, string>;

export type MLTemplateId = "scholarship" | "universityAdmission" | "exchangeProgramme" | "researchFellowship";

export interface MLTemplateMeta {
  id: MLTemplateId;
  label: string;
  description: string;
}

export const ML_TEMPLATES: MLTemplateMeta[] = [
  { id: "scholarship", label: "Scholarship", description: "Guidance tuned for scholarship/funding applications" },
  { id: "universityAdmission", label: "University Admission", description: "Guidance tuned for degree program admission" },
  { id: "exchangeProgramme", label: "Exchange Programme", description: "Guidance tuned for study-abroad exchange applications" },
  { id: "researchFellowship", label: "Research Fellowship", description: "Guidance tuned for research fellowship applications" },
];

export interface MLSectionGuidance {
  writingAdvice: string;
  exampleBlueprint: string;
}

export interface MLSectionMeta {
  id: MLSectionId;
  label: string;
  objective: string;
  recommendedWordRange: [number, number];
  commonMistakes: string[];
  /** Per-template variants — this is the only thing a template changes. */
  guidance: Record<MLTemplateId, MLSectionGuidance>;
}

export const ML_SECTIONS: MLSectionMeta[] = [
  {
    id: "greeting",
    label: "Greeting",
    objective: "Open with an appropriate, professional salutation matching the audience and formality of this application.",
    recommendedWordRange: [5, 20],
    commonMistakes: [
      "Using an overly casual greeting (\"Hi\" or \"Hey\")",
      "Getting a named committee or panel's title wrong",
      "Skipping the greeting and jumping straight into the body",
    ],
    guidance: {
      scholarship: {
        writingAdvice: "Address the scholarship committee or selection panel by name if it's known; otherwise use a formal, general salutation.",
        exampleBlueprint: "Dear Members of the [Scholarship Name] Selection Committee,",
      },
      universityAdmission: {
        writingAdvice: "Address the admissions committee formally, and check the university's own application guidance for a preferred form.",
        exampleBlueprint: "Dear Admissions Committee,",
      },
      exchangeProgramme: {
        writingAdvice: "Address the programme coordinator or exchange office by title if it's named in the call for applications.",
        exampleBlueprint: "Dear Exchange Programme Selection Committee,",
      },
      researchFellowship: {
        writingAdvice: "Address the fellowship committee or, where appropriate, the specific supervisor you hope to work with.",
        exampleBlueprint: "Dear Professor [Name] and Fellowship Committee,",
      },
    },
  },
  {
    id: "introduction",
    label: "Introduction",
    objective: "Open with a specific, true moment or realization that connects you to this opportunity — not a general statement of interest.",
    recommendedWordRange: [80, 150],
    commonMistakes: [
      "Starting with \"My name is...\" or restating your CV",
      "Opening with a generic quote unrelated to your own story",
      "Trying to summarize your entire life in one paragraph",
    ],
    guidance: {
      scholarship: {
        writingAdvice: "Lead with a concrete moment that shows why funding this specific opportunity matters to you, not just why you deserve it.",
        exampleBlueprint: "Growing up in [town], I watched [specific challenge] shape my community's access to [field] — that is where my interest in [field] began.",
      },
      universityAdmission: {
        writingAdvice: "Lead with what drew you to this field specifically, grounded in a real experience rather than an abstract passion statement.",
        exampleBlueprint: "The first time I [specific experience], I realized [field] could address problems I had grown up seeing firsthand.",
      },
      exchangeProgramme: {
        writingAdvice: "Connect your opening to why cross-cultural or international study specifically matters to your growth, not just general academic interest.",
        exampleBlueprint: "My decision to study abroad began the day I [specific moment that sparked interest in another country, culture, or system].",
      },
      researchFellowship: {
        writingAdvice: "Open with the specific question or problem that first pulled you into this research area.",
        exampleBlueprint: "I first encountered [research question] while [specific project or course], and I have been trying to answer it ever since.",
      },
    },
  },
  {
    id: "academicBackground",
    label: "Academic Background",
    objective: "Show the academic path — courses, projects, achievements — that prepared you for this next step, without simply repeating your CV.",
    recommendedWordRange: [100, 180],
    commonMistakes: [
      "Listing courses and grades with no narrative connecting them",
      "Repeating your CV or transcript almost verbatim",
      "Omitting what you actually learned or how it changed your thinking",
    ],
    guidance: {
      scholarship: {
        writingAdvice: "Highlight the specific academic achievements most relevant to what this scholarship funds — not everything you've ever done.",
        exampleBlueprint: "During my Bachelor's in [field], my project on [topic] taught me [specific skill], which directly connects to why I am ready for this scholarship.",
      },
      universityAdmission: {
        writingAdvice: "Connect your academic history directly to this specific program's curriculum or faculty strengths.",
        exampleBlueprint: "My coursework in [subject] and my thesis on [topic] built the foundation this program's focus on [area] will let me build further.",
      },
      exchangeProgramme: {
        writingAdvice: "Emphasize academic readiness for a different educational system or teaching style, not just subject knowledge.",
        exampleBlueprint: "My training in [method/system] at [institution] has prepared me to adapt quickly to [host institution]'s different academic approach.",
      },
      researchFellowship: {
        writingAdvice: "Foreground specific research experience — methods used, findings, what you'd do differently — over general coursework.",
        exampleBlueprint: "My undergraduate research on [topic], using [method], produced [specific outcome], and left me with the question I want to pursue in this fellowship.",
      },
    },
  },
  {
    id: "motivation",
    label: "Motivation",
    objective: "Explain what genuinely draws you to this field, and why your interest is specific rather than general.",
    recommendedWordRange: [100, 180],
    commonMistakes: [
      "Vague claims like \"I am passionate about helping people\" with no specifics",
      "Explaining interest in the field but not why this field over related ones",
      "Motivation that doesn't connect to anything in your background",
    ],
    guidance: {
      scholarship: {
        writingAdvice: "Show how your motivation connects to the scholarship's own mission or values, not just your personal interest.",
        exampleBlueprint: "My commitment to [cause] is why a scholarship built around [scholarship's mission] resonated with me specifically.",
      },
      universityAdmission: {
        writingAdvice: "Explain why this field over adjacent ones — specificity is what separates genuine motivation from a generic personal statement.",
        exampleBlueprint: "I chose [specific field] over [related field] because [specific reason grounded in experience].",
      },
      exchangeProgramme: {
        writingAdvice: "Tie your motivation to what a different national or institutional context adds that home study cannot.",
        exampleBlueprint: "Studying [subject] in [host country] specifically matters because [country-specific reason: policy model, industry, research strength].",
      },
      researchFellowship: {
        writingAdvice: "Ground your motivation in the current state of the field — what's unresolved that you want to help answer.",
        exampleBlueprint: "What sustains my interest in [research area] is the unresolved question of [specific open problem].",
      },
    },
  },
  {
    id: "whyProgramme",
    label: "Why This Programme?",
    objective: "Name specific, concrete features of this program — faculty, curriculum, structure — that make it the right fit, not generic praise.",
    recommendedWordRange: [100, 180],
    commonMistakes: [
      "Praise that could apply to any program (\"world-class faculty\", \"excellent reputation\")",
      "Not naming a single specific course, module, or person",
      "Confusing this section with Why This Institution",
    ],
    guidance: {
      scholarship: {
        writingAdvice: "Connect the program's structure or funding priorities to your specific goals — show you understand what makes this scholarship's chosen program distinctive.",
        exampleBlueprint: "The [program]'s emphasis on [specific feature] matches directly with my plan to [specific goal].",
      },
      universityAdmission: {
        writingAdvice: "Name a specific course, module, or research group within the program that you can't easily get elsewhere.",
        exampleBlueprint: "I am drawn specifically to [Course/Module Name], which directly builds toward my planned focus on [topic].",
      },
      exchangeProgramme: {
        writingAdvice: "Focus on what this specific host program offers that your home program does not.",
        exampleBlueprint: "[Host Program]'s approach to [specific teaching method or focus area] is not something available at my home institution.",
      },
      researchFellowship: {
        writingAdvice: "Name the specific research group, lab, or supervisor whose work aligns with your own research question.",
        exampleBlueprint: "Professor [Name]'s work on [topic] at [Program] directly extends the question I want to pursue.",
      },
    },
  },
  {
    id: "whyInstitution",
    label: "Why This Institution?",
    objective: "Explain what specifically about this institution — beyond the program itself — supports your goals: resources, location, community, values.",
    recommendedWordRange: [80, 150],
    commonMistakes: [
      "Repeating what you already said about the program",
      "Praising rankings or prestige with no personal connection",
      "Nothing specific to this institution that couldn't apply to any similar one",
    ],
    guidance: {
      scholarship: {
        writingAdvice: "Connect the institution's values or mission to your own, especially if the scholarship is tied to a specific university.",
        exampleBlueprint: "[Institution]'s commitment to [value] mirrors the kind of environment where I do my best work.",
      },
      universityAdmission: {
        writingAdvice: "Reference specific institutional resources — research centers, industry links, student communities — relevant to you.",
        exampleBlueprint: "[Institution]'s [specific center/resource] would let me pursue [specific goal] in a way few other universities support.",
      },
      exchangeProgramme: {
        writingAdvice: "Focus on what makes this specific institution, not just this country, the right exchange destination.",
        exampleBlueprint: "Beyond studying in [country], [Institution] specifically offers [resource/community] that fits my exchange goals.",
      },
      researchFellowship: {
        writingAdvice: "Highlight institutional research infrastructure — labs, funding, collaborations — relevant to your specific project.",
        exampleBlueprint: "[Institution]'s [lab/facility/collaboration] gives me access to resources my current research cannot use.",
      },
    },
  },
  {
    id: "personalStrengths",
    label: "Personal Strengths",
    objective: "Demonstrate — through a specific example — the qualities that make you ready for this opportunity, rather than simply listing adjectives.",
    recommendedWordRange: [80, 150],
    commonMistakes: [
      "Listing traits (\"hardworking, dedicated, passionate\") with no evidence",
      "Choosing a strength unrelated to the opportunity",
      "Overstating achievements without concrete detail",
    ],
    guidance: {
      scholarship: {
        writingAdvice: "Choose a strength that speaks to your ability to make the most of limited funding and represent the scholarship well.",
        exampleBlueprint: "When [specific example], I demonstrated [strength], which is why I know I will make full use of this opportunity.",
      },
      universityAdmission: {
        writingAdvice: "Choose a strength that predicts success in this specific program's demands — independent research, teamwork, etc.",
        exampleBlueprint: "[Specific example] shows my ability to [strength], a skill this program's [feature] will demand.",
      },
      exchangeProgramme: {
        writingAdvice: "Emphasize adaptability, cross-cultural communication, or independence — qualities that predict success abroad.",
        exampleBlueprint: "[Specific example of adapting to a new environment] shows I can thrive outside my usual context.",
      },
      researchFellowship: {
        writingAdvice: "Emphasize intellectual persistence, problem-solving under uncertainty, or original thinking — evidenced by a specific research moment.",
        exampleBlueprint: "When my initial [method] failed, I [specific action], which shows the persistence this research requires.",
      },
    },
  },
  {
    id: "careerGoals",
    label: "Career Goals",
    objective: "Describe your concrete short- and long-term plans, and how this opportunity connects to them — including, where relevant, how you'll apply this back home.",
    recommendedWordRange: [80, 150],
    commonMistakes: [
      "Vague ambitions (\"make a difference\", \"be successful\") with no specifics",
      "Goals disconnected from the program you're applying to",
      "No mention of what happens after the program ends",
    ],
    guidance: {
      scholarship: {
        writingAdvice: "Many scholarship committees weigh a credible return/impact plan heavily — be concrete about what you'll do with the funding afterward.",
        exampleBlueprint: "After completing this program, I plan to [specific role/organization] in Nepal, applying [specific skill] to [specific challenge].",
      },
      universityAdmission: {
        writingAdvice: "Connect your post-graduation plans directly to what this specific program will have given you.",
        exampleBlueprint: "This program's focus on [area] will prepare me for [specific role or further study], my next concrete step.",
      },
      exchangeProgramme: {
        writingAdvice: "Describe how the exchange experience specifically will shape your path after you return.",
        exampleBlueprint: "The perspective and skills from studying at [host institution] will directly inform [specific plan] once I return.",
      },
      researchFellowship: {
        writingAdvice: "Describe the research trajectory this fellowship enables — the next project, publication, or application of the findings.",
        exampleBlueprint: "This fellowship's findings will feed directly into [next research step or professional application].",
      },
    },
  },
  {
    id: "closing",
    label: "Closing Statement",
    objective: "End with a confident, realistic conclusion that reconnects to your opening and reaffirms your readiness.",
    recommendedWordRange: [40, 100],
    commonMistakes: [
      "Introducing new information in the closing",
      "Overly dramatic or desperate-sounding conclusions",
      "A generic closing that could end any letter",
    ],
    guidance: {
      scholarship: {
        writingAdvice: "Close by reaffirming what you'll do with the opportunity, tying back to your opening story.",
        exampleBlueprint: "The [experience from your introduction] that first drew me to this field is the same drive I will bring to this scholarship.",
      },
      universityAdmission: {
        writingAdvice: "Close with quiet confidence — restate fit without repeating earlier paragraphs verbatim.",
        exampleBlueprint: "I am ready to bring this preparation and motivation to [Program], and I look forward to contributing to it.",
      },
      exchangeProgramme: {
        writingAdvice: "Close by expressing genuine readiness for the challenge of studying in a new environment.",
        exampleBlueprint: "I am ready for the challenge and growth that studying at [Host Institution] will bring.",
      },
      researchFellowship: {
        writingAdvice: "Close by reaffirming your commitment to the research question you opened with.",
        exampleBlueprint: "The question that led me to this fellowship is one I remain committed to answering, and I welcome the chance to pursue it here.",
      },
    },
  },
];

export function createEmptyML(): MLData {
  return {
    greeting: "",
    introduction: "",
    academicBackground: "",
    motivation: "",
    whyProgramme: "",
    whyInstitution: "",
    personalStrengths: "",
    careerGoals: "",
    closing: "",
  };
}

/** Static reference content (item 7 of the ES) — never per-template, never per-section; shown once in a dedicated panel. */
export const NEPAL_SPECIFIC_GUIDANCE: string[] = [
  "Maintain consistency across your CV, SOP, LOR, and Motivation Letter.",
  "Avoid plagiarism and copied templates.",
  "Use evidence instead of unsupported claims.",
  "Translate Nepali documents where required.",
  "Ensure dates, achievements, and academic history remain consistent throughout the application.",
  "Use professional English and proofread before submission.",
];

/** Static reference content (item 8 of the ES). */
export const WRITING_TIPS: string[] = [
  "Show motivation rather than simply stating it.",
  "Explain why this programme fits your goals.",
  "Connect academic achievements with future ambitions.",
  "Avoid repeating the CV.",
  "Keep paragraphs focused.",
  "Use concrete examples.",
  "Finish with a confident but realistic conclusion.",
];