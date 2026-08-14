/**
 * ES-010C - University Comparison: comparison engine.
 *
 * Migrated from the retired src/data/universities.ts foundation to the
 * canonical src/lib/universities.ts service layer (see the University
 * Modules Reconciliation Report). University.country now stores a full
 * country name directly (e.g. "Germany"), not a 2-letter code, so the
 * old COUNTRY_NAMES translation layer is gone entirely - one less
 * moving part, not just a renamed import.
 *
 * This is still the "no duplicated logic, reuse existing architecture"
 * piece. It does not hold any new data of its own - it only reads
 * from three already-existing sources and combines them at render
 * time:
 *   - University (src/lib/universities.ts) - canonical since ES-010A
 *   - COUNTRIES / COUNTRY_ENHANCEMENTS (src/data/scholarships.ts,
 *     src/data/countryEnhancements.ts) - Country Guide, unmodified.
 *     Both COUNTRY_ENHANCEMENTS and VISA_PREPARATION are keyed by
 *     country CODE (e.g. "US"), not name - so every lookup below goes
 *     through the matched Country entry's code, never through
 *     university.country directly.
 *   - VISA_PREPARATION (src/data/visaPreparation.ts) - Visa
 *     Preparation Hub, unmodified
 *   - SCHOLARSHIPS (src/data/scholarships.ts) - matched here by
 *     country name, not duplicated into a new shape
 *
 * "Future Ready" architecture unchanged from the original design:
 * criteria are a plain data array (ComparisonCriterion[]), each with a
 * getValue resolver. Both ComparisonTable and ComparisonCards map
 * over this same array - they have no per-field logic of their own,
 * and needed zero changes during this migration.
 */

import { University } from "../../lib/universities";
import { COUNTRIES } from "../../data/scholarships";
import { COUNTRY_ENHANCEMENTS } from "../../data/countryEnhancements";
import { VISA_PREPARATION } from "../../data/visaPreparation";
import { SCHOLARSHIPS } from "../../data/scholarships";

export const NOT_YET_AVAILABLE = "Not yet available";

export interface UniversityComparisonRow {
  university: University;
  countryName: string;
  countryFlag: string;
  scholarshipCount: number;
  degreeLevels: string;
  tuition: string;
  livingCost: string;
  englishRequirement: string;
  workWhileStudying: string;
  postStudyWork: string;
  visaGuide: string;
  nextApplicationDeadline: string;
}

export function buildComparisonRow(university: University): UniversityComparisonRow {
  const countryEntry = COUNTRIES.find((c) => c.name === university.country);
  const hasGuideCoverage = !!countryEntry;

  const enhancement = countryEntry ? COUNTRY_ENHANCEMENTS[countryEntry.code] : undefined;
  const visaProfile = countryEntry ? VISA_PREPARATION[countryEntry.code] : undefined;

  const matchingScholarships = SCHOLARSHIPS.filter((s) => s.country === university.country);
  const degreeLevelSet = new Set(matchingScholarships.map((s) => s.level).filter(Boolean));
  const upcomingDeadlines = matchingScholarships
    .map((s) => s.deadline)
    .filter((d): d is string => !!d && /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort();

  return {
    university,
    countryName: university.country,
    countryFlag: countryEntry?.flag ?? "",
    scholarshipCount: matchingScholarships.length,
    degreeLevels: degreeLevelSet.size > 0 ? Array.from(degreeLevelSet).join(", ") : NOT_YET_AVAILABLE,
    tuition: hasGuideCoverage && enhancement ? enhancement.tuitionOverview : NOT_YET_AVAILABLE,
    livingCost: hasGuideCoverage && countryEntry ? countryEntry.averageCostOfLiving : NOT_YET_AVAILABLE,
    englishRequirement: hasGuideCoverage && countryEntry ? countryEntry.languageRequirements : NOT_YET_AVAILABLE,
    workWhileStudying: hasGuideCoverage && enhancement ? enhancement.partTimeWorkRights : NOT_YET_AVAILABLE,
    postStudyWork: hasGuideCoverage && enhancement ? enhancement.postStudyWorkOpportunity : NOT_YET_AVAILABLE,
    visaGuide: hasGuideCoverage && visaProfile ? visaProfile.overview.visaType : hasGuideCoverage && countryEntry ? countryEntry.visaGuidance : NOT_YET_AVAILABLE,
    nextApplicationDeadline: upcomingDeadlines.length > 0 ? upcomingDeadlines[0] : matchingScholarships.length > 0 ? "Rolling / Varies by Scholarship" : NOT_YET_AVAILABLE,
  };
}

export interface ComparisonCriterion {
  key: string;
  label: string;
  getValue: (row: UniversityComparisonRow) => string;
}

export const COMPARISON_CRITERIA: ComparisonCriterion[] = [
  { key: "country", label: "Country", getValue: (r) => `${r.countryFlag} ${r.countryName}`.trim() },
  { key: "university", label: "University", getValue: (r) => r.university.name },
  { key: "city", label: "City", getValue: (r) => r.university.city },
  { key: "type", label: "Type", getValue: (r) => r.university.publicPrivate ?? NOT_YET_AVAILABLE },
  { key: "degreeLevels", label: "Degree Levels (via matched scholarships)", getValue: (r) => r.degreeLevels },
  { key: "tuition", label: "Estimated Tuition", getValue: (r) => r.tuition },
  { key: "scholarships", label: "Available Scholarships", getValue: (r) => (r.scholarshipCount > 0 ? `${r.scholarshipCount} in KIPLANScholar's database` : NOT_YET_AVAILABLE) },
  { key: "livingCost", label: "Living Cost", getValue: (r) => r.livingCost },
  { key: "deadline", label: "Application Deadline", getValue: (r) => r.nextApplicationDeadline },
  { key: "englishRequirement", label: "English Requirement", getValue: (r) => r.englishRequirement },
  { key: "workWhileStudying", label: "Work While Studying", getValue: (r) => r.workWhileStudying },
  { key: "postStudyWork", label: "Post-study Work", getValue: (r) => r.postStudyWork },
  { key: "visaGuide", label: "Visa Guide", getValue: (r) => r.visaGuide },
  { key: "notes", label: "Notes", getValue: (r) => r.university.notes ?? NOT_YET_AVAILABLE },
];