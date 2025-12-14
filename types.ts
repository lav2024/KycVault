export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum KycStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface User {
  username: string;
  role: Role;
  email?: string;
}

export interface DocumentData {
  extractedName: string;
  extractedDob: string;
  extractedGender: string;
  docType: string;
  docNumber: string;
  matchStatus: {
    name: boolean;
    dob: boolean;
    gender: boolean;
  };
}

export interface KycSubmission {
  id: string;
  username: string;
  submittedAt: string; // ISO date string
  userProvided: {
    fullName: string;
    dob: string;
    gender: string;
  };
  documentImage: string; // Base64
  aiAnalysis: {
    documentData: DocumentData;
    riskLevel: RiskLevel;
    fraudScore: number;
    explanation: string;
  };
  status: KycStatus;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
