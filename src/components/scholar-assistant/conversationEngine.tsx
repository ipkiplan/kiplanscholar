/**
 * ES-005-B — Conversation Experience Layer: Conversation Engine.
 * ES-005-G — Conversation Intelligence & Human Assistance (this
 * revision). Per explicit, written approval, this module was
 * TEMPORARILY UNLOCKED for ES-005G only, to refine conversation
 * wording, add context-aware topic switching, and add the Human
 * Assistant handoff flow. The underlying mechanism — a state machine
 * driven by ConversationContext { journey, stage, answers } and a
 * single submitAnswer() transition function — is UNCHANGED. What
 * changed is the copy this engine produces and the set of states it
 * can be in, not how states or context work.
 *
 * Still true after ES-005G, unchanged from ES-005B:
 *   - No Supabase / scholarship database access.
 *   - No AI/LLM calls.
 *   - No recommendation or matching logic.
 *   - No document generation.
 * This file still has zero imports — it cannot reach any of the above
 * even by accident.
 *
 * Per DOC-003 §9.9 Knowledge Boundary Rule: this engine never invents
 * scholarship info, never presents unavailable details as facts,
 * never promises approval/admission/funding/success. ES-005G's new
 * "Compare Scholarships" and "Scholarship Calendar" menu options are
 * honestly labeled as not yet available in chat, rather than
 * fabricating that capability — see submitAnswer's "complete" stage
 * handling below.
 */

export type JourneyId =
  | "find-scholarships"
  | "understand-eligibility"
  | "improve-documents"
  | "country-guidance";

export interface QuestionStep {
  id: string;
  /** Key this answer is stored under in ConversationContext.answers */
  contextKey: string;
  /** Prompt text, allowed to reference earlier answers for natural flow (DOC-003 §5.3 — "adapt follow-up questions based on previous responses") */
  prompt: (answers: Record<string, string>) => string;
  quickReplies?: string[];
}

export interface JourneyDefinition {
  id: JourneyId;
  /** Label shown as a quick-reply option on the goal question */
  label: string;
  /** Keywords used to route free-typed goal answers to this journey */
  keywords: RegExp;
  steps: QuestionStep[];
}

export type ConversationStage = "goal" | string | "complete";

export interface ConversationContext {
  journey: JourneyId | null;
  stage: ConversationStage;
  answers: Record<string, string>;
}

export const INITIAL_CONTEXT: ConversationContext = {
  journey: null,
  stage: "goal",
  answers: {},
};

// ---------------------------------------------------------------------------
// Journey definitions — DOC-003 §6.4 Main Student Journeys.
// UNCHANGED by ES-005G: same journeys, same steps, same questions,
// same quick replies. ES-005G only adds new ways to ENTER these
// journeys (see enterJourney below) and new states that exist
// alongside them (human-assistant-*), never new steps within them.
// ---------------------------------------------------------------------------

