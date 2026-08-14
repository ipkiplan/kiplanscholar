/**
 * ES-007A — Visa Preparation Hub: data model.
 *
 * New, independent module — deliberately self-contained (same pattern as
 * src/components/cv-builder's own type system and countryEnhancements.ts)
 * rather than extending src/types.ts.
 *
 * Keyed by the same `code` values used in COUNTRIES (src/data/scholarships.ts)
 * so this can be looked up directly off a selected Country Guide entry.
 * Scope for this Foundation release is limited to the 12 countries already
 * present in Country Guide — see the ES-007A Completion Report.
 *
 * This module focuses on preparation, not immigration law. Fees and
 * processing times shift over time and by individual case; treat every
 * figure here as an informed estimate, and always verify against the
 * official source linked in `officialResources` before applying.
 */

export interface VisaOverview {
  visaType: string;
  processingTime: string;
  visaFee: string;
  applicationMethod: string;
  embassyOrVfs: string;
  officialWebsite: string;
}

export type DocumentCategoryName =
  | "Identity"
  | "Academic"
  | "Language"
  | "Financial"
  | "Employment"
  | "Additional Country Requirements";

export interface DocumentCategory {
  category: DocumentCategoryName;
  items: string[];
}

export interface OfficialResourceLink {
  label: string;
  url: string;
}

export interface VisaCountryProfile {
  countryCode: string;
  overview: VisaOverview;
  documentCategories: DocumentCategory[];
  nepalGuidance: string[];
  officialResources: OfficialResourceLink[];
}

/**
 * Guidance that applies to every destination, shown once on the Hub
 * rather than duplicated inside each country's Nepal-specific guidance
 * array. Country-specific NEPAL_GUIDANCE entries below cover what differs
 * by destination (embassy location, translation needs, etc.); this
 * covers what doesn't.
 */
export const UNIVERSAL_NEPAL_GUIDANCE: string[] = [
  "The Ministry of Education, Science and Technology (MOEST) No Objection Letter (NOC), applied for online at noc.moest.gov.np, is required before any international tuition transfer and before most visa submissions — apply as soon as you have an admission/offer letter.",
  "All academic transcripts and certificates (SEE/SLC, +2, Bachelor's) typically need MOEST attestation, followed by Ministry of Foreign Affairs (MoFA) verification at Keshar Mahal, before the destination country's embassy will accept them.",
  "Nepali-language documents generally need certified English translation — use a recognised translator and have the translation notarised; embassies routinely reject uncertified translations.",
  "Check your passport's remaining validity early — most destinations require at least 6 months of validity beyond your intended stay, and passport renewal in Nepal can itself take several weeks.",
  "A medical/health examination, at a panel-approved clinic where the destination requires one, and a police clearance certificate from Nepal Police can both take 1–2 weeks to arrange — start early rather than in the final weeks before your interview.",
];

export interface ConsultancyGuidancePoint {
  label: string;
  description: string;
}

/**
 * ES-007A.4 — Education Consultancy Guidance (expanded).
 * Replaces the earlier plain string[] CONSULTANCY_GUIDANCE with
 * labelled points, matching the structured wording supplied in the
 * ES. Consumed by both the on-screen Hub and the PDF generator, so
 * this content is authored once and never duplicated.
 */
export const CONSULTANCY_INTRO: string =
  "A good education consultancy can genuinely simplify the university admission and student visa process, but the quality of services varies significantly. KIPLANScholar does not recommend individual consultancies. Instead, consider the following factors before deciding whom to work with.";

export const CONSULTANCY_GUIDANCE: ConsultancyGuidancePoint[] = [
  {
    label: "Destination expertise",
    description:
      "Choose a consultancy with proven experience in your intended destination country and programme level, not just general study-abroad services.",
  },
  {
    label: "Track record",
    description:
      "Ask about their recent admission and student visa success for your chosen destination, rather than relying only on overall figures.",
  },
  {
    label: "Transparency",
    description:
      "Request a written explanation of fees, services included, expected timelines, and any additional charges before making a commitment.",
  },
  {
    label: "Complete document checklist",
    description:
      "A professional consultancy should provide a comprehensive document checklist at the beginning of the process so students can prepare efficiently and avoid unnecessary delays.",
  },
  {
    label: "Communication",
    description:
      "Observe how clearly and promptly they respond during the initial consultation. This often reflects the quality of support you will receive later.",
  },
  {
    label: "Ethical practices",
    description:
      "Never work with a consultancy that suggests falsifying documents, inflating financial information, misrepresenting sponsors, or providing misleading information. Such practices may result in refusal of admission or visa and may affect future applications.",
  },
];

