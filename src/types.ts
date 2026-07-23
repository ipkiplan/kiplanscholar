export interface Scholarship {
  id: string;
  slug: string;
  title: string;
  provider: string; // matches organization for backwards compatibility
  organization: string;
  description: string;
  amount: string; // matches funding amount/benefits
  deadline: string; // matches applicationDeadline for backwards compatibility
  applicationDeadline: string;
  countries: string[]; // matches country for backwards compatibility
  country: string;
  levels: ("Undergraduate" | "Graduate" | "Postgraduate" | "Research" | "PhD" | "Any")[]; // for backwards compatibility
  academicLevel: string;
  categories: ("Nepali Students" | "Women" | "Entrepreneurs" | "Researchers" | "Professionals")[];
  link: string; // matches officialWebsite for backwards compatibility
  officialWebsite: string;
  tags: string[];
  eligibility: string[];
  benefits: string[];
  featured?: boolean;
  
  // New detailed fields
  fieldOfStudy: string;
  fundingType: string;
  fullyFunded: "Yes" | "No";
  bondRequired: "Yes" | "No";
  duration: string;
  requiredDocuments: string[];
  applicationTips: string[];
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  description: string;
  popularScholarshipsCount: number;
  visaGuidance: string;
  averageCostOfLiving: string;
  languageRequirements: string;
  featuredScholarships: string[];
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  scholarshipName: string;
  text: string;
  location: string;
  avatar: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Eligibility" | "Application" | "Visa";
}

export interface ResourceTemplate {
  id: string;
  title: string;
  description: string;
  type: "SOP" | "CV" | "LOR" | "Checklist";
  downloadUrl: string;
  contentStructure: string[];
  tips: string[];
}
