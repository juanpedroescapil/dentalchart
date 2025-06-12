export type ToothCondition = 
  | 'Healthy' 
  | 'Caries' 
  | 'Missing' 
  | 'Restored' 
  | 'Crown' 
  | 'Implant' 
  | 'RootCanalTreated'
  | 'ToExtract'
  | 'Veneer'
  | 'BridgePontic'
  | 'BridgeAbutment';

export interface Tooth {
  id: number; // Using FDI notation (e.g., 11-18, 21-28, 31-38, 41-48)
  condition: ToothCondition;
  notes?: string;
  treatments?: { date: string; description: string }[];
}

export interface Odontogram {
  teeth: Tooth[];
  generalNotes?: string;
}

export interface TreatmentRecord {
  date: string;
  toothInvolved?: number; // FDI notation
  procedure: string;
  notes?: string;
  cost?: number;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  contact: {
    phone?: string;
    email?: string;
    address?: string;
  };
  medicalHistory: {
    conditions: string[];
    allergies: string[];
    medications: string[];
    notes?: string;
  };
  dentalHistorySummary?: string;
  treatmentRecords: TreatmentRecord[];
  odontogram: Odontogram;
  lastVisit?: string; // YYYY-MM-DD
  nextAppointment?: string; // YYYY-MM-DD
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export const initialTeethData: Tooth[] = [
  // Quadrant 1 (Upper Right)
  ...[18, 17, 16, 15, 14, 13, 12, 11].map(id => ({ id, condition: 'Healthy' as ToothCondition })),
  // Quadrant 2 (Upper Left)
  ...[21, 22, 23, 24, 25, 26, 27, 28].map(id => ({ id, condition: 'Healthy' as ToothCondition })),
  // Quadrant 3 (Lower Left)
  ...[31, 32, 33, 34, 35, 36, 37, 38].map(id => ({ id, condition: 'Healthy' as ToothCondition })),
  // Quadrant 4 (Lower Right)
  ...[41, 42, 43, 44, 45, 46, 47, 48].map(id => ({ id, condition: 'Healthy' as ToothCondition })),
];

export const initialOdontogram: Odontogram = {
  teeth: initialTeethData,
  generalNotes: '',
};

export const toothConditions: ToothCondition[] = [
  'Healthy', 'Caries', 'Missing', 'Restored', 'Crown', 'Implant', 
  'RootCanalTreated', 'ToExtract', 'Veneer', 'BridgePontic', 'BridgeAbutment'
];