export const JOURNEYS: JourneyDefinition[] = [
  {
    id: "find-scholarships",
    label: "Find Scholarships",
    keywords: /scholarship|find|search|discover|fund(ing)?/i,
    steps: [
      {
        id: "education-level",
        contextKey: "educationLevel",
        prompt: () =>
          "Great, let's find the right opportunities for you. What's your current or intended level of study?",
        quickReplies: ["Undergraduate", "Master's", "PhD", "Postdoctoral"],
      },
      {
        id: "field",
        contextKey: "field",
        prompt: (a) =>
          `Thanks! For your ${a.educationLevel ?? "studies"}, which field are you most interested in?`,
        quickReplies: ["Engineering & Technology", "Business", "Medicine & Health", "Social Sciences", "Something else"],
      },
      {
        id: "country",
        contextKey: "country",
        prompt: () => "Do you have a country or region in mind, or are you open to anywhere?",
        quickReplies: ["United States", "United Kingdom", "Europe", "Open to anywhere"],
      },
      {
        id: "funding",
        contextKey: "funding",
        prompt: () => "Last question — are you looking specifically for fully-funded opportunities?",
        quickReplies: ["Fully funded only", "Open to partial funding too", "Not sure yet"],
      },
    ],
  },
  {
    id: "understand-eligibility",
    label: "Understand Eligibility",
    keywords: /eligib|qualify|qualif/i,
    steps: [
      {
        id: "target",
        contextKey: "target",
        prompt: () =>
          "Happy to help you think through eligibility. Is there a specific scholarship or program you have in mind?",
        quickReplies: ["I'm not sure yet"],
      },
      {
        id: "education-level",
        contextKey: "educationLevel",
        prompt: () => "And what's your current level of education?",
        quickReplies: ["High School", "Undergraduate", "Master's", "PhD"],
      },
      {
        id: "background",
        contextKey: "background",
        prompt: () =>
          "Is there anything about your academic or professional background you'd like me to keep in mind?",
        quickReplies: ["Strong academic record", "Some work experience", "Still building my profile", "Prefer not to say"],
      },
    ],
  },
  {
    id: "improve-documents",
    label: "Improve My Documents",
    keywords: /\bsop\b|\bcv\b|resume|\blor\b|document|essay|recommendation letter|statement of purpose|motivation letter/i,
    steps: [
      {
        id: "doc-type",
        contextKey: "docType",
        prompt: () => "Let's strengthen your application. Which document would you like to work on?",
        quickReplies: ["Statement of Purpose (SOP)", "CV / Resume", "Letter of Recommendation (LOR)", "Motivation Letter"],
      },
      {
        id: "doc-stage",
        contextKey: "docStage",
        prompt: (a) => `Good choice. Where are you with your ${a.docType ?? "document"} right now?`,
        quickReplies: ["Haven't started yet", "I have a rough draft", "Nearly finished, need polish"],
      },
    ],
  },
  {
    id: "country-guidance",
    label: "Explore Countries",
    keywords: /countr|visa|destination|abroad|study in/i,
    steps: [
      {
        id: "region",
        contextKey: "region",
        prompt: () => "Let's explore study destinations. Is there a country or region you're curious about?",
        quickReplies: ["United States", "United Kingdom", "Europe", "Not sure yet — help me compare"],
      },
      {
        id: "topic",
        contextKey: "topic",
        prompt: (a) => `What would be most useful to know about ${a.region ?? "that destination"}?`,
        quickReplies: ["Cost of living", "Visa process", "Scholarship environment", "General overview"],
      },
    ],
  },
];

export const GOAL_QUICK_REPLIES = [...JOURNEYS.map((j) => j.label), "Recommend Trusted Education Consultancy"];

// ---------------------------------------------------------------------------
// Engine — routing helpers (UNCHANGED by ES-005G)
// ---------------------------------------------------------------------------

function matchJourney(input: string): JourneyId | null {
  const normalized = input.trim().toLowerCase();
  const exact = JOURNEYS.find((j) => j.label.toLowerCase() === normalized);
  if (exact) return exact.id;
  const byKeyword = JOURNEYS.find((j) => j.keywords.test(normalized));
  return byKeyword ? byKeyword.id : null;
}

function getJourney(id: JourneyId | null): JourneyDefinition | null {
  return id ? JOURNEYS.find((j) => j.id === id) ?? null : null;
}

// ---------------------------------------------------------------------------
// ES-015 — Scholar Assistant conversation & intent correction.
//
// extractFindScholarshipsSignals(): when a goal-stage message that
// routes into find-scholarships already states an explicit education
// level, extract it so the first question isn't asked again. Separately
// and specifically: a message stating the user already HOLDS a
// Bachelor's degree is never stored as educationLevel "Undergraduate"
// — those are different concepts (credential held vs. current/intended
// level of study) — instead the first question is replaced with a
// direct clarification about the intended NEXT level (see the
// universal BACHELORS_HOLDER_PATTERN check in submitAnswer below).
//
// ES-015's original second fix (interrupting the Human Assistant
// sub-flow mid-conversation) is superseded by ES-016: that sub-flow no
// longer exists — Human Assistant now resolves in a single turn (see
// isHumanAssistantIntent's usage in submitAnswer), so there is nothing
// left to interrupt.
// ---------------------------------------------------------------------------

