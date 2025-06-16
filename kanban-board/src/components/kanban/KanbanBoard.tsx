
"use client";

import type { JobApplication, ApplicationStatus, KanbanColumnSpec } from "@/types";
import { useEffect, useState } from "react";
import { KanbanColumn } from "./KanbanColumn";
import { AddJobApplicationForm } from "./AddJobApplicationForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Mail, CalendarClock, Briefcase, FileText, XCircle, PlusCircle, ExternalLink, Info } from 'lucide-react';
import { JobActionItems } from "./JobActionItems";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { format, parseISO } from "date-fns";

const COLUMN_SPECS: KanbanColumnSpec[] = [
  { id: 'Applied', title: 'Applied', icon: Mail },
  { id: 'Interview Scheduled', title: 'Interview Scheduled', icon: CalendarClock },
  { id: 'Interviewing', title: 'Interviewing', icon: Briefcase },
  { id: 'Offer', title: 'Offer', icon: FileText },
  { id: 'Rejected', title: 'Rejected', icon: XCircle },
];

const initialJobApplications: JobApplication[] = [
  { id: '1', companyName: 'Tech Solutions Inc.', jobTitle: 'Frontend Developer', applicationDate: '2024-07-15', status: 'Applied', location: 'Remote', salary: '$90k - $110k', jobPostingLink: 'https://example.com/job/frontend' },
  { id: '2', companyName: 'Innovate Hub', jobTitle: 'UX Designer', applicationDate: '2024-07-10', status: 'Interview Scheduled', location: 'New York, NY', notes: 'First interview with hiring manager.' },
  { id: '3', companyName: 'Data Corp', jobTitle: 'Data Analyst', applicationDate: '2024-06-20', status: 'Interviewing', location: 'San Francisco, CA', salary: '$85k', jobPostingLink: 'https://example.com/job/data' },
  { id: '4', companyName: 'Global Systems', jobTitle: 'Backend Engineer', applicationDate: '2024-05-01', status: 'Offer', location: 'Remote', notes: 'Received offer, negotiating terms.' },
  { id: '5', companyName: 'Creative Minds', jobTitle: 'Graphic Designer', applicationDate: '2024-07-01', status: 'Rejected', location: 'Austin, TX' },
];


