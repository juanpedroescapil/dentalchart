"use client";

import { Control } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface AddPatientFormFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>; // Control from react-hook-form
}

export function AddPatientFormFields({ control }: AddPatientFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <Input placeholder="John" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input placeholder="Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="dateOfBirth"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date of Birth</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
                <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="contact.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="john.doe@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="contact.phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input type="tel" placeholder="555-123-4567" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="contact.address"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Textarea placeholder="123 Main St, Anytown, USA" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="medicalHistory.conditions"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Medical Conditions</FormLabel>
            <FormControl>
              <Textarea placeholder="e.g., Diabetes, Hypertension (comma separated)" {...field} 
                onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                value={Array.isArray(field.value) ? field.value.join(', ') : ''}
              />
            </FormControl>
            <FormDescription>Enter conditions separated by commas.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="medicalHistory.allergies"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Allergies</FormLabel>
            <FormControl>
              <Textarea placeholder="e.g., Penicillin, Latex (comma separated)" {...field} 
                onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                value={Array.isArray(field.value) ? field.value.join(', ') : ''}
              />
            </FormControl>
            <FormDescription>Enter allergies separated by commas.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="medicalHistory.medications"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Current Medications</FormLabel>
            <FormControl>
              <Textarea placeholder="e.g., Aspirin, Metformin (comma separated)" {...field} 
                onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                value={Array.isArray(field.value) ? field.value.join(', ') : ''}
              />
            </FormControl>
            <FormDescription>Enter medications separated by commas.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="medicalHistory.notes"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Additional Medical Notes</FormLabel>
            <FormControl>
              <Textarea placeholder="Any other relevant medical information..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="dentalHistorySummary"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Dental History Summary</FormLabel>
            <FormControl>
              <Textarea placeholder="e.g., Regular checkups, previous orthodontic work..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
