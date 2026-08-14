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
  educationLevel: string;
  funding: 
    | "Fully Funded"
    | "Partially Funded"
    | "Self Funded"
    | "Fellowship Stipend"
    | "Paid Internship"
    | "Grant"
    | "Prize Money";
  status: "Rolling" | "Open" | "Closing Soon" | "Closed";
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
  targetGroup: string;
  subjectArea: string;
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