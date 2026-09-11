import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyTasksIllustration from "../../../../components/ui/empty-tasks-illustration";
import TaskModal from "./task-modal";

export default function NoTasksMessage({ columnId }: { columnId: string }) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center px-3 py-8 text-center">
      <EmptyTasksIllustration />
      <h3 className="mt-4 text-sm font-medium">No tasks yet</h3>
      <p className="text-muted-foreground mt-1 max-w-48 text-xs leading-relaxed">
        Add a task to get started in this column.
      </p>
      <TaskModal
        mode="create"
        columnId={columnId}
        trigger={
          <Button
            variant="outline"
            size="sm"
            className="bg-background mt-5 min-w-32 shadow-xs"
          >
            <Plus aria-hidden="true" />
            Add task
          </Button>
        }
      />
    </div>
  );
}
