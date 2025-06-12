"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <CalendarDays className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-headline tracking-tight">Appointments</CardTitle>
          </div>
          <CardDescription>Manage and schedule patient appointments.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-lg">
            <CalendarDays className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground">Appointment Management Coming Soon</h3>
            <p className="text-muted-foreground">This section is under construction.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
