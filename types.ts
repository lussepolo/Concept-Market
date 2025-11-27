
export enum Division {
  MIDDLE_SCHOOL = "Middle School",
  HIGH_SCHOOL = "High School"
}

export interface Project {
  id: string;
  title: string;
  division: Division;
  mentor: string;
  primaryArea: string; // Area of Knowledge
  theme: string; // Thematic Cluster
  outputType: string;
  mdp: string; // Proposed MDP
  team: string[]; // Student names
  imageUrl: string;
  
  // Live Data
  totalHoursInvested: number;
  investorCount: number;
}

export interface Allocation {
  projectId: string;
  hours: number;
}

export interface Family {
  id: string;
  accessCode: string; // The login credential
  studentName: string; // e.g. "The Smith Family" - empty string means unclaimed
  allocations: Allocation[];
  hasFinishedVoting?: boolean;
  claimedAt?: number; // Timestamp when family registered
}

export interface FamilyState {
  allocations: Allocation[];
  remainingHours: number;
}

// Sort Options
export type SortOption = 'popular' | 'name' | 'hours_high' | 'hours_low';
