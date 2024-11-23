import { ClipboardIcon, PlusIcon } from "lucide-react";
import TaskCreationModal from "./modals/task-creation";

export default function NoTasksMessage({ columnId }: { columnId: string }) {
  return (
    <div className="relative flex flex-col items-center px-4 py-8">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-primary/5 via-primary/10 to-muted blur-2xl dark:from-primary/10 dark:via-primary/5 dark:to-muted" />
      </div>

      <div className="relative flex flex-col items-center gap-4">
        <div className="relative">
          <div className="rounded-xl bg-background p-3 shadow-[0_2px_10px] shadow-black/[0.04] ring-1 ring-black/[0.08] dark:shadow-black/[0.1] dark:ring-white/[0.09]">
            <ClipboardIcon className="size-6 text-muted-foreground/50 dark:text-muted-foreground/70" />
          </div>
          <div className="absolute -right-0.5 -top-0.5">
            <div className="h-2 w-2 rounded-full bg-primary/30 blur-[2px] dark:bg-primary/40" />
          </div>
        </div>

        <div className="text-center">
          <p className="bg-gradient-to-r from-foreground/80 via-foreground/70 to-foreground/60 bg-clip-text text-sm font-medium text-transparent dark:from-foreground/70 dark:to-foreground/50">
            No tasks yet
          </p>
          <p className="mt-1 text-sm text-muted-foreground/60 dark:text-muted-foreground/50">
            Start organizing your workflow
          </p>
        </div>
        <TaskCreationModal
          columnId={columnId}
          trigger={
            <button className="mt-2 flex items-center gap-1 rounded-md bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground/80 shadow-sm ring-1 ring-black/[0.04] transition-all duration-200 hover:bg-muted/70 hover:text-foreground/90 hover:shadow hover:ring-black/[0.08] dark:bg-muted/50 dark:text-muted-foreground/70 dark:ring-white/[0.06] dark:hover:bg-muted/60 dark:hover:text-foreground/80 dark:hover:ring-white/[0.08]">
              <PlusIcon className="size-4" />
              Add Task
            </button>
          }
        />
      </div>
    </div>
  );
}
