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
    <Card className="bg-background relative z-1 border-none shadow-none">
      <div className="absolute inset-0 z-[-1] flex items-center justify-center">
        <div className="from-primary/5 via-primary/10 to-muted dark:from-primary/20 dark:via-primary/10 dark:to-muted h-32 w-32 rounded-full bg-linear-to-tr blur-2xl" />
      </div>

      <CardHeader className="relative text-center">
        <div className="group relative mx-auto mb-4">
          <div className="bg-card group-hover:shadow-primary/20 group-hover:ring-primary/30 rounded-xl p-3 shadow-lg ring-1 ring-black/[0.08] transition-all duration-300 dark:ring-white/[0.09]">
            <ClipboardPenLine className="text-muted-foreground/50 group-hover:text-primary dark:text-muted-foreground/70 size-5 transition-colors duration-300" />
          </div>

          <div className="absolute -top-0.5 -right-0.5">
            <div className="bg-primary/30 dark:bg-primary/50 h-2 w-2 rounded-full blur-[4px]" />
          </div>
        </div>

        <CardTitle className="from-foreground/90 to-foreground/70 dark:from-foreground/80 dark:to-foreground/60 bg-linear-to-r bg-clip-text text-lg font-semibold text-transparent">
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
            <Button className="dark:hover:bg-accent/5 h-8" variant="outline">
              <CirclePlus className="size-[14px]!" />
              New Task
            </Button>
          }
        />
      </CardFooter>
    </Card>
  );
}
