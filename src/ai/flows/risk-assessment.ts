// risk-assessment.ts
'use server';

/**
 * @fileOverview AI-powered risk assessment for dental patients.
 *
 * This file defines a Genkit flow that analyzes patient dental history and odontogram data
 * to identify potential risks and suggest preventative measures.
 *
 * @interface AiPoweredRiskAssessmentInput - The input type for the risk assessment flow.
 * @interface AiPoweredRiskAssessmentOutput - The output type for the risk assessment flow.
 * @function aiPoweredRiskAssessment - The main function to trigger the risk assessment flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the AI-powered risk assessment
const AiPoweredRiskAssessmentInputSchema = z.object({
  patientHistory: z
    .string()
    .describe('Detailed dental and medical history of the patient.'),
  odontogramData: z
    .string()
    .describe('Structured data representing the patient odontogram.'),
});

export type AiPoweredRiskAssessmentInput = z.infer<
  typeof AiPoweredRiskAssessmentInputSchema
>;

// Define the output schema for the AI-powered risk assessment
const AiPoweredRiskAssessmentOutputSchema = z.object({
  riskFactors: z
    .array(z.string())
    .describe('List of potential risk factors identified.'),
  suggestedPreventativeMeasures: z
    .array(z.string())
    .describe('List of suggested preventative measures.'),
  overallRiskAssessment: z
    .string()
    .describe('An overall assessment of the patient risk level.'),
});

export type AiPoweredRiskAssessmentOutput = z.infer<
  typeof AiPoweredRiskAssessmentOutputSchema
>;

// Define the main function to trigger the risk assessment flow
export async function aiPoweredRiskAssessment(
  input: AiPoweredRiskAssessmentInput
): Promise<AiPoweredRiskAssessmentOutput> {
  return aiPoweredRiskAssessmentFlow(input);
}

// Define the prompt for the AI-powered risk assessment
const riskAssessmentPrompt = ai.definePrompt({
  name: 'riskAssessmentPrompt',
  input: {schema: AiPoweredRiskAssessmentInputSchema},
  output: {schema: AiPoweredRiskAssessmentOutputSchema},
  prompt: `Analyze the patient's dental history and odontogram data to identify potential risks and suggest preventative measures.

Patient History: {{{patientHistory}}}
Odontogram Data: {{{odontogramData}}}

Based on this information, provide a list of potential risk factors, suggested preventative measures, and an overall risk assessment.

Risk Factors:
Suggested Preventative Measures:
Overall Risk Assessment:`, // Ensure the output adheres to the schema descriptions.
});

// Define the Genkit flow for the AI-powered risk assessment
const aiPoweredRiskAssessmentFlow = ai.defineFlow(
  {
    name: 'aiPoweredRiskAssessmentFlow',
    inputSchema: AiPoweredRiskAssessmentInputSchema,
    outputSchema: AiPoweredRiskAssessmentOutputSchema,
  },
  async input => {
    const {output} = await riskAssessmentPrompt(input);
    return output!;
  }
);
