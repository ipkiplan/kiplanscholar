import { Scholarship, Country, Testimonial, FAQ, ResourceTemplate } from "../types";

interface CompactSch {
  id: string;
  slug: string;
  title: string;
  org: string;
  country: string;
  level: "Undergraduate" | "Graduate" | "Postgraduate" | "Research" | "PhD" | "Any";
  field: string;
  desc: string;
  amount: string;
  deadline: string;
  link: string;
  eligibility: string[];
  benefits: string[];
  docs: string[];
  tips: string[];
  featured: boolean;
  fully: "Yes" | "No";
  bond: "Yes" | "No";
  duration: string;
  cats: ("Nepali Students" | "Women" | "Entrepreneurs" | "Researchers" | "Professionals")[];
}

const rawScholarships: CompactSch[] = [
  {
    id: "sch-1",
    slug: "chevening-scholarship",
    title: "Chevening Scholarships",
    org: "FCDO, UK Government",
    country: "United Kingdom",
    level: "Graduate",
    field: "All Fields",
    desc: "Fully-funded master's degrees for mid-career professionals with leadership potential.",
    amount: "Fully Funded (Tuition, Stipend, Flights, Visa)",
    deadline: "2026-11-03",
    link: "https://www.chevening.org/scholarship/nepal/",
    eligibility: [
      "Nepali citizenship",
      "Return to Nepal for 2 years after study",
      "Undergraduate degree (equivalent to UK upper second-class honors)",
      "At least 2 years (2,800 hours) of work experience"
    ],
    benefits: [
      "Full tuition coverage",
      "Monthly living stipend",
      "Round-trip economy flights",
      "Visa application fees and TB test contribution"
    ],
    docs: [
      "Two reference letters",
      "Valid passport or citizenship certificate",
      "Academic transcripts & certificates",
      "Unconditional offers from 3 UK universities"
    ],
    tips: [
      "Focus on concrete leadership and networking examples in your essays",
      "Detail a realistic post-study contribution plan for Nepal's growth"
    ],
    featured: true,
    fully: "Yes",
    bond: "No",
    duration: "1 Year",
    cats: ["Professionals", "Nepali Students"]
  },
  {
    id: "sch-2",
    slug: "women-in-stem-scholarship",
    title: "British Council Scholarships for Women in STEM",
    org: "British Council",
    country: "United Kingdom",
    level: "Graduate",
    field: "STEM Fields",
    desc: "A prestigious program supporting women from South Asia to pursue their Master's degree in STEM fields in the UK.",
    amount: "Fully Funded",
    deadline: "2026-04-30",
    link: "https://www.britishcouncil.org/study-work-abroad/in-uk/scholarships-women-stem",
    eligibility: [
      "Identify as a woman",
      "Nepali citizen and resident",
      "Undergraduate degree in a STEM field",
      "Active master's application at a participating UK university"
    ],
    benefits: [
      "Full tuition fees",
      "Monthly living stipend",
      "Round-trip travel & visa fees",
      "English language testing fees",
      "Special allowance for mothers"
    ],
    docs: [
      "Degree certificate & transcript",
      "Personal statement focused on STEM leadership",
      "Proof of English proficiency (IELTS)",
      "Recommendation letters"
    ],
    tips: [
      "Demonstrate a plan to inspire future generations of women in STEM in Nepal",
      "Highlight your research passion and societal impact"
    ],
    featured: true,
    fully: "Yes",
    bond: "No",
    duration: "1 Year",
    cats: ["Women", "Nepali Students"]
  },
  {
    id: "sch-3",
    slug: "fulbright-nepal",
    title: "Fulbright Foreign Student Program",
    org: "USEF Nepal / US Department of State",
    country: "United States",
    level: "Graduate",
    field: "All Fields (except Medicine)",
    desc: "Highly prestigious fellowship for Nepali students to pursue a master's degree in the United States.",
    amount: "Fully Funded",
    deadline: "2026-05-15",
    link: "https://usefnepal.org/fulbright/",
    eligibility: [
      "Nepali citizen residing in Nepal",
      "Four-year Bachelor's degree (or equivalent)",
      "3 years of post-bachelor professional work experience",
      "TOEFL or IELTS score"
    ],
    benefits: [
      "Full tuition and university fees",
      "Monthly living stipend",
      "Comprehensive health insurance",
      "International airfare & pre-academic programs"
    ],
    docs: [
      "Academic transcripts & diplomas",
      "Three reference letters",
      "Statement of Purpose (SOP)",
      "Detailed study/research objectives"
    ],
    tips: [
      "The Statement of Purpose should emphasize cross-cultural exchange and leadership",
      "Ensure recommendations are highly specific and detail-oriented"
    ],
    featured: true,
    fully: "Yes",
    bond: "No",
    duration: "2 Years",
    cats: ["Nepali Students", "Researchers"]
  },
  {
    id: "sch-4",
    slug: "aauw-fellowships",
    title: "AAUW International Fellowships for Women",
    org: "American Association of University Women",
    country: "United States",
    level: "Graduate",
    field: "All Fields",
    desc: "Supporting female scholars who are not US citizens to pursue full-time graduate or postgraduate study in the USA.",
    amount: "Up to $50,000",
    deadline: "2026-11-15",
    link: "https://www.aauw.org/resources/programs/fellowships-grants/international/",
    eligibility: [
      "Non-US citizen (including Nepal)",
      "Academic degree equivalent to US Bachelor's",
      "Commit to return to home country to pursue a professional career"
    ],
    benefits: [
      "Tuition support",
      "Living expenses",
      "Childcare support",
      "Professional development & networking"
    ],
    docs: [
      "Proof of English proficiency (TOEFL/IELTS)",
      "Official academic transcripts",
      "Three letters of recommendation",
      "Proof of current university enrollment"
    ],
    tips: [
      "Show active commitment to the advancement of women and girls in Nepal",
      "Formulate a clear and actionable professional return plan"
    ],
    featured: true,
    fully: "Yes",
    bond: "No",
    duration: "2 Years",
    cats: ["Women", "Researchers"]
  },
  {
    id: "sch-5",
    slug: "erasmus-mundus",
    title: "Erasmus Mundus Joint Masters",
    org: "European Union",
    country: "Europe",
    level: "Graduate",
    field: "Interdisciplinary Fields",
    desc: "Prestigious international joint master's programs delivered by consortia of European universities.",
    amount: "Fully Funded (Tuition + €1,400/month)",
    deadline: "2026-02-15",
    link: "https://erasmus-plus.ec.europa.eu/",
    eligibility: [
      "Open to students worldwide (including Nepal)",
      "Bachelor's degree or equivalent completed before program start",
      "No previous Erasmus Mundus scholarship received"
    ],
    benefits: [
      "Full tuition fee waiver",
      "Monthly living stipend (€1,400)",
      "Travel, visa, and installation allowance",
      "Comprehensive medical insurance"
    ],
    docs: [
      "Transcripts & certificates",
      "CV in Europass format",
      "Two letters of recommendation",
      "Statement of Purpose tailored to the specific joint program"
    ],
    tips: [
      "Apply early as different consortia have varying deadlines",
      "Demonstrate adaptability and passion for multicultural academic setups"
    ],
    featured: true,
    fully: "Yes",
    bond: "No",
    duration: "2 Years",
    cats: ["Nepali Students", "Professionals"]
  },
  {
    id: "sch-6",
    slug: "australia-awards",
    title: "Australia Awards Scholarships",
    org: "DFAT, Australian Government",
    country: "Australia",
    level: "Graduate",
    field: "Development, Health, Education, Environment",
    desc: "Fully-funded postgraduate study in participating Australian universities to support Nepal's development.",
    amount: "Fully Funded",
    deadline: "2026-04-30",
    link: "https://www.dfat.gov.au/people-to-people/australia-awards",
    eligibility: [
      "Nepali citizen residing in Nepal",
      "Minimum 18 years old",
      "Commit to return and contribute to development in Nepal",
      "At least 2 years relevant work experience"
    ],
    benefits: [
      "Full tuition fees",
      "One-time establishment allowance",
      "Contribution to living expenses (stipend)",
      "Overseas Student Health Cover (OSHC)",
      "Airfare"
    ],
    docs: [
      "Undergrad transcripts & degree",
      "Passport/Citizenship certificate",
      "Employer support letter",
      "IELTS (6.5+) or PTE certificate"
    ],
    tips: [
      "Connect your proposed study with Nepal's development priorities",
      "Explain concrete plans to implement your knowledge locally"
    ],
    featured: true,
    fully: "Yes",
    bond: "No",
    duration: "2 Years",
    cats: ["Nepali Students", "Professionals"]
  },
  {
    id: "sch-7",
    slug: "thiel-fellowship",
    title: "Thiel Fellowship",
    org: "The Thiel Foundation",
    country: "United States",
    level: "Undergraduate",
    field: "Tech, Science, Business",
    desc: "Grants for young people who skip or drop out of college to build new startups.",
    amount: "$100,000 + Mentorship",
    deadline: "Rolling (Applications Open Year-Round)",
    link: "https://thielfellowship.org/",
    eligibility: [
      "Aged 22 or younger",
      "Willing to skip or defer college",
      "Visionary technology or research project with high scalability"
    ],
    benefits: [
      "$100,000 direct equity-free grant",
      "Guidance from Silicon Valley founders",
      "Access to Thiel Network"
    ],
    docs: [
      "Pitch deck",
      "Project technical details",
      "Founder background information",
      "Early prototype link (if available)"
    ],
    tips: [
      "Show a highly scalable project with active progress or traction",
      "Explain why university is slowing down your vision"
    ],
    featured: true,
    fully: "Yes",
    bond: "No",
    duration: "2 Years",
    cats: ["Entrepreneurs"]
  },
  {
    id: "sch-8",
    slug: "daad-research-grants",
    title: "DAAD Doctoral Research Grants",
    org: "German Academic Exchange Service (DAAD)",
    country: "Germany",
    level: "PhD",
    field: "All Fields",
    desc: "Funding for doctoral studies in Germany at state-recognized universities and institutes.",
    amount: "Fully Funded (Stipend + Flights + Insurance)",
    deadline: "2026-10-31",
    link: "https://www.daad.de/",
    eligibility: [
      "Master's degree not older than 6 years",
      "Excellent research proposal",
      "Agreement of a German supervisor"
    ],
    benefits: [
      "Monthly stipend (€1,300)",
      "Travel allowance",
      "Health, accident, and personal liability insurance",
      "Study allowance"
    ],
    docs: [
      "Detailed research proposal",
      "Curriculum vitae",
      "Host supervisor acceptance letter",
      "Academic references"
    ],
    tips: [
      "Secure a host professor in Germany before applying",
      "The scientific structure and feasibility of your proposal is key"
    ],
    featured: true,
    fully: "Yes",
    bond: "No",
    duration: "4 Years",
    cats: ["Researchers", "Nepali Students"]
  },
  {
    id: "sch-9",
    slug: "schlumberger-women-stem",
    title: "Faculty for the Future Fellowships",
    org: "Schlumberger Foundation",
    country: "Any",
    level: "PhD",
    field: "STEM Fields",
    desc: "Fellowships to women from developing economies preparing for PhD or post-doctoral studies in STEM.",
    amount: "Up to $50,000 / year",
    deadline: "2026-11-10",
    link: "https://www.facultyforthefuture.net/",
    eligibility: [
      "Identify as a woman",
      "Citizen of a developing country (includes Nepal)",
      "Applied to or enrolled in PhD/Post-doc abroad"
    ],
    benefits: [
      "Tuition and university fees",
      "Living expenses stipend",
      "Travel & conference grant",
      "Global support network"
    ],
    docs: [
      "PhD admission letter",
      "Detailed research proposal",
      "List of scientific publications",
      "Three reference letters"
    ],
    tips: [
      "Demonstrate leadership potential and active commitment to return to teach in Nepal",
      "Highlight your academic achievements and publications"
    ],
    featured: true,
    fully: "Yes",
    bond: "No",
    duration: "3 Years",
    cats: ["Women", "Researchers"]
  },
  {
    id: "sch-10",
    slug: "halcyon-fellowship",
    title: "Halcyon Fellowship",
    org: "Halcyon House",
    country: "United States",
    level: "Any",
    field: "Social Entrepreneurship",
    desc: "Residency fellowship in Washington, D.C. for early-stage social enterprise founders.",
    amount: "Residency + $10,000 Stipend",
    deadline: "2026-06-15",
    link: "https://halcyonhouse.org/",
    eligibility: [
      "Primary founder or co-founder",
      "Scalable social impact business model",
      "Willing to reside in Washington D.C. for 8 weeks"
    ],
    benefits: [
      "8-week residency in Washington DC",
      "$10,000 living stipend",
      "$25,000 cloud and legal credits",
      "Strategic mentorship"
    ],
    docs: [
      "Business plan",
      "Social impact thesis",
      "Pitch presentation",
      "Financial projection sheet"
    ],
    tips: [
      "Show clear, measurable social or environmental metrics for Nepal",
      "Articulate why Washington, D.C. is an ideal accelerator hub for your startup"
    ],
    featured: true,
    fully: "Yes",
    bond: "No",
    duration: "8 Weeks",
    cats: ["Entrepreneurs", "Professionals"]
  },
  {
    id: "sch-11",
    slug: "mext-japan",
    title: "MEXT Japan Graduate Scholarships",
    org: "MEXT, Japanese Government",
    country: "Japan",
    level: "Graduate",
    field: "All Fields",
    desc: "Fully funded scholarships by the Japanese government for research, master's, or doctoral studies.",
    amount: "Fully Funded (Tuition + Stipend + Travel)",
    deadline: "2026-05-31",
    link: "https://www.np.emb-japan.go.jp/itpr_en/scholarship.html",
    eligibility: [
      "Nepali citizenship",
      "Under 35 years of age",
      "Bachelor's degree completed",
      "Willing to learn Japanese language"
    ],
    benefits: [
      "100% tuition fees",
      "Monthly living allowance",
      "Round-trip international travel",
      "Preparatory Japanese language course"
    ],
    docs: [
      "MEXT application form",
      "Mark sheets / transcripts",
      "SOP & research study plan",
      "Medical fitness certificate"
    ],
    tips: [
      "Study basic Japanese; high scores on written tests at the Embassy in Kathmandu are highly critical",
      "Make your study plan precise and relevant to Japanese technology or culture"
    ],
    featured: true,
    fully: "Yes",
    bond: "No",
    duration: "2 Years",
    cats: ["Nepali Students", "Researchers"]
  },
  {
    id: "sch-12",
    slug: "gks-korea",
    title: "Global Korea Scholarship (GKS)",
    org: "NIIED, South Korea Government",
    country: "South Korea",
    level: "Graduate",
    field: "All Fields",
    desc: "Fully-funded graduate degrees in South Korea paired with one year of intensive language training.",
    amount: "Fully Funded",
    deadline: "2026-03-10",
    link: "https://www.studyinkorea.go.kr/",
    eligibility: [
      "Nepali citizen under 40 years old",
      "Bachelor's or Master's degree",
      "Cumulative GPA above 80% or top 20% in class"
    ],
    benefits: [
      "Airfare",
      "Settlement allowance",
      "Tuition & Language training fee",
      "Monthly stipend",
      "Medical insurance"
    ],
    docs: [
      "Application form",
      "Personal statement",
      "Detailed study plan",
      "Two recommendation letters",
      "Academic transcripts"
    ],
    tips: [
      "Highlight your interest in Korean culture & academic ties",
      "A high GPA is extremely vital for GKS screening"
    ],
    featured: false,
    fully: "Yes",
    bond: "No",
    duration: "3 Years",
    cats: ["Nepali Students"]
  },
  {
    id: "sch-13",
    slug: "csc-china",
    title: "Chinese Government Scholarship (CSC)",
    org: "China Scholarship Council",
    country: "China",
    level: "Graduate",
    field: "All Fields",
    desc: "A scholarship scheme by the Chinese Ministry of Education to support international students in Chinese universities.",
    amount: "Fully Funded",
    deadline: "2026-02-28",
    link: "http://www.campuschina.org/",
    eligibility: [
      "Non-Chinese citizen",
      "Good health",
      "Bachelor's or Master's degree",
      "Age under 35 (Masters) or 40 (PhD)"
    ],
    benefits: [
      "Tuition waiver",
      "Free on-campus accommodation",
      "Monthly stipend",
      "Comprehensive medical insurance"
    ],
    docs: [
      "CSC application form",
      "Notarized highest diploma",
      "Academic transcripts",
      "Two LORs",
      "Study plan in China"
    ],
    tips: [
      "Get an acceptance letter from a host Chinese professor to guarantee selection",
      "Translate documents into Chinese or English"
    ],
    featured: false,
    fully: "Yes",
    bond: "No",
    duration: "3 Years",
    cats: ["Nepali Students"]
  },
  {
    id: "sch-14",
    slug: "iccr-india",
    title: "ICCR Scholarships for Nepali Students",
    org: "Indian Council for Cultural Relations",
    country: "India",
    level: "Undergraduate",
    field: "All Fields (except Medicine)",
    desc: "Fully funded scholarships to study undergraduate, postgraduate, or PhD courses in prestigious Indian universities.",
    amount: "Fully Funded (Tuition, Hostel, Stipend)",
    deadline: "2026-04-15",
    link: "https://www.indembkathmandu.gov.in/",
    eligibility: [
      "Nepali citizen residing in Nepal",
      "Age 18 to 30",
      "Good command of English language"
    ],
    benefits: [
      "Full tuition waiver",
      "Living allowance / stipend",
      "Hostel accommodation",
      "Medical coverage"
    ],
    docs: [
      "Syllabus transcripts",
      "Recommendation letters",
      "English test at Embassy",
      "Medical fitness form"
    ],
    tips: [
      "Prepare thoroughly for the English proficiency exam conducted at the Indian Embassy in Kathmandu",
      "List top tier universities"
    ],
    featured: false,
    fully: "Yes",
    bond: "No",
    duration: "3 Years",
    cats: ["Nepali Students"]
  },
  {
    id: "sch-15",
    slug: "adb-japan",
    title: "ADB-Japan Scholarship Program",
    org: "Asian Development Bank / Japan Govt",
    country: "Japan",
    level: "Graduate",
    field: "Economics, Management, Science, Tech",
    desc: "Offers opportunities for citizens of ADB's developing member countries to pursue postgraduate studies.",
    amount: "Fully Funded",
    deadline: "2026-08-31",
    link: "https://www.adb.org/work-with-us/careers/japan-scholarship-program",
    eligibility: [
      "Citizen of an ADB member (including Nepal)",
      "Admitted to an approved master's course",
      "At least 2 years work experience"
    ],
    benefits: [
      "Full tuition",
      "Monthly housing and living allowance",
      "Books and instructional materials",
      "Medical insurance",
      "Airfare"
    ],
    docs: [
      "University application form",
      "Income certificate of applicant",
      "Transcripts",
      "Work experience certificate"
    ],
    tips: [
      "Choose participating institutions like Tokyo Tech or National University of Singapore",
      "Highlight economic development relevance"
    ],
    featured: false,
    fully: "Yes",
    bond: "No",
    duration: "2 Years",
    cats: ["Professionals"]
  },
  {
    id: "sch-16",
    slug: "swiss-government",
    title: "Swiss Government Excellence Scholarships",
    org: "Federal Commission for Scholarships (FCS), Switzerland",
    country: "Switzerland",
    level: "Research",
    field: "All Academic Disciplines",
    desc: "Provides graduates of all disciplines with the opportunity to pursue doctoral or post-doctoral research in Switzerland.",
    amount: "Fully Funded",
    deadline: "2026-11-30",
    link: "https://www.sbfi.admin.ch/scholarships_eng",
    eligibility: [
      "Master's degree completed before starting",
      "Born after Dec 1989",
      "Valid research project in Switzerland"
    ],
    benefits: [
      "Monthly allowance (CHF 1,920)",
      "Health insurance",
      "Airfare allowance",
      "Housing allowance"
    ],
    docs: [
      "Research proposal",
      "CV",
      "Support letter from host Swiss professor",
      "Two LORs"
    ],
    tips: [
      "Secure a supervisor at a public Swiss university early",
      "The scientific feasibility of your proposal is key"
    ],
    featured: false,
    fully: "Yes",
    bond: "No",
    duration: "3 Years",
    cats: ["Researchers"]
  },
  {
    id: "sch-17",
    slug: "world-bank-scholarships",
    title: "Joint Japan/World Bank Graduate Scholarship",
    org: "World Bank / Government of Japan",
    country: "Japan",
    level: "Graduate",
    field: "Development Policy, Economics, Public Health",
    desc: "Supports master's degrees in development-related topics at preferred universities around the world.",
    amount: "Fully Funded (Tuition, Stipend, Flights)",
    deadline: "2026-05-26",
    link: "https://www.worldbank.org/",
    eligibility: [
      "Citizen of a World Bank member country (Nepal)",
      "3+ years development-related work experience",
      "Admitted to a preferred program"
    ],
    benefits: [
      "Full tuition fees",
      "Monthly living stipend",
      "Round-trip economy air travel",
      "Travel allowance"
    ],
    docs: [
      "Acceptance letter from university",
      "Employer recommendation",
      "Income certificates",
      "SOP on development goals"
    ],
    tips: [
      "Choose one of the specialized 'Preferred Programs' on the WB website",
      "Focus your essays on policy solutions for Nepal"
    ],
    featured: false,
    fully: "Yes",
    bond: "No",
    duration: "2 Years",
    cats: ["Professionals"]
  },
  {
    id: "sch-18",
    slug: "singa-singapore",
    title: "Singapore International Graduate Award (SINGA)",
    org: "A*STAR, Singapore",
    country: "Singapore",
    level: "PhD",
    field: "Biomedical, Physical Science, Engineering",
    desc: "A collaboration to support PhD studies in Singapore's top-tier research institutes.",
    amount: "Fully Funded (Stipend + Tuition)",
    deadline: "2026-06-01",
    link: "https://www.a-star.edu.sg/Scholarships/",
    eligibility: [
      "International graduates with a passion for research",
      "Excellent academic records",
      "Strong reports from academic referees"
    ],
    benefits: [
      "Full tuition fees",
      "Monthly stipend (SGD 2,200 - 2,700)",
      "One-time settling-in allowance",
      "Airfare grant"
    ],
    docs: [
      "Transcripts",
      "Two academic referee reports",
      "GRE/TOEFL scores (optional)",
      "Research interest draft"
    ],
    tips: [
      "Select lab supervisors carefully from Singapore's elite institutions",
      "Write a highly technical research interest essay"
    ],
    featured: false,
    fully: "Yes",
    bond: "No",
    duration: "4 Years",
    cats: ["Researchers"]
  },
  {
    id: "sch-19",
    slug: "newzealand-manaaki",
    title: "Manaaki New Zealand Scholarships",
    org: "Ministry of Foreign Affairs and Trade, New Zealand",
    country: "New Zealand",
    level: "Graduate",
    field: "Climate Change, Agriculture, Disaster Risk Management",
    desc: "Fully funded scholarships for students from developing nations to study in New Zealand public universities.",
    amount: "Fully Funded",
    deadline: "2026-02-28",
    link: "https://www.nzscholarships.govt.nz/",
    eligibility: [
      "Nepali citizen under 40 years old",
      "Commit to return to Nepal for 2 years",
      "Work experience in a priority sector"
    ],
    benefits: [
      "Full tuition fees",
      "Living allowance (weekly stipend)",
      "Establishment allowance",
      "Medical insurance",
      "Travel flights"
    ],
    docs: [
      "Transcripts",
      "English certificate (IELTS/PTE)",
      "Work experience proof",
      "SOP on how you will benefit Nepal"
    ],
    tips: [
      "Select topics related to climate resilience, disaster management or agriculture to align with New Zealand priorities",
      "Be descriptive and analytical in your personal statements"
    ],
    featured: false,
    fully: "Yes",
    bond: "No",
    duration: "2 Years",
    cats: ["Professionals"]
  },
  {
    id: "sch-20",
    slug: "swedish-institute",
    title: "Swedish Institute Scholarships for Global Professionals",
    org: "Swedish Institute",
    country: "Sweden",
    level: "Graduate",
    field: "Sustainable Development, Engineering, IT",
    desc: "A highly selective scholarship program for ambitious professionals from selected countries to study in Sweden.",
    amount: "Fully Funded (Tuition + Stipend)",
    deadline: "2026-02-28",
    link: "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/",
    eligibility: [
      "Nepali citizenship",
      "At least 3,000 hours of demonstrated leadership/work experience",
      "Applied to an eligible Swedish Master's"
    ],
    benefits: [
      "Full tuition coverage",
      "Monthly living stipend (SEK 11,000)",
      "Travel grant (SEK 15,000)",
      "Membership in the SI Network"
    ],
    docs: [
      "CV in SI format",
      "Proof of work/leadership experience",
      "Two LORs (at least one professional)",
      "Passport copy"
    ],
    tips: [
      "Sweden heavily values sustainable development and clean technology; structure your CV to highlight these traits",
      "Ensure work hours match perfectly with employment logs"
    ],
    featured: false,
    fully: "Yes",
    bond: "No",
    duration: "2 Years",
    cats: ["Professionals", "Nepali Students"]
  },
  {
    id: "sch-21",
    slug: "vlir-uos",
    title: "VLIR-UOS Scholarships (Belgium)",
    org: "VLIR-UOS, Belgium Government",
    country: "Belgium",
    level: "Graduate",
    field: "Sustainable Development, Ecology, Data Science",
    desc: "Provides scholarships to students from developing countries to study English-taught master's programs in Belgium.",
    amount: "Fully Funded",
    deadline: "2026-02-01",
    link: "https://www.vliruos.be/",
    eligibility: [
      "National of one of the 29 eligible countries (includes Nepal)",
      "Under 35 years of age",
      "Academic background in developmental sectors"
    ],
    benefits: [
      "Tuition fees waived",
      "Monthly allowance",
      "Accommodation and food covered",
      "Travel airfare & insurance"
    ],
    docs: [
      "Passport copy",
      "Transcripts",
      "SOP explaining local application of training",
      "Two academic recommendations"
    ],
    tips: [
      "Focus on how Belgium's expertise in sustainable engineering or public health will assist Nepal's local issues",
      "Be highly specific regarding local municipality challenges"
    ],
    featured: false,
    fully: "Yes",
    bond: "No",
    duration: "2 Years",
    cats: ["Professionals"]
  },
  {
    id: "sch-22",
    slug: "humphrey-fellowship",
    title: "Hubert H. Humphrey Fellowship",
    org: "US Department of State / USEF Nepal",
    country: "United States",
    level: "Research",
    field: "Public Policy, Leadership, Environmental Policy",
    desc: "Brings accomplished mid-career professionals from developing countries to the US for a year of non-degree graduate study and professional collaboration.",
    amount: "Fully Funded",
    deadline: "2026-06-30",
    link: "https://usefnepal.org/humphrey/",
    eligibility: [
      "Nepali citizen",
      "5 years of professional experience",
      "Undergrad degree",
      "Demonstrated leadership and public service record"
    ],
    benefits: [
      "Tuition & fees at host campus",
      "Pre-academic English language training",
      "Living stipend",
      "Travel & conference allowance"
    ],
    docs: [
      "Online application form",
      "Transcripts",
      "Two professional references",
      "Employer endorsement letter"
    ],
    tips: [
      "Draft essays explaining how this non-degree fellowship directly enhances your public policy enforcement capability in Nepal",
      "Must show concrete team leadership experiences"
    ],
    featured: false,
    fully: "Yes",
    bond: "No",
    duration: "1 Year",
    cats: ["Professionals"]
  },
  {
    id: "sch-23",
    slug: "gates-cambridge",
    title: "Gates Cambridge Scholarships",
    org: "Bill & Melinda Gates Foundation / Cambridge Trust",
    country: "United Kingdom",
    level: "PhD",
    field: "All Fields available at Cambridge",
    desc: "Highly competitive scholarships for outstanding applicants from outside the UK to pursue a postgraduate degree at Cambridge.",
    amount: "Fully Funded (Tuition + £20,000/year)",
    deadline: "2026-01-07",
    link: "https://www.gatescambridge.org/",
    eligibility: [
      "Citizen of any country outside the UK",
      "Applying for PhD, MSc, or MLitt",
      "Exceptional academic credentials"
    ],
    benefits: [
      "University composition fee",
      "Maintenance allowance",
      "Inbound airfare & visa cost",
      "Maternity/paternity funding"
    ],
    docs: [
      "Cambridge admission application",
      "Gates reference",
      "Academic references",
      "Research proposal"
    ],
    tips: [
      "Show outstanding intellectual ability and a clear commitment to improving the lives of others",
      "Draft a meticulous proposal early in cooperation with your target faculty members"
    ],
    featured: false,
    fully: "Yes",
    bond: "No",
    duration: "3 Years",
    cats: ["Researchers", "Nepali Students"]
  },
  {
    id: "sch-24",
    slug: "cartier-womens-initiative",
    title: "Cartier Women's Initiative Awards",
    org: "Cartier / INSEAD Business School",
    country: "Any",
    level: "Any",
    field: "Social Ventures & Business Innovation",
    desc: "A massive international program supporting women-run and women-owned social impact businesses.",
    amount: "Up to $100,000 + Executive MBA Support",
    deadline: "2026-06-30",
    link: "https://www.cartierwomensinitiative.com/",
    eligibility: [
      "Identify as a woman",
      "Run a business with significant social/environmental impact",
      "Early-stage revenue-generating startup"
    ],
    benefits: [
      "$100,000 grant (for first place)",
      "Executive coaching & mentoring by INSEAD",
      "Media visibility and PR support"
    ],
    docs: [
      "Financial statements",
      "Impact reports",
      "Short pitch video",
      "Company registration papers"
    ],
    tips: [
      "Your startup in Nepal must be actively active and generating early revenues or proving solid market traction",
      "Show sustainable and transparent financials"
    ],
    featured: false,
    fully: "Yes",
    bond: "No",
    duration: "1 Year",
    cats: ["Women", "Entrepreneurs"]
  },

  // ---------------------------------------------------------------------
  // ES-010 — Scholarship Expansion (priority countries: AU, US, UK, DE,
  // CA, FR, SE, NO, FI, BE, AT). Real, currently-operating programmes
  // only — no placeholders. Deadlines reflect the next known/expected
  // application cycle at time of writing; several established
  // programmes without a single fixed date use the same "Varies" /
  // "Rolling" text pattern already used elsewhere in this file rather
  // than inventing a precise date.
  // ---------------------------------------------------------------------
  {
    id: "sch-25",
    slug: "melbourne-research-scholarship",
    title: "Melbourne Research Scholarship",
    org: "University of Melbourne",
    country: "Australia",
    level: "PhD",
    field: "All Fields",
    desc: "Covers tuition and a living allowance for outstanding domestic and international research (PhD/research master's) candidates at the University of Melbourne.",
    amount: "Full Tuition + Living Allowance",
    deadline: "2026-10-31",
    link: "https://scholarships.unimelb.edu.au/awards/melbourne-research-scholarship",
    eligibility: ["Offer of a place in an eligible research degree", "Strong academic record"],
    benefits: ["Full tuition fee offset", "Annual living allowance stipend"],
    docs: ["Academic transcripts", "Research proposal"],
    tips: ["Apply for the scholarship and the research degree simultaneously — they share one application"],
    featured: false,
    fully: "Yes",
    bond: "No",
    duration: "3-4 Years",
    cats: ["Researchers"]
  },
  {
    id: "sch-26",
    slug: "anu-chancellors-international-scholarship",
    title: "ANU Chancellor's International Scholarship",
    org: "Australian National University",
    country: "Australia",
    level: "Any",
    field: "All Fields",
    desc: "Merit-based tuition fee scholarship for high-achieving international undergraduate and postgraduate coursework students at ANU.",
    amount: "Partial to Full Tuition Waiver",
    deadline: "2026-10-31",
    link: "https://www.anu.edu.au/study/scholarships/international-student-scholarships",
    eligibility: ["International student with an ANU offer", "High academic achievement"],
    benefits: ["Tuition fee reduction for the duration of the degree"],
    docs: ["Academic transcripts"],
    tips: ["No separate application required for many rounds — automatically considered with your ANU admission"],
    featured: false,
    fully: "No",
    bond: "No",
    duration: "Program Length",
    cats: ["Nepali Students"]
  },
  {
    id: "sch-27",
    slug: "monash-international-merit-scholarship",
    title: "Monash International Merit Scholarship",
    org: "Monash University",
    country: "Australia",
    level: "Graduate",
    field: "All Fields",
    desc: "Automatic tuition fee reduction for high-achieving international students commencing an eligible postgraduate coursework degree at Monash.",
    amount: "Partial Tuition Waiver",
    deadline: "Rolling (Applications Open Year-Round)",
    link: "https://www.monash.edu/study/fees-scholarships/scholarships",
    eligibility: ["International student", "Strong GPA in prior qualification"],
    benefits: ["10-25% tuition fee reduction depending on entry GPA"],
    docs: ["Academic transcripts"],
    tips: ["Automatically assessed with your course application — no separate scholarship form"],
    featured: false,
    fully: "No",
    bond: "No",
    duration: "Program Length",
    cats: ["Nepali Students"]
  },
  {
    id: "sch-28",
    slug: "university-of-sydney-international-scholarships",
    title: "University of Sydney International Scholarships (USydIS)",
    org: "University of Sydney",
    country: "Australia",
    level: "Any",
    field: "All Fields",
    desc: "Merit-based scholarships for high-achieving international undergraduate and postgraduate students starting a degree at the University of Sydney.",
    amount: "Up to 50% Tuition Waiver",
    deadline: "2026-10-31",
    link: "https://www.sydney.edu.au/scholarships/international.html",
    eligibility: ["Offer of admission to an eligible degree", "Excellent academic record"],
    benefits: ["Tuition fee reduction for up to 4 years"],
    docs: ["Academic transcripts", "Offer letter"],
    tips: ["Submit your scholarship application as soon as you receive your course offer — rounds fill quickly"],
    featured: false,
    fully: "No",
    bond: "No",
    duration: "Up to 4 Years",
    cats: ["Nepali Students"]
  },
  {
    id: "sch-29",
    slug: "hubert-humphrey-fellowship",
    title: "Hubert H. Humphrey Fellowship Program",
    org: "U.S. Department of State (Fulbright)",
    country: "United States",
    level: "Any",
    field: "Public Policy & Professional Development",
    desc: "A non-degree, ten-month professional development fellowship in the US for accomplished mid-career professionals with a record of public service leadership.",
    amount: "Fully Funded (Tuition, Stipend, Travel, Insurance)",
    deadline: "2026-10-01",
    link: "https://www.humphreyfellowship.org/",
    eligibility: ["Nepali citizenship", "At least 5 years of relevant professional experience", "No prior long-term US study"],
    benefits: ["Full funding for a 10-month non-degree fellowship", "Placement at a US host university"],
    docs: ["Professional resume", "Letters of recommendation"],
    tips: ["This is not a degree program — frame your application around leadership and public service impact, not academic ambition alone"],
    featured: false,
    fully: "Yes",
    bond: "No",
    duration: "10 Months",
    cats: ["Professionals"]
  },
  {
    id: "sch-30",
    slug: "aauw-international-fellowships",
    title: "AAUW International Fellowships",
    org: "American Association of University Women",
    country: "United States",
    level: "Graduate",
    field: "All Fields",
    desc: "Fellowships for women pursuing full-time graduate or postdoctoral study in the United States, with a preference for candidates committed to returning home to contribute to their communities.",
    amount: "$18,000 - $30,000",
    deadline: "2026-12-01",
    link: "https://www.aauw.org/resources/programs/fellowships-grants/current-opportunities/international/",
    eligibility: ["Woman who is not a US citizen or permanent resident", "Admission to a US institution for full-time study"],
    benefits: ["Stipend toward tuition and living costs"],
    docs: ["Personal statement", "Letters of recommendation"],
    tips: ["Clearly articulate your plan to apply your degree back home — this program specifically values that return commitment"],
    featured: false,
    fully: "No",
    bond: "No",
    duration: "1 Year",
    cats: ["Women"]
  },
  {
    id: "sch-31",
    slug: "commonwealth-scholarships",
    title: "Commonwealth Scholarships",
    org: "Commonwealth Scholarship Commission (UK)",
    country: "United Kingdom",
    level: "Graduate",
    field: "All Fields",
    desc: "Fully-funded UK master's and PhD scholarships for citizens of Commonwealth countries, prioritising development-relevant fields of study.",
    amount: "Fully Funded (Tuition, Stipend, Flights)",
    deadline: "2026-12-15",
    link: "https://cscuk.fcdo.gov.uk/scholarships/",
    eligibility: ["Nepali citizenship", "First degree with upper second-class honours or equivalent", "Cannot afford to study in the UK without this scholarship"],
    benefits: ["Full tuition fees", "Living stipend and return airfare"],
    docs: ["Academic transcripts", "Reference letters"],
    tips: ["Applications go through Commonwealth Scholarships' online portal, not directly to universities — check open country/year windows carefully"],
    featured: false,
    fully: "Yes",
    bond: "No",
    duration: "1-3 Years",
    cats: ["Nepali Students"]
  },
  {
    id: "sch-32",
    slug: "great-scholarships",
    title: "GREAT Scholarships",
    org: "British Council",
    country: "United Kingdom",
    level: "Graduate",
    field: "All Fields",
    desc: "One-year tuition fee awards co-funded by the British Council and partner UK universities, for students starting a postgraduate master's degree in the UK.",
    amount: "£10,000 Tuition Fee Award",
    deadline: "2027-01-31",
    link: "https://study-uk.britishcouncil.org/scholarships/great-scholarships",
    eligibility: ["Nepali citizenship", "Offer at a participating UK university for an eligible master's course"],
    benefits: ["£10,000 toward tuition fees"],
    docs: ["University offer letter", "Personal statement"],
    tips: ["Only specific partner universities and courses participate each year — check the current list before applying to a programme"],
    featured: false,
    fully: "No",
    bond: "No",
    duration: "1 Year",
    cats: ["Nepali Students"]
  },
  {
    id: "sch-33",
    slug: "cambridge-trust-international-scholarships",
    title: "Cambridge Trust International Scholarships",
    org: "University of Cambridge",
    country: "United Kingdom",
    level: "Graduate",
    field: "All Fields",
    desc: "Needs- and merit-based funding for international graduate students admitted to the University of Cambridge, ranging from partial support to full-cost awards.",
    amount: "Partial to Full Funding",
    deadline: "2026-12-03",
    link: "https://www.cambridgetrust.org/",
    eligibility: ["Offer of admission to a Cambridge graduate course", "Demonstrated financial need for the higher awards"],
    benefits: ["Tuition and/or maintenance funding depending on award level"],
    docs: ["Cambridge graduate application", "Financial statement"],
    tips: ["You are automatically considered when you apply to your Cambridge course by the relevant funding deadline — no separate scholarship form for most awards"],
    featured: false,
    fully: "No",
    bond: "No",
    duration: "Program Length",
    cats: ["Nepali Students"]
  },
  {
    id: "sch-34",
    slug: "daad-helmut-schmidt-programme",
    title: "DAAD Helmut-Schmidt Programme",
    org: "DAAD",
    country: "Germany",
    level: "Graduate",
    field: "Public Policy, Economics & Law",
    desc: "Fully-funded master's scholarships in public policy, economics, and law at German universities, for future leaders from developing and transition countries.",
    amount: "Fully Funded (Tuition, Stipend, Travel)",
    deadline: "2026-10-31",
    link: "https://www.daad.de/en/study-and-research-in-germany/scholarships/",
    eligibility: ["Bachelor's degree in a relevant field", "Professional experience relevant to public policy or governance"],
    benefits: ["Monthly stipend", "Tuition and health insurance coverage"],
    docs: ["Academic transcripts", "Motivation letter"],
    tips: ["This programme specifically favours applicants planning to return to public-sector or policy work in their home country"],
    featured: false,
    fully: "Yes",
    bond: "No",
    duration: "2 Years",
    cats: ["Professionals"]
  },
  {
    id: "sch-35",
    slug: "deutschlandstipendium",
    title: "Deutschlandstipendium",
    org: "German Federal Government / Participating Universities",
    country: "Germany",
    level: "Any",
    field: "All Fields",
    desc: "A merit-based scholarship co-funded by the German government and private sponsors, awarded directly by individual German universities to high-achieving students of any nationality.",
    amount: "€300/month",
    deadline: "Varies by University (Check Institution)",
    link: "https://www.deutschlandstipendium.de/",
    eligibility: ["Enrolled or admitted at a participating German university", "Strong academic performance"],
    benefits: ["€300 monthly stipend for at least two semesters"],
    docs: ["Academic transcripts", "Motivation letter"],
    tips: ["Apply directly through your specific university's own Deutschlandstipendium office, not a central portal — deadlines differ by institution"],
    featured: false,
    fully: "No",
    bond: "No",
    duration: "Minimum 2 Semesters",
    cats: ["Nepali Students"]
  },
  {
    id: "sch-36",
    slug: "erasmus-mundus-germany",
    title: "Erasmus Mundus Joint Master's Degrees (Germany-based consortia)",
    org: "European Commission",
    country: "Germany",
    level: "Graduate",
    field: "All Fields",
    desc: "Fully-funded joint master's programmes taught across at least two European universities, including many Germany-anchored consortia, for students worldwide.",
    amount: "Fully Funded (Tuition, Stipend, Travel)",
    deadline: "2027-01-15",
    link: "https://www.eacea.ec.europa.eu/scholarships/emjmd-catalogue_en",
    eligibility: ["Bachelor's degree relevant to the chosen joint programme", "Meets the specific consortium's English requirement"],
    benefits: ["Full tuition waiver", "Monthly living allowance and travel/installation costs"],
    docs: ["Academic transcripts", "Motivation letter", "CV"],
    tips: ["Each joint programme has its own deadline within the EMJMD catalogue — check the specific consortium page, not a single central date"],
    featured: false,
    fully: "Yes",
    bond: "No",
    duration: "1-2 Years",
    cats: ["Nepali Students"]
  },
  {
    id: "sch-37",
    slug: "toronto-lester-pearson-scholarship",
    title: "University of Toronto Lester B. Pearson International Scholarship",
    org: "University of Toronto",
    country: "Canada",
    level: "Undergraduate",
    field: "All Fields",
    desc: "A highly competitive, fully-funded scholarship covering tuition, books, and living expenses for exceptional incoming international undergraduate students at the University of Toronto.",
    amount: "Fully Funded (Tuition, Books, Residence)",
    deadline: "2026-11-30",
    link: "https://future.utoronto.ca/pearson/",
    eligibility: ["International student entering first-year undergraduate study", "Exceptional academic achievement and leadership record"],
    benefits: ["Full tuition, books, and incidental fees", "Full residence support for 4 years"],
    docs: ["School nomination (required)", "Personal profile"],
    tips: ["You cannot apply directly — your secondary school must nominate you, so confirm your school's nomination process early"],
    featured: false,
    fully: "Yes",
    bond: "No",
    duration: "4 Years",
    cats: ["Nepali Students"]
  },
  {
    id: "sch-38",
    slug: "ubc-international-major-entrance-scholarship",
    title: "UBC International Major Entrance Scholarship (IMES)",
    org: "University of British Columbia",
    country: "Canada",
    level: "Undergraduate",
    field: "All Fields",
    desc: "Merit-based entrance scholarships for outstanding international students admitted directly from secondary school to UBC's undergraduate programs.",
    amount: "CAD $10,000 - $40,000",
    deadline: "2027-01-15",
    link: "https://you.ubc.ca/financial-planning/scholarships-awards/entrance-scholarships/",
    eligibility: ["International student applying from secondary school", "Top academic performance"],
    benefits: ["Renewable award toward tuition, one to four years depending on award level"],
    docs: ["UBC admission application"],
    tips: ["Automatically considered with your UBC application submitted by the scholarship deadline — no separate form"],
    featured: false,
    fully: "No",
    bond: "No",
    duration: "1-4 Years",
    cats: ["Nepali Students"]
  },
  {
    id: "sch-39",
    slug: "mcgill-major-entrance-scholarships",
    title: "McGill Major Entrance Scholarships",
    org: "McGill University",
    country: "Canada",
    level: "Undergraduate",
    field: "All Fields",
    desc: "Merit-based renewable entrance scholarships for exceptional incoming international undergraduate students at McGill University.",
    amount: "CAD $3,000 - $12,000/year",
    deadline: "2027-01-15",
    link: "https://www.mcgill.ca/studentaid/scholarships-aid/entrance",
    eligibility: ["International student admitted to a first-year undergraduate program", "Outstanding academic record"],
    benefits: ["Renewable annual award for the length of the undergraduate degree"],
    docs: ["McGill admission application"],
    tips: ["Automatically considered with your McGill application — submitting your admission file early gives the strongest chance"],
    featured: false,
    fully: "No",
    bond: "No",
    duration: "Program Length",
    cats: ["Nepali Students"]
  },
  {
    id: "sch-40",
    slug: "eiffel-excellence-scholarship",
    title: "Eiffel Excellence Scholarship Program",
    org: "French Ministry for Europe and Foreign Affairs",
    country: "France",
    level: "Graduate",
    field: "All Fields",
    desc: "A prestigious French government scholarship enabling French institutions to attract top international students into master's and PhD programmes, prioritising seven strategic fields.",
    amount: "€1,181-€2,300/month + Travel & Insurance",
    deadline: "2027-01-08",
    link: "https://www.campusfrance.org/en/france-excellence-eiffel-scholarship-program",
    eligibility: ["Under 29 at master's level or 35 at PhD level", "Not a French national"],
    benefits: ["Monthly stipend", "International and local transport, insurance, and housing assistance"],
    docs: ["Academic transcripts", "Research or study project"],
    tips: ["You cannot apply directly — a French institution must nominate you, so confirm your target university's own internal Eiffel deadline first, usually well before the national one"],
    featured: false,
    fully: "Yes",
    bond: "No",
    duration: "1-3 Years",
    cats: ["Nepali Students"]
  },
  {
    id: "sch-41",
    slug: "sciences-po-emile-boutmy-scholarship",
    title: "Sciences Po Emile Boutmy Scholarship",
    org: "Sciences Po",
    country: "France",
    level: "Any",
    field: "Political Science, Economics & International Affairs",
    desc: "A need- and merit-based scholarship for non-EU students admitted to Sciences Po's undergraduate or master's programmes, reserved for those not otherwise eligible for French government aid.",
    amount: "€3,500 - €15,000 (Non-Renewable)",
    deadline: "2026-12-15",
    link: "https://www.sciencespo.fr/en/admissions/tuition-and-financial-aid/scholarships/",
    eligibility: ["Admission offer from Sciences Po", "Non-EU nationality", "Demonstrated financial need"],
    benefits: ["One-time award applied toward tuition"],
    docs: ["Admission offer", "Financial statement"],
    tips: ["Apply for this scholarship only after receiving your Sciences Po admission decision — it is a separate, follow-up application"],
    featured: false,
    fully: "No",
    bond: "No",
    duration: "One-Time Award",
    cats: ["Nepali Students"]
  },
  {
    id: "sch-42",
    slug: "french-government-scholarships-bgf",
    title: "French Government Scholarships (Bourses du Gouvernement Français)",
    org: "French Embassy / Campus France",
    country: "France",
    level: "Any",
    field: "All Fields",
    desc: "Scholarships awarded by French embassies to support priority-sector international students pursuing degrees at French institutions, coordinated locally by Campus France.",
    amount: "Varies by Programme",
    deadline: "Varies by Programme (Check Campus France Nepal)",
    link: "https://www.france-visas.gouv.fr/en/web/france-visas/scholarships",
    eligibility: ["Admission or pre-admission to a French institution", "Meets the priority field/criteria set by the local embassy"],
    benefits: ["Monthly stipend and, in many cases, tuition support"],
    docs: ["Academic transcripts", "Motivation letter"],
    tips: ["Register with Campus France Nepal early — most BGF cycles require applying through them, not directly to the embassy"],
    featured: false,
    fully: "No",
    bond: "No",
    duration: "Program Length",
    cats: ["Nepali Students"]
  },
  {
    id: "sch-43",
    slug: "swedish-institute-scholarships-global-professionals",
    title: "Swedish Institute Scholarships for Global Professionals (SISGP)",
    org: "Swedish Institute",
    country: "Sweden",
    level: "Graduate",
    field: "All Fields",
    desc: "A fully-funded Swedish government scholarship for master's study, aimed at professionals with leadership experience who intend to contribute to their home country's development.",
    amount: "Fully Funded (Tuition, Stipend, Travel, Insurance)",
    deadline: "2027-01-15",
    link: "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/",
    eligibility: ["Citizen of an eligible country", "At least 3,000 hours (roughly 2 years) of relevant work or leadership experience"],
    benefits: ["Full tuition fees", "Monthly stipend, travel grant, and insurance"],
    docs: ["Proof of work experience", "Leadership documentation"],
    tips: ["First secure admission to an eligible master's programme via University Admissions — the SI Scholarship application only opens after that"],
    featured: false,
    fully: "Yes",
    bond: "No",
    duration: "1-2 Years",
    cats: ["Professionals"]
  },
  {
    id: "sch-44",
    slug: "kth-scholarships",
    title: "KTH Scholarships for Master's Studies",
    org: "KTH Royal Institute of Technology",
    country: "Sweden",
    level: "Graduate",
    field: "Engineering, Science & Technology",
    desc: "Merit-based tuition waiver scholarships awarded directly by KTH to high-achieving fee-paying master's applicants.",
    amount: "25-100% Tuition Waiver",
    deadline: "2027-01-15",
    link: "https://www.kth.se/en/studies/master/scholarships",
    eligibility: ["Admission offer to a KTH master's programme", "Fee-paying (non-EU/EEA) status"],
    benefits: ["Partial to full tuition fee waiver"],
    docs: ["KTH master's application"],
    tips: ["Apply for the scholarship at the same time as your programme application — there is no separate late-stage form"],
    featured: false,
    fully: "No",
    bond: "No",
    duration: "2 Years",
    cats: ["Nepali Students"]
  },
  {
    id: "sch-45",
    slug: "erasmus-mundus-norway",
    title: "Erasmus Mundus Joint Master's Degrees (Norway-based consortia)",
    org: "European Commission",
    country: "Norway",
    level: "Graduate",
    field: "All Fields",
    desc: "Fully-funded joint master's programmes delivered across multiple European universities, including Norway-anchored consortia — one of the few substantial funded pathways into Norwegian higher education for international students.",
    amount: "Fully Funded (Tuition, Stipend, Travel)",
    deadline: "2027-01-15",
    link: "https://www.eacea.ec.europa.eu/scholarships/emjmd-catalogue_en",
    eligibility: ["Bachelor's degree relevant to the chosen joint programme", "Meets the specific consortium's English requirement"],
    benefits: ["Full tuition waiver", "Monthly living allowance and travel costs"],
    docs: ["Academic transcripts", "Motivation letter", "CV"],
    tips: ["Norwegian public universities are legally limited in offering scholarships directly to non-EU students, which makes EMJMD consortia one of the more reliable funded routes into Norway specifically"],
    featured: false,
    fully: "Yes",
    bond: "No",
    duration: "1-2 Years",
    cats: ["Nepali Students"]
  },
  {
    id: "sch-46",
    slug: "finnish-government-scholarship-pool",
    title: "Finnish Government Scholarship Pool",
    org: "Finnish National Agency for Education (EDUFI)",
    country: "Finland",
    level: "PhD",
    field: "All Fields",
    desc: "Scholarships for doctoral-level study and research periods at Finnish higher education institutions, administered through participating universities.",
    amount: "€1,500/month",
    deadline: "Rolling (Applications Open Year-Round)",
    link: "https://www.oph.fi/en/programmes/finland-scholarships",
    eligibility: ["Doctoral student or researcher hosted by a Finnish university", "Nomination or hosting confirmation from the Finnish institution"],
    benefits: ["Monthly grant for the funded period"],
    docs: ["Hosting confirmation from Finnish university", "Research plan"],
    tips: ["You need a confirmed Finnish host institution and supervisor before applying — this is not a stand-alone application"],
    featured: false,
    fully: "No",
    bond: "No",
    duration: "3-12 Months",
    cats: ["Researchers"]
  },
  {
    id: "sch-47",
    slug: "university-of-helsinki-scholarship",
    title: "University of Helsinki Scholarship",
    org: "University of Helsinki",
    country: "Finland",
    level: "Graduate",
    field: "All Fields",
    desc: "Tuition fee waiver and grant scholarships for non-EU/EEA master's applicants admitted to an eligible University of Helsinki programme.",
    amount: "Full or Partial Tuition Waiver + Grant",
    deadline: "2027-01-07",
    link: "https://www.helsinki.fi/en/admissions/tuition-fees-and-scholarships",
    eligibility: ["Non-EU/EEA applicant", "Admission offer to an eligible master's programme"],
    benefits: ["Tuition fee waiver, in some cases with an additional living-cost grant"],
    docs: ["Studyinfo.fi application"],
    tips: ["Apply for admission through Studyinfo.fi by the January deadline — the scholarship decision follows the same application"],
    featured: false,
    fully: "No",
    bond: "No",
    duration: "2 Years",
    cats: ["Nepali Students"]
  },
  {
    id: "sch-48",
    slug: "aalto-university-scholarship",
    title: "Aalto University Scholarship",
    org: "Aalto University",
    country: "Finland",
    level: "Graduate",
    field: "Technology, Business & Design",
    desc: "Merit-based tuition fee scholarships for non-EU/EEA students admitted to an Aalto University master's programme.",
    amount: "50-100% Tuition Waiver",
    deadline: "2027-01-07",
    link: "https://www.aalto.fi/en/study-at-aalto/scholarships",
    eligibility: ["Non-EU/EEA applicant liable for tuition fees", "Admission offer to an eligible master's programme"],
    benefits: ["Tuition fee waiver of 50% or 100% depending on merit"],
    docs: ["Studyinfo.fi application"],
    tips: ["No separate scholarship form — you are automatically assessed for this award through your Aalto admission application"],
    featured: false,
    fully: "No",
    bond: "No",
    duration: "2 Years",
    cats: ["Nepali Students"]
  },
  {
    id: "sch-49",
    slug: "vlir-uos-scholarships",
    title: "VLIR-UOS Scholarships",
    org: "Flemish Interuniversity Council (VLIR-UOS)",
    country: "Belgium",
    level: "Graduate",
    field: "Development-Related Fields",
    desc: "Belgian government-funded scholarships for master's and training programmes at Flemish universities, aimed at professionals from developing countries working on sustainable development.",
    amount: "Fully Funded (Tuition, Stipend, Travel, Insurance)",
    deadline: "2027-01-15",
    link: "https://www.vliruos.be/en/scholarships",
    eligibility: ["National of an eligible developing country", "At least 3 years of relevant professional experience for most programmes"],
    benefits: ["Full tuition and monthly stipend", "Return travel and insurance"],
    docs: ["Professional CV", "Motivation letter", "Employer confirmation where required"],
    tips: ["Priority is given to candidates whose home organisation confirms they will return to apply their new skills — make that connection explicit in your motivation letter"],
    featured: false,
    fully: "Yes",
    bond: "No",
    duration: "1-2 Years",
    cats: ["Professionals"]
  },
  {
    id: "sch-50",
    slug: "ku-leuven-science-at-leuven-scholarship",
    title: "KU Leuven Science@Leuven Scholarship",
    org: "KU Leuven",
    country: "Belgium",
    level: "Graduate",
    field: "Science & Technology",
    desc: "Tuition and living-cost scholarships for outstanding international students admitted to a KU Leuven master's programme in science or engineering.",
    amount: "€8,500/year",
    deadline: "2027-02-01",
    link: "https://www.kuleuven.be/english/education/scholarships",
    eligibility: ["Admission offer to an eligible KU Leuven science/engineering master's programme", "Strong academic record"],
    benefits: ["Annual grant toward tuition and living costs"],
    docs: ["KU Leuven master's application"],
    tips: ["Apply to your programme well before the scholarship deadline — the scholarship round closes earlier than general admission"],
    featured: false,
    fully: "No",
    bond: "No",
    duration: "2 Years",
    cats: ["Nepali Students"]
  },
  {
    id: "sch-51",
    slug: "oead-scholarships",
    title: "OeAD Scholarships",
    org: "OeAD (Austrian Agency for Education and Internationalisation)",
    country: "Austria",
    level: "Any",
    field: "All Fields",
    desc: "Scholarships administered by Austria's national agency for international education, covering a range of programmes from short research stays to full degree study at Austrian institutions.",
    amount: "Varies by Programme",
    deadline: "Varies by Programme (Check OeAD)",
    link: "https://oead.at/en/to-austria/scholarships",
    eligibility: ["Varies by specific scholarship programme", "Generally requires a hosting/admission confirmation from an Austrian institution"],
    benefits: ["Monthly stipend; some programmes also cover tuition and insurance"],
    docs: ["Hosting or admission confirmation", "Academic transcripts"],
    tips: ["OeAD administers many distinct scholarship lines — identify the specific programme matching your study level before applying, rather than a single general form"],
    featured: false,
    fully: "No",
    bond: "No",
    duration: "Varies",
    cats: ["Nepali Students"]
  },
  {
    id: "sch-52",
    slug: "ernst-mach-grant",
    title: "Ernst Mach Grant (ASEA-UNINET)",
    org: "OeAD / ASEA-UNINET",
    country: "Austria",
    level: "Graduate",
    field: "All Fields",
    desc: "A grant supporting master's, PhD, and short research stays at Austrian universities, open to students from ASEA-UNINET partner regions and other eligible countries.",
    amount: "€1,150/month",
    deadline: "2026-09-15",
    link: "https://oead.at/en/to-austria/scholarships/scholarship-database",
    eligibility: ["Admission or hosting confirmation from an Austrian university", "Meets the specific programme's academic level requirements"],
    benefits: ["Monthly stipend for the funded period"],
    docs: ["Hosting confirmation", "Study or research plan"],
    tips: ["Two application rounds run each year — plan around the March and September windows rather than assuming a single annual deadline"],
    featured: false,
    fully: "No",
    bond: "No",
    duration: "1-9 Months",
    cats: ["Researchers"]
  }
];

