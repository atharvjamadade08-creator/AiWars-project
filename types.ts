
export enum AdminLevel {
  MUNICIPAL = "Municipal Level",
  STATE = "State Level",
  CENTRAL = "Central Level"
}

export interface AssignedOfficial {
  name: string;
  designation: string;
  phone: string;
}

export interface ClassificationResult {
  level: AdminLevel;
  department: string;
  summary: string;
  urgency: "High" | "Medium" | "Low";
  reasoning: string;
  assignedOfficial: AssignedOfficial;
  estimatedTimelineDays: number;
  initialProgress: number;
}

export interface Complaint {
  id: string;
  text: string;
  status: "Pending" | "Classified" | "Processing" | "Resolved";
  timestamp: Date;
  classification?: ClassificationResult;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
}
