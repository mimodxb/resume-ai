
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { ResumeGenerator } from "@/components/resume/ResumeGenerator";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="p-4">
      <KanbanBoard />
      <Separator className="my-8" />
      <ResumeGenerator />
    </main>
  );
}
