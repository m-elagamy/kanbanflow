import { SortableContext } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

import { Card, CardContent } from "@/components/ui/card";
import ColumnHeader from "./column-header";
import NoTasksMessage from "../task/no-tasks-message";
import TaskCard from "../task/task-card";
import { Column, type Task } from "@prisma/client";

const ColumnCard = ({ column, tasks }: { tasks: Task[]; column: Column }) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const taskIds = tasks.map((task) => `${column.id}_${task.id}`);

  return (
    <Card
      className="max-h-[500px] w-64 shrink-0 snap-start overflow-y-auto md:w-72"
      ref={setNodeRef}
    >
      <ColumnHeader column={column} tasksCount={tasks.length} />
      <CardContent className="flex-grow space-y-2 overflow-y-auto p-3">
        {tasks?.length === 0 ? (
          <NoTasksMessage columnId={column.id} />
        ) : (
          <SortableContext items={taskIds}>
            {tasks?.map((task) => (
              <TaskCard key={task.id} task={task} columnId={column.id} />
            ))}
          </SortableContext>
        )}
      </CardContent>
    </Card>
  );
};

export default ColumnCard;
