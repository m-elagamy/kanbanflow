import { useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ColumnHeader from "./column-header";
import NoTasksMessage from "../task/no-tasks-message";
import TaskCard from "../task/task-card";
import type Column from "@/lib/types/column";
import useKanbanStore from "@/stores/use-kanban-store";

const ColumnCard = ({ column }: { column: Column }) => {
  const tasks = useKanbanStore(
    useCallback((state) => state.getColumnTasks(column.id), [column.id]),
  );

  return (
    <Card className="max-h-[500px] w-64 min-w-64 snap-start overflow-y-auto md:w-72 md:min-w-72">
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
};

export default ColumnCard;
