
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
  totalCoinsInvested: number;
  investorCount: number;
}

export interface Allocation {
  projectId: string;
  coins: number;
}

export interface Family {
  id: string;
  accessCode: string; // The login credential
  studentName: string; // e.g. "The Smith Family"
  allocations: Allocation[];
  hasFinishedVoting?: boolean;
}

export interface FamilyState {
  allocations: Allocation[];
  remainingCoins: number;
}

// Sort Options
export type SortOption = 'popular' | 'name' | 'coins_high' | 'coins_low';