const BACHELORS_HOLDER_PATTERN =
  /\bbachelor'?s?\s*(degree)?\s*(holder|graduate|completed|done|finished)\b|\bhold(?:s|ing)?\s+a\s+bachelor'?s?\b|\bhave\s+(?:a\s+|my\s+)?bachelor'?s?\s*(degree)?\b|\bcompleted?\s+(?:my\s+)?bachelor'?s?\b/i;

const EDUCATION_LEVEL_SIGNALS: Array<{ pattern: RegExp; value: string }> = [
  { pattern: /\bpostdoc(toral)?\b/i, value: "Postdoctoral" },
  { pattern: /\bphd\b|\bdoctorate\b|\bdoctoral\b/i, value: "PhD" },
  { pattern: /\bmaster'?s?\b|\bmba\b|\bmsc\b|\bma\b(?!\w)/i, value: "Master's" },
  // Deliberately last, and only as a *currently-studying* signal, never
  // triggered by BACHELORS_HOLDER_PATTERN's "already holds" phrasing —
  // checked separately in the caller, not folded in here.
  { pattern: /\bundergraduate\b|\bundergrad\b/i, value: "Undergraduate" },
];

function extractEducationLevelSignal(input: string): string | null {
  if (BACHELORS_HOLDER_PATTERN.test(input)) return null; // handled separately — never auto-classified
  for (const { pattern, value } of EDUCATION_LEVEL_SIGNALS) {
    if (pattern.test(input)) return value;
  }
  return null;
}

const RESEARCHER_SIGNAL = /\bresearcher(s)?\b/i;

/**
 * Applied only when a goal-stage message routes into find-scholarships.
 * Returns adjustments to make on top of the journey's normal first
 * step — never invents an answer the user didn't state. The
 * Bachelor's-holder case is handled separately, earlier, and
 * universally (see BACHELORS_HOLDER_PATTERN check in submitAnswer) —
 * a message matching that pattern never reaches here.
 */
function extractFindScholarshipsSignals(
  input: string
): { presetAnswers: Record<string, string>; skipToIndex: number } {
  const educationLevel = extractEducationLevelSignal(input);
  if (!educationLevel) {
    return { presetAnswers: {}, skipToIndex: 0 };
  }
  // find-scholarships step 0 is education-level — skip straight to
  // step 1 (field) with the extracted value pre-filled, same mechanism
  // enterJourney already uses for menu-driven re-entry.
  return { presetAnswers: { educationLevel }, skipToIndex: 1 };
}


/** Returns the QuestionStep the assistant should currently be asking, or null in the goal/complete/human-assistant stages. */
export function getCurrentStep(context: ConversationContext): QuestionStep | null {
  const journey = getJourney(context.journey);
  if (!journey) return null;
  return journey.steps.find((s) => s.id === context.stage) ?? null;
}

/**
 * Result of submitting an answer: the next context, plus the assistant
 * reply the UI should render for it.
 */
export interface ContactLink {
  label: string;
  href: string;
}

export interface AnswerResult {
  context: ConversationContext;
  assistantText: string;
  quickReplies?: string[];
  /**
   * True only when the engine has determined this answer is a request to
   * start over. The UI must treat this as the sole trigger for resetting
   * the visible conversation — it must not pattern-match reset intent
   * itself, or the "what counts as a reset" decision would live in two
   * places at once.
   */
  resetRequested?: boolean;
  /**
   * ES-016: real, clickable contact actions (WhatsApp/Call/Email) for
   * the KIPLAN Human Assistant direct-contact response. Optional —
   * absent on every other message. Rendered by the UI as actual links,
   * not quick-reply buttons (quick replies re-submit text into the
   * conversation; these must open an external app/dialer/mail client).
   */
  contactLinks?: ContactLink[];
}

const CLARIFY_GOAL_TEXT =
  "I want to make sure I point you in the right direction — could you pick one of the options below, or tell me a bit more about what you need?";

// ---------------------------------------------------------------------------
// ES-005G — Human Assistant handoff
//
// A small, self-contained sub-flow, added as new states within the
// SAME state-machine mechanism used everywhere else in this file — not
// a new architecture. Entry is via a single, universal intent check
// (isHumanAssistantIntent) applied at the top of submitAnswer, so
// "Recommend an education consultancy" typed mid-journey is handled
// the same way as clicking the "Talk to a Human Assistant" menu
// option — one code path, no duplicated logic (DOC-003 §9.9 and the
// Product Constitution's consultancy-neutrality policy, below, apply
// identically either way).
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// ES-016 — Human Assistant now means direct KIPLAN contact, not an
// external-consultancy questionnaire. The prior two-stage
// consent → region → consultancy-policy-text flow is replaced by a
// single, immediate response with real contact actions. No quick-reply
// stages remain for this branch, so there is nothing left to
// "interrupt" mid-flow — isHumanAssistantIntent below still fires from
// anywhere (any stage, any journey), exactly as before, it just now
// resolves in one turn instead of two.
// ---------------------------------------------------------------------------

function isHumanAssistantIntent(input: string): boolean {
  return /consultanc|talk to a human|need help from a human|human assistant|speak (to|with) (a |someone|human)|real person/i.test(
    input
  );
}

const KIPLAN_CONTACT_LINKS: ContactLink[] = [
  { label: "Chat on WhatsApp", href: "https://wa.me/9779849530970" },
];

const KIPLAN_CONTACT_TEXT =
  "Of course — I'll connect you with a real KIPLAN team member. You can reach us directly:\n\n" +
  "KIPLAN\nCivil Trade Centre (CTC) Mall\nSundhara, Kathmandu 44600, Nepal\n\n" +
  "Office: +977 1 5312040\nMobile (WhatsApp/Viber): +977 9849530970\nEmail: ipkiplan@gmail.com";

// ---------------------------------------------------------------------------
// ES-006A.1 — Document-completion intent recognition
//
// Same pattern as isHumanAssistantIntent above: a universal check
// applied at the top of submitAnswer, so "My CV is ready" is
// recognized identically whether typed at the very first message or
// mid-way through an unrelated journey — the exact gap demonstrated
// in the ES-006A Completion Report (a document-readiness statement
// typed mid-journey was previously recorded as a literal answer to
// whatever unrelated question was active).
//
// Scope is strictly "ready/review" phrasing, not general document
// mentions — "Help me build my CV" still correctly routes through the
// existing, unchanged matchJourney keyword logic into the
// improve-documents journey's normal question flow. This only
// intercepts a *readiness declaration*, where re-asking "which
// document?" or "where are you with it?" would be redundant, since
// the user already answered both in one sentence.
// ---------------------------------------------------------------------------

const DOCUMENT_TYPE_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /\bcv\b|resume/i, label: "CV / Resume" },
  { pattern: /\bsop\b|statement of purpose/i, label: "Statement of Purpose (SOP)" },
  { pattern: /\blor\b|letter of recommendation|recommendation letter/i, label: "Letter of Recommendation (LOR)" },
  { pattern: /motivation letter/i, label: "Motivation Letter" },
];

const DOCUMENT_READY_TRIGGER = /\b(is ready|ready for review|review my|finished|done|completed)\b/i;

function detectDocumentReadyIntent(input: string): { docType: string } | null {
  if (!DOCUMENT_READY_TRIGGER.test(input)) return null;
  const match = DOCUMENT_TYPE_PATTERNS.find((p) => p.pattern.test(input));
  return match ? { docType: match.label } : null;
}

// The CV Builder (ES-006A) is a real, existing feature, so it's
// honestly referenced by name for CV readiness specifically. SOP/LOR/
// CV, SOP, LOR, and Motivation Letter all have real, working builders
// today — each case below honestly points to its own. The Human
// Assistant offer still applies to all of them; a working builder
// doesn't remove the value of a second pair of eyes.
function buildDocumentReadyText(docType: string): string {
  const builderNameByDocType: Record<string, string> = {
    "CV / Resume": "CV Builder",
    "Statement of Purpose (SOP)": "SOP Builder",
    "Letter of Recommendation (LOR)": "LOR Builder",
    "Motivation Letter": "Motivation Letter Builder",
  };
  const builderName = builderNameByDocType[docType];
  if (builderName) {
    return `That's great to hear! You're welcome to review or export it anytime using our ${builderName}, and our Human Assistant can also take a look before you apply, if that would help.`;
  }
  return `That's great to hear! I can't review your ${docType} directly in this chat, but our Human Assistant would be glad to take a look before you apply, if that would help.`;
}

// ---------------------------------------------------------------------------
// ES-005G — Post-guidance action menu (Objectives 5 & 7)
//
// Replaces the old two-option "Ask something else / Start a New
// Conversation" menu with real continuations. Every option here is
// either a genuine re-entry into an existing, unchanged journey
// (Check Eligibility, Prepare SOP, Build CV, Review Documents, Visa
// Guide, Country Guide), the Human Assistant handoff, the existing
// reset action — or, for the two capabilities that don't exist yet
// (Compare Scholarships, Scholarship Calendar), an honest "not yet
// available in chat" message rather than fabricated functionality.
// ---------------------------------------------------------------------------

export const COMPLETE_QUICK_REPLIES = [
  "Compare Scholarships",
  "Check Eligibility",
  "Prepare SOP",
  "Build CV",
  "Review Documents",
  "Visa Guide",
  "Country Guide",
  "Scholarship Calendar",
  "Talk to a Human Assistant",
  "Start a New Conversation",
];

const NOT_YET_AVAILABLE_TEXT: Record<string, string> = {
  "compare scholarships":
    "Side-by-side comparison isn't built into this chat yet — for now, the best way to compare listings closely is on Explore Opportunities, where you can view full details for each one. Want me to help you search for more scholarships instead?",
  "scholarship calendar":
    "I don't have a live calendar view in this chat yet, but every scholarship's real deadline is listed on Explore Opportunities, so you can track dates there. Want me to help you find scholarships with upcoming deadlines?",
};

/**
 * Re-enters an existing, unchanged journey from the action menu.
 * `startStepIndex` lets a menu choice that already tells us the
 * answer (e.g. clicking "Prepare SOP" already answers the doc-type
 * question) skip straight past it, with that answer pre-filled —
 * a conversation-transitions improvement, not a new question or a new
 * journey.
 */
function enterJourney(
  journeyId: JourneyId,
  priorAnswers: Record<string, string>,
  presetAnswers: Record<string, string> = {},
  startStepIndex = 0
): AnswerResult {
  const journey = getJourney(journeyId)!;
  const mergedAnswers = { ...priorAnswers, ...presetAnswers };
  const step = journey.steps[startStepIndex];
  if (!step) {
    return {
      context: { journey: journeyId, stage: "complete", answers: mergedAnswers },
      assistantText: buildGuidanceText(journey, mergedAnswers),
      quickReplies: COMPLETE_QUICK_REPLIES,
    };
  }
  return {
    context: { journey: journeyId, stage: step.id, answers: mergedAnswers },
    assistantText: step.prompt(mergedAnswers),
    quickReplies: step.quickReplies,
  };
}

// DOC-003 §9.9 Knowledge Boundary Rule: never invent scholarship info,
// never present unavailable details as facts, never promise approval,
// admission, funding, or success. ES-005G rewrote this copy for two
// reasons: (1) natural, varied wording per journey instead of one
// repeated template (Objective 1), and (2) for find-scholarships
// specifically, removing a real contradiction — the old text said "I'm
// not yet able to search" immediately before the Assistant Orchestrator
// appended real search results right after it (Objective 2). The other
// three journeys never had that contradiction (no search follows them),
// so their honesty about current limitations is preserved, only the
// wording is fresher.
function buildGuidanceText(journey: JourneyDefinition, answers: Record<string, string>): string {
  switch (journey.id) {
    case "find-scholarships":
      // A real search follows this message (Assistant Orchestrator,
      // unchanged trigger logic) — so this is a confident transition
      // line, never a disclaimer about being unable to search.
      return "Great! Let me find scholarships that match what you've shared.";

    case "understand-eligibility": {
      const target = answers.target && !/not sure/i.test(answers.target) ? ` for ${answers.target}` : "";
      return (
        `Got it, thanks for sharing that. Eligibility${target} ultimately comes down to the specific scholarship's ` +
        `official criteria, since requirements vary quite a bit — I'd recommend checking the exact listing on Explore Opportunities. ` +
        `If it'd help, I can also search for scholarships that fit your profile directly.`
      );
    }

    case "improve-documents": {
      const doc = answers.docType ?? "document";
      const builderNameByDocType: Record<string, string> = {
        "CV / Resume": "CV Builder",
        "Statement of Purpose (SOP)": "SOP Builder",
        "Letter of Recommendation (LOR)": "LOR Builder",
        "Motivation Letter": "Motivation Letter Builder",
      };
      const builderName = builderNameByDocType[doc];
      if (builderName) {
        return (
          `Nice — working on your ${doc} is a great step. You're welcome to work on it anytime using our ${builderName}, ` +
          `and our Human Assistant can also review a draft with you directly if that would help.`
        );
      }
      return (
        `Nice — working on your ${doc} is a great step. I can't generate or edit the document itself here, ` +
        `but our Human Assistant can review a draft with you directly if that would help.`
      );
    }

    case "country-guidance": {
      const region = answers.region && !/not sure/i.test(answers.region) ? answers.region : "that destination";
      return (
        `${region} is a solid choice to explore. I can't pull live country-specific details into this chat yet, ` +
        `so for the most accurate, current information I'd point you to official sources — but I'm happy to help you search for scholarships there in the meantime.`
      );
    }

    default:
      return "Thanks for sharing that.";
  }
}

/**
 * Core transition function. Given the current context and the user's raw
 * answer (typed or from a quick-reply button), returns the next context
 * and the assistant message to display.
 */
