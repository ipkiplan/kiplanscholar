/**
 * ES-005C — Query Builder.
 *
 * Steps 2–3 of the Intelligence Layer pipeline: "Build database
 * queries" and "Retrieve matching scholarships from Supabase."
 *
 * Deliberately retrieves a broad *candidate* set rather than hard-
 * filtering on every SearchContext dimension at once: requiring every
 * field to match exactly at the database level would silently drop
 * good candidates over one soft mismatch (e.g. a great fit whose
 * country wasn't specified by the applicant). This module's job is
 * volume reduction and correctness (only active scholarships, only
 * columns that exist); the Ranking Engine is responsible for scoring
 * candidates against the full profile.
 *
 * This file imports the existing `supabase` client and the locked
 * `Scholarship` row type directly — it does not modify
 * src/lib/supabase.ts or src/lib/scholarships.ts, and does not
 * duplicate/override any of their existing exported functions.
 */

import { supabase } from "../../lib/supabase";
import { Scholarship } from "../../lib/scholarships";
import { SearchContext } from "./types";

export interface QueryResult {
  data: Scholarship[] | null;
  error: string | null;
}

function toErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return "An unexpected error occurred while searching scholarships.";
}

/**
 * Retrieves active scholarships that match at least one dimension of
 * the SearchContext (OR across columns present in the context), or
 * all active scholarships if the context carries no usable criteria
 * at all. Results are capped and ordered by soonest deadline, mirroring
 * the existing conventions in src/lib/scholarships.ts.
 */
export async function queryScholarships(context: SearchContext, limit = 50): Promise<QueryResult> {
  try {
    let query = supabase.from("scholarships").select("*").eq("active", true);

    const orClauses: string[] = [];
    if (context.degreeLevel) orClauses.push(`degree_level.ilike.%${context.degreeLevel}%`);
    if (context.country) orClauses.push(`country.ilike.%${context.country}%`);
    if (context.fieldOfStudy) orClauses.push(`field_of_study.ilike.%${context.fieldOfStudy}%`);
    if (context.fundingType) orClauses.push(`funding_type.ilike.%${context.fundingType}%`);
    if (context.targetGroup) orClauses.push(`target_group.ilike.%${context.targetGroup}%`);
    for (const term of context.freeTextTerms) {
      if (term.trim()) {
        orClauses.push(`title.ilike.%${term}%`, `description.ilike.%${term}%`, `eligibility.ilike.%${term}%`);
      }
    }

    if (orClauses.length > 0) {
      query = query.or(orClauses.join(","));
    }
    // If there are no usable criteria at all, we intentionally fall
    // through to a broad active-scholarships fetch rather than
    // returning nothing — the Ranking Engine and orchestrator are
    // responsible for honestly labeling an unpersonalized result set
    // as such (see index.ts / rankingEngine.ts).

    query = query.order("deadline", { ascending: true }).limit(limit);

    const { data, error } = await query;

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: (data ?? []) as Scholarship[], error: null };
  } catch (err) {
    return { data: null, error: toErrorMessage(err) };
  }
}