import type { LucideIcon } from 'lucide-react';

export type ApplicationStatus = 'Applied' | 'Interview Scheduled' | 'Interviewing' | 'Offer' | 'Rejected';

export interface JobApplication {
  id: string;
  companyName: string;
  jobTitle: string;
  applicationDate: string; // YYYY-MM-DD
  status: ApplicationStatus;
  location?: string;
  jobPostingLink?: string;
  salary?: string;
  notes?: string;
}

export interface KanbanColumnSpec {
  id: ApplicationStatus;
  title: string;
  icon: LucideIcon;
}
