"use client";

import { PatientListTable } from '@/components/patients/PatientListTable';
import { usePatientContext } from '@/contexts/PatientContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';

export default function PatientsPage() {
  const { patients, isLoading } = usePatientContext();
  
  if (isLoading) {
     return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-5 w-64 mt-1" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full mb-4" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline font-semibold tracking-tight">Patient Records</CardTitle>
          <CardDescription>Browse, search, and manage all patient information.</CardDescription>
        </CardHeader>
        <CardContent>
          <PatientListTable patients={patients} />
        </CardContent>
      </Card>
    </div>
  );
}
