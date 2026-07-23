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
  }
];

export const SCHOLARSHIPS: Scholarship[] = rawScholarships.map(s => ({
  id: s.id,
  slug: s.slug,
  title: s.title,
  provider: s.org,
  organization: s.org,
  description: s.desc,
  amount: s.amount,
  deadline: s.deadline,
  applicationDeadline: s.deadline,
  countries: [s.country],
  country: s.country,
  levels: [s.level],
  academicLevel: s.level === "Graduate" ? "Graduate (Master's)" : s.level === "PhD" ? "Doctorate / PhD" : s.level + " Level",
  categories: s.cats,
  link: s.link,
  officialWebsite: s.link,
  tags: [s.country, s.level, s.field, s.amount.includes("Fully") ? "Fully Funded" : "Scholarship"],
  eligibility: s.eligibility,
  benefits: s.benefits,
  featured: s.featured,
  fieldOfStudy: s.field,
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
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ca1ad?q=80&w=600&auto=format&fit=crop"
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
  }
];
