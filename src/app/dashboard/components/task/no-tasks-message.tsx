import { CirclePlus, ClipboardPenLine, Sparkles } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TaskModal from "./task-modal";

export default function NoTasksMessage({ columnId }: { columnId: string }) {
  return (
    <Card className="group border-border/50 from-card/30 to-card/10 hover:border-border/70 relative border-dashed bg-gradient-to-br shadow-none backdrop-blur-sm transition-all duration-300 hover:shadow-sm">
      <div className="absolute inset-0 z-[-1] flex items-center justify-center">
        <div className="from-primary/5 via-primary/10 h-40 w-40 rounded-full bg-gradient-to-tr to-transparent opacity-50 blur-2xl transition-opacity duration-500 group-hover:opacity-70" />
      </div>

      <CardHeader className="relative pb-4 text-center">
        <div className="group relative mx-auto mb-4">
          <div className="bg-card/80 group-hover:shadow-primary/20 group-hover:ring-primary/30 ring-border/50 rounded-xl p-3 shadow-lg ring-1 backdrop-blur-sm transition-all duration-300 hover:scale-105">
            <ClipboardPenLine className="text-muted-foreground/60 group-hover:text-primary size-5 transition-colors duration-300" />
          </div>

          <div className="absolute -top-1 -right-1">
            <Sparkles className="text-primary/60 size-3 animate-pulse" />
          </div>
        </div>

        <CardTitle className="from-foreground/90 to-foreground/70 bg-gradient-to-r bg-clip-text text-lg font-semibold text-transparent">
          No tasks yet
        </CardTitle>

        <CardDescription className="text-muted-foreground/70 text-sm">
          Start organizing your workflow by adding your first task
        </CardDescription>
      </CardHeader>

      <CardFooter className="flex justify-center pb-4">
        <TaskModal
          mode="create"
          columnId={columnId}
          trigger={
            <Button
              className="group/btn bg-primary/90 hover:bg-primary dark:hover:text-primary hover:text-primary-foreground relative overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md"
              size="sm"
            >
              <CirclePlus className="mr-2 size-4 transition-transform duration-300 group-hover/btn:rotate-90" />
              Add Task
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
            </Button>
          }
        />
      </CardFooter>
    </Card>
  );
}
