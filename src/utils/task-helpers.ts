import type { Task } from "@prisma/client";

export const findColumnIdByTask = (
  tasksByColumnId: Record<string, Task[]>,
  taskId: string,
) => {
  return Object.keys(tasksByColumnId).find((columnId) =>
    tasksByColumnId[columnId].some((task) => task.id === taskId),
  );
};
