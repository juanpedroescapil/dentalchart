"use client";

import type { ReactNode } from 'react';
import React, { createContext, useState, useContext, useEffect } from 'react';
import type { Patient, Odontogram, Tooth, TreatmentRecord } from '@/types/patient';
import { mockPatients } from '@/lib/mock-data';
import { initialOdontogram } from '@/types/patient';

interface PatientContextType {
  patients: Patient[];
  getPatientById: (id: string) => Patient | undefined;
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'odontogram' | 'treatmentRecords'>) => Patient;
  updatePatient: (id: string, updatedData: Partial<Patient>) => void;
  addTreatmentRecord: (patientId: string, record: TreatmentRecord) => void;
  updateOdontogram: (patientId: string, odontogram: Odontogram) => void;
  updateToothInOdontogram: (patientId: string, toothId: number, updatedToothData: Partial<Tooth>) => void;
  isLoading: boolean;
}

export const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider = ({ children }: { children: ReactNode }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading patients from a source (e.g., localStorage or API)
    // For now, we initialize with mockPatients if localStorage is empty
    try {
      const storedPatients = localStorage.getItem('dentalPatients');
      if (storedPatients) {
        setPatients(JSON.parse(storedPatients));
      } else {
        setPatients(mockPatients);
        localStorage.setItem('dentalPatients', JSON.stringify(mockPatients));
      }
    } catch (error) {
      console.error("Failed to load patients from localStorage", error);
      setPatients(mockPatients); // Fallback to mock data
    }
    setIsLoading(false);
  }, []);

  const persistPatients = (updatedPatients: Patient[]) => {
    setPatients(updatedPatients);
    try {
      localStorage.setItem('dentalPatients', JSON.stringify(updatedPatients));
    } catch (error) {
      console.error("Failed to save patients to localStorage", error);
    }
  };

  const getPatientById = (id: string) => {
    return patients.find(p => p.id === id);
  };

  const addPatient = (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'odontogram' | 'treatmentRecords'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: (patients.length + 1 + Date.now()).toString(), // simple unique ID
      odontogram: JSON.parse(JSON.stringify(initialOdontogram)), // Deep copy
      treatmentRecords: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedPatients = [...patients, newPatient];
    persistPatients(updatedPatients);
    return newPatient;
  };

  const updatePatient = (id: string, updatedData: Partial<Patient>) => {
    const updatedPatients = patients.map(p =>
      p.id === id ? { ...p, ...updatedData, updatedAt: new Date().toISOString() } : p
    );
    persistPatients(updatedPatients);
  };

  const addTreatmentRecord = (patientId: string, record: TreatmentRecord) => {
    const updatedPatients = patients.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          treatmentRecords: [...p.treatmentRecords, record],
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    });
    persistPatients(updatedPatients);
  };

  const updateOdontogram = (patientId: string, odontogram: Odontogram) => {
    const updatedPatients = patients.map(p =>
      p.id === patientId ? { ...p, odontogram, updatedAt: new Date().toISOString() } : p
    );
    persistPatients(updatedPatients);
  };

  const updateToothInOdontogram = (patientId: string, toothId: number, updatedToothData: Partial<Tooth>) => {
    const patient = getPatientById(patientId);
    if (patient) {
      const updatedOdontogramTeeth = patient.odontogram.teeth.map(tooth =>
        tooth.id === toothId ? { ...tooth, ...updatedToothData } : tooth
      );
      updateOdontogram(patientId, { ...patient.odontogram, teeth: updatedOdontogramTeeth });
    }
  };


  return (
    <PatientContext.Provider value={{ patients, getPatientById, addPatient, updatePatient, addTreatmentRecord, updateOdontogram, updateToothInOdontogram, isLoading }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatientContext = () => {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatientContext must be used within a PatientProvider');
  }
  return context;
};
