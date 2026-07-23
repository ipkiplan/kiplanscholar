import { Scholarship } from "../../types";

export interface EnrichedOpportunity extends Scholarship {
  opportunityType: 
    | "Scholarship"
    | "Fellowship"
    | "Internship"
    | "Grant"
    | "Conference"
    | "Exchange"
    | "Research"
    | "Competition"
    | "Job"
    | "Volunteer"
    | "Summer School"
    | "Training"
    | "Accelerator"
    | "Incubator";
  educationLevel: 
    | "High School"
    | "Diploma"
    | "Undergraduate"
    | "Bachelor's"
    | "Master's"
    | "PhD"
    | "Postdoctoral"
    | "Research"
    | "Short Course"
    | "Professional Training";
  funding: 
    | "Fully Funded"
    | "Partially Funded"
    | "Self Funded"
    | "Fellowship Stipend"
    | "Paid Internship"
    | "Grant"
    | "Prize Money";
  status: "Open" | "Opening Soon" | "Closing Soon" | "Closed";
  intake: 
    | "January"
    | "February"
    | "March"
    | "April"
    | "May"
    | "June"
    | "July"
    | "August"
    | "September"
    | "October"
    | "November"
    | "December"
    | "Rolling Intake";
  gender: "All" | "Women" | "Men";
  targetGroup: 
    | "All"
    | "Women"
    | "Entrepreneurs"
    | "Teachers"
    | "Researchers"
    | "Journalists"
    | "Government Employees"
    | "Civil Servants"
    | "Lawyers"
    | "Doctors"
    | "Engineers"
    | "Startup Founders"
    | "Persons with Disabilities"
    | "Refugees"
    | "Indigenous Communities"
    | "Youth Leaders";
  subjectArea: 
    | "Engineering"
    | "AI"
    | "Computer Science"
    | "Data Science"
    | "Medicine"
    | "Public Health"
    | "Agriculture"
    | "Business"
    | "Economics"
    | "Law"
    | "Education"
    | "Climate Change"
    | "Energy"
    | "Environment"
    | "Architecture"
    | "Arts"
    | "Humanities";
  organizationType: 
    | "Government"
    | "University"
    | "NGO"
    | "INGO"
    | "UN Agency"
    | "Development Bank"
    | "Private Foundation";
  
  // Custom metrics for sorting
  viewsCount: number;
  dateAdded: string; // YYYY-MM-DD
  daysRemaining: number;
}
