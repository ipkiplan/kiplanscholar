import { supabase } from "./supabase";

/**
 * Row shape of the `scholarships` table.
 * Matches the Supabase schema exactly (verified by direct introspection,
 * SDM-001 Track 1) — do not add, remove, or rename fields here without
 * updating the table definition first.
 */
export interface Scholarship {
  id: string;
  title: string;
  slug: string;
  organization: string;
  country: string;
  degree_level: string;
  field_of_study: string | null;
  funding_type: string;
  target_group: string | null;
  eligibility: string | null;
  benefits: string | null;
  description: string | null;
  deadline: string | null; // date, ISO format (YYYY-MM-DD)
  application_url: string | null;
  featured: boolean;
  active: boolean;
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
  // SDM-001 Track 1 — these 5 columns exist live in Supabase but were
  // previously omitted here, despite this interface's own header
  // comment claiming an exact match. All 5 are nullable in the live
  // schema (currently NULL on all 24 existing records), so every
  // consumer must handle null exactly like the pre-existing nullable
  // fields above (field_of_study, target_group, etc.) — never assume
  // populated.
  stipend: string | null;
  duration: string | null;
  gender: string | null;
  last_updated: string | null; // date, ISO format (YYYY-MM-DD)
  status: string | null;
  // SDM-001 Track 4a — live column, nullable, no CHECK constraint (a
  // documented convention, matching the SDM-001 controlled-vocabulary
  // fields, not a database-enforced enum). Currently NULL on all 24
  // records. See mapScholarship.ts for how the mapper validates this
  // against EnrichedOpportunity.opportunityType's 14-value union.
  opportunity_type: string | null;
}

export interface ScholarshipResult<T> {
  data: T | null;
  error: string | null;
}

/**
 * Converts any thrown/caught error (Supabase PostgrestError, network
 * error, etc.) into a plain string message so callers never have to
 * deal with inconsistent error shapes.
 */
function toErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return "An unexpected error occurred while fetching scholarship data.";
}

/**
 * Returns all active scholarships, ordered by deadline (soonest first).
 */
export async function getScholarships(): Promise<ScholarshipResult<Scholarship[]>> {
  try {
    const { data, error } = await supabase
      .from("scholarships")
      .select("*")
      .eq("active", true)
      .order("deadline", { ascending: true });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Scholarship[], error: null };
  } catch (err) {
    return { data: null, error: toErrorMessage(err) };
  }
}

/**
 * Returns a single scholarship by its id, or null if not found.
 */
export async function getScholarshipById(
  id: string
): Promise<ScholarshipResult<Scholarship>> {
  try {
    const { data, error } = await supabase
      .from("scholarships")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Scholarship | null, error: null };
  } catch (err) {
    return { data: null, error: toErrorMessage(err) };
  }
}

/**
 * Returns a single scholarship by its slug, or null if not found.
 */
export async function getScholarshipBySlug(
  slug: string
): Promise<ScholarshipResult<Scholarship>> {
  try {
    const { data, error } = await supabase
      .from("scholarships")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Scholarship | null, error: null };
  } catch (err) {
    return { data: null, error: toErrorMessage(err) };
  }
}

/**
 * Searches active scholarships across title, organization, country,
 * degree_level, field_of_study, funding_type, and target_group.
 * Case-insensitive partial match, OR'd across all fields — lets users
 * search terms like "Master", "PhD", "Engineering", "Women", or
 * "Fully Funded" and match on whichever column is relevant.
 */
export async function searchScholarships(
  searchTerm: string
): Promise<ScholarshipResult<Scholarship[]>> {
  try {
    const trimmed = searchTerm.trim();

    if (!trimmed) {
      return getScholarships();
    }

    const pattern = `%${trimmed}%`;

    const { data, error } = await supabase
      .from("scholarships")
      .select("*")
      .eq("active", true)
      .or(
        [
          `title.ilike.${pattern}`,
          `organization.ilike.${pattern}`,
          `country.ilike.${pattern}`,
          `degree_level.ilike.${pattern}`,
          `field_of_study.ilike.${pattern}`,
          `funding_type.ilike.${pattern}`,
          `target_group.ilike.${pattern}`,
        ].join(",")
      )
      .order("deadline", { ascending: true });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Scholarship[], error: null };
  } catch (err) {
    return { data: null, error: toErrorMessage(err) };
  }
}

/**
 * Returns active scholarships flagged as featured, ordered by deadline
 * (soonest first).
 */
export async function getFeaturedScholarships(): Promise<ScholarshipResult<Scholarship[]>> {
  try {
    const { data, error } = await supabase
      .from("scholarships")
      .select("*")
      .eq("featured", true)
      .eq("active", true)
      .order("deadline", { ascending: true });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Scholarship[], error: null };
  } catch (err) {
    return { data: null, error: toErrorMessage(err) };
  }
}