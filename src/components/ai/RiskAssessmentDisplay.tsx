"use client";
import type { Patient } from '@/types/patient';
import { aiPoweredRiskAssessment, type AiPoweredRiskAssessmentInput, type AiPoweredRiskAssessmentOutput } from '@/ai/flows/risk-assessment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Loader2, AlertTriangle, ShieldCheck, ListChecks, Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RiskAssessmentDisplayProps {
  patient: Patient;
}

function formatPatientHistoryForAI(patient: Patient): string {
  let history = `Patient: ${patient.firstName} ${patient.lastName}, DOB: ${patient.dateOfBirth}, Gender: ${patient.gender}.\n`;
  history += `Medical Conditions: ${patient.medicalHistory.conditions.join(', ') || 'None'}.\n`;
  history += `Allergies: ${patient.medicalHistory.allergies.join(', ') || 'None'}.\n`;
  history += `Medications: ${patient.medicalHistory.medications.join(', ') || 'None'}.\n`;
  if (patient.medicalHistory.notes) history += `Medical Notes: ${patient.medicalHistory.notes}\n`;
  if (patient.dentalHistorySummary) history += `Dental History Summary: ${patient.dentalHistorySummary}\n`;
  
  history += "Recent Treatments:\n";
  patient.treatmentRecords.slice(-5).forEach(record => { // Last 5 treatments
    history += `- ${record.date}: ${record.procedure}${record.toothInvolved ? ` (Tooth ${record.toothInvolved})` : ''}. Notes: ${record.notes || 'N/A'}\n`;
  });
  return history;
}

function formatOdontogramForAI(odontogram: Patient['odontogram']): string {
  let data = "Odontogram Status:\n";
  odontogram.teeth.forEach(tooth => {
    data += `Tooth ${tooth.id}: ${tooth.condition}.${tooth.notes ? ` Notes: ${tooth.notes}` : ''}\n`;
  });
  if(odontogram.generalNotes) data += `\nGeneral Odontogram Notes: ${odontogram.generalNotes}`;
  return data;
}


export function RiskAssessmentDisplay({ patient }: RiskAssessmentDisplayProps) {
  const [assessment, setAssessment] = useState<AiPoweredRiskAssessmentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunAssessment = async () => {
    setIsLoading(true);
    setError(null);
    setAssessment(null);

    const input: AiPoweredRiskAssessmentInput = {
      patientHistory: formatPatientHistoryForAI(patient),
      odontogramData: formatOdontogramForAI(patient.odontogram),
    };

    try {
      const result = await aiPoweredRiskAssessment(input);
      setAssessment(result);
    } catch (e) {
      console.error("AI Risk Assessment Error:", e);
      setError("Failed to perform risk assessment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Bot className="h-7 w-7 text-primary" />
          <CardTitle className="font-headline text-2xl">AI-Powered Risk Assessment</CardTitle>
        </div>
        <CardDescription>
          Analyze patient history and odontogram data to predict potential dental issues and suggest preventative measures.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button onClick={handleRunAssessment} disabled={isLoading} size="lg">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Assessing Risk...
            </>
          ) : (
            "Run Risk Assessment"
          )}
        </Button>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive text-destructive rounded-md">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <p className="font-semibold">Error</p>
            </div>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {assessment && (
          <div className="space-y-6 pt-4 border-t">
            <div>
              <h3 className="text-lg font-semibold flex items-center mb-2">
                <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
                Overall Risk Assessment
              </h3>
              <Badge variant={
                assessment.overallRiskAssessment.toLowerCase().includes('low') ? 'default' :
                assessment.overallRiskAssessment.toLowerCase().includes('medium') || assessment.overallRiskAssessment.toLowerCase().includes('moderate') ? 'secondary' :
                'destructive'
              } className="text-base px-3 py-1">
                {assessment.overallRiskAssessment}
              </Badge>
            </div>

            <div>
              <h3 className="text-lg font-semibold flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                Potential Risk Factors
              </h3>
              {assessment.riskFactors.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 pl-2">
                  {assessment.riskFactors.map((factor, index) => (
                    <li key={index} className="text-sm">{factor}</li>
                  ))}
                </ul>
              ) : <p className="text-sm text-muted-foreground">No specific risk factors identified by AI.</p>}
            </div>

            <div>
              <h3 className="text-lg font-semibold flex items-center mb-2">
                <ListChecks className="h-5 w-5 mr-2 text-green-600" />
                Suggested Preventative Measures
              </h3>
              {assessment.suggestedPreventativeMeasures.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 pl-2">
                  {assessment.suggestedPreventativeMeasures.map((measure, index) => (
                    <li key={index} className="text-sm">{measure}</li>
                  ))}
                </ul>
              ) : <p className="text-sm text-muted-foreground">No specific preventative measures suggested by AI.</p>}
            </div>
          </div>
        )}
         {isLoading && !assessment && (
          <div className="flex flex-col items-center justify-center text-muted-foreground py-8">
            <Loader2 className="h-8 w-8 animate-spin mb-3" />
            <p className="text-lg">AI is analyzing the data...</p>
            <p className="text-sm">This might take a moment.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
