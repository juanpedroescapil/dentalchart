"use client";

import type { Patient } from '@/types/patient';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Eye, Edit3, Trash2, UserPlus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';


interface PatientListTableProps {
  patients: Patient[];
}

type SortKey = keyof Pick<Patient, 'firstName' | 'lastName' | 'dateOfBirth' | 'lastVisit'>;

export function PatientListTable({ patients: initialPatients }: PatientListTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [patients, setPatients] = useState<Patient[]>(initialPatients);


  const filteredAndSortedPatients = useMemo(() => {
    let result = patients.filter(patient =>
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.contact.email && patient.contact.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (sortKey) {
      result.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        if (valA === undefined && valB === undefined) return 0;
        if (valA === undefined) return sortOrder === 'asc' ? 1 : -1;
        if (valB === undefined) return sortOrder === 'asc' ? -1 : 1;
        
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortOrder === 'asc' ? valA - valB : valB - valA;
        }
        // For dates (assuming they are string representations)
        if (sortKey === 'dateOfBirth' || sortKey === 'lastVisit') {
            const dateA = new Date(valA as string).getTime();
            const dateB = new Date(valB as string).getTime();
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        }
        return 0;
      });
    }
    return result;
  }, [patients, searchTerm, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };
  
  const formatDateSafe = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid Date';
    }
  };

  // Placeholder for delete action
  const handleDeletePatient = (patientId: string) => {
    if (window.confirm("Are you sure you want to delete this patient? This action cannot be undone.")) {
      // In a real app, call an API. Here, filter out from local state.
      setPatients(prevPatients => prevPatients.filter(p => p.id !== patientId));
      // Also update localStorage if using PatientContext that persists
      // This direct manipulation is simplified. PatientContext should handle delete.
      console.log(`Patient ${patientId} deleted (mock).`);
    }
  };


  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Input
          placeholder="Search patients (name, ID, email)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button asChild>
          <Link href="/dashboard/add-patient">
            <UserPlus className="mr-2 h-4 w-4" /> Add New Patient
          </Link>
        </Button>
      </div>
      <div className="rounded-md border shadow-sm bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('lastName')} className="cursor-pointer">
                Name <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort('dateOfBirth')} className="cursor-pointer hidden md:table-cell">
                DOB <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead className="hidden lg:table-cell">Contact</TableHead>
              <TableHead onClick={() => handleSort('lastVisit')} className="cursor-pointer hidden md:table-cell">
                Last Visit <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedPatients.length > 0 ? (
              filteredAndSortedPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">
                    <Link href={`/dashboard/patients/${patient.id}`} className="hover:underline">
                      {patient.firstName} {patient.lastName}
                    </Link>
                    <div className="text-xs text-muted-foreground">ID: {patient.id}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{formatDateSafe(patient.dateOfBirth)}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {patient.contact.email && <div>{patient.contact.email}</div>}
                    {patient.contact.phone && <div className="text-sm text-muted-foreground">{patient.contact.phone}</div>}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{formatDateSafe(patient.lastVisit)}</TableCell>
                  <TableCell>
                    {patient.nextAppointment ? (
                       <Badge variant="default">Upcoming</Badge>
                    ) : (
                       <Badge variant="secondary">No Upcoming</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/patients/${patient.id}`} className="flex items-center cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log(`Edit patient ${patient.id}`)} className="cursor-pointer"> {/* Placeholder */}
                           <Edit3 className="mr-2 h-4 w-4" /> Edit Patient
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeletePatient(patient.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Patient
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No patients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
       {filteredAndSortedPatients.length === 0 && searchTerm && (
         <div className="text-center text-muted-foreground py-4">No patients match your search criteria.</div>
       )}
    </div>
  );
}