export interface DocumentProtectionGuidance {
  heading: string;
  intro: string;
  points: string[];
  closing: string;
}

export const DOCUMENT_PROTECTION_GUIDANCE: DocumentProtectionGuidance = {
  heading: "Protect Your Original Documents",
  intro:
    "Before handing over original academic certificates, transcripts, passport, or other valuable documents:",
  points: [
    "Decide which consultancy you wish to work with before submitting original documents.",
    "Ask whether certified copies are sufficient instead of originals whenever possible.",
    "Request a written acknowledgement (receipt) for any original documents submitted.",
    "Confirm when and under what conditions your original documents will be returned.",
    "Keep scanned copies and photocopies of all important documents for your own records.",
  ],
  closing:
    "Keeping control of your original documents allows you to compare services from different consultancies and make an informed decision before committing to one provider.",
};

export const VISA_PREPARATION: Record<string, VisaCountryProfile> = {
  US: {
    countryCode: "US",
    overview: {
      visaType: "F-1 Student Visa (non-immigrant)",
      processingTime: "Varies by embassy interview wait times — typically several weeks; book your interview as soon as your I-20 and SEVIS payment are ready",
      visaFee: "SEVIS I-901 fee: $350 + DS-160 visa application fee: $185 (total ≈ $535)",
      applicationMethod: "Online DS-160 form, SEVIS fee paid at fmjfee.com, interview scheduled via the official appointment system",
      embassyOrVfs: "U.S. Embassy, Maharajgunj, Kathmandu (in-person interview required)",
      officialWebsite: "https://ceac.state.gov",
    },
    documentCategories: [
      { category: "Identity", items: ["Valid passport (6+ months beyond intended stay)", "Recent visa-compliant photograph", "DS-160 confirmation page with barcode"] },
      { category: "Academic", items: ["Form I-20 issued by your U.S. institution", "Academic transcripts and certificates (SEE/+2/Bachelor's as applicable)", "Standardized test scores (SAT/GRE/GMAT where required)"] },
      { category: "Language", items: ["TOEFL/IELTS/Duolingo scores as required by your institution"] },
      { category: "Financial", items: ["Proof of funds covering tuition and living costs (bank statements, sponsor letters, loan approval)", "SEVIS fee payment receipt", "Scholarship or funding letters if applicable"] },
      { category: "Employment", items: ["Sponsor's employment/income verification letter if a family member is funding your studies"] },
      { category: "Additional Country Requirements", items: ["Evidence of ties to Nepal (property, family, career plans) to support non-immigrant intent", "SEVIS-registered I-20 with correct program dates"] },
    ],
    nepalGuidance: [
      "The visa interview is the single most weighted step — be ready to clearly explain your program choice, funding source, and plans to return to Nepal after graduation.",
      "Pay the SEVIS fee at least 3 business days before your interview date; payment confirmation must be printed and carried to the interview.",
    ],
    officialResources: [
      { label: "DS-160 Online Application (CEAC)", url: "https://ceac.state.gov" },
      { label: "SEVIS I-901 Fee Payment", url: "https://www.fmjfee.com" },
      { label: "U.S. Department of State — Study in the States", url: "https://studyinthestates.dhs.gov" },
    ],
  },

  UK: {
    countryCode: "UK",
    overview: {
      visaType: "Student Route Visa",
      processingTime: "Typically 3–8 weeks after biometrics",
      visaFee: "£558 application fee + Immigration Health Surcharge (IHS) of £776/year",
      applicationMethod: "Online application via GOV.UK, followed by document submission and biometrics at VFS Global",
      embassyOrVfs: "VFS Global Visa Application Centre, Kathmandu",
      officialWebsite: "https://www.gov.uk/student-visa",
    },
    documentCategories: [
      { category: "Identity", items: ["Valid passport", "Recent photograph", "Biometric Residence data (collected at VFS)"] },
      { category: "Academic", items: ["Confirmation of Acceptance for Studies (CAS) from your UK institution", "Academic transcripts and certificates"] },
      { category: "Language", items: ["IELTS for UKVI or equivalent Secure English Language Test (SELT) results"] },
      { category: "Financial", items: ["28 consecutive days of bank statements meeting the required maintenance funds threshold", "Tuberculosis (TB) test certificate from an approved clinic"] },
      { category: "Employment", items: ["Sponsor's income and employment documents, where a family member is funding the studies"] },
      { category: "Additional Country Requirements", items: ["MOEST No Objection Letter (NOC)", "IHS payment confirmation"] },
    ],
    nepalGuidance: [
      "The Home Office's 28-day financial rule is strictly enforced — funds must sit continuously above the required threshold for 28 days before you apply; a single day's shortfall can mean refusal.",
      "Self-uploading documents is no longer available for Nepal — all documents must go through VFS Global Kathmandu, so plan your VFS appointment well ahead of your intended travel date.",
    ],
    officialResources: [
      { label: "UK Government — Student Visa", url: "https://www.gov.uk/student-visa" },
      { label: "VFS Global — UK Visa Application (Nepal)", url: "https://visa.vfsglobal.com/npl/en/gbr" },
    ],
  },

  DE: {
    countryCode: "DE",
    overview: {
      visaType: "National (Type D) Visa — Studies category",
      processingTime: "Typically 4–12 weeks after your embassy appointment; total process from APS to visa often runs 3–6 months",
      visaFee: "€75 (paid in NPR cash equivalent at the embassy); waived for DAAD/EU public-fund scholarship holders",
      applicationMethod: "VIDEX online form + Blocked account (Sperrkonto) setup + in-person embassy appointment",
      embassyOrVfs: "Embassy of the Federal Republic of Germany, Gyaneshwor, Kathmandu",
      officialWebsite: "https://kathmandu.diplo.de",
    },
    documentCategories: [
      { category: "Identity", items: ["Valid passport", "Biometric photograph", "Completed VIDEX application form"] },
      { category: "Academic", items: ["University admission letter (Zulassungsbescheid)", "APS Certificate (mandatory academic credential verification for Nepal)", "Transcripts and degree certificates"] },
      { category: "Language", items: ["German language proof (if required) or English proficiency for English-taught programs"] },
      { category: "Financial", items: ["Blocked account (Sperrkonto) confirmation showing €11,904/year", "Health insurance confirmation"] },
      { category: "Employment", items: ["Not typically required unless a sponsor's income is being used as additional proof of funds"] },
      { category: "Additional Country Requirements", items: ["APS interview/certificate scheduled through the APS Office in Kathmandu", "MOEST NOC"] },
    ],
    nepalGuidance: [
      "APS certificate verification is mandatory for Nepali applicants and is often the longest step (6–8 weeks) — start this before you finalise your blocked account.",
      "Set up your blocked account (Sperrkonto) only after admission is confirmed; several providers serve Nepali students, and funding it can take a few working days once opened.",
    ],
    officialResources: [
      { label: "German Embassy Kathmandu — Study Visa", url: "https://kathmandu.diplo.de" },
      { label: "DAAD — Study in Germany", url: "https://www.daad.de" },
    ],
  },

  AU: {
    countryCode: "AU",
    overview: {
      visaType: "Student Visa (Subclass 500)",
      processingTime: "4–12 weeks typical for Nepal-origin applications; can extend to 3+ months in high-volume periods",
      visaFee: "AUD 2,500 (base application, non-refundable; additional fees apply for dependants)",
      applicationMethod: "Online via ImmiAccount, including the Genuine Student (GS) statement",
      embassyOrVfs: "VFS Global Visa Application Centre, Kathmandu (biometrics); decisions made by the Department of Home Affairs",
      officialWebsite: "https://immi.homeaffairs.gov.au",
    },
    documentCategories: [
      { category: "Identity", items: ["Valid passport", "Recent photograph"] },
      { category: "Academic", items: ["Confirmation of Enrolment (CoE) from a CRICOS-registered institution", "Academic transcripts and certificates"] },
      { category: "Language", items: ["IELTS, PTE, or equivalent English test results meeting the current threshold"] },
      { category: "Financial", items: ["Evidence of funds meeting the AUD 29,710/year living cost requirement", "Overseas Student Health Cover (OSHC) confirmation"] },
      { category: "Employment", items: ["Sponsor income/employment verification where applicable"] },
      { category: "Additional Country Requirements", items: ["Genuine Student (GS) statement", "MOEST NOC"] },
    ],
    nepalGuidance: [
      "The Genuine Student statement replaced the old GTE test — it must be specific and personal, connecting your academic background, course choice, and career plans in Nepal; generic or templated statements are flagged quickly.",
      "Nepal is treated as a higher-scrutiny (Assessment Level 3) country, so processing and document verification can run longer than average — apply as early as your CoE allows.",
    ],
    officialResources: [
      { label: "Department of Home Affairs — Student Visa (500)", url: "https://immi.homeaffairs.gov.au" },
      { label: "VFS Global — Australia Visa (Nepal)", url: "https://visa.vfsglobal.com/npl/en/aus" },
    ],
  },

  JP: {
    countryCode: "JP",
    overview: {
      visaType: "College Student Visa (via Certificate of Eligibility)",
      processingTime: "COE issuance by Japanese Immigration: 1–3 months; embassy visa stamping after COE: 5–7 business days",
      visaFee: "Varies by visa class (single/multiple entry); confirm current amount with the Embassy/VFS at application time",
      applicationMethod: "Your Japanese institution applies for your Certificate of Eligibility (COE) on your behalf; you then submit the COE at the visa application stage",
      embassyOrVfs: "VFS Japan Visa Application Centre, Kathmandu (under the Embassy of Japan's jurisdiction)",
      officialWebsite: "https://www.np.emb-japan.go.jp",
    },
    documentCategories: [
      { category: "Identity", items: ["Valid passport", "Recent photograph"] },
      { category: "Academic", items: ["Certificate of Eligibility (COE) from Japanese Immigration", "Admission/enrolment letter from your Japanese institution", "Academic transcripts and certificates"] },
      { category: "Language", items: ["JLPT results if the program is Japanese-taught"] },
      { category: "Financial", items: ["Sponsor's bank statements covering tuition plus living costs (commonly cited around JPY 100,000/month)", "Tax/income documents for the sponsor"] },
      { category: "Employment", items: ["Sponsor's employment verification letter"] },
      { category: "Additional Country Requirements", items: ["Pre-entry TB screening (JPETS) — required for applicants from Nepal as a specified country", "MOEST NOC"] },
    ],
    nepalGuidance: [
      "Unlike most countries, you don't apply for the COE yourself — your institution does. Confirm with your school early on their typical COE turnaround, since this is usually the longest stage of the whole process.",
      "Budget the pre-entry TB screening (JPETS) into your timeline; it applies specifically to applicants from Nepal and a few other countries and must be completed before the visa stage.",
    ],
    officialResources: [
      { label: "Embassy of Japan in Nepal", url: "https://www.np.emb-japan.go.jp" },
      { label: "Japan Immigration Services Agency", url: "https://www.moj.go.jp/isa" },
    ],
  },

  KR: {
    countryCode: "KR",
    overview: {
      visaType: "D-2 Visa (Degree Program) or D-4 Visa (Language/General Training)",
      processingTime: "Minimum ~21 working days per the Embassy; longer during peak March/September intake periods",
      visaFee: "Varies by visa class — confirm current fee with the Embassy at application time",
      applicationMethod: "In-person application at the Embassy of the Republic of Korea, after your Korean institution issues a Certificate of Admission",
      embassyOrVfs: "Embassy of the Republic of Korea, Kathmandu",
      officialWebsite: "https://overseas.mofa.go.kr",
    },
    documentCategories: [
      { category: "Identity", items: ["Valid passport (6+ months validity)", "Recent photograph", "Completed visa application form"] },
      { category: "Academic", items: ["Certificate of Admission/Enrollment from your Korean institution", "Apostilled academic transcripts and certificates"] },
      { category: "Language", items: ["TOPIK results for Korean-medium programs; IELTS/TOEFL for English-taught programs"] },
      { category: "Financial", items: ["Bank statement showing sufficient funds (commonly cited around KRW 18–20 million) or scholarship documentation", "Tuition payment receipt for the first semester"] },
      { category: "Employment", items: ["Sponsor's income verification and tax documents where applicable"] },
      { category: "Additional Country Requirements", items: ["Tuberculosis (TB) test certificate", "MOEST NOC"] },
    ],
    nepalGuidance: [
      "Document verification and TB testing rules for Nepali applicants are specific — always check the Embassy's current published requirements rather than relying on older guides, since Korea has periodically run batch/bulk verification windows for Nepali universities.",
      "Apply at least 3–4 weeks before your intended departure to accommodate the minimum 21 working-day processing window.",
    ],
    officialResources: [
      { label: "Embassy of the Republic of Korea in Nepal", url: "https://overseas.mofa.go.kr" },
      { label: "Hi Korea — Immigration & Visa Portal", url: "https://www.hikorea.go.kr" },
    ],
  },

  CN: {
    countryCode: "CN",
    overview: {
      visaType: "X1 Visa (long-term study, over 180 days) or X2 Visa (short-term study, up to 180 days)",
      processingTime: "Typically around 4 working days once your file is complete, though this varies seasonally",
      visaFee: "Varies by nationality/reciprocity; confirm current amount at the visa centre",
      applicationMethod: "In-person application with JW201/JW202 form and Admission Notice from your Chinese institution",
      embassyOrVfs: "Chinese Visa Application Service Center (CVASC), Kathmandu",
      officialWebsite: "https://np.china-embassy.gov.cn",
    },
    documentCategories: [
      { category: "Identity", items: ["Valid passport (6+ months validity, blank visa pages)", "Recent photograph", "Completed visa application form"] },
      { category: "Academic", items: ["Admission Notice from your Chinese institution", "JW201 or JW202 form", "Academic transcripts and certificates"] },
      { category: "Language", items: ["HSK results for Chinese-taught programs; IELTS/TOEFL for English-taught programs"] },
      { category: "Financial", items: ["Bank statements or scholarship confirmation covering tuition and living costs", "A steady balance history — funds deposited immediately before applying are a common cause for extra scrutiny"] },
      { category: "Employment", items: ["Sponsor's employment/income documents where applicable"] },
      { category: "Additional Country Requirements", items: ["Physical examination form (re-examination is typically required again after arrival in China)", "MOEST NOC"] },
    ],
    nepalGuidance: [
      "X1 visa holders must convert to a residence permit at the local Exit-Entry Administration Bureau within 30 days of arrival — this is a separate step from the visa itself, so don't treat the X1 stamp as the end of the process.",
      "Apply at least 3–4 weeks before departure, and keep bank balances stable well in advance rather than depositing a lump sum right before applying.",
      "Beyond the well-known Chinese Government Scholarship (CSC), Nepali students may also find funding through university-specific scholarships, provincial government scholarships, or the Nepal–China Bilateral Government Scholarship Programme (where applicable) — this is one of several available pathways, not the only one, so check current availability with your target university and MOEST.",
    ],
    officialResources: [
      { label: "Chinese Embassy in Nepal", url: "https://np.china-embassy.gov.cn" },
      { label: "China Scholarship Council (CSC)", url: "https://www.csc.edu.cn" },
    ],
  },

  IN: {
    countryCode: "IN",
    overview: {
      visaType: "Student Visa (multiple-entry, for the duration of the course)",
      processingTime: "Generally faster than Western destinations, though it can extend during peak intake periods; confirm current timelines with the Visa Service Centre",
      visaFee: "Varies by fee category/reciprocity; confirm current amount on the official portal",
      applicationMethod: "Online application at indianvisaonline.gov.in, followed by document submission at the Indian Visa Service Centre",
      embassyOrVfs: "Indian Visa Service Centre / Embassy of India, Kathmandu",
      officialWebsite: "https://indianvisaonline.gov.in/visa/",
    },
    documentCategories: [
      { category: "Identity", items: ["Valid passport (6+ months validity)", "Recent photograph (2×2 inch, white background)", "Printed and signed online visa application form"] },
      { category: "Academic", items: ["Admission/offer letter from your Indian institution", "Academic transcripts and certificates"] },
      { category: "Language", items: ["English proficiency evidence where the program requires it (often waived for Nepali applicants at partner institutions)"] },
      { category: "Financial", items: ["Bank statements or ICCR/scholarship confirmation showing sufficient funds"] },
      { category: "Employment", items: ["Sponsor's income verification where applicable"] },
      { category: "Additional Country Requirements", items: ["MOEST NOC (standard registration; typically no separate visa-linked NOC beyond this)"] },
    ],
    nepalGuidance: [
      "As a close and frequently travelled destination, requirements are generally lighter than Western countries, but the online form must still be completed and printed before your Visa Service Centre appointment — don't skip that step.",
      "ICCR scholarship recipients receive visa-processing support directly through the scheme; confirm the specific process with your ICCR liaison if you're an awardee.",
    ],
    officialResources: [
      { label: "Indian Visa Online (Official)", url: "https://indianvisaonline.gov.in/visa/" },
      { label: "Embassy of India, Kathmandu", url: "https://www.indembkathmandu.gov.in" },
    ],
  },

  FI: {
    countryCode: "FI",
    overview: {
      visaType: "Residence Permit for Studies (for stays over 90 days)",
      processingTime: "Typically 4–8 weeks; application queues can add 1–2 months before an appointment is offered",
      visaFee: "Confirm current fee on Enter Finland at application time",
      applicationMethod: "Online via the Enter Finland e-service, followed by biometrics at the Embassy/VFS in Kathmandu",
      embassyOrVfs: "Embassy of Finland, Kathmandu (VFS Global handles biometrics/appointments)",
      officialWebsite: "https://enterfinland.fi",
    },
    documentCategories: [
      { category: "Identity", items: ["Valid passport", "Recent photograph", "Proof of legal residency in Nepal (a Nepali visa does not count as proof of residency)"] },
      { category: "Academic", items: ["Admission letter from your Finnish institution", "Academic transcripts and certificates"] },
      { category: "Language", items: ["IELTS or equivalent for English-taught programs"] },
      { category: "Financial", items: ["Proof of funds meeting Migri's minimum monthly requirement", "Tuition payment confirmation if applicable"] },
      { category: "Employment", items: ["Sponsor's income verification where applicable"] },
      { category: "Additional Country Requirements", items: ["MOEST NOC", "Certified English translations of all Nepali-language documents, legalised first by MoFA and then by the Embassy of Finland"] },
    ],
    nepalGuidance: [
      "The queue for an appointment at the Embassy in Kathmandu can itself take 1–2 months, separate from the processing time after you apply — factor this into your overall timeline.",
      "Nepali-language documents must be translated into English and legalised first by Nepal's Ministry of Foreign Affairs, then by the Embassy of Finland, before submission.",
    ],
    officialResources: [
      { label: "Enter Finland — Residence Permit Application", url: "https://enterfinland.fi" },
      { label: "Embassy of Finland, Kathmandu", url: "https://finlandabroad.fi/web/npl" },
    ],
  },

  NO: {
    countryCode: "NO",
    overview: {
      visaType: "Study Residence Permit",
      processingTime: "Typically 8–12 weeks",
      visaFee: "Approximately EUR 90 visa fee + EUR 20 VFS service charge (confirm current amount at application time)",
      applicationMethod: "Online via the Application Portal Norway, submitted and biometrics collected via VFS Global Kathmandu; case processed by the Norwegian Embassy in New Delhi",
      embassyOrVfs: "VFS Global Visa Application Centre, Kathmandu (case processed by the Royal Norwegian Embassy, New Delhi)",
      officialWebsite: "https://www.udi.no",
    },
    documentCategories: [
      { category: "Identity", items: ["Valid passport", "Recent photograph"] },
      { category: "Academic", items: ["Admission letter from your Norwegian institution", "Academic transcripts and certificates"] },
      { category: "Language", items: ["IELTS/TOEFL for English-taught programs; Norwegian proficiency only for Norwegian-taught degrees"] },
      { category: "Financial", items: ["Proof of funds meeting UDI's minimum annual living-cost requirement", "Tuition payment confirmation, where the program charges tuition"] },
      { category: "Employment", items: ["Sponsor's income verification where applicable"] },
      { category: "Additional Country Requirements", items: ["MOEST NOC"] },
    ],
    nepalGuidance: [
      "Norway doesn't process Nepal applications locally — your file is submitted at VFS Kathmandu but decided by the Norwegian Embassy in New Delhi, which adds transit time (48–72 hours) into the standard processing window.",
      "Your passport is returned to VFS Kathmandu once a decision is made, so there's no need to travel to New Delhi yourself.",
    ],
    officialResources: [
      { label: "Norwegian Directorate of Immigration (UDI)", url: "https://www.udi.no" },
      { label: "Norway in Nepal — Visa Services", url: "https://www.norway.no/en/nepal" },
    ],
  },

  NL: {
    countryCode: "NL",
    overview: {
      visaType: "MVV (entry visa) + Residence Permit for Study",
      processingTime: "Typically 4–10 weeks; usually applied for on your behalf by your enrolling institution",
      visaFee: "Confirm current fee with the IND; often invoiced through your enrolling institution",
      applicationMethod: "Your Dutch institution submits the MVV/residence permit application to the IND on your behalf",
      embassyOrVfs: "VFS Global Visa Application Centre, Kathmandu (case forwarded to the Embassy of the Netherlands, New Delhi)",
      officialWebsite: "https://ind.nl",
    },
    documentCategories: [
      { category: "Identity", items: ["Valid passport", "Recent photograph"] },
      { category: "Academic", items: ["Admission/enrolment confirmation from your Dutch institution", "Academic transcripts and certificates"] },
      { category: "Language", items: ["IELTS/TOEFL for English-taught programs"] },
      { category: "Financial", items: ["Proof of funds meeting the IND's monthly living-cost requirement", "Tuition payment confirmation"] },
      { category: "Employment", items: ["Sponsor's income verification where applicable"] },
      { category: "Additional Country Requirements", items: ["MOEST NOC"] },
    ],
    nepalGuidance: [
      "The Netherlands has no embassy in Nepal — your file goes through VFS Kathmandu to the Embassy in New Delhi for adjudication, so build that transit time into your planning.",
      "Because your institution typically submits the MVV/residence permit application on your behalf, confirm early with your university's international office exactly what they need from you and by when.",
    ],
    officialResources: [
      { label: "Immigration and Naturalisation Service (IND)", url: "https://ind.nl" },
      { label: "Study in NL — Visa & Residence Permit", url: "https://www.studyinnl.org" },
    ],
  },

  RU: {
    countryCode: "RU",
    overview: {
      visaType: "Student Visa",
      processingTime: "Typically 4–6 weeks, but only after the university's official invitation (приглашение) is confirmed by Russian authorities",
      visaFee: "Varies by visa class; confirm current fee at the Embassy",
      applicationMethod: "Your Russian host university submits an official invitation to the Russian Ministry of Internal Affairs; you then apply for the visa once the invitation is issued",
      embassyOrVfs: "Embassy of the Russian Federation, Kathmandu",
      officialWebsite: "https://education-in-russia.com",
    },
    documentCategories: [
      { category: "Identity", items: ["Valid passport", "Recent photograph", "Completed visa application form"] },
      { category: "Academic", items: ["University invitation letter (приглашение)", "Academic transcripts and certificates"] },
      { category: "Language", items: ["Not required at entry for the mandatory preparatory year; Russian proficiency develops during that year for Russian-taught programs"] },
      { category: "Financial", items: ["For Government Quota recipients: confirmation of scholarship award (tuition and stipend covered)", "For self-funded students: bank statements covering tuition and living costs"] },
      { category: "Employment", items: ["Sponsor's income verification where applicable, for self-funded applicants"] },
      { category: "Additional Country Requirements", items: ["Medical certificate/health insurance as required by your host university", "MOEST NOC"] },
    ],
    nepalGuidance: [
      "The invitation letter from your Russian university is the gating step — you cannot apply for the visa before it's confirmed, so keep in close contact with your university or the Russian House in Kathmandu (for Government Quota applicants) on its status.",
      "Government Quota (Rossotrudnichestvo) applicants go through a distinct selection process coordinated by the Russian House in Kathmandu, separate from the visa application itself.",
      "Beyond the Russian Government Scholarship (Rossotrudnichestvo Quota), Nepali students may also find funding through university-specific scholarships or the Nepal–Russia Bilateral Government Scholarship Programme (where applicable) — this is one of several available pathways, not the only one, so check current availability with your target university and MOEST.",
    ],
    officialResources: [
      { label: "Education in Russia (Official Government Quota Portal)", url: "https://education-in-russia.com" },
      { label: "Embassy of the Russian Federation in Nepal", url: "https://nepal.mid.ru" },
    ],
  },
};