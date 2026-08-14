/**
 * ES-005D — Conversation Engine ⇄ Intelligence Engine Bridge.
 * ES-005G — Conversation Intelligence & Human Assistance (this
 * revision). Per explicit, written approval, this module was
 * TEMPORARILY UNLOCKED for ES-005G only, scoped strictly to
 * "recommendation presentation" — how a search result is formatted
 * into chat text. The ONLY change in this revision is inside
 * formatIntelligenceMessage() below: matches are now rendered as
 * star-rated cards with a "why this matches" list, built entirely
 * from fields already present on IntelligenceResult (score,
 * matchedCriteria, the real scholarship record) — no new data source,
 * no touch to scoring, retrieval, or the Intelligence Layer itself.
 * shouldTriggerSearch's decision logic and the single
 * findScholarshipsForApplicant() call are UNCHANGED.
 *
 * This is the ONLY file in the app that knows about both ES-005B
 * (Conversation Engine) and ES-005C (Intelligence Layer). Neither of
 * those locked modules imports the other, and neither imports this
 * file — it is called only from the Chat UI (ES-005A), which remains
 * the sole caller of both the Conversation Engine and this bridge.
 *
 * Architecture guarantee this file exists to preserve:
 *   - conversationEngine.ts (ES-005B) never imports Supabase or the
 *     Intelligence Layer, and stays synchronous.
 *   - scholarshipIntelligence/index.ts (ES-005C) is completely
 *     unchanged, still today, by this revision. This file calls
 *     exactly one function from it, findScholarshipsForApplicant — the
 *     single public Intelligence API. No other export from ES-005C
 *     (individual engines, Supabase client, etc.) is ever imported
 *     here or anywhere in the UI layer.
 *   - All Supabase access is confined to ES-005C; this file, like
 *     ES-005B, never touches it directly.
 */

import {
  ConversationContext,
  JourneyId,
  COMPLETE_QUICK_REPLIES,
} from "./conversationEngine";
import { findScholarshipsForApplicant, IntelligenceResult } from "../../services/scholarshipIntelligence";

/**
 * Journeys for which a live scholarship search is meaningful. Kept
 * deliberately narrow for this integration phase — "find-scholarships"
 * is the journey the ES-005C brief's own example maps to.
 * "understand-eligibility" / "country-guidance" are reasonable future
 * candidates; "improve-documents" never triggers a search (it isn't
 * about scholarship discovery at all).
 */
const SEARCHABLE_JOURNEYS: ReadonlySet<JourneyId> = new Set(["find-scholarships"]);

export interface ConversationMessageForSearch {
  role: "assistant" | "user";
  text: string;
}

export interface BridgeMessage {
  text: string;
  quickReplies: string[];
}

/**
 * Determines whether the answer that just produced `nextContext`
 * (transitioning from `previousStage`) should trigger a live
 * scholarship search. True exactly once per journey completion — the
 * instant `stage` becomes "complete" for a searchable journey — not on
 * every subsequent render/reload where stage is already "complete".
 */
export function shouldTriggerSearch(previousStage: string, nextContext: ConversationContext): boolean {
  return (
    nextContext.stage === "complete" &&
    previousStage !== "complete" &&
    nextContext.journey !== null &&
    SEARCHABLE_JOURNEYS.has(nextContext.journey)
  );
}

const MAX_DISPLAYED_MATCHES = 5;

// Score → star rating. Purely a presentation label for a number the
// (unchanged) Ranking Engine already computed — WEIGHTS there sum to a
// maximum of 11 (degreeLevel 3 + fundingType 2 + country 2 +
// fieldOfStudy 2 + targetGroup 2). This mapping does not change what
// is scored, only how the existing score is described.
function starRating(score: number): { stars: string; label: string } {
  if (score >= 8) return { stars: "⭐⭐⭐⭐⭐", label: "Excellent Match" };
  if (score >= 6) return { stars: "⭐⭐⭐⭐", label: "Strong Match" };
  if (score >= 4) return { stars: "⭐⭐⭐", label: "Good Match" };
  if (score >= 2) return { stars: "⭐⭐", label: "Possible Match" };
  if (score >= 1) return { stars: "⭐", label: "Partial Match" };
  return { stars: "", label: "General Opportunity" };
}

// Maps a matchedCriteria label (from rankingEngine.ts, unchanged) to
// the real field on the scholarship record that actually satisfied
// it. Every bullet this produces is a real, verified database value —
// never invented — and only appears when the Ranking Engine actually
// matched that criterion.
function matchReasons(match: IntelligenceResult["matches"][number]): string[] {
  const { scholarship, matchedCriteria } = match;
  const reasons: string[] = [];
  for (const criterion of matchedCriteria) {
    if (criterion === "degree level" && scholarship.degree_level) reasons.push(scholarship.degree_level);
    if (criterion === "funding preference" && scholarship.funding_type) reasons.push(scholarship.funding_type);
    if (criterion === "preferred country" && scholarship.country) reasons.push(scholarship.country);
    if (criterion === "field of study" && scholarship.field_of_study) reasons.push(scholarship.field_of_study);
    if (criterion === "target group" && scholarship.target_group) reasons.push(scholarship.target_group);
  }
  return reasons;
}

function formatMatchCard(match: IntelligenceResult["matches"][number]): string {
  const { scholarship, score } = match;
  const { stars, label } = starRating(score);
  const reasons = matchReasons(match);

  const header = stars ? `${stars} ${label}` : label;
  const lines = [
    header,
    scholarship.title,
    `Country: ${scholarship.country}`,
    `Degree: ${scholarship.degree_level}`,
    `Funding: ${scholarship.funding_type}`,
  ];

  if (reasons.length > 0) {
    lines.push("", "Why this matches:");
    reasons.forEach((reason) => lines.push(`• ${reason}`));
  } else {
    lines.push("", "Shown as a general open opportunity — please check the official listing for full eligibility.");
  }

  return lines.join("\n");
}

/**
 * Formats an IntelligenceResult into the single chat message the UI
 * should append. Every value here comes from the Intelligence Layer's
 * own output — real scholarship fields, real scores, real matched
 * criteria — this function only lays out and labels what was already
 * computed; it makes no independent judgment about scholarships.
 */
function formatIntelligenceMessage(result: IntelligenceResult): string {
  if (result.matches.length === 0) {
    return result.summaryMessage;
  }

  const shown = result.matches.slice(0, MAX_DISPLAYED_MATCHES);
  const cards = shown.map(formatMatchCard);
  const remainder = result.matches.length - shown.length;
  const remainderLine =
    remainder > 0
      ? `\n\n(${remainder} more match${remainder === 1 ? "" : "es"} not shown here — visit Explore Opportunities to see the full list.)`
      : "";

  return `${result.summaryMessage}\n\n${cards.join("\n\n")}${remainderLine}`;
}

/**
 * The single integration call: given the conversation context and
 * message history at the moment a searchable journey completed, runs
 * a real search through the Intelligence Layer's one public API and
 * returns a ready-to-append chat message.
 *
 * Never throws — any unexpected failure (beyond what
 * findScholarshipsForApplicant already catches internally) is turned
 * into the same honest, non-fabricating message the Product
 * Constitution requires, never a silent fallback to invented content.
 */
export async function runIntelligenceSearch(
  context: ConversationContext,
  messages: ConversationMessageForSearch[]
): Promise<BridgeMessage> {
  try {
    const result = await findScholarshipsForApplicant(context.answers, messages);
    return {
      text: formatIntelligenceMessage(result),
      quickReplies: COMPLETE_QUICK_REPLIES,
    };
  } catch {
    return {
      text:
        "I wasn't able to search verified scholarship data just now. I don't want to guess, so please try again shortly, or explore opportunities directly using Explore Opportunities.",
      quickReplies: COMPLETE_QUICK_REPLIES,
    };
  }
}