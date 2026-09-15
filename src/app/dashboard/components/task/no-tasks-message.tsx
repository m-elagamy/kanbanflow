import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyTasksIllustration from "@/components/ui/empty-tasks-illustration";
import { EmptyState } from "@/components/ui/empty-state";

export default function NoTasksMessage({
  onQuickAdd,
}: {
  onQuickAdd: () => void;
}) {
  return (
    <EmptyState
      size="compact"
      illustration={<EmptyTasksIllustration />}
      title="No tasks yet"
      description="Add a task to get started in this column."
      action={
        <Button
          variant="outline"
          size="sm"
          className="bg-background min-w-32 shadow-xs"
          onClick={onQuickAdd}
        >
          <Plus aria-hidden="true" />
          Add task
        </Button>
      }
    />
  );
}
