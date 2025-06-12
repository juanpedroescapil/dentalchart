"use client";

import type { Patient } from '@/types/patient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OdontogramInteractiveDisplay } from '@/components/odontogram/OdontogramInteractiveDisplay';
import { PatientHistorySection } from '@/components/history/PatientHistorySection';
import { RiskAssessmentDisplay } from '@/components/ai/RiskAssessmentDisplay';
import { usePatientContext } from '@/contexts/PatientContext'; // To handle updates
import { Stethoscope, FileText, Bot } from 'lucide-react';


interface PatientDetailTabsProps {
  patient: Patient;
}

export function PatientDetailTabs({ patient: initialPatient }: PatientDetailTabsProps) {
  const { updateOdontogram } = usePatientContext();

  // No local state for patient needed here if context handles updates and re-renders appropriately.
  // Otherwise, you'd manage a local patient state and sync with context.

  const handleOdontogramChange = (updatedOdontogram: Patient['odontogram']) => {
    updateOdontogram(initialPatient.id, updatedOdontogram);
    // Potentially trigger a toast notification
  };


  return (
    <Tabs defaultValue="odontogram" className="w-full">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-12 mb-6 rounded-lg p-1.5">
        <TabsTrigger value="odontogram" className="py-2.5 text-sm sm:text-base data-[state=active]:shadow-md flex items-center gap-2">
          <Stethoscope size={18} /> Odontogram
        </TabsTrigger>
        <TabsTrigger value="history" className="py-2.5 text-sm sm:text-base data-[state=active]:shadow-md flex items-center gap-2">
          <FileText size={18} /> Patient History
        </TabsTrigger>
        <TabsTrigger value="ai-risk" className="py-2.5 text-sm sm:text-base data-[state=active]:shadow-md flex items-center gap-2">
          <Bot size={18} /> AI Risk Assessment
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="odontogram">
        <OdontogramInteractiveDisplay 
          odontogram={initialPatient.odontogram} 
          onOdontogramChange={handleOdontogramChange}
          patientId={initialPatient.id} 
        />
      </TabsContent>
      <TabsContent value="history">
        <PatientHistorySection patient={initialPatient} />
      </TabsContent>
      <TabsContent value="ai-risk">
        <RiskAssessmentDisplay patient={initialPatient} />
      </TabsContent>
    </Tabs>
  );
}
