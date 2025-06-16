
"use client";

import type { JobApplication, KanbanColumnSpec, ApplicationStatus } from "@/types";
import { KanbanCard } from "./KanbanCard";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KanbanColumnProps {
  columnSpec: KanbanColumnSpec;
  applications: JobApplication[];
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, targetStatus: ApplicationStatus) => void;
  onCardDragStart: (e: React.DragEvent<HTMLDivElement>, applicationId: string) => void;
  onCardClick: (application: JobApplication) => void;
  onCardEdit: (application: JobApplication) => void; // Added this prop
}

export function KanbanColumn({
  columnSpec,
  applications,
  onDragOver,
  onDrop,
  onCardDragStart,
  onCardClick,
  onCardEdit, // Added this prop
}: KanbanColumnProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const IconComponent = columnSpec.icon;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
    onDragOver(e);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDraggingOver(false);
    onDrop(e, columnSpec.id);
  };

  return (
    <Card
      className={`min-w-[300px] w-[300px] h-full flex flex-col bg-muted/50 rounded-lg shadow-sm transition-colors duration-200 ${
        isDraggingOver ? "bg-accent/30" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-label={`Column ${columnSpec.title}, currently ${applications.length} applications`}
    >
      <CardHeader className="p-4 border-b border-border sticky top-0 bg-muted/50 z-10 rounded-t-lg">
        <CardTitle className="font-headline text-lg flex items-center">
          <IconComponent className="h-5 w-5 mr-2 text-primary" />
          {columnSpec.title}
          <span className="ml-2 text-sm font-normal text-muted-foreground bg-background px-2 py-0.5 rounded-full">
            {applications.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-grow overflow-y-auto">
        {applications.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            No applications here.
          </div>
        ) : (
          applications.map((app) => (
            <KanbanCard
              key={app.id}
              application={app}
              columnSpec={columnSpec}
              onDragStart={onCardDragStart}
              onClick={() => onCardClick(app)}
              onEdit={() => onCardEdit(app)} // Pass the onEdit handler
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
