import { SCHOLARSHIPS } from "../../data/scholarships";
import { EnrichedOpportunity } from "./types";

// Helper to calculate deadline info dynamically relative to July 21, 2026
export function calculateDeadlineInfo(
  deadlineStr: string,
  openingDateStr?: string
): { status: EnrichedOpportunity["status"]; daysRemaining: number } {
  const referenceDate = new Date("2026-07-21");
  
  if (!deadlineStr || deadlineStr.toLowerCase().includes("rolling")) {
    return {
      status: "Open" as const,
      daysRemaining: 365,
    };
  }

  const deadlineDate = new Date(deadlineStr);
  if (isNaN(deadlineDate.getTime())) {
    return {
      status: "Open" as const,
      daysRemaining: 365,
    };
  }

  // Check if it's opening soon (if opening date is in the future)
  if (openingDateStr) {
    const openingDate = new Date(openingDateStr);
    if (!isNaN(openingDate.getTime()) && openingDate > referenceDate) {
      return {
        status: "Opening Soon" as EnrichedOpportunity["status"],
        daysRemaining: Math.ceil((deadlineDate.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24)),
      };
    }
  }

  const diffTime = deadlineDate.getTime() - referenceDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      status: "Closed" as const,
      daysRemaining: diffDays,
    };
  } else if (diffDays <= 30) {
    return {
      status: "Closing Soon" as const,
      daysRemaining: diffDays,
    };
  } else {
    return {
      status: "Open" as const,
      daysRemaining: diffDays,
    };
  }
}

// Map the original scholarships to Enriched Opportunities
const enrichedFromOriginal: EnrichedOpportunity[] = SCHOLARSHIPS.map((s, index) => {
  // Infer opportunity Type
  let opportunityType: EnrichedOpportunity["opportunityType"] = "Scholarship";
  if (s.title.toLowerCase().includes("fellowship")) {
    opportunityType = "Fellowship";
  } else if (s.title.toLowerCase().includes("grant")) {
    opportunityType = "Grant";
  }

  // Infer education level
  let educationLevel: EnrichedOpportunity["educationLevel"] = "Master's";
  if (s.academicLevel.toLowerCase().includes("phd") || s.academicLevel.toLowerCase().includes("doctor")) {
    educationLevel = "PhD";
  } else if (s.academicLevel.toLowerCase().includes("undergrad") || s.academicLevel.toLowerCase().includes("bachelor")) {
    educationLevel = "Bachelor's";
  } else if (s.academicLevel.toLowerCase().includes("postdoc")) {
    educationLevel = "Postdoctoral";
  } else if (s.academicLevel.toLowerCase().includes("research")) {
    educationLevel = "Research";
  }

  // Infer Funding Type
  let funding: EnrichedOpportunity["funding"] = s.fullyFunded === "Yes" ? "Fully Funded" : "Partially Funded";
  if (s.amount.toLowerCase().includes("stipend") || s.title.toLowerCase().includes("fellowship")) {
    funding = "Fully Funded";
  }

  // Calculate deadline and status
  const { status, daysRemaining } = calculateDeadlineInfo(s.applicationDeadline ?? "");

  // Infer Subject Area
  let subjectArea: EnrichedOpportunity["subjectArea"] = "Business";
  const studyField = s.fieldOfStudy.toLowerCase();
  if (studyField.includes("stem") || studyField.includes("science") || studyField.includes("engineering") || studyField.includes("tech")) {
    subjectArea = "Engineering";
  } else if (studyField.includes("ai") || studyField.includes("intelligence")) {
    subjectArea = "AI";
  } else if (studyField.includes("computer") || studyField.includes("coding")) {
    subjectArea = "Computer Science";
  } else if (studyField.includes("data")) {
    subjectArea = "Data Science";
  } else if (studyField.includes("medicine") || studyField.includes("health")) {
    subjectArea = "Medicine";
  } else if (studyField.includes("public health")) {
    subjectArea = "Public Health";
  } else if (studyField.includes("agriculture")) {
    subjectArea = "Agriculture";
  } else if (studyField.includes("climate") || studyField.includes("environment") || studyField.includes("energy")) {
    subjectArea = "Climate Change";
  } else if (studyField.includes("law")) {
    subjectArea = "Law";
  } else if (studyField.includes("education")) {
    subjectArea = "Education";
  } else {
    subjectArea = "Humanities";
  }

  // Infer Organization Type
  let organizationType: EnrichedOpportunity["organizationType"] = "University";
  const org = s.organization.toLowerCase();
  if (org.includes("government") || org.includes("fcdo") || org.includes("dfat") || org.includes("department")) {
    organizationType = "Government";
  } else if (org.includes("ngo")) {
    organizationType = "NGO";
  } else if (org.includes("un ") || org.includes("united nations")) {
    organizationType = "UN Agency";
  } else if (org.includes("bank") || org.includes("development")) {
    organizationType = "Development Bank";
  } else if (org.includes("foundation") || org.includes("trust")) {
    organizationType = "Private Foundation";
  } else if (org.includes("council") || org.includes("association")) {
    organizationType = "NGO";
  }

  // Infer Target Group
  let targetGroup: EnrichedOpportunity["targetGroup"] = "All";
  if (s.categories.includes("Women")) {
    targetGroup = "Women";
  } else if (s.categories.includes("Entrepreneurs")) {
    targetGroup = "Startup Founders";
  } else if (s.categories.includes("Researchers")) {
    targetGroup = "Researchers";
  } else if (s.categories.includes("Professionals")) {
    targetGroup = "Youth Leaders";
  }

  // Infer Intake
  const intakeMonths: EnrichedOpportunity["intake"][] = [
    "September", "October", "January", "August", "September", "October"
  ];
  const intake = (s.applicationDeadline ?? "").toLowerCase().includes("rolling")
    ? ("Rolling Intake" as const)
    : intakeMonths[index % intakeMonths.length];

  return {
    ...s,
    opportunityType,
    educationLevel,
    funding,
    status,
    intake,
    gender: s.categories.includes("Women") ? "Women" as const : "All" as const,
    targetGroup,
    subjectArea,
    organizationType,
    viewsCount: 150 + (index * 42) % 350,
    dateAdded: `2026-0${(index % 5) + 2}-15`, // realistic dates added from Feb to June 2026
    daysRemaining,
  };
});

