"use client";

import { PatientListTable } from '@/components/patients/PatientListTable';
import { usePatientContext } from '@/contexts/PatientContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarClock, AlertTriangle, Smile } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { patients, isLoading } = usePatientContext();

  // Basic stats calculation (example)
  const totalPatients = patients.length;
  const upcomingAppointments = patients.filter(p => p.nextAppointment).length;
  // This is a very naive risk count, should be replaced by AI data.
  const highRiskPatients = patients.filter(p => p.medicalHistory.conditions.length > 1).length; 

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12 mb-1" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
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
    )
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-semibold tracking-tight">Dashboard Overview</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
            <p className="text-xs text-muted-foreground">Managed in the system</p>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <CalendarClock className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments}</div>
            <p className="text-xs text-muted-foreground">Scheduled soon</p>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High-Risk Patients</CardTitle>
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highRiskPatients}</div>
            <p className="text-xs text-muted-foreground">Based on medical history (example)</p>
          </CardContent>
        </Card>
         <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Clinic Health</CardTitle>
            <Smile className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Good</div>
            <p className="text-xs text-muted-foreground">Proactive care emphasized</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Patient Directory</CardTitle>
          <CardDescription>Manage and view all patient records.</CardDescription>
        </CardHeader>
        <CardContent>
          <PatientListTable patients={patients} />
        </CardContent>
      </Card>
    </div>
  );
}
