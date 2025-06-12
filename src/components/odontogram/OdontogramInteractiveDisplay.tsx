"use client";

import type { Odontogram as OdontogramType, Tooth as ToothType, ToothCondition } from '@/types/patient';
import { ToothDisplay } from './ToothDisplay';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toothConditions } from '@/types/patient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '../ui/input';

interface OdontogramInteractiveDisplayProps {
  odontogram: OdontogramType;
  onOdontogramChange: (updatedOdontogram: OdontogramType) => void;
  patientId: string; // Used for context if needed, e.g. saving notes
}

// FDI tooth numbering layout
const quadrants = {
  upperRight: [18, 17, 16, 15, 14, 13, 12, 11],
  upperLeft: [21, 22, 23, 24, 25, 26, 27, 28],
  lowerLeft: [31, 32, 33, 34, 35, 36, 37, 38], // Displayed as 38..31
  lowerRight: [41, 42, 43, 44, 45, 46, 47, 48], // Displayed as 48..41
};

export function OdontogramInteractiveDisplay({ odontogram, onOdontogramChange, patientId }: OdontogramInteractiveDisplayProps) {
  const [selectedTooth, setSelectedTooth] = useState<ToothType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentToothNotes, setCurrentToothNotes] = useState("");
  const [currentToothCondition, setCurrentToothCondition] = useState<ToothCondition>("Healthy");
  const [generalNotes, setGeneralNotes] = useState(odontogram.generalNotes || "");

  useEffect(() => {
    setGeneralNotes(odontogram.generalNotes || "");
  }, [odontogram.generalNotes]);

  const handleToothClick = (toothId: number) => {
    const tooth = odontogram.teeth.find(t => t.id === toothId);
    if (tooth) {
      setSelectedTooth(tooth);
      setCurrentToothCondition(tooth.condition);
      setCurrentToothNotes(tooth.notes || "");
      setIsModalOpen(true);
    }
  };

  const handleSaveChanges = () => {
    if (selectedTooth) {
      const updatedTeeth = odontogram.teeth.map(t =>
        t.id === selectedTooth.id ? { ...t, condition: currentToothCondition, notes: currentToothNotes } : t
      );
      onOdontogramChange({ ...odontogram, teeth: updatedTeeth });
    }
    setIsModalOpen(false);
    setSelectedTooth(null);
  };
  
  const handleGeneralNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGeneralNotes(e.target.value);
  };

  const handleSaveGeneralNotes = () => {
     onOdontogramChange({ ...odontogram, generalNotes });
     // Optionally add a toast notification here
  };

  const renderQuadrant = (toothIds: number[]) => (
    <div className="flex justify-center gap-1 sm:gap-1.5">
      {toothIds.map(id => {
        const tooth = odontogram.teeth.find(t => t.id === id);
        return tooth ? (
          <ToothDisplay key={id} tooth={tooth} onClick={handleToothClick} isSelected={selectedTooth?.id === id} size="sm" />
        ) : null;
      })}
    </div>
  );

  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Odontogram</CardTitle>
        <CardDescription>Interactive dental chart. Click a tooth to update its status and add notes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-2 items-center justify-center">
          {/* Upper Jaw */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-2">
            {renderQuadrant(quadrants.upperRight.slice().reverse())} 
            <div className="h-4 w-px bg-border hidden sm:block mx-1"></div>
            {renderQuadrant(quadrants.upperLeft)}
          </div>
          
          {/* Separator */}
          <hr className="my-2 sm:my-3 border-dashed border-border" />

          {/* Lower Jaw */}
           <div className="flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-2">
            {renderQuadrant(quadrants.lowerRight.slice().reverse())}
            <div className="h-4 w-px bg-border hidden sm:block mx-1"></div>
            {renderQuadrant(quadrants.lowerLeft)}
          </div>
        </div>

        <div className="pt-4">
          <Label htmlFor="generalOdontogramNotes" className="text-md font-semibold">General Odontogram Notes</Label>
          <Textarea
            id="generalOdontogramNotes"
            value={generalNotes}
            onChange={handleGeneralNotesChange}
            placeholder="Enter any general notes for this odontogram..."
            rows={3}
            className="mt-2"
          />
           <Button onClick={handleSaveGeneralNotes} className="mt-2" size="sm">Save General Notes</Button>
        </div>
      </CardContent>

      {selectedTooth && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-headline text-xl">Update Tooth {selectedTooth.id}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="condition" className="text-right">Condition</Label>
                <Select 
                  value={currentToothCondition} 
                  onValueChange={(value: ToothCondition) => setCurrentToothCondition(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {toothConditions.map(cond => (
                      <SelectItem key={cond} value={cond}>{cond}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">Notes</Label>
                <Textarea
                  id="notes"
                  value={currentToothNotes}
                  onChange={(e) => setCurrentToothNotes(e.target.value)}
                  placeholder="Add specific notes for this tooth..."
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                 <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="button" onClick={handleSaveChanges}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
