/**
 * ES-005C — Search Context builder.
 *
 * Step 1 of the Intelligence Layer pipeline (per Primary Objective):
 * "Convert the Applicant Profile into a Search Context." This is a
 * pure, synchronous transform — no database access happens here. It
 * only decides *what* to look for; the Query Builder decides *how* to
 * ask the database for it.
 */

import { ApplicantProfile, SearchContext } from "./types";

export function buildSearchContext(profile: ApplicantProfile): SearchContext {
  const genderTargetGroup = profile.gender === "Woman" ? "Women" : null;

  return {
    degreeLevel: profile.preferredDegree ?? profile.educationLevel,
    country: profile.preferredCountry,
    fieldOfStudy: profile.fieldOfStudy,
    fundingType: profile.fundingPreference === "Fully Funded" ? "Fully Funded" : null,
    targetGroup: profile.targetGroups[0] ?? genderTargetGroup,
    freeTextTerms: profile.researchInterests,
  };
}