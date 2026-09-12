import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyTasksIllustration from "@/components/ui/empty-tasks-illustration";
import { EmptyState } from "@/components/ui/empty-state";
import TaskModal from "./task-modal";

export default function NoTasksMessage({ columnId }: { columnId: string }) {
  return (
    <EmptyState
      size="compact"
      illustration={<EmptyTasksIllustration />}
      title="No tasks yet"
      description="Add a task to get started in this column."
      action={
        <TaskModal
          mode="create"
          columnId={columnId}
          trigger={
            <Button
              variant="outline"
              size="sm"
              className="bg-background min-w-32 shadow-xs"
            >
              <Plus aria-hidden="true" />
              Add task
            </Button>
          }
        />
      }
    />
  );
}
