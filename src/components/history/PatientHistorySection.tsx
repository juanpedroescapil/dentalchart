"use client";
import type { Patient, TreatmentRecord } from '@/types/patient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { usePatientContext } from '@/contexts/PatientContext';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, FileText } from 'lucide-react';
import { format } from 'date-fns';

const treatmentRecordSchema = z.object({
  date: z.string().min(1, "Date is required"),
  toothInvolved: z.coerce.number().optional(),
  procedure: z.string().min(1, "Procedure is required"),
  notes: z.string().optional(),
});

const patientHistorySchema = z.object({
  medicalHistory: z.object({
    conditions: z.array(z.string()).optional(),
    allergies: z.array(z.string()).optional(),
    medications: z.array(z.string()).optional(),
    notes: z.string().optional(),
  }),
  dentalHistorySummary: z.string().optional(),
  treatmentRecords: z.array(treatmentRecordSchema).optional(),
});

type PatientHistoryFormValues = z.infer<typeof patientHistorySchema>;

interface PatientHistorySectionProps {
  patient: Patient;
}

export function PatientHistorySection({ patient }: PatientHistorySectionProps) {
  const { updatePatient, addTreatmentRecord: contextAddTreatmentRecord } = usePatientContext();
  const { toast } = useToast();

  const form = useForm<PatientHistoryFormValues>({
    resolver: zodResolver(patientHistorySchema),
    defaultValues: {
      medicalHistory: patient.medicalHistory,
      dentalHistorySummary: patient.dentalHistorySummary || "",
      treatmentRecords: patient.treatmentRecords.map(tr => ({
        ...tr,
        date: format(new Date(tr.date), "yyyy-MM-dd") // Format for input type=date
      })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "treatmentRecords",
  });
  
  // Function to handle saving medical and dental summary
  const onSaveSummary = (data: Pick<PatientHistoryFormValues, 'medicalHistory' | 'dentalHistorySummary'>) => {
     updatePatient(patient.id, {
      medicalHistory: data.medicalHistory,
      dentalHistorySummary: data.dentalHistorySummary,
    });
    toast({ title: "History Updated", description: "Medical and dental summary saved." });
  };

  // Function to handle adding a new treatment record (simplified, doesn't use field array's append for submission)
  // This is just for showing how a single record could be added.
  // For full form based editing of existing records, the approach would be different.
  const onAddTreatmentRecord = (record: TreatmentRecord) => {
    contextAddTreatmentRecord(patient.id, record);
     // Re-fetch or update form's defaultValues to reflect new record
    const updatedRecords = [...patient.treatmentRecords, record].map(tr => ({
      ...tr,
      date: format(new Date(tr.date), "yyyy-MM-dd")
    }));
    form.reset({ ...form.getValues(), treatmentRecords: updatedRecords });
    toast({ title: "Treatment Record Added", description: "New record saved." });
  };


  // For this component, we'll make Medical History and Dental Summary editable
  // Treatment records will be displayed, and a separate form will add new ones.
  // Editing existing treatment records is more complex and omitted for brevity.

  return (
    <Card className="shadow-lg">
      <CardHeader>
         <div className="flex items-center gap-3">
          <FileText className="h-7 w-7 text-primary" />
          <CardTitle className="font-headline text-2xl">Patient History</CardTitle>
        </div>
        <CardDescription>Manage medical history, dental summary, and treatment records.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <Form {...form}>
          {/* Medical History and Dental Summary Form */}
          <form onSubmit={form.handleSubmit(onSaveSummary)} className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-xl">Medical Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="medicalHistory.conditions"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Conditions (comma-separated)</Label>
                      <FormControl>
                        <Input 
                          {...field} 
                          value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                          onChange={e => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="medicalHistory.allergies"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Allergies (comma-separated)</Label>
                      <FormControl>
                        <Input 
                          {...field} 
                          value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                          onChange={e => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="medicalHistory.medications"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Medications (comma-separated)</Label>
                      <FormControl>
                        <Input 
                          {...field} 
                          value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                          onChange={e => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="medicalHistory.notes"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Medical Notes</Label>
                      <FormControl><Textarea {...field} rows={3} /></FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-xl">Dental History Summary</CardTitle></CardHeader>
              <CardContent>
                 <FormField
                  control={form.control}
                  name="dentalHistorySummary"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Summary</Label>
                      <FormControl><Textarea {...field} rows={4} /></FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Button type="submit">Save Medical & Dental Summary</Button>
          </form>

          {/* Treatment Records Display and Add Form */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Treatment Records</h3>
            {fields.length > 0 ? (
              <ul className="space-y-3">
                {fields.map((item, index) => (
                  <li key={item.id} className="p-3 border rounded-md bg-card flex justify-between items-start">
                    <div>
                      <p className="font-medium">{item.procedure} {item.toothInvolved ? `(Tooth #${item.toothInvolved})` : ''}</p>
                      <p className="text-sm text-muted-foreground">Date: {format(new Date(item.date), "PPP")}</p>
                      {item.notes && <p className="text-sm text-muted-foreground mt-1">Notes: {item.notes}</p>}
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive hover:bg-destructive/10">
                      <Trash2 size={16} />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : <p className="text-muted-foreground">No treatment records yet.</p>}
            
            {/* Simplified Add New Treatment Record */}
            <Button type="button" onClick={() => append({ date: format(new Date(), "yyyy-MM-dd"), procedure: "", notes: "" })}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Treatment Record Row (for editing)
            </Button>
            <p className="text-xs text-muted-foreground">Note: To finalize added rows, save Medical & Dental Summary. For permanent record addition, use a dedicated "Add Record" feature (not fully implemented here).</p>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
