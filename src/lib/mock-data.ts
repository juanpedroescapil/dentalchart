import type { Patient, Odontogram, Tooth, ToothCondition } from '@/types/patient';
import { initialOdontogram } from '@/types/patient';

const initialTeeth = (): Tooth[] => [
  // Quadrant 1 (Upper Right)
  ...[18, 17, 16, 15, 14, 13, 12, 11].map(id => ({ id, condition: 'Healthy' as ToothCondition, treatments: [], notes: '' })),
  // Quadrant 2 (Upper Left)
  ...[21, 22, 23, 24, 25, 26, 27, 28].map(id => ({ id, condition: 'Healthy' as ToothCondition, treatments: [], notes: '' })),
  // Quadrant 3 (Lower Left)
  ...[31, 32, 33, 34, 35, 36, 37, 38].map(id => ({ id, condition: 'Healthy' as ToothCondition, treatments: [], notes: '' })),
  // Quadrant 4 (Lower Right)
  ...[41, 42, 43, 44, 45, 46, 47, 48].map(id => ({ id, condition: 'Healthy' as ToothCondition, treatments: [], notes: '' })),
];


const createInitialOdontogram = (): Odontogram => ({
  teeth: initialTeeth(),
  generalNotes: '',
});


export const mockPatients: Patient[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1985-07-20',
    gender: 'Male',
    contact: { email: 'john.doe@example.com', phone: '555-0101' },
    medicalHistory: {
      conditions: ['Hypertension'],
      allergies: ['Penicillin'],
      medications: ['Lisinopril'],
      notes: 'Patient is generally healthy, takes medication for blood pressure.'
    },
    dentalHistorySummary: 'Regular checkups, fillings in 2015 and 2018.',
    treatmentRecords: [
      { date: '2023-05-10', procedure: 'Routine Checkup & Cleaning', notes: 'Good oral hygiene.' },
      { date: '2023-05-10', toothInvolved: 16, procedure: 'Composite Filling', notes: 'MOD Caries.' },
    ],
    odontogram: {
      ...createInitialOdontogram(),
      teeth: createInitialOdontogram().teeth.map(t => {
        if (t.id === 16) return { ...t, condition: 'Restored', treatments: [{date: '2023-05-10', description: 'Composite MOD'}] };
        if (t.id === 24) return { ...t, condition: 'Caries' };
        if (t.id === 36) return { ...t, condition: 'Missing' };
        return t;
      }),
    },
    lastVisit: '2023-05-10',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: '1992-03-15',
    gender: 'Female',
    contact: { email: 'jane.smith@example.com', phone: '555-0202' },
    medicalHistory: {
      conditions: ['Asthma'],
      allergies: [],
      medications: ['Albuterol Inhaler (as needed)'],
    },
    dentalHistorySummary: 'Orthodontic treatment (2008-2010). Wisdom teeth extracted 2012.',
    treatmentRecords: [
      { date: '2023-08-22', procedure: 'Dental Examination', notes: 'No new issues found.' },
    ],
    odontogram: {
      ...createInitialOdontogram(),
       teeth: createInitialOdontogram().teeth.map(t => {
        if (t.id === 18 || t.id === 28 || t.id === 38 || t.id === 48) return { ...t, condition: 'Missing', notes: 'Wisdom tooth extracted' };
        return t;
      })
    },
    lastVisit: '2023-08-22',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Functions to simulate backend operations will be added in PatientContext.tsx
// For now, this file just provides the initial mock data structure.
