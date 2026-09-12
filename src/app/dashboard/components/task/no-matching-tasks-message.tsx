"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import EmptyResultsIllustration from "@/components/ui/empty-results-illustration";
import { useTaskFilterStore } from "@/stores/task-filter";

export default function NoMatchingTasksMessage() {
  const setPriorityFilter = useTaskFilterStore(
    (state) => state.setPriorityFilter,
  );

  return (
    <EmptyState
      size="compact"
      illustration={<EmptyResultsIllustration />}
      title="No matching tasks"
      description="No tasks in this column have the selected priority."
      action={
        <Button
          variant="outline"
          size="sm"
          className="bg-background shadow-xs"
          onClick={() => setPriorityFilter("all")}
        >
          <RotateCcw aria-hidden="true" />
          Clear filter
        </Button>
      }
    />
  );
}
