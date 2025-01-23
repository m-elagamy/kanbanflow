import { CirclePlus, ClipboardPenLine } from "lucide-react";
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
    <Card className="relative top-1/2 z-[1] border-none shadow-none">
      <div className="absolute inset-0 z-[-1] flex items-center justify-center">
        <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-primary/5 via-primary/10 to-muted blur-2xl dark:from-primary/20 dark:via-primary/10 dark:to-muted" />
      </div>

      <CardHeader className="relative text-center">
        <div className="group relative mx-auto mb-4">
          <div className="rounded-xl bg-card p-3 shadow-lg ring-1 ring-black/[0.08] transition-all duration-300 group-hover:shadow-primary/20 group-hover:ring-primary/30 dark:ring-white/[0.09]">
            <ClipboardPenLine className="size-5 text-muted-foreground/50 transition-colors duration-300 group-hover:text-primary dark:text-muted-foreground/70" />
          </div>

          <div className="absolute -right-0.5 -top-0.5">
            <div className="h-2 w-2 rounded-full bg-primary/30 blur-[4px] dark:bg-primary/50" />
          </div>
        </div>

        <CardTitle className="bg-gradient-to-r from-foreground/90 to-foreground/70 bg-clip-text text-lg font-semibold text-transparent dark:from-foreground/80 dark:to-foreground/60">
          No tasks yet
        </CardTitle>

        <CardDescription className="text-muted-foreground/80 dark:text-muted-foreground/60">
          Start organizing your workflow
        </CardDescription>
      </CardHeader>

      <CardFooter className="flex justify-center">
        <TaskModal
          mode="create"
          columnId={columnId}
          trigger={
            <Button
              className="gap-1 px-2 dark:hover:bg-accent/5"
              variant="outline"
              size="sm"
            >
              <CirclePlus />
              New Task
            </Button>
          }
        />
      </CardFooter>
    </Card>
  );
}
