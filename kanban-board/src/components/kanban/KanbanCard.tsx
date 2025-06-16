
"use client";

import type { JobApplication, KanbanColumnSpec } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { Button } from "../ui/button";
import { ExternalLink, Sparkles, FilePenLine } from "lucide-react";

interface KanbanCardProps {
  application: JobApplication;
  columnSpec: KanbanColumnSpec;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, applicationId: string) => void;
  onClick: () => void;
  onEdit: () => void;
}

export function KanbanCard({ application, columnSpec, onDragStart, onClick, onEdit }: KanbanCardProps) {
  const IconComponent = columnSpec.icon;

  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart(e, application.id)}
      className="mb-3 cursor-grab active:cursor-grabbing shadow-md hover:shadow-lg transition-shadow duration-200 bg-card"
      // onClick prop is now primarily for AI suggestions or details view trigger, edit has its own button.
      // If the entire card click should still open details, it's fine.
      // If edit and AI suggestions are the primary actions, the main onClick could be removed or changed.
      // For now, let's keep it and ensure buttons stop propagation.
      role="button" // Keep if card itself is clickable for details
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick()}}
      aria-label={`Job application: ${application.jobTitle} at ${application.companyName}. Click for details or use action buttons.`}
    >
      <CardHeader className="p-4" onClick={onClick} role="button">
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-base mb-1">{application.jobTitle}</CardTitle>
          <IconComponent className="h-5 w-5 text-primary" />
        </div>
        <CardDescription className="text-sm">{application.companyName}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-xs space-y-2">
        <p className="text-muted-foreground">
          Applied: {format(parseISO(application.applicationDate), "MMM d, yyyy")}
        </p>
        {application.location && (
          <p className="text-muted-foreground">Location: {application.location}</p>
        )}
         {application.salary && (
          <Badge variant="secondary" className="mr-2">{application.salary}</Badge>
        )}
        <div className="flex justify-between items-center mt-2 flex-wrap gap-2">
           <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation(); 
                onEdit();
              }}
              className="text-primary hover:bg-primary/10 px-2 py-1 h-auto"
              aria-label="Edit Application"
            >
              <FilePenLine className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation(); 
                onClick(); 
              }}
              className="text-primary hover:bg-primary/10 px-2 py-1 h-auto"
              aria-label="Get AI Suggestions"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Suggestions
            </Button>
           </div>
          {application.jobPostingLink && (
            <a
              href={application.jobPostingLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()} 
              className="text-xs text-primary hover:underline inline-flex items-center"
              aria-label="View job posting"
            >
              Job Link <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