export function submitAnswer(context: ConversationContext, rawAnswer: string): AnswerResult {
  const trimmed = rawAnswer.trim();

  // --- ES-016: Human Assistant → direct KIPLAN contact, single turn ---
  // Resolves immediately, from any stage, with real contact actions.
  // No sub-flow stages remain for this branch (ES-016 removed the
  // prior two-stage consent/region questionnaire), so there is nothing
  // left to "interrupt" — this check simply always takes precedence,
  // exactly like the document-ready and Bachelor's-holder checks below.
  if (isHumanAssistantIntent(trimmed)) {
    return {
      context: { journey: null, stage: "complete", answers: context.answers },
      assistantText: KIPLAN_CONTACT_TEXT,
      quickReplies: COMPLETE_QUICK_REPLIES,
      contactLinks: KIPLAN_CONTACT_LINKS,
    };
  }

  // --- ES-006A.1: universal document-completion intent (Objective: recognize without restarting) ---
  {
    const documentIntent = detectDocumentReadyIntent(trimmed);
    if (documentIntent) {
      return {
        context: {
          journey: null,
          stage: "complete",
          answers: { ...context.answers, docType: documentIntent.docType, docStage: "Ready for review" },
        },
        assistantText: buildDocumentReadyText(documentIntent.docType),
        quickReplies: COMPLETE_QUICK_REPLIES,
      };
    }
  }

  // --- ES-015: universal Bachelor's-degree-holder recognition ---
  // Applied before any stage-specific handling, so a credential-holder
  // statement is recognized whether it's the very first message (as in
  // the reported case, which never matches a journey keyword and would
  // otherwise hit the generic CLARIFY_GOAL_TEXT fallback) or typed
  // mid-journey. Never stores "Undergraduate" from this signal — asks
  // directly what the user wants to study next instead.
  if (BACHELORS_HOLDER_PATTERN.test(trimmed)) {
    return {
      context: { journey: "find-scholarships", stage: "education-level", answers: { ...context.answers, goal: trimmed } },
      assistantText:
        "Thanks for sharing that — since you already hold a Bachelor's degree, what would you like to study next: Master's, MBA, PhD, or something else?",
      quickReplies: ["Master's", "MBA", "PhD", "Something else"],
    };
  }

  // --- Complete stage: the action menu (Objectives 5 & 7) ---
  if (context.stage === "complete") {
    if (/new conversation/i.test(trimmed)) {
      // Caller (UI) is responsible for actually resetting; engine just
      // reports the intent so the UI can call resetConversation().
      return {
        context: INITIAL_CONTEXT,
        assistantText: "",
        resetRequested: true,
      };
    }

    const normalized = trimmed.toLowerCase();

    if (/check eligibility/i.test(normalized)) {
      return enterJourney("understand-eligibility", context.answers);
    }
    if (/prepare sop|statement of purpose/i.test(normalized)) {
      return enterJourney("improve-documents", context.answers, { docType: "Statement of Purpose (SOP)" }, 1);
    }
    if (/build cv|resume/i.test(normalized)) {
      return enterJourney("improve-documents", context.answers, { docType: "CV / Resume" }, 1);
    }
    if (/review documents?/i.test(normalized)) {
      return enterJourney("improve-documents", context.answers);
    }
    if (/visa guide/i.test(normalized)) {
      return enterJourney("country-guidance", context.answers);
    }
    if (/country guide/i.test(normalized)) {
      return enterJourney("country-guidance", context.answers);
    }
    if (NOT_YET_AVAILABLE_TEXT[normalized]) {
      return {
        context: { ...context, stage: "complete" },
        assistantText: NOT_YET_AVAILABLE_TEXT[normalized],
        quickReplies: COMPLETE_QUICK_REPLIES,
      };
    }

    // Anything else typed — go back to the goal question without
    // wiping message history, so the conversation continues to feel
    // natural rather than restarting.
    return {
      context: { journey: null, stage: "goal", answers: {} },
      assistantText: "Of course — what would you like help with?",
      quickReplies: GOAL_QUICK_REPLIES,
    };
  }

  // --- Goal stage: route to a journey ---
  if (context.stage === "goal") {
    const journeyId = matchJourney(trimmed);
    if (!journeyId) {
      return {
        context,
        assistantText: CLARIFY_GOAL_TEXT,
        quickReplies: GOAL_QUICK_REPLIES,
      };
    }
    const journey = getJourney(journeyId)!;
    const signals = journeyId === "find-scholarships" ? extractFindScholarshipsSignals(trimmed) : { presetAnswers: {}, skipToIndex: 0 };
    const firstStep = journey.steps[signals.skipToIndex] ?? journey.steps[0];
    const nextContext: ConversationContext = {
      journey: journeyId,
      stage: firstStep ? firstStep.id : "complete",
      answers: { goal: trimmed, ...signals.presetAnswers },
    };
    if (!firstStep) {
      // Defensive — every current journey has at least one step.
      return { context: { ...nextContext, stage: "complete" }, assistantText: buildGuidanceText(journey, nextContext.answers), quickReplies: COMPLETE_QUICK_REPLIES };
    }
    return {
      context: nextContext,
      assistantText: firstStep.prompt(nextContext.answers),
      quickReplies: firstStep.quickReplies,
    };
  }

  // --- Mid-journey: record the answer, advance to the next step or guidance ---
  const journey = getJourney(context.journey);
  if (!journey) {
    // Shouldn't happen, but fail safe back to the goal question.
    return {
      context: { journey: null, stage: "goal", answers: {} },
      assistantText: "Let's start over — what would you like help with?",
      quickReplies: GOAL_QUICK_REPLIES,
    };
  }

  const currentIndex = journey.steps.findIndex((s) => s.id === context.stage);
  const currentStep = journey.steps[currentIndex];
  const newAnswers = currentStep
    ? { ...context.answers, [currentStep.contextKey]: trimmed }
    : context.answers;
  const nextStep = journey.steps[currentIndex + 1];

  if (nextStep) {
    const nextContext: ConversationContext = { ...context, answers: newAnswers, stage: nextStep.id };
    return {
      context: nextContext,
      assistantText: nextStep.prompt(newAnswers),
      quickReplies: nextStep.quickReplies,
    };
  }

  // No more steps in this journey — move to guidance/complete.
  const nextContext: ConversationContext = { ...context, answers: newAnswers, stage: "complete" };
  return {
    context: nextContext,
    assistantText: buildGuidanceText(journey, newAnswers),
    quickReplies: COMPLETE_QUICK_REPLIES,
  };
}