import { Scholarship } from "../lib/scholarships";
import { EnrichedOpportunity } from "../components/results/types";

/**
 * Maps a raw row from the canonical `scholarships` table (typed against
 * the locked schema in src/lib/scholarships.ts) into the UI-facing
 * "EnrichedOpportunity"-style shape consumed by Scholarships.tsx and its
 * child components (SearchBar, FilterSidebar, OpportunityGrid, etc.).
 *
 * SDM-001 Track 1: stipend, duration, gender, last_updated, and status
 * are now read from their real Supabase columns (confirmed live via
 * direct schema introspection) rather than proxied/hardcoded. All five
 * are nullable and currently NULL on every existing record, so each is
 * handled with an explicit, documented fallback — see the inline
 * comments at each field below.
 *
 * SDM-001 Track 4b: opportunityType now reads the real, live
 * `opportunity_type` column (added in Track 4a) instead of an
 * unconditional hardcoded literal. Validated against
 * EnrichedOpportunity.opportunityType's existing 14-value union before
 * being trusted — no new union value was invented or added anywhere.
 * `opportunity_type` is NULL on all 24 records as of Track 4a/4b (no
 * backfill has occurred — that is Track 4c, separately authorized), so
 * every record continues to display "Scholarship" until that backfill
 * happens.
 *
 * Fields with no schema equivalent (organizationType, intake,
 * viewsCount, tags, categories, requiredDocuments, applicationTips)
 * remain static/derived defaults — there is nothing to map them from
 * without adding a new column, which is out of scope here.
 */

/**
 * Normalizes the live Supabase `degree_level` vocabulary into the
 * terminology the existing Eligibility scoring function's substring
 * checks (.includes("master"), .includes("bachelor"), etc.) already
 * expect. Explicit lookup table, not a fuzzy transformation -- an
 * unrecognized value is passed through unchanged rather than guessed
 * at, so nothing is silently miscategorized.
 *
 * Grounded in real eligibility-text evidence, not assumption: sampled
 * "Graduate" scholarships each require an already-completed Bachelor's
 * degree as their entry prerequisite (i.e. post-bachelor's, Master's-
 * level study) -- confirmed directly against live data before this
 * mapping was written.
 */
const DEGREE_LEVEL_NORMALIZATION: Record<string, string> = {
  "Graduate": "Master's",
  "Undergraduate": "Bachelor's",
  "PhD": "PhD",
  "Research": "Research",
  "Any": "Any",
};

function normalizeDegreeLevel(rawDegreeLevel: string): string {
  return DEGREE_LEVEL_NORMALIZATION[rawDegreeLevel] ?? rawDegreeLevel;
}

export function mapSupabaseScholarship(s: Scholarship): EnrichedOpportunity {
  // Deadline is nullable in the locked schema (e.g. rolling-admission
  // scholarships). Guard against null before doing date arithmetic —
  // `new Date(null)` silently resolves to the Unix epoch and would
  // otherwise produce a wildly wrong (~20,000-day-overdue) result.
  const hasDeadline = s.deadline !== null && s.deadline !== undefined;
  const daysRemaining = hasDeadline
    ? Math.ceil(
        (new Date(s.deadline as string).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  // Status derivation:
  // - No deadline at all -> "Rolling"
  // - Deadline already passed -> "Closed"
  // - Deadline within 30 days -> "Closing Soon"
  // - Otherwise -> "Open"
  let deadlineDerivedStatus: "Rolling" | "Open" | "Closing Soon" | "Closed";
  if (!hasDeadline || daysRemaining === null) {
    deadlineDerivedStatus = "Rolling";
  } else if (daysRemaining < 0) {
    deadlineDerivedStatus = "Closed";
  } else if (daysRemaining <= 30) {
    deadlineDerivedStatus = "Closing Soon";
  } else {
    deadlineDerivedStatus = "Open";
  }

  // SDM-001 Track 1: the real `status` column exists but has no
  // enforced set of values (no CHECK constraint, no enum — confirmed
  // by direct schema introspection). EnrichedOpportunity.status is a
  // strict 4-value union, so a free-text DB value that doesn't match
  // one of those 4 exact strings must not be trusted directly — that
  // would either fail to compile or silently introduce a status the
  // UI has no styling/logic for. Prefer the real column only when it
  // holds one of the 4 known-valid values; otherwise fall back to the
  // existing deadline-derived computation, so every one of the current
  // 24 records (status is NULL on all of them today) behaves exactly
  // as before.
  const VALID_STATUSES = ["Rolling", "Open", "Closing Soon", "Closed"] as const;
  const status: "Rolling" | "Open" | "Closing Soon" | "Closed" =
    s.status && (VALID_STATUSES as readonly string[]).includes(s.status)
      ? (s.status as "Rolling" | "Open" | "Closing Soon" | "Closed")
      : deadlineDerivedStatus;

  // SDM-001 Track 1: same reasoning for gender — EnrichedOpportunity.gender
  // is a strict "All" | "Women" | "Men" union, and the real `gender`
  // column (also currently NULL on all 24 records) has no enforced
  // value set either. Prefer it when populated and valid; otherwise
  // fall back to the previous target_group-based inference, so the
  // current 24 null-gender records render identically to before —
  // this is the "preserve backward compatibility with NULL values"
  // requirement applied concretely.
  const VALID_GENDERS = ["All", "Women", "Men"] as const;
  const gender: "All" | "Women" | "Men" =
    s.gender && (VALID_GENDERS as readonly string[]).includes(s.gender)
      ? (s.gender as "All" | "Women" | "Men")
      : s.target_group === "Women"
        ? "Women"
        : "All";

  // SDM-001 Track 4b: same validate-then-fallback pattern as status/
  // gender above. EnrichedOpportunity.opportunityType's union is
  // reproduced here verbatim (not modified) purely to validate against
  // — the source of truth for the union itself remains
  // components/results/types.ts.
  const VALID_OPPORTUNITY_TYPES = [
    "Scholarship",
    "Fellowship",
    "Internship",
    "Grant",
    "Conference",
    "Exchange",
    "Research",
    "Competition",
    "Job",
    "Volunteer",
    "Summer School",
    "Training",
    "Accelerator",
    "Incubator",
  ] as const;
  const opportunityType: EnrichedOpportunity["opportunityType"] =
    s.opportunity_type && (VALID_OPPORTUNITY_TYPES as readonly string[]).includes(s.opportunity_type)
      ? (s.opportunity_type as EnrichedOpportunity["opportunityType"])
      : "Scholarship";

  const isFullyFunded = s.funding_type?.toLowerCase().includes("fully") ?? false;

  return {
    id: s.id,
    slug: s.slug,

    title: s.title,

    provider: s.organization,
    organization: s.organization,
    org: s.organization,

    description: s.description || "",
    desc: s.description || "",

    amount: s.benefits || "",

    deadline: s.deadline,
    applicationDeadline: s.deadline,

    country: s.country,
    countries: [s.country],

    level: s.degree_level,
    levels: [s.degree_level],

    academicLevel: s.degree_level,

    field: s.field_of_study || "All Fields",
    fieldOfStudy: s.field_of_study || "All Fields",

    // Fixed: was s.official_website (does not exist in the locked
    // schema) — the real column is application_url.
    link: s.application_url,
    officialWebsite: s.application_url,

    // ES-004 / B2: eligibility/benefits are single semicolon-joined
    // text fields in the locked schema. Previously wrapped as a single-
    // element array, causing the Detail Panel to render one giant
    // run-on bullet instead of one bullet per criterion. Now split into
    // real individual items, trimmed, with empty fragments filtered out.
    eligibility: Array.isArray(s.eligibility)
      ? s.eligibility
      : (s.eligibility ?? "")
          .split(";")
          .map((item) => item.trim())
          .filter((item) => item.length > 0),

    benefits: Array.isArray(s.benefits)
      ? s.benefits
      : (s.benefits ?? "")
          .split(";")
          .map((item) => item.trim())
          .filter((item) => item.length > 0),

    featured: s.featured,

    tags: [],

    categories: [],

    fundingType: s.funding_type || "",

    // SDM-001 Track 1: now reads the real `duration` column instead of
    // an unconditional hardcoded default. Falls back to the same
    // "Not specified" string as before whenever duration is null
    // (true for all 24 current records) — zero behavior change until
    // this column is actually populated.
    duration: s.duration || "Not specified",

    // SDM-001 Track 1: new — the real `stipend` column, previously not
    // read anywhere in this mapper at all. Uses the same "Not specified"
    // honesty convention already established for duration/bondRequired
    // in this exact file, rather than leaving it blank or fabricating
    // a figure.
    stipend: s.stipend || "Not specified",

    fullyFunded: isFullyFunded ? "Yes" : "No",

    // ES-004 / B1: previously hardcoded to "No", presented as a
    // confirmed fact with no backing data. No `bond_required` column
    // exists in the locked schema — "Not specified" is the honest
    // value per the Product Constitution's Trust Principle. A true fix
    // requires a schema addition (Schema v2, out of scope this cycle).
    bondRequired: "Not specified" as "Yes" | "No" | "Not specified",

    requiredDocuments: [],
    applicationTips: [],

    // EnrichedOpportunity fields
    opportunityType,

    // NOTE (technical debt, explicitly out of scope this task, per
    // instruction not to modify educationLevel or subjectArea):
    // hardcoded regardless of the scholarship's real degree_level /
    // field_of_study. Reported below, not fixed.
    // ES-004B: previously hardcoded to "Master's" for every scholarship,
    // which meant every Navbar education-level shortcut (Undergraduate,
    // Graduate/Master's, PhD, Research) silently returned zero results,
    // since real data's educationLevel never varied. Now derived from
    // the real degree_level column, already used correctly elsewhere
    // in this function (see `level`/`academicLevel` above).
    educationLevel: normalizeDegreeLevel(s.degree_level),

    funding: isFullyFunded ? "Fully Funded" : "Partially Funded",

    // SDM-001 Track 1: now derived via the validated `status` const
    // above (real column when valid, deadline-derived fallback
    // otherwise) instead of always being deadline-only.
    status,

    // ES-004 / C3: no `intake` column exists anywhere in the locked
    // schema — unlike subjectArea above, there is genuinely no real
    // data to derive this from. Per Chief Architect guidance, this is
    // hidden/disabled rather than removed: the field, the filter state
    // key, and the filtering predicate in Scholarships.tsx all remain
    // intact for forward compatibility with Schema v2. NOTE: the actual
    // filter *option* for this dimension could not be hidden from the
    // rendered UI as part of this cycle, since FilterSidebar.tsx does
    // not exist as an accessible file in this codebase — flagged as an
    // open item pending that file becoming available.
    intake: "Rolling Intake",

    // SDM-001 Track 1: now derived via the validated `gender` const
    // above — reads the real `gender` column when it holds a valid
    // value, falling back to the previous target_group-based inference
    // only when gender is null/invalid (true for all 24 current
    // records today), preserving identical display behavior for them.
    gender,

    // Also wired to the real target_group column instead of a hardcoded
    // "All" — same root data source as the gender fallback above,
    // surfaced here rather than silently left inconsistent.
    targetGroup: s.target_group || "All",

    // ES-004 / C3 (subject dimension): previously hardcoded to
    // "Business" for every scholarship regardless of real data. Unlike
    // intake/organizationType below, this one has a genuine backing
    // column (field_of_study) already used correctly elsewhere in this
    // function — this is a real fix, not a hidden/disabled default.
    subjectArea: s.field_of_study || "All Fields",

    // ES-004 / C3: same situation as intake above — no `organization_type`
    // column exists in the locked schema. Preserved architecturally,
    // not removed; UI-level hiding pending FilterSidebar.tsx access.
    organizationType: "Government",

    viewsCount: 0,

    // Historical fix: previously read s.last_updated for this exact
    // field, back when that column did not exist — every scholarship
    // showed the identical hardcoded date "2026-07-29". dateAdded is
    // sourced from updated_at (an automatic DB timestamp); see
    // lastUpdated below for the distinct, now-real last_updated column.
    dateAdded: s.updated_at,

    // SDM-001 Track 1: new — the real `last_updated` column, distinct
    // from `updated_at` (an automatic DB timestamp set on any row
    // change) in that `last_updated` is meant to represent a deliberate
    // "verified as of this date" marker. Nullable — currently null on
    // all 24 records — left as null rather than substituting
    // `updated_at` or a fabricated date, so the UI can distinguish
    // "genuinely verified recently" from "unknown."
    lastUpdated: s.last_updated,

    daysRemaining: daysRemaining ?? 9999,
  };
}