"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, AlertTriangle, Link as LinkIcon, Loader2, CheckCircle, ExternalLink } from "lucide-react";
import { getCalendarEvents, type GetCalendarEventsInput, type GetCalendarEventsOutput, type CalendarEvent } from "@/ai/flows/calendar-events-flow";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function AppointmentsPage() {
  const { userEmail } = useAuth();
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate checking connection status (e.g., from localStorage or a user profile setting)
  useEffect(() => {
    const storedConnectionStatus = localStorage.getItem("googleCalendarConnected");
    if (storedConnectionStatus === "true") {
      setIsGoogleCalendarConnected(true);
    }
  }, []);

  const handleConnectGoogleCalendar = () => {
    // In a real app, this would initiate the OAuth flow with Google.
    // For now, we'll just simulate a successful connection.
    setIsGoogleCalendarConnected(true);
    localStorage.setItem("googleCalendarConnected", "true");
    setError(null); // Clear any previous errors
  };
  
  const handleDisconnectGoogleCalendar = () => {
    setIsGoogleCalendarConnected(false);
    localStorage.removeItem("googleCalendarConnected");
    setEvents([]); // Clear events on disconnect
    setError(null);
  };

  const handleFetchEvents = async () => {
    if (!userEmail) {
      setError("User email is not available. Please log in again.");
      return;
    }
    if (!isGoogleCalendarConnected) {
      setError("Please connect to Google Calendar first.");
      return;
    }

    setIsLoadingEvents(true);
    setError(null);
    setEvents([]);

    const input: GetCalendarEventsInput = {
      userId: userEmail, // Or a more persistent user ID if available
    };

    try {
      const result = await getCalendarEvents(input);
      if (result && result.events) {
        setEvents(result.events);
      } else {
        setError("No events found or an unexpected response was received.");
      }
    } catch (e) {
      console.error("Failed to fetch calendar events:", e);
      setError("Failed to fetch calendar events. Please try again.");
    } finally {
      setIsLoadingEvents(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <CalendarDays className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-headline tracking-tight">Appointments</CardTitle>
          </div>
          <CardDescription>Manage and schedule patient appointments. Connect your Google Calendar to view and manage events.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-primary" />
                Google Calendar Integration
              </CardTitle>
              <CardDescription>
                {isGoogleCalendarConnected 
                  ? "Your Google Calendar is connected. Fetch events or disconnect."
                  : "Connect your Google Calendar to sync and display your appointments."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isGoogleCalendarConnected ? (
                <Button onClick={handleConnectGoogleCalendar} size="lg">
                  <LinkIcon className="mr-2 h-5 w-5" /> Connect to Google Calendar
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="flex items-center gap-2 text-green-600 p-2 border border-green-300 bg-green-50 rounded-md">
                     <CheckCircle className="h-5 w-5" />
                     <span>Google Calendar Connected</span>
                  </div>
                  <Button onClick={handleDisconnectGoogleCalendar} variant="outline">
                    Disconnect Google Calendar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {isGoogleCalendarConnected && (
            <div className="space-y-4 pt-4 border-t">
              <Button onClick={handleFetchEvents} disabled={isLoadingEvents} size="lg">
                {isLoadingEvents ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Fetching Events...
                  </>
                ) : (
                  "Fetch My Google Calendar Events"
                )}
              </Button>
            </div>
          )}

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive text-destructive rounded-md flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {isLoadingEvents && (
             <div className="flex flex-col items-center justify-center text-muted-foreground py-10">
                <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
                <p className="text-lg font-semibold">Loading events from Google Calendar...</p>
                <p className="text-sm">This may take a moment.</p>
            </div>
          )}

          {!isLoadingEvents && events.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Fetched Events ({events.length})</h3>
              <ul className="space-y-3">
                {events.map(event => (
                  <li key={event.id} className="p-4 border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-primary">{event.summary}</h4>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(event.start), "PPP p")} - {format(new Date(event.end), "p")}
                        </p>
                        {event.description && <p className="text-sm mt-1">{event.description}</p>}
                      </div>
                      {event.htmlLink && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={event.htmlLink} target="_blank" rel="noopener noreferrer">
                            View on Google Calendar <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!isLoadingEvents && isGoogleCalendarConnected && events.length === 0 && !error && (
             <div className="text-center text-muted-foreground py-8 border-2 border-dashed border-border rounded-lg">
                <CalendarDays className="h-12 w-12 mx-auto mb-3 text-muted-foreground/70" />
                <p className="text-lg font-medium">No events fetched yet or calendar is empty for the selected period.</p>
                <p className="text-sm">Click "Fetch My Google Calendar Events" to load your schedule.</p>
            </div>
          )}
          
          {!isGoogleCalendarConnected && !isLoadingEvents && events.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center h-60 border-2 border-dashed border-border rounded-lg text-center p-6">
                <CalendarDays className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground">Connect to Google Calendar</h3>
                <p className="text-muted-foreground">Once connected, you can fetch and view your Google Calendar events here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
