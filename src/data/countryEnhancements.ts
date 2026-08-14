/**
 * ES-009A — Destination Guide Final Enhancement.
 *
 * The locked `Country` interface (src/types.ts, ES-004-locked) does
 * not have fields for tuition overview, visa processing time,
 * part-time work rights, post-study work opportunity, or an
 * advantage badge. Rather than request a Controlled Unlock of a
 * locked file for five new fields, this is a separate, new, parallel
 * data structure — keyed by the same `code` already used in
 * `COUNTRIES` (src/data/scholarships.ts) — that `Countries.tsx` (not
 * locked) merges in at render time. `src/types.ts` is not touched at
 * all by this phase.
 *
 * Figures below (visa processing time, tuition overview) are general,
 * reasonable planning estimates, not sourced from a live embassy/
 * university feed — presented as such, not as precisely verified
 * fact, consistent with this project's existing honesty standard for
 * unverified specifics.
 */

export interface CountryEnhancement {
  advantageBadge: string;
  tuitionOverview: string;
  visaProcessingTime: string;
  partTimeWorkRights: string;
  postStudyWorkOpportunity: string;
}

export const COUNTRY_ENHANCEMENTS: Record<string, CountryEnhancement> = {
  US: {
    advantageBadge: "Research Leader",
    tuitionOverview: "$20,000 – $55,000/year at public universities; varies widely by state and program.",
    visaProcessingTime: "3–5 weeks (F-1, after SEVIS + interview)",
    partTimeWorkRights: "On-campus only, up to 20 hrs/week during term (CPT/OPT rules apply for off-campus/internships)",
    postStudyWorkOpportunity: "OPT: 12 months (STEM fields eligible for a 24-month extension)",
  },
  UK: {
    advantageBadge: "One-Year Master's",
    tuitionOverview: "£10,000 – £26,000/year for most Master's programs; higher for medicine/business.",
    visaProcessingTime: "3–8 weeks (Student Visa, standard processing)",
    partTimeWorkRights: "Up to 20 hrs/week during term (most degree levels)",
    postStudyWorkOpportunity: "Graduate Route: 2 years post-study work visa",
  },
  DE: {
    advantageBadge: "No Tuition Fee",
    tuitionOverview: "€0 tuition at most public universities (small per-semester admin fee only)",
    visaProcessingTime: "6–12 weeks (National Student Visa, embassy-dependent)",
    partTimeWorkRights: "120 full days or 240 half days per year",
    postStudyWorkOpportunity: "18-month post-study job-seeker visa extension",
  },
  AU: {
    advantageBadge: "PR Friendly",
    tuitionOverview: "$20,000 – $45,000 AUD/year, varies by university and field.",
    visaProcessingTime: "4–8 weeks (Subclass 500, after Genuine Student assessment)",
    partTimeWorkRights: "Up to 48 hrs per fortnight during term",
    postStudyWorkOpportunity: "Temporary Graduate visa (Subclass 485): 2–4 years depending on qualification",
  },
  JP: {
    advantageBadge: "Technology & Innovation",
    tuitionOverview: "¥535,800/year (~$3,600) at national universities; private universities higher.",
    visaProcessingTime: "4–8 weeks (Certificate of Eligibility + visa stamping)",
    partTimeWorkRights: "Up to 28 hrs/week with a permit (Shikaku-gai Katsudo)",
    postStudyWorkOpportunity: "Up to 1 year job-seeking visa extension after graduation",
  },
  KR: {
    advantageBadge: "Global Korea Scholarship",
    tuitionOverview: "₩2,000,000 – ₩6,000,000/semester (~$1,500–$4,500); GKS recipients receive full tuition coverage.",
    visaProcessingTime: "4–6 weeks (D-2 Student Visa)",
    partTimeWorkRights: "Up to 20–25 hrs/week with permission after 1 semester",
    postStudyWorkOpportunity: "D-10 job-seeking visa: up to 2 years",
  },
  CN: {
    advantageBadge: "Affordable Education",
    tuitionOverview: "¥20,000 – ¥40,000/year (~$2,800–$5,600); CSC scholarship recipients often receive full waivers.",
    visaProcessingTime: "4–8 weeks (X1/X2 Student Visa)",
    partTimeWorkRights: "Limited; requires explicit university and public security bureau approval",
    postStudyWorkOpportunity: "Varies by province; some pilot cities offer short-term post-study work permits",
  },
  IN: {
    advantageBadge: "Regional Excellence",
    tuitionOverview: "₹100,000 – ₹400,000/year (~$1,200–$4,800) for most postgraduate programs; ICCR awardees receive full tuition waivers.",
    visaProcessingTime: "2–4 weeks (Student Visa, e-Visa eligible for some categories)",
    partTimeWorkRights: "Generally not permitted on a standard student visa",
    postStudyWorkOpportunity: "Limited; typically requires a separate work visa/employer sponsorship",
  },
  FI: {
    advantageBadge: "Free Doctoral Studies",
    tuitionOverview: "€8,000 – €20,000/year for non-EU Bachelor's/Master's programs; doctoral studies remain tuition-free for all nationalities.",
    visaProcessingTime: "4–8 weeks (Residence Permit for Studies, via Enter Finland + Kathmandu VFS biometrics)",
    partTimeWorkRights: "Up to 30 hrs/week during term, full-time during official holidays",
    postStudyWorkOpportunity: "Residence permit extension to seek employment or start a business after graduation (typically up to 2 years, field/university dependent)",
  },
  NO: {
    advantageBadge: "Free PhD Study",
    tuitionOverview: "Since 2023, non-EU/EEA students pay tuition at public universities (roughly NOK 80,000 – 340,000/year, institution and program dependent); PhD positions remain tuition-free. Policy changes are under review for 2026 — confirm current rates with the specific university.",
    visaProcessingTime: "8–12 weeks (Study Residence Permit, processed via the Norwegian Embassy in New Delhi)",
    partTimeWorkRights: "Up to 20 hrs/week during term, full-time during holidays",
    postStudyWorkOpportunity: "Limited; typically requires a separate job-seeking permit or direct employer sponsorship after graduation",
  },
  NL: {
    advantageBadge: "12-Month Job Search Visa",
    tuitionOverview: "€2,530/year statutory fee for EU/EEA students; non-EU students typically pay €9,000 – €20,000/year for Bachelor's and €12,000 – €30,000/year for Master's programs, institution-dependent.",
    visaProcessingTime: "4–10 weeks (MVV + residence permit, IND-processed via the enrolling institution)",
    partTimeWorkRights: "Up to 16 hrs/week during term, or full-time in June–August, with an employer work permit (TWV)",
    postStudyWorkOpportunity: "Orientation Year (Zoekjaar) visa: up to 12 months to search for a job or start a business, no employer sponsor required to apply",
  },
  RU: {
    advantageBadge: "Fully Funded Government Quota",
    tuitionOverview: "Government Quota recipients: full tuition covered plus a modest monthly stipend. Self-funded students: tuition varies widely by university and program, with medicine and technical fields typically higher.",
    visaProcessingTime: "4–6 weeks (Student Visa, only after the university's official invitation letter is confirmed by Russian authorities)",
    partTimeWorkRights: "Limited; part-time work generally requires a separate work permit and is uncommon during the mandatory preparatory year",
    postStudyWorkOpportunity: "No dedicated post-study work visa; graduates generally require employer sponsorship or a separate work visa to remain in Russia",
  },
};