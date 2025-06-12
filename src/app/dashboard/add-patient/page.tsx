"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AddPatientFormFields } from "@/components/patients/AddPatientFormFields";
import { usePatientContext } from "@/contexts/PatientContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";

const patientFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female", "Other", "Prefer not to say"]),
  contact: z.object({
    email: z.string().email("Invalid email address").optional().or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
  medicalHistory: z.object({
    conditions: z.array(z.string()).optional().default([]),
    allergies: z.array(z.string()).optional().default([]),
    medications: z.array(z.string()).optional().default([]),
    notes: z.string().optional(),
  }),
  dentalHistorySummary: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

export default function AddPatientPage() {
  const { addPatient } = usePatientContext();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "Prefer not to say",
      contact: { email: "", phone: "", address: "" },
      medicalHistory: { conditions: [], allergies: [], medications: [], notes: "" },
      dentalHistorySummary: "",
    },
  });

  function onSubmit(data: PatientFormValues) {
    try {
      const newPatient = addPatient(data);
      toast({
        title: "Patient Added",
        description: `${data.firstName} ${data.lastName} has been successfully added.`,
        variant: "default"
      });
      router.push(`/dashboard/patients/${newPatient.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add patient. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to add patient:", error);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <UserPlus className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-headline tracking-tight">Add New Patient</CardTitle>
          </div>
          <CardDescription>Enter the details for the new patient record.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-8">
              <AddPatientFormFields control={form.control} />
            </CardContent>
            <CardFooter className="flex justify-end pt-6">
              <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Patient Record"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
