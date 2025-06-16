
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sparkles, Terminal } from "lucide-react";
import { generateTailoredResume, type GenerateTailoredResumeOutput } from "@/ai/flows/generate-resume-flow";
import { useToast } from "@/hooks/use-toast";

const ResumeGeneratorSchema = z.object({
  jobDescription: z.string().min(50, "Job description must be at least 50 characters."),
  currentResume: z.string().min(50, "Current resume must be at least 50 characters."),
});

type ResumeGeneratorFormData = z.infer<typeof ResumeGeneratorSchema>;

export function ResumeGenerator() {
  const [result, setResult] = useState<GenerateTailoredResumeOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<ResumeGeneratorFormData>({
    resolver: zodResolver(ResumeGeneratorSchema),
    defaultValues: {
      jobDescription: "",
      currentResume: "",
    },
  });

  async function onSubmit(data: ResumeGeneratorFormData) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await generateTailoredResume(data);
      setResult(response);
    } catch (e) {
      console.error("Error generating tailored resume:", e);
      setError("Failed to generate tailored resume. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not generate resume.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto my-8 shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary flex items-center">
          <Sparkles className="mr-2 h-6 w-6" />
          AI Resume Tailor
        </CardTitle>
        <CardDescription>
          Provide a job description and your current resume to get an AI-tailored version.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Job Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste the full job description here..."
                      className="min-h-[150px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentResume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Your Current Resume</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your current resume text here..."
                      className="min-h-[200px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? (
                <>
                  <Skeleton className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-transparent border-t-primary" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Tailored Resume
                </>
              )}
            </Button>
          </form>
        </Form>

        {loading && !result && (
          <div className="space-y-4 mt-8 p-4 border rounded-md bg-muted/50">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-8">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Generation Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && !loading && (
          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl text-primary">Generated Resume</CardTitle>
                <CardDescription>
                  This resume has been tailored based on the job description you provided.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={result.tailoredResume}
                  readOnly
                  className="min-h-[300px] resize-y bg-muted/30 whitespace-pre-wrap"
                  aria-label="Generated Tailored Resume"
                />
                 <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(result.tailoredResume)}
                    className="mt-2"
                  >
                    Copy Resume
                  </Button>
              </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Reasoning</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{result.reasoning}</p>
                </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