export function KanbanBoard() {
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);
  const [isActionItemDialogOpen, setIsActionItemDialogOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedApps = localStorage.getItem("jobApplications");
    if (storedApps) {
      try {
        const parsedApps = JSON.parse(storedApps);
        // Basic validation to ensure dates are strings
        if (Array.isArray(parsedApps) && parsedApps.every(app => typeof app.applicationDate === 'string')) {
          setJobApplications(parsedApps);
        } else {
          setJobApplications(initialJobApplications);
        }
      } catch (error) {
        console.error("Failed to parse job applications from localStorage", error);
        setJobApplications(initialJobApplications);
      }
    } else {
      setJobApplications(initialJobApplications);
    }
  }, []);

  useEffect(() => {
    if(isClient) {
      localStorage.setItem("jobApplications", JSON.stringify(jobApplications));
    }
  }, [jobApplications, isClient]);


  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, applicationId: string) => {
    e.dataTransfer.setData("applicationId", applicationId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStatus: ApplicationStatus) => {
    const applicationId = e.dataTransfer.getData("applicationId");
    setJobApplications((prevApps) =>
      prevApps.map((app) =>
        app.id === applicationId ? { ...app, status: targetStatus } : app
      )
    );
  };

  const handleSaveApplication = (formData: Omit<JobApplication, 'id' | 'status'>) => {
    if (editingApplication) {
      // Edit mode
      setJobApplications((prevApps) =>
        prevApps.map((app) =>
          app.id === editingApplication.id
            ? { ...editingApplication, ...formData } // formData.applicationDate is already "yyyy-MM-dd"
            : app
        )
      );
      setEditingApplication(null);
    } else {
      // Add mode
      const newApplication: JobApplication = {
        ...formData, // formData.applicationDate is already "yyyy-MM-dd"
        id: crypto.randomUUID(),
        status: 'Applied', 
      };
      setJobApplications((prevApps) => [...prevApps, newApplication]);
    }
    setIsFormOpen(false);
  };
  
  const handleOpenAddForm = () => {
    setEditingApplication(null);
    setIsFormOpen(true);
  };

  const handleCardClick = (application: JobApplication) => {
    setSelectedApplication(application);
    setIsActionItemDialogOpen(true);
  };

  const handleCardEditClick = (application: JobApplication) => {
    setEditingApplication(application);
    setIsFormOpen(true);
  };
  
  if (!isClient) {
    return (
      <div className="flex flex-col h-screen p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-headline text-primary">Loading JobTrack Board...</h1>
        </div>
        <div className="flex-grow flex gap-4 overflow-x-auto pb-4">
          {COLUMN_SPECS.map(spec => (
            <Card key={spec.id} className="min-w-[300px] w-[300px] h-full flex flex-col bg-muted/50 rounded-lg shadow-sm">
              <CardHeader className="p-4 border-b border-border sticky top-0 bg-muted/50 z-10 rounded-t-lg">
                <CardTitle className="font-headline text-lg flex items-center">
                  <spec.icon className="h-5 w-5 mr-2 text-primary" />
                  {spec.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex-grow overflow-y-auto">
                <div className="space-y-2">
                  <div className="h-24 bg-background rounded animate-pulse"></div>
                  <div className="h-24 bg-background rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col h-screen p-2 sm:p-4 md:p-6 bg-background">
      <header className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-headline text-primary">JobTrack Board</h1>
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
          setIsFormOpen(isOpen);
          if (!isOpen) {
            setEditingApplication(null); // Clear editing state when dialog closes
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenAddForm}>
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Application
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">
                {editingApplication ? "Edit Job Application" : "Add New Job Application"}
              </DialogTitle>
              <DialogDescription>
                {editingApplication ? "Update the details for this job application." : "Fill in the details for your new job application."}
              </DialogDescription>
            </DialogHeader>
            <AddJobApplicationForm
              onSave={handleSaveApplication}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingApplication(null);
              }}
              initialData={editingApplication ? {
                companyName: editingApplication.companyName,
                jobTitle: editingApplication.jobTitle,
                applicationDate: editingApplication.applicationDate, // Pass as string
                location: editingApplication.location,
                jobPostingLink: editingApplication.jobPostingLink,
                salary: editingApplication.salary,
                notes: editingApplication.notes,
              } : undefined}
              mode={editingApplication ? 'edit' : 'add'}
            />
          </DialogContent>
        </Dialog>
      </header>

      <ScrollArea className="flex-grow w-full">
        <div className="flex gap-4 pb-4 h-[calc(100vh-150px)] sm:h-[calc(100vh-120px)]">
          {COLUMN_SPECS.map((spec) => (
            <KanbanColumn
              key={spec.id}
              columnSpec={spec}
              applications={jobApplications.filter((app) => app.status === spec.id)}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onCardDragStart={handleDragStart}
              onCardClick={handleCardClick}
              onCardEdit={handleCardEditClick}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {selectedApplication && (
         <Dialog open={isActionItemDialogOpen} onOpenChange={setIsActionItemDialogOpen}>
         <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
           <DialogHeader>
             <DialogTitle className="font-headline text-xl text-primary flex items-center">
                <Info size={20} className="mr-2" /> 
                Application Details & Suggestions
             </DialogTitle>
             <DialogDescription>
               Review details for {selectedApplication.jobTitle} at {selectedApplication.companyName} and see AI-powered action items.
             </DialogDescription>
           </DialogHeader>
           <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg">{selectedApplication.jobTitle}</CardTitle>
                    <CardDescription>{selectedApplication.companyName}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                    <p><strong>Status:</strong> {selectedApplication.status}</p>
                    <p><strong>Applied Date:</strong> {format(parseISO(selectedApplication.applicationDate), "PPP")}</p>
                    {selectedApplication.location && <p><strong>Location:</strong> {selectedApplication.location}</p>}
                    {selectedApplication.salary && <p><strong>Salary:</strong> {selectedApplication.salary}</p>}
                    {selectedApplication.jobPostingLink && (
                        <p><strong>Job Link:</strong> <a href={selectedApplication.jobPostingLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center">View Posting <ExternalLink size={14} className="ml-1"/></a></p>
                    )}
                    {selectedApplication.notes && <p><strong>Notes:</strong> {selectedApplication.notes}</p>}
                </CardContent>
            </Card>
             <JobActionItems application={selectedApplication} />
           </div>
           <div className="flex justify-end pt-2">
                <Button variant="outline" onClick={() => setIsActionItemDialogOpen(false)}>Close</Button>
            </div>
         </DialogContent>
       </Dialog>
      )}
    </div>
  );
}