export const SCHOLARSHIPS: Scholarship[] = rawScholarships.map(s => ({
  id: s.id,
  slug: s.slug,
  title: s.title,
  provider: s.org,
  organization: s.org,
  org: s.org,
  description: s.desc,
  desc: s.desc,
  amount: s.amount,
  deadline: s.deadline,
  applicationDeadline: s.deadline,
  countries: [s.country],
  country: s.country,
  levels: [s.level],
  level: s.level,
  academicLevel: s.level === "Graduate" ? "Graduate (Master's)" : s.level === "PhD" ? "Doctorate / PhD" : s.level + " Level",
  categories: s.cats,
  link: s.link,
  officialWebsite: s.link,
  tags: [s.country, s.level, s.field, s.amount.includes("Fully") ? "Fully Funded" : "Scholarship"],
  eligibility: s.eligibility,
  benefits: s.benefits,
  featured: s.featured,
  fieldOfStudy: s.field,
  field: s.field,
  fundingType: s.amount.includes("Fully") ? "Fully Funded" : "Scholarship",
  fullyFunded: s.fully,
  bondRequired: s.bond,
  duration: s.duration,
  requiredDocuments: s.docs,
  applicationTips: s.tips
}));

export const COUNTRIES: Country[] = [
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    description: "The global hub for premium higher education, pioneering research, and Silicon Valley-driven entrepreneurship. Home to prestigious Ivy League universities and generous merit-based teaching/research assistantships.",
    popularScholarshipsCount: 142,
    visaGuidance: "Requires F-1 student visa. You must obtain an I-20 form from an approved school and pay the SEVIS fee before scheduling your visa interview at the US Embassy in Kathmandu (Maharajgunj).",
    averageCostOfLiving: "$1,200 - $2,000 / month",
    languageRequirements: "TOEFL iBT (80+), IELTS (6.5+), or Duolingo (115+)",
    featuredScholarships: ["Fulbright Foreign Student Program", "AAUW International Fellowships for Women", "Thiel Fellowship"],
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=600&auto=format&fit=crop"
  },
  {
    code: "UK",
    name: "United Kingdom",
    flag: "🇬🇧",
    description: "Rich academic history paired with accelerated 1-year Master's programs. Iconic institutions like Oxford, Cambridge, and Imperial College London offer massive scholarship programs funded by government and royal trusts.",
    popularScholarshipsCount: 98,
    visaGuidance: "Requires a Student Visa (formerly Tier 4). Students must accumulate 70 points based on university acceptance (CAS), financial proof, and English language proficiency.",
    averageCostOfLiving: "£1,000 - £1,500 / month",
    languageRequirements: "IELTS Academic (6.5+ with no band below 6.0) or PTE (58+)",
    featuredScholarships: ["Chevening Scholarships", "British Council Scholarships for Women in STEM", "Gates Cambridge Scholarships"],
    image: "https://images.unsplash.com/photo-1486299267070-83823f5448dd?q=80&w=600&auto=format&fit=crop"
  },
  {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    description: "The engineering and scientific power-house of Europe. Most public universities have ZERO tuition fees for international students, making academic research accessible with DAAD living stipends.",
    popularScholarshipsCount: 75,
    visaGuidance: "Requires a German National Student Visa. Nepali students must create a Blocked Account (Sperrkonto) with around €11,900 to prove financial sufficiency for one year, unless fully funded by DAAD.",
    averageCostOfLiving: "€850 - €1,100 / month",
    languageRequirements: "IELTS (6.0+) or German language proof (TestDaF/Goethe C1 for German-taught)",
    featuredScholarships: ["DAAD Doctoral Research Grants", "Erasmus Mundus Joint Masters", "Swedish Institute Scholarships for Global Professionals"],
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=600&auto=format&fit=crop"
  },
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    description: "Boasting spectacular natural beauty, top-ranking research hubs, and very favorable post-study work rights. A major hub for South Asian students pursuing environmental science, IT, and healthcare fields.",
    popularScholarshipsCount: 62,
    visaGuidance: "Requires Subclass 500 Student Visa. Applicants must pass Genuine Student (GS) tests, provide health exams, and demonstrate sufficient OSHC medical coverage.",
    averageCostOfLiving: "$1,500 - $2,200 AUD / month",
    languageRequirements: "IELTS (6.5+), PTE (58+), or TOEFL iBT (79+)",
    featuredScholarships: ["Australia Awards Scholarships", "Manaaki New Zealand Scholarships"],
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=600&auto=format&fit=crop"
  },
  {
    code: "JP",
    name: "Japan",
    flag: "🇯🇵",
    description: "A global leader in technology, engineering, and innovation, offering some of the world's most affordable public university tuition alongside deeply subsidized MEXT government scholarships.",
    popularScholarshipsCount: 41,
    visaGuidance: "Requires a Student Visa backed by a Certificate of Eligibility (COE) issued by your accepting Japanese institution. The COE must be obtained before applying at the Japanese Embassy in Kathmandu.",
    averageCostOfLiving: "¥100,000 - ¥150,000 / month",
    languageRequirements: "JLPT N2 for Japanese-taught programs; IELTS (6.0+) or TOEFL iBT (72+) for English-taught programs",
    featuredScholarships: ["MEXT Scholarship", "JASSO Scholarship", "ADB-Japan Scholarship Program"],
    image: "https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=600&auto=format&fit=crop"
  },
  {
    code: "KR",
    name: "South Korea",
    flag: "🇰🇷",
    description: "A rapidly rising destination combining cutting-edge technology, K-culture influence, and the fully-funded Global Korea Scholarship, covering tuition, a monthly stipend, and Korean language training.",
    popularScholarshipsCount: 33,
    visaGuidance: "Requires a D-2 Student Visa. Applicants need a Certificate of Admission from a Korean institution and proof of financial capability, submitted through the Korean Embassy in Kathmandu.",
    averageCostOfLiving: "₩700,000 - ₩1,200,000 / month",
    languageRequirements: "TOPIK Level 3+ for Korean-taught programs; IELTS (6.0+) or TOEFL iBT (80+) for English-taught programs",
    featuredScholarships: ["Global Korea Scholarship (GKS)", "KAIST Scholarship", "POSTECH Scholarship"],
    image: "https://images.unsplash.com/photo-1612150139260-09745e8a1d55?q=80&w=600&auto=format&fit=crop"
  },
  {
    code: "CN",
    name: "China",
    flag: "🇨🇳",
    description: "Home to a fast-growing number of globally-ranked universities and the large-scale Chinese Government Scholarship (CSC) program, offering an affordable and increasingly popular alternative for South Asian students.",
    popularScholarshipsCount: 28,
    visaGuidance: "Requires an X1 (long-term) or X2 (short-term) Student Visa. Applicants need a JW201/JW202 form and admission letter from their Chinese institution, processed via the Chinese Embassy in Kathmandu.",
    averageCostOfLiving: "¥2,000 - ¥3,500 / month",
    languageRequirements: "HSK Level 4+ for Chinese-taught programs; IELTS (6.0+) or TOEFL iBT (80+) for English-taught programs",
    featuredScholarships: ["Chinese Government Scholarship (CSC)", "Provincial Government Scholarships", "University-Specific Scholarships"],
    image: "https://images.unsplash.com/photo-1752662742861-fb76c71576d7?q=80&w=600&auto=format&fit=crop"
  },
  {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    description: "A geographically and culturally close destination offering strong regional academic ties, government-funded ICCR scholarships, and comparatively low travel and living costs for Nepali students.",
    popularScholarshipsCount: 54,
    visaGuidance: "Requires a Student Visa, obtainable through the Indian Embassy in Kathmandu or via e-Visa for eligible categories. Requires proof of admission and, in most cases, no separate NOC beyond standard MOEST registration.",
    averageCostOfLiving: "₹15,000 - ₹25,000 / month",
    languageRequirements: "Most programs are English-taught; IELTS (6.0+) sometimes waived for Nepali applicants at partner institutions",
    featuredScholarships: ["ICCR Scholarship", "Study in India Programme", "SAARC Scholarships (where applicable)"],
    image: "https://images.unsplash.com/photo-1759058441220-c5f17193fee6?q=80&w=600&auto=format&fit=crop"
  },
  {
    code: "FI",
    name: "Finland",
    flag: "🇫🇮",
    description: "A world leader in education quality and student wellbeing, offering English-taught Bachelor's and Master's programmes at research-driven universities. EU/EEA students study tuition-free, while non-EU nationals gain access to moderate tuition, extensive work rights, and a strong post-study stay pathway.",
    popularScholarshipsCount: 22,
    visaGuidance: "Requires a Finnish Residence Permit for Studies (for stays over 90 days), applied for online via Enter Finland and processed by the Finnish Immigration Service (Migri); biometrics and document submission are completed at the Finnish Embassy/VFS Global centre in Kathmandu.",
    averageCostOfLiving: "€700 - €1,200 / month",
    languageRequirements: "IELTS (6.0+) or equivalent for English-taught programmes; Finnish/Swedish proficiency is not required for most Bachelor's and Master's degrees",
    featuredScholarships: ["University-specific tuition waivers (up to 100%)", "Finnish Government Scholarship Pool (doctoral researchers)", "Erasmus Mundus Joint Master's (Finland-based consortia)"],
    image: "https://images.unsplash.com/photo-1544096714-18ad573ad07e?q=80&w=600&auto=format&fit=crop"
  },
  {
    code: "NO",
    name: "Norway",
    flag: "🇳🇴",
    description: "Renowned for research strength, high living standards, and a historically tuition-free public university system. Since 2023, non-EU/EEA students pay tuition at public institutions, but PhD study remains free for all nationalities, and the safety and natural environment make Norway a strong fit for research-focused applicants.",
    popularScholarshipsCount: 15,
    visaGuidance: "Requires a Norwegian Study Residence Permit. Applications for Nepali citizens are processed by the Royal Norwegian Embassy in New Delhi, but submitted and collected locally through the VFS Global Visa Application Centre in Kathmandu.",
    averageCostOfLiving: "NOK 12,000 - 18,000 / month",
    languageRequirements: "IELTS (6.0+) or TOEFL iBT for English-taught programmes; Norwegian proficiency is required only for Norwegian-taught degrees",
    featuredScholarships: ["Norwegian university-specific tuition reductions (institution-dependent)", "Erasmus Mundus Joint Master's (Norway-based consortia)", "Quota Scheme legacy partnerships (select institutions)"],
    image: "https://images.unsplash.com/photo-1690809092810-dc3e9240191f?q=80&w=600&auto=format&fit=crop"
  },
  {
    code: "NL",
    name: "Netherlands",
    flag: "🇳🇱",
    description: "A highly ranked, largely English-taught higher education system known for problem-based learning, strong industry links, and a large network of research universities and universities of applied sciences. Non-EU tuition is comparatively lower than the UK or US, paired with a generous post-study job-search year.",
    popularScholarshipsCount: 46,
    visaGuidance: "Requires an MVV (entry visa) combined with a residence permit for study, usually applied for on your behalf by the enrolling Dutch institution through the IND. Applications are submitted via the VFS Global Visa Application Centre in Kathmandu and forwarded to the Embassy of the Netherlands in New Delhi for adjudication.",
    averageCostOfLiving: "€1,000 - €1,400 / month",
    languageRequirements: "IELTS (6.0-6.5+) or TOEFL iBT for English-taught programmes; Dutch proficiency is not required for the many English-taught Bachelor's/Master's degrees",
    featuredScholarships: ["Holland Scholarship", "Orange Knowledge Programme (Nuffic)", "University-specific Excellence Scholarships (e.g. Amsterdam Excellence, Utrecht Excellence)"],
    image: "https://images.unsplash.com/photo-1753810809240-a28f725d3328?q=80&w=600&auto=format&fit=crop"
  },
  {
    code: "RU",
    name: "Russia",
    flag: "🇷🇺",
    description: "A long-standing destination for Nepali students in medicine, engineering, and technical fields, offering the fully funded Russian Government Scholarship (Rossotrudnichestvo quota) alongside significantly lower self-funded tuition and living costs than Western Europe or North America.",
    popularScholarshipsCount: 33,
    visaGuidance: "Requires a Russian Student Visa, issued only after the host university submits an official invitation (приглашение) to the Russian Ministry of Internal Affairs. Applications are submitted at the Embassy of the Russian Federation in Kathmandu once the invitation is confirmed.",
    averageCostOfLiving: "₽15,000 - ₽25,000 / month",
    languageRequirements: "Most degree programmes are taught in Russian, requiring a one-year preparatory language course for non-Russian speakers; a growing number of English-taught programmes (mainly medicine and engineering) accept IELTS (6.0+)",
    featuredScholarships: ["Russian Government Scholarship (Rossotrudnichestvo Quota)", "University-specific tuition discounts for high-academic-standing students", "Bilateral scholarship agreements coordinated through the Russian House in Kathmandu"],
    image: "https://images.unsplash.com/photo-1513326738677-b964603b136d?q=80&w=600&auto=format&fit=crop"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Anusha Shrestha",
    role: "British Council STEM Scholar",
    scholarshipName: "British Council Scholarships for Women in STEM",
    text: "Getting fully funded to study Renewable Energy at Cranfield University was a dream come true. As a Nepali woman in engineering, this scholarship removed all financial barriers and connected me to an incredible circle of international scientists.",
    location: "Kathmandu / London",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: "test-2",
    name: "Dr. Ramesh Adhikari",
    role: "Post-doctoral Researcher",
    scholarshipName: "Fulbright Foreign Student Program",
    text: "My time researching agricultural biotechnology in Minnesota under the Fulbright program completely reshaped my academic career. KIPLANScholar's checklist on structuring a research proposal was the exact edge I needed during my application.",
    location: "Pokhara / Minneapolis",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: "test-3",
    name: "Pradip Ghimire",
    role: "Founder, GreenTech Nepal",
    scholarshipName: "Halcyon Fellowship",
    text: "As a social entrepreneur, navigating international startup fellowships seemed impossible until I found KIPLANScholar. The focus on entrepreneur grants and step-by-step pitch structures led directly to our seed residency in D.C.",
    location: "Lalitpur / Washington D.C.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
  }
];

