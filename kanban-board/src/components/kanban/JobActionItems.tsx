"use client";

import type { JobApplication } from "@/types";
import { suggestActionItems, type SuggestActionItemsOutput } from "@/ai/flows/suggest-action-items";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JobActionItemsProps {
  application: JobApplication;
}

export function JobActionItems({ application }: JobActionItemsProps) {
  const [result, setResult] = useState<SuggestActionItemsOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (application) {
      setLoading(true);
      setError(null);
      suggestActionItems({
        jobTitle: application.jobTitle,
        companyName: application.companyName,
        applicationStatus: application.status,
        applicationDate: application.applicationDate,
        jobPostingLink: application.jobPostingLink,
        salaryExpectation: application.salary,
        notes: application.notes,
      })
        .then(setResult)
        .catch((e) => {
          console.error("Error fetching AI suggestions:", e);
          setError("Failed to load AI suggestions. Please try again.");
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not fetch AI-powered suggestions.",
          });
        })
        .finally(() => setLoading(false));
    }
  }, [application, toast]);

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="font-headline text-lg text-primary">AI Suggested Action Items</CardTitle>
        <CardDescription>{result.reasoning}</CardDescription>
      </CardHeader>
      <CardContent>
        {result.actionItems.length > 0 ? (
          <ul className="list-disc space-y-2 pl-5 text-sm">
            {result.actionItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No specific action items suggested at this time.</p>
        )}
      </CardContent>
    </Card>
  );
}