// Create additional high-quality non-scholarship opportunities to populate all filter categories
const extraOpportunities: EnrichedOpportunity[] = [
  {
    id: "opp-intern-google",
    slug: "google-software-internship-tokyo",
    title: "Google STEP Internship 2027",
    // No `featured` signal exists anywhere in this hand-authored object
    // (unlike enrichedFromOriginal's SCHOLARSHIPS-derived entries, which
    // carry a real featured boolean via `{ ...s }` spread). Set to
    // false as the evidence-based default: never curated/flagged as
    // featured, not an arbitrary guess in either direction.
    featured: false,
    provider: "Google Asia Pacific",
    organization: "Google",
    org: "Google",
    description: "An intensive software engineering internship in Tokyo designed for undergraduate students. Interns work directly on product teams alongside experienced engineers.",
    desc: "An intensive software engineering internship in Tokyo designed for undergraduate students. Interns work directly on product teams alongside experienced engineers.",
    amount: "Paid Internship (Stipend, Housing, Flights)",
    applicationDeadline: "2026-10-15",
    deadline: "2026-10-15",
    countries: ["Japan"],
    country: "Japan",
    levels: ["Undergraduate"],
    level: "Undergraduate",
    academicLevel: "Undergraduate (Bachelor's)",
    categories: ["Nepali Students"],
    link: "https://careers.google.com/jobs/",
    officialWebsite: "https://careers.google.com/jobs/",
    tags: ["Japan", "Software Engineering", "Internship", "Paid"],
    eligibility: [
      "Currently enrolled in a Bachelor's degree in Computer Science or related STEM field",
      "Completed 1st or 2nd year of university by internship start",
      "Programming experience in C++, Java, Python, or Go"
    ],
    benefits: [
      "Competitive monthly salary stipend",
      "Full housing accommodation in Tokyo",
      "Round-trip economy flight to Japan",
      "Direct mentorship from senior Google Engineers"
    ],
    fieldOfStudy: "Computer Science & Engineering",
    field: "Computer Science & Engineering",
    fundingType: "Paid Internship",
    fullyFunded: "Yes",
    bondRequired: "No",
    duration: "12 Weeks",
    requiredDocuments: [
      "Updated English CV",
      "Latest university transcript",
      "Answers to two short application questions"
    ],
    applicationTips: [
      "Practice solving algorithmic and data structures questions on LeetCode",
      "Highlight collaborative school projects and personal coding portfolios"
    ],
    opportunityType: "Internship",
    educationLevel: "Bachelor's",
    funding: "Paid Internship",
    status: "Open",
    intake: "Rolling Intake",
    gender: "All",
    targetGroup: "Engineers",
    subjectArea: "Computer Science",
    organizationType: "Private Foundation",
    viewsCount: 980,
    dateAdded: "2026-06-01",
    daysRemaining: 86,
  },
  {
    id: "opp-grant-national-geographic",
    slug: "natgeo-explorer-grant",
    title: "National Geographic Explorer Grants 2026",
    featured: false, // see rationale on the Google STEP entry above
    provider: "National Geographic Society",
    organization: "National Geographic",
    org: "National Geographic",
    description: "Funding for conservation, education, research, social enterprise, and storytelling projects in Nepal and Southeast Asia.",
    desc: "Funding for conservation, education, research, social enterprise, and storytelling projects in Nepal and Southeast Asia.",
    amount: "Up to $20,000 Project Funding",
    applicationDeadline: "2026-08-15",
    deadline: "2026-08-15",
    countries: ["Any"],
    country: "Global",
    levels: ["Graduate", "PhD", "Research"],
    level: "Graduate",
    academicLevel: "Graduate & Research Levels",
    categories: ["Researchers", "Nepali Students"],
    link: "https://www.nationalgeographic.org/grants/",
    officialWebsite: "https://www.nationalgeographic.org/grants/",
    tags: ["Conservation", "Storytelling", "Research Grant", "Funding"],
    eligibility: [
      "Aged 18 or older",
      "Project focused on conservation, environment, storytelling, or research",
      "Direct relevance to local communities in Nepal"
    ],
    benefits: [
      "Direct research project grant up to $20,000",
      "Membership in the global National Geographic Explorer community",
      "Media exposure and storytelling training"
    ],
    fieldOfStudy: "Environmental Science & Storytelling",
    field: "Environmental Science & Storytelling",
    fundingType: "Grant",
    fullyFunded: "Yes",
    bondRequired: "No",
    duration: "1 Year",
    requiredDocuments: [
      "Project proposal outline",
      "Budget breakdown and timeline",
      "Two professional reference letters",
      "CV listing previous conservation work"
    ],
    applicationTips: [
      "Make your conservation target highly local and measurable",
      "Incorporate local Nepali community members in your project execution plan"
    ],
    opportunityType: "Grant",
    educationLevel: "Research",
    funding: "Grant",
    status: "Closing Soon",
    intake: "Rolling Intake",
    gender: "All",
    targetGroup: "Researchers",
    subjectArea: "Climate Change",
    organizationType: "NGO",
    viewsCount: 620,
    dateAdded: "2026-05-10",
    daysRemaining: 25,
  },
  {
    id: "opp-conf-one-young-world",
    slug: "one-young-world-summit",
    title: "One Young World Summit 2027 Scholarship",
    featured: false, // see rationale on the Google STEP entry above
    provider: "One Young World",
    organization: "One Young World",
    org: "One Young World",
    description: "Fully-funded attendance to the global summit for young leaders. Brings together 2,000+ change-makers from 190+ countries to debate solutions for the SDGs.",
    desc: "Fully-funded attendance to the global summit for young leaders. Brings together 2,000+ change-makers from 190+ countries to debate solutions for the SDGs.",
    amount: "Fully Funded Conference Pass + Flights",
    applicationDeadline: "2026-12-01",
    deadline: "2026-12-01",
    countries: ["Germany"],
    country: "Germany",
    levels: ["Any"],
    level: "Any",
    academicLevel: "All Levels (Age 18-30)",
    categories: ["Nepali Students", "Professionals"],
    link: "https://www.oneyoungworld.com/",
    officialWebsite: "https://www.oneyoungworld.com/",
    tags: ["Summit", "Leadership", "SDGs", "Fully Funded"],
    eligibility: [
      "Aged 18-30 (exceptions can be made)",
      "Demonstrated commitment to creating positive impact in Nepal",
      "Proven leadership track record"
    ],
    benefits: [
      "Full access pass to the One Young World Summit in Munich",
      "Round-trip economy flights to Germany",
      "Hotel accommodation and all meals provided",
      "Ground transport within Munich"
    ],
    fieldOfStudy: "Leadership & Social Impact",
    field: "Leadership & Social Impact",
    fundingType: "Fully Funded",
    fullyFunded: "Yes",
    bondRequired: "No",
    duration: "1 Week",
    requiredDocuments: [
      "Online application essay questions",
      "One reference letter from a local NGO/community leader",
      "Proof of age (Passport/Citizenship)"
    ],
    applicationTips: [
      "Explain your actual, tangible volunteer or project impact in Nepal rather than abstract theories",
      "Be highly specific about which global SDGs your work aligns with"
    ],
    opportunityType: "Conference",
    educationLevel: "Professional Training",
    funding: "Fully Funded",
    status: "Open",
    intake: "September",
    gender: "All",
    targetGroup: "Youth Leaders",
    subjectArea: "Climate Change",
    organizationType: "NGO",
    viewsCount: 1250,
    dateAdded: "2026-07-01",
    daysRemaining: 133,
  },
  {
    id: "opp-comp-hult-prize",
    slug: "hult-prize-competition",
    title: "Hult Prize $1M Social Startup Competition",
    featured: false, // see rationale on the Google STEP entry above
    provider: "Hult Prize Foundation / UN",
    organization: "Hult Prize Foundation",
    org: "Hult Prize Foundation",
    description: "The world's largest social entrepreneurship student competition. Teams pitch business models designed to address a critical global issue nominated by President Bill Clinton.",
    desc: "The world's largest social entrepreneurship student competition. Teams pitch business models designed to address a critical global issue nominated by President Bill Clinton.",
    amount: "$1,000,000 Seed Prize Money",
    applicationDeadline: "2026-09-30",
    deadline: "2026-09-30",
    countries: ["United States"],
    country: "United States",
    levels: ["Undergraduate", "Graduate"],
    level: "Undergraduate",
    academicLevel: "University Students",
    categories: ["Entrepreneurs", "Nepali Students"],
    link: "https://www.hultprize.org/",
    officialWebsite: "https://www.hultprize.org/",
    tags: ["Social Enterprise", "Pitch Competition", "Seed Funding", "Prize"],
    eligibility: [
      "Team of 3-4 university students (from same or different Nepali colleges)",
      "Social business idea solving the year's specific challenge",
      "Eligible to pitch in English"
    ],
    benefits: [
      "$1,000,000 USD global grand prize",
      "All-expenses-paid accelerator residency in London and New York",
      "Mentorship from leading venture capitalists and UN specialists"
    ],
    fieldOfStudy: "Social Entrepreneurship & Business",
    field: "Social Entrepreneurship & Business",
    fundingType: "Prize Money",
    fullyFunded: "Yes",
    bondRequired: "No",
    duration: "6 Months",
    requiredDocuments: [
      "Pitch deck outlining business model",
      "Completed team member enrollments",
      "Short video presentation of the social business concept"
    ],
    applicationTips: [
      "Focus heavily on the economic feasibility and scalability of the business model",
      "Ensure your product solves a real problem faced by everyday citizens in developing areas like Nepal"
    ],
    opportunityType: "Competition",
    educationLevel: "Bachelor's",
    funding: "Prize Money",
    status: "Open",
    intake: "September",
    gender: "All",
    targetGroup: "Startup Founders",
    subjectArea: "Business",
    organizationType: "UN Agency",
    viewsCount: 1100,
    dateAdded: "2026-06-15",
    daysRemaining: 71,
  },
  {
    id: "opp-acc-yc",
    slug: "y-combinator-startup-funding",
    title: "Y Combinator W27 Batch",
    featured: false, // see rationale on the Google STEP entry above
    provider: "Y Combinator",
    organization: "Y Combinator",
    org: "Y Combinator",
    description: "Twice a year, Y Combinator invests $500,000 in a large number of startups. Startups move to Silicon Valley for 3 months to build, talk to users, and scale.",
    desc: "Twice a year, Y Combinator invests $500,000 in a large number of startups. Startups move to Silicon Valley for 3 months to build, talk to users, and scale.",
    amount: "$500,000 Venture Funding",
    applicationDeadline: "2026-09-15",
    deadline: "2026-09-15",
    countries: ["United States"],
    country: "United States",
    levels: ["Any"],
    level: "Any",
    academicLevel: "All Levels (Startup Founders)",
    categories: ["Entrepreneurs"],
    link: "https://www.ycombinator.com/",
    officialWebsite: "https://www.ycombinator.com/",
    tags: ["Startup Accelerator", "Silicon Valley", "Pre-seed", "Tech"],
    eligibility: [
      "Technical co-founders prefered",
      "Highly scalable tech, software, or bio-tech business concept",
      "Willing to spend 3 months in San Francisco"
    ],
    benefits: [
      "$500,000 USD standard investment package",
      "Demoday access to the world's most elite angel investors and VCs",
      "Life-long access to the YC founder network and resources"
    ],
    fieldOfStudy: "Computer Science & Tech Entrepreneurship",
    field: "Computer Science & Tech Entrepreneurship",
    fundingType: "Accelerator",
    fullyFunded: "Yes",
    bondRequired: "No",
    duration: "3 Months",
    requiredDocuments: [
      "Online application detailing product, progress, and team",
      "1-minute pitch video explaining the startup",
      "Direct code/demo links"
    ],
    applicationTips: [
      "Explain your product in extremely plain, direct English (avoid buzzwords)",
      "Focus on talking about things you have actually built and users who love it"
    ],
    opportunityType: "Accelerator",
    educationLevel: "Professional Training",
    funding: "Grant",
    status: "Open",
    intake: "September",
    gender: "All",
    targetGroup: "Startup Founders",
    subjectArea: "AI",
    organizationType: "Private Foundation",
    viewsCount: 1540,
    dateAdded: "2026-07-10",
    daysRemaining: 56,
  },
  {
    id: "opp-volunteer-un",
    slug: "un-volunteer-nepal",
    title: "UN Volunteers - Climate Resilient Agriculture",
    featured: false, // see rationale on the Google STEP entry above
    provider: "United Nations Volunteers / UNDP",
    organization: "UNDP Nepal",
    org: "UNDP Nepal",
    description: "Join the UNDP team in Nepal as an official UN Volunteer. Support climate resilient agricultural programs in rural provinces, working with smallholder farmers.",
    desc: "Join the UNDP team in Nepal as an official UN Volunteer. Support climate resilient agricultural programs in rural provinces, working with smallholder farmers.",
    amount: "Volunteer Stipend (Living Allowance, Health, Travel)",
    applicationDeadline: "2026-08-30",
    deadline: "2026-08-30",
    countries: ["Any"],
    country: "Global",
    levels: ["Undergraduate", "Graduate", "Any"],
    level: "Undergraduate",
    academicLevel: "Bachelor or Master Candidates",
    categories: ["Nepali Students", "Professionals"],
    link: "https://www.unv.org/",
    officialWebsite: "https://www.unv.org/",
    tags: ["Volunteering", "Agriculture", "Climate Resilience", "UNV"],
    eligibility: [
      "At least 22 years of age at program commencement",
      "University degree in Agriculture, Environment, or Rural Development",
      "Strong spoken and written English & Nepali"
    ],
    benefits: [
      "Monthly Volunteer Living Allowance (VLA) to cover basic needs",
      "Full health and life insurance coverage",
      "Resettlement/repatriation allowance upon service completion",
      "Official UN certification of professional service"
    ],
    fieldOfStudy: "Agriculture & Climate Science",
    field: "Agriculture & Climate Science",
    fundingType: "Volunteer Stipend",
    fullyFunded: "Yes",
    bondRequired: "No",
    duration: "1 Year",
    requiredDocuments: [
      "Updated UNV profile application",
      "University degree transcript",
      "Valid passport/citizenship document",
      "Motivation letter"
    ],
    applicationTips: [
      "Demonstrate previous rural field research or volunteer work in Nepal",
      "Highlight collaborative leadership skills and ability to adapt to basic living standards"
    ],
    opportunityType: "Volunteer",
    educationLevel: "Undergraduate",
    funding: "Fellowship Stipend",
    status: "Open",
    intake: "Rolling Intake",
    gender: "All",
    targetGroup: "Youth Leaders",
    subjectArea: "Agriculture",
    organizationType: "UN Agency",
    viewsCount: 450,
    dateAdded: "2026-07-12",
    daysRemaining: 40,
  },
  {
    id: "opp-opening-soon-da",
    slug: "daad-exchange-coming",
    title: "DAAD Germany Exchange Fellowship 2027",
    featured: false, // see rationale on the Google STEP entry above
    provider: "DAAD Germany",
    organization: "DAAD",
    org: "DAAD",
    description: "An elite academic exchange fellowship offering bi-lateral research partnerships for young scholars from South Asia to teach or research in Germany.",
    desc: "An elite academic exchange fellowship offering bi-lateral research partnerships for young scholars from South Asia to teach or research in Germany.",
    amount: "Fully Funded Monthly Stipend",
    applicationDeadline: "2026-11-01",
    deadline: "2026-11-01",
    countries: ["Germany"],
    country: "Germany",
    levels: ["Graduate", "PhD"],
    level: "Graduate",
    academicLevel: "Master or PhD Students",
    categories: ["Researchers"],
    link: "https://www.daad.de/",
    officialWebsite: "https://www.daad.de/",
    tags: ["Exchange", "Germany", "Fellowship", "Research"],
    eligibility: [
      "Currently enrolled as a postgraduate student at an approved Nepali university",
      "Endorsement letter from current university department head",
      "Clear research project aligned with German university partners"
    ],
    benefits: [
      "Monthly travel and housing stipend in Germany",
      "Access to premium university lab infrastructure",
      "Health insurance coverage and flight tickets"
    ],
    fieldOfStudy: "Science & Engineering",
    field: "Science & Engineering",
    fundingType: "Fully Funded",
    fullyFunded: "Yes",
    bondRequired: "No",
    duration: "6 Months",
    requiredDocuments: [
      "Research proposal summary",
      "Academic transcript",
      "German host professor support letter",
      "English/German proficiency cert"
    ],
    applicationTips: [
      "Establish a firm relationship with the German academic host department before applying",
      "Focus on the collaborative nature of the exchange"
    ],
    opportunityType: "Exchange",
    educationLevel: "PhD",
    funding: "Fully Funded",
    status: "Opening Soon" as EnrichedOpportunity["status"],
    intake: "January",
    gender: "All",
    targetGroup: "Researchers",
    subjectArea: "Engineering",
    organizationType: "Government",
    viewsCount: 340,
    dateAdded: "2026-07-20",
    daysRemaining: 103,
  },
  {
    id: "opp-closed-mit",
    slug: "mit-summer-research",
    title: "MSRP (MIT Summer Research Program)",
    featured: false, // see rationale on the Google STEP entry above
    provider: "MIT Graduate Education",
    organization: "MIT",
    org: "MIT",
    description: "An elite summer research internship at the Massachusetts Institute of Technology. Interns spend 9 weeks working under world-famous professors in state-of-the-art laboratories.",
    desc: "An elite summer research internship at the Massachusetts Institute of Technology. Interns spend 9 weeks working under world-famous professors in state-of-the-art laboratories.",
    amount: "Fully Funded Stipend, Housing, & Travel",
    applicationDeadline: "2026-01-30",
    deadline: "2026-01-30",
    countries: ["United States"],
    country: "United States",
    levels: ["Undergraduate"],
    level: "Undergraduate",
    academicLevel: "Undergraduate (Junior Year)",
    categories: ["Nepali Students"],
    link: "https://gradeducation.mit.edu/msrp/",
    officialWebsite: "https://gradeducation.mit.edu/msrp/",
    tags: ["Research", "MIT", "Summer Internship", "STEM"],
    eligibility: [
      "Currently enrolled in undergraduate studies with junior standing",
      "Minimum GPA 3.5/4.0 in engineering, math, or sciences",
      "High interest in pursuing a PhD at top-tier institutions"
    ],
    benefits: [
      "Direct academic stipend (~$5,000 USD)",
      "Free housing and dining meal plan on MIT campus",
      "Round-trip airfare and local transport",
      "Direct workshops for PhD admissions training"
    ],
    fieldOfStudy: "STEM Fields",
    field: "STEM Fields",
    fundingType: "Fully Funded",
    fullyFunded: "Yes",
    bondRequired: "No",
    duration: "9 Weeks",
    requiredDocuments: [
      "Three detailed academic references",
      "Statement of Purpose targeting MIT professors",
      "Official university academic transcripts",
      "Resume & list of science fair awards"
    ],
    applicationTips: [
      "Address your specific research interests and detail which MIT labs you want to join",
      "Demonstrate strong mathematical, programming, or physics foundations in your CV"
    ],
    opportunityType: "Summer School",
    educationLevel: "Bachelor's",
    funding: "Fully Funded",
    status: "Closed",
    intake: "June",
    gender: "All",
    targetGroup: "Engineers",
    subjectArea: "Engineering",
    organizationType: "University",
    viewsCount: 2200,
    dateAdded: "2025-11-01",
    daysRemaining: -172,
  }
];

export const ALL_OPPORTUNITIES: EnrichedOpportunity[] = [
  ...enrichedFromOriginal,
  ...extraOpportunities,
];