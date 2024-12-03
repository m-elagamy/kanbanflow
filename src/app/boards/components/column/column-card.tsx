import { memo, useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";

import { Card, CardContent } from "@/components/ui/card";
import ColumnHeader from "./column-header";
import NoTasksMessage from "../task/no-tasks-message";
import TaskCard from "../task/task-card";
import useKanbanStore from "@/stores/use-kanban-store";
import type Column from "@/lib/types/column";

const ColumnCard = memo(({ column }: { column: Column }) => {
  const tasks = useKanbanStore(
    useMemo(() => (state) => state.getColumnTasks(column.id), [column.id]),
  );

  const { setNodeRef } = useSortable({
    id: column.id,
  });

  return (
    <Card
      className="max-h-[500px] w-64 shrink-0 snap-start overflow-y-auto md:w-72"
      ref={setNodeRef}
    >
      <ColumnHeader column={column} />
      <CardContent className="flex-grow space-y-2 overflow-y-auto p-3">
        {tasks?.length === 0 ? (
          <NoTasksMessage columnId={column.id} />
        ) : (
          tasks?.map((task) => (
            <TaskCard key={task.id} task={task} columnId={column.id} />
          ))
        )}
      </CardContent>
    </Card>
  );
});

ColumnCard.displayName = "ColumnCard";

export default ColumnCard;