export const FAQS: FAQ[] = [
  {
    id: "faq-1",
    question: "How can Nepali students prove English proficiency?",
    answer: "Most international scholarships require either IELTS, TOEFL, or PTE Academic scores. However, some universities accept a 'Medium of Instruction (MOI)' certificate if your Bachelor's degree was taught entirely in English. Make sure to take your exams at certified centers in Kathmandu, Lalitpur, or Pokhara to guarantee validity.",
    category: "General"
  },
  {
    id: "faq-2",
    question: "Are there specific full-tuition grants for women in STEM from Nepal?",
    answer: "Yes! Programs like the British Council Women in STEM scholarships and the Schlumberger Foundation Faculty for the Future are exclusively designed for women from developing regions, providing 100% tuition, monthly living expenses, childcare grants, and international airfare.",
    category: "Eligibility"
  },
  {
    id: "faq-3",
    question: "What is a Statement of Purpose (SOP), and how long should it be?",
    answer: "An SOP is a critical 1-2 page essay (typically 800-1000 words) describing your academic background, career objectives, research interests, and why you are applying to that specific scholarship. It must explain how you plan to return and contribute to Nepal's socioeconomic growth.",
    category: "Application"
  },
  {
    id: "faq-4",
    question: "What is a 'Blocked Account' required for German student visas?",
    answer: "Germany has no tuition fees, but to get a student visa, Nepali students must open a Blocked Account (Sperrkonto) containing around €11,900, which acts as proof that you have enough funds to live for a year. Fully funded scholarship recipients (like DAAD) are completely exempt from this requirement.",
    category: "Visa"
  },
  {
    id: "faq-5",
    question: "Who is KIPLANScholar designed for?",
    answer: "KIPLANScholar is primarily designed to support Nepali students, researchers, women, entrepreneurs, and professionals seeking international educational opportunities. Students and professionals from around the world are also welcome to explore opportunities where eligibility criteria permit.",
    category: "General"
  }
];

export const RESOURCES: ResourceTemplate[] = [
  {
    id: "res-sop",
    title: "SOP (Statement of Purpose) Master Outline",
    description: "The complete, paragraph-by-paragraph structure to write a winning SOP that emphasizes leadership and your return-to-Nepal plan.",
    type: "SOP",
    downloadUrl: "#",
    contentStructure: [
      "Introduction: The Hook (A real-life incident in Nepal showing your drive)",
      "Academic Background: Highlighting high-impact undergraduate projects",
      "Professional Experience: Translating your work into leadership skills",
      "Why This Country & Course: Specific modules & professors you want to research under",
      "Why This Scholarship: How the funding aligns with your socioeconomic goals",
      "The Return Plan: Concrete ways you plan to give back to Nepal's local industries"
    ],
    tips: [
      "Avoid passive sentences; use strong active verbs (e.g., 'I established' instead of 'It was established by me').",
      "Never copy templates. Plagiarism check is extremely strict in US/UK/Europe universities.",
      "Highlight how you will support or empower other women/entrepreneurs if applicable."
    ]
  },
  {
    id: "res-lor",
    title: "Academic Reference Letter (LOR) Template",
    description: "Guidelines and a downloadable template for your University Professors or Dean to write a highly credible reference.",
    type: "LOR",
    downloadUrl: "#",
    contentStructure: [
      "Paragraph 1: Academic relationship length and courses taught",
      "Paragraph 2: Ranking (e.g., 'She was in the top 5% of my computer science class of 120')",
      "Paragraph 3: Specific project evidence showing critical thinking, research skills, or initiative",
      "Paragraph 4: Extracurricular and leadership activities (e.g., college club organization)",
      "Paragraph 5: Unconditional, enthusiastic recommendation for the scholarship"
    ],
    tips: [
      "Provide your professors with your resume and a list of achievements so they can customize the letter.",
      "Must be printed on official college/university letterhead with a signature and official email address."
    ]
  },
  {
    id: "res-checklist",
    title: "Nepali Student Visa & Scholarship Checklist",
    description: "A chronological checklist for preparing your document portfolios, attestation, and embassy appointments.",
    type: "Checklist",
    downloadUrl: "#",
    contentStructure: [
      "Attestation of transcripts by MOEST (Ministry of Education, Science and Technology, Nepal)",
      "Verification of documents by MoFA (Ministry of Foreign Affairs, Nepal)",
      "Valid Passport (with at least 18 months remaining)",
      "English Proficiency Test certificate (IELTS/PTE) printed copy",
      "At least two Recommendation Letters (signed on official letterheads)",
      "SOP (Statement of Purpose) final proofread draft",
      "Medical insurance certificate matching country specifications",
      "No Objection Letter (NOC) from MOEST (required for bank transfers and currency exchange)"
    ],
    tips: [
      "Begin the MOEST attestation at least 3 months prior to departure to avoid peak-season queues in Keshar Mahal.",
      "Keep a clean digital copy of all certified documents on Google Drive."
    ]
  },
  {
    id: "res-visa-guide",
    title: "Nepal Student Visa Application Guide",
    description: "The step-by-step visa application sequence for Nepali students, from offer letter to embassy interview — separate from the document checklist above.",
    type: "Visa",
    downloadUrl: "#",
    contentStructure: [
      "Secure your unconditional offer/admission letter and scholarship award confirmation before booking any embassy appointment",
      "Complete MOEST attestation and MoFA verification of academic transcripts (see Visa & Scholarship Checklist for the full document list)",
      "Arrange proof of funds: sponsorship letter, bank statements, or a blocked account where the host country requires one",
      "Apply for the No Objection Letter (NOC) from MOEST, required for foreign currency exchange and bank transfers",
      "Book your visa/embassy appointment in Kathmandu and complete biometrics enrolment",
      "Prepare for the visa interview: genuine student intent, financial credibility, and a clear return-to-Nepal plan",
      "Track visa decision timelines against your program's intake date and confirm travel/pre-departure formalities"
    ],
    tips: [
      "Visa processing times and financial-proof requirements vary by destination country — check the specific country's guide in Destination Guides for exact figures.",
      "Apply for your embassy appointment only after MOEST/MoFA attestation is complete; most embassies in Kathmandu require the attested originals at the counter.",
      "Rehearse interview answers about your course choice, funding source, and post-study return plan — vague answers are the most common cause of refusal."
    ]
  },
  {
    id: "res-legal-notarial",
    title: "Legal & Notarial Service",
    description: "Guidance and preparation support for certified translation, document verification, attestation, and notarial requirements associated with international education and scholarship applications.",
    type: "Guidance & Preparation",
    downloadUrl: "#",
    contentStructure: [
      "Certified translation",
      "Document verification and attestation guidance",
      "Notarial / document certification support",
      "MoFA and relevant authority procedures",
      "Guidance on document requirements for international applications"
    ],
    tips: [],
    comingSoon: true,
    routeTo: "legal-notarial"
  },
  {
    id: "res-interview-prep",
    title: "Scholarship Interview Preparation",
    description: "Practical guidance for scholarship panel and remote interviews — common question areas, a structure for organizing your answers, and technical setup tips for video interviews.",
    type: "Interview",
    downloadUrl: "#",
    contentStructure: [
      "Common question areas: Why this scholarship and this programme? Tell us about yourself and your background. Your career goals and how you plan to contribute after returning to Nepal. A challenge you've faced and how you handled it. Questions specific to your field of study.",
      "The STAR technique: a simple structure for organizing an answer around real experience — Situation (brief context), Task (what you needed to do), Action (what you actually did), Result (the outcome, including what you learned).",
      "Using STAR with your own material: pick two or three genuine experiences from your studies, work, or community involvement, and practice describing each one using the Situation/Task/Action/Result structure. The goal is a structure to adapt, not a script to memorize or copy — panels notice rehearsed, generic answers.",
      "Remote/video interview setup: test your camera and microphone at least a day beforehand, use a stable wired or strong Wi-Fi connection where possible, sit facing a light source rather than a window behind you, choose a plain and tidy background, and dress the same way you would for an in-person interview.",
    ],
    tips: [
      "Practice your answers out loud, not just in your head — this is the only way to notice if something sounds unclear or too long.",
      "Keep answers focused; two to three minutes is usually enough for most questions.",
      "It's fine to pause for a moment before answering — a brief pause reads as thoughtful, not unprepared.",
      "Prepare a few real, specific examples from your own experience that you can adapt to different questions, rather than one fixed answer per question.",
      "Have a backup plan for your internet connection or device in case of technical issues on the day.",
    ],
  },
  {
    id: "res-cv",
    title: "CV Writing Guide",
    description: "What to include, how to phrase achievements, and formatting standards for a strong academic CV.",
    type: "CV",
    downloadUrl: "#",
    contentStructure: [
      "Personal Information & Summary: your name and contact details, followed by a short 2–3 sentence professional summary that highlights your academic focus and goals — not a generic introduction.",
      "Education: list degrees in reverse chronological order (most recent first), including institution, dates, and any coursework, thesis, or research relevant to your target programme.",
      "Experience: work, research, or volunteer experience — describe what you actually did and achieved using action verbs, not just a list of duties (e.g. 'Led a team of five to redesign the intake process' rather than 'Responsible for the intake process').",
      "Achievements: awards, scholarships, and publications, each described with enough context that someone outside your specific field can understand why it matters.",
      "Skills & Activities: list skills you can genuinely speak to in an interview, grouped logically (e.g. technical skills together, language skills together) rather than one long unsorted list.",
      "Academic vs. professional CV format: academic CVs are typically longer and include research and publications sections; professional CVs are usually concise (one to two pages) and focus on work achievements. Check what your target programme actually expects before choosing a length and style.",
    ],
    tips: [
      "Use active, specific verbs — led, designed, analyzed, published — instead of vague ones like helped, worked on, or was involved in.",
      "Quantify results where you honestly can (numbers, percentages, timeframes), but never invent a figure you can't stand behind if asked about it.",
      "Keep formatting consistent throughout: the same date format, heading style, and bullet style on every page.",
      "Leave out personal details like a photo, marital status, or religion unless the programme specifically asks for them.",
      "Ask someone else to proofread before you submit — spelling and formatting errors are one of the most common reasons a CV gets set aside early.",
    ],
  },
];