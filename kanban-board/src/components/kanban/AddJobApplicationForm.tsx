
"use client";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { JobApplication } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { useEffect } from "react";

const JobApplicationSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  applicationDate: z.date({ required_error: "Application date is required" }),
  location: z.string().optional(),
  jobPostingLink: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  salary: z.string().optional(),
  notes: z.string().optional(),
});

type JobApplicationFormData = z.infer<typeof JobApplicationSchema>;

// Use Omit to exclude fields not managed by this form, plus ID.
type FormInitialData = Omit<JobApplication, 'id' | 'status'>;

interface AddJobApplicationFormProps {
  onSave: (data: Omit<JobApplication, 'id' | 'status'>) => void;
  onCancel: () => void;
  initialData?: FormInitialData;
  mode: 'add' | 'edit';
}

export function AddJobApplicationForm({ onSave, onCancel, initialData, mode }: AddJobApplicationFormProps) {
  const form = useForm<JobApplicationFormData>({
    resolver: zodResolver(JobApplicationSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          applicationDate: initialData.applicationDate ? parseISO(initialData.applicationDate) : new Date(),
        }
      : {
          companyName: "",
          jobTitle: "",
          applicationDate: new Date(),
          location: "",
          jobPostingLink: "",
          salary: "",
          notes: "",
        },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        companyName: initialData.companyName || "",
        jobTitle: initialData.jobTitle || "",
        applicationDate: initialData.applicationDate ? parseISO(initialData.applicationDate) : new Date(),
        location: initialData.location || "",
        jobPostingLink: initialData.jobPostingLink || "",
        salary: initialData.salary || "",
        notes: initialData.notes || "",
      });
    } else {
      form.reset({
        companyName: "",
        jobTitle: "",
        applicationDate: new Date(),
        location: "",
        jobPostingLink: "",
        salary: "",
        notes: "",
      });
    }
  }, [initialData, form]);

  function onSubmit(data: JobApplicationFormData) {
    onSave({
      ...data,
      applicationDate: format(data.applicationDate, "yyyy-MM-dd"),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Software Engineer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Acme Corp" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="applicationDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Application Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
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
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. San Francisco, CA or Remote" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jobPostingLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Posting Link (Optional)</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://example.com/job/123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="salary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salary/Compensation (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. $100,000 - $120,000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Any relevant notes..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{mode === 'edit' ? 'Save Changes' : 'Save Application'}</Button>
        </div>
      </form>
    </Form>
  );
}
