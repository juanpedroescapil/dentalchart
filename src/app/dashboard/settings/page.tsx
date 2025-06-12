"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
           <div className="flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-headline tracking-tight">Settings</CardTitle>
          </div>
          <CardDescription>Configure application settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-lg">
            <Settings className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground">Settings Page Coming Soon</h3>
            <p className="text-muted-foreground">This section is under construction.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
