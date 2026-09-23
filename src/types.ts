export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export type Status = 
  | 'Report Submitted'
  | 'AI Verified'
  | 'Department Assigned'
  | 'In Progress'
  | 'Resolution Pending'
  | 'Resolved';

export type Department = 
  | 'Municipal Roads'
  | 'Water & Sewerage'
  | 'Solid Waste Management'
  | 'Electricity & Lighting'
  | 'Traffic & Safety';

export interface TimelineEntry {
  status: Status;
  timestamp: string;
  note: string;
  actor: string;
  completed: boolean;
  current: boolean;
}

export interface VerificationData {
  afterImageUrl: string;
  clearanceScore: number;
  defectDetected: boolean;
  timestamp: string;
  citizenConfirmed: boolean | null; // null = pending, true = confirmed, false = rejected
  aiVerdict: string;
  notes?: string;
}

export interface CivicIssue {
  id: string; // e.g., 'CA1024'
  title: string;
  description: string;
  category: 'Road Pothole' | 'Broken Streetlight' | 'Open Manhole' | 'Garbage Dump' | 'Water Leakage' | 'Damaged Signage' | string;
  severity: Severity;
  severityScore: number; // 0 - 100
  locationName: string;
  coordinates: [number, number]; // [lat, lng]
  potentialImpact: string;
  duplicateCount: number;
  duplicateDistanceMeters: number;
  department: Department;
  status: Status;
  imageUrl: string;
  confidence: number;
  createdAt: string;
  slaHours: number;
  assignedCrew?: string;
  priorityScore: number; // Calculated by engine
  verification?: VerificationData;
  history: TimelineEntry[];
  reporterName?: string;
  source?: 'User Portal' | 'System';
  isUserSubmitted?: boolean;
}

export interface PriorityWeights {
  severity: number; // default 0.35
  duplicates: number; // default 0.25
  locationImportance: number; // default 0.20
  publicImpact: number; // default 0.20
}

export type ActiveTab = 
  | 'citizen'
  | 'admin'
  | 'priority'
  | 'tracking'
  | 'verify';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  ward: string;
  role: 'citizen' | 'officer' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface EmergencyService {
  id: string;
  name: string;
  category: 'Police' | 'Fire' | 'Medical' | 'Municipal' | 'Electricity' | 'Water' | 'Safety';
  number: string;
  altNumber?: string;
  address: string;
  distanceKm: number;
  available: string;
  icon: string;
}
