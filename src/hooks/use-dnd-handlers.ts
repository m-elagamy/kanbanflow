import { useShallow } from "zustand/react/shallow";
import { updateTaskPositionAction } from "@/actions/task";
import type {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import type { Task } from "@prisma/client";
import { debounce } from "@/utils/debounce";
import { useTaskStore } from "@/stores/task";
import { findColumnIdByTaskId } from "@/utils/task-helpers";
import useTaskStateComparison from "./use-task-position-comparison";

const useDndHandlers = () => {
  const {
    columnTaskIds,
    getTask,
    moveTaskBetweenColumns,
    reorderTaskWithinColumn,
    activeTaskId,
    setActiveTask,
    getColumnTasks,
  } = useTaskStore(
    useShallow((state) => ({
      columnTaskIds: state.columnTaskIds,
      getTask: state.getTask,
      moveTaskBetweenColumns: state.moveTaskBetweenColumns,
      reorderTaskWithinColumn: state.reorderTaskWithinColumn,
      activeTaskId: state.activeTaskId,
      setActiveTask: state.setActiveTask,
      getColumnTasks: state.getColumnTasks,
    })),
  );

  const activeTask = activeTaskId ? getTask(activeTaskId) : null;
  const { captureInitialPosition, hasTaskPositionChanged } =
    useTaskStateComparison();

  const getTasksByColumnId = () =>
    Object.keys(columnTaskIds).reduce(
      (acc, columnId) => {
        acc[columnId] = getColumnTasks(columnId);
        return acc;
      },
      {} as Record<string, Task[]>,
    );

  const handleDragStart = ({ active }: DragStartEvent) => {
    if (!active?.id) return;
    const task = getTask(String(active.id));

    if (!task) return;

    setActiveTask(task);
    captureInitialPosition(getTasksByColumnId());
  };

  const processDragEvent = (
    activeId: string,
    overId: string,
    isEnd = false,
  ) => {
    const fromColumnId = findColumnIdByTaskId(columnTaskIds, activeId);
    const isOverTask = !!getTask(overId);
    const toColumnId = isOverTask
      ? findColumnIdByTaskId(columnTaskIds, overId)
      : overId;
    if (!fromColumnId || !toColumnId) return;

    if (fromColumnId === toColumnId && isOverTask) {
      reorderTaskWithinColumn(fromColumnId, activeId, overId);
    } else {
      moveTaskBetweenColumns(
        activeId,
        fromColumnId,
        toColumnId,
        isOverTask ? overId : undefined,
      );
    }

    if (isEnd) {
      const updatedTaskOrder = columnTaskIds[toColumnId] || [];
      if (
        hasTaskPositionChanged(getTasksByColumnId(), fromColumnId, toColumnId)
      ) {
        updateTaskPositionAction(
          activeId,
          fromColumnId,
          toColumnId,
          updatedTaskOrder,
        );
      }
      setActiveTask(null);
    }
  };

  const handleDragOver = debounce(({ active, over }: DragOverEvent) => {
    if (!active?.id || !over?.id) return;

    processDragEvent(String(active.id), String(over.id));
  }, 100);

  const handleDragEnd = debounce(({ active, over }: DragEndEvent) => {
    if (!active?.id || !over?.id) return;

    processDragEvent(String(active.id), String(over.id), true);
  }, 300);

  return {
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel: () => setActiveTask(null),
  };
};

export default useDndHandlers;
