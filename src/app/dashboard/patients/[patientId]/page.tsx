"use client";

import { useParams, useRouter } from 'next/navigation';
import { usePatientContext } from '@/contexts/PatientContext';
import { PatientDetailTabs } from '@/components/patients/PatientDetailTabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, UserCircle, CalendarDays, Phone, Mail, MapPin, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { format, differenceInYears } from 'date-fns';

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.patientId as string;
  const { getPatientById, isLoading: patientsLoading } = usePatientContext();
  
  const patient = getPatientById(patientId);

  if (patientsLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold mb-4">Patient Not Found</h2>
        <p className="text-muted-foreground mb-6">The patient record you are looking for does not exist.</p>
        <Button asChild variant="outline">
          <Link href="/dashboard/patients">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Patient List
          </Link>
        </Button>
      </div>
    );
  }
  
  const age = differenceInYears(new Date(), new Date(patient.dateOfBirth));

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <UserCircle className="h-16 w-16 text-primary shrink-0" />
            <div>
              <CardTitle className="text-3xl font-headline tracking-tight">
                {patient.firstName} {patient.lastName}
              </CardTitle>
              <CardDescription className="text-base text-foreground/80">
                Patient ID: {patient.id}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <span><strong>DOB:</strong> {format(new Date(patient.dateOfBirth), "MMMM dd, yyyy")} ({age} years old)</span>
          </div>
          <div className="flex items-center gap-2">
            <UserCircle className="h-5 w-5 text-muted-foreground" /> {/* Placeholder for gender icon */}
            <span><strong>Gender:</strong> {patient.gender}</span>
          </div>
           {patient.contact.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span><strong>Email:</strong> {patient.contact.email}</span>
            </div>
          )}
          {patient.contact.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <span><strong>Phone:</strong> {patient.contact.phone}</span>
            </div>
          )}
          {patient.contact.address && (
            <div className="flex items-center gap-2 md:col-span-2 lg:col-span-1">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span><strong>Address:</strong> {patient.contact.address}</span>
            </div>
          )}
           <div className="flex items-center gap-2">
             <CalendarDays className="h-5 w-5 text-muted-foreground" />
             <span><strong>Last Visit:</strong> {patient.lastVisit ? format(new Date(patient.lastVisit), "PPP") : 'N/A'}</span>
           </div>
        </CardContent>
      </Card>
      
      <PatientDetailTabs patient={patient} />
    </div>
  );
}
