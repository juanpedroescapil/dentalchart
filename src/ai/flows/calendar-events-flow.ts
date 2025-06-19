'use server';
/**
 * @fileOverview Flow for managing Google Calendar events.
 *
 * Exports:
 * - getCalendarEvents: Fetches calendar events for the authenticated user using a Genkit tool.
 * - GetCalendarEventsInputSchema: Zod schema for the input of getCalendarEvents.
 * - GetCalendarEventsInput: TypeScript type for the input of getCalendarEvents.
 * - GetCalendarEventsOutputSchema: Zod schema for the output of getCalendarEvents.
 * - GetCalendarEventsOutput: TypeScript type for the output of getCalendarEvents.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { listCalendarEventsTool, ListCalendarEventsInputSchema, ListCalendarEventsOutputSchema } from '@/ai/tools/google-calendar-tools';

export const GetCalendarEventsInputSchema = ListCalendarEventsInputSchema;
export type GetCalendarEventsInput = z.infer<typeof GetCalendarEventsInputSchema>;

export const GetCalendarEventsOutputSchema = ListCalendarEventsOutputSchema;
export type GetCalendarEventsOutput = z.infer<typeof GetCalendarEventsOutputSchema>;

const getCalendarEventsFlow = ai.defineFlow(
  {
    name: 'getCalendarEventsFlow',
    inputSchema: GetCalendarEventsInputSchema,
    outputSchema: GetCalendarEventsOutputSchema,
  },
  async (input) => {
    try {
      // Directly call the tool. No LLM reasoning is needed for this simple "fetch" operation.
      // The tool itself contains the (mock) logic to get events.
      const eventsOutput = await listCalendarEventsTool(input);
      return eventsOutput;
    } catch (error) {
      console.error("Error in getCalendarEventsFlow calling listCalendarEventsTool:", error);
      // Ensure the flow returns data matching its outputSchema, even on error,
      // or rethrow and let the caller handle it.
      // Returning empty events allows the UI to gracefully handle failures.
      return { events: [] };
    }
  }
);

// Exported wrapper function to be called from the application code (e.g., React components).
export async function getCalendarEvents(input: GetCalendarEventsInput): Promise<GetCalendarEventsOutput> {
  return getCalendarEventsFlow(input);
}
