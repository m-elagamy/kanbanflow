import { useShallow } from "zustand/react/shallow";
import { updateTaskPositionAction } from "@/actions/task";
import type {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import type { ClientTask } from "@/lib/types";
import { debounce } from "@/utils/debounce";
import { useTaskStore } from "@/stores/task";
import { findColumnIdByTaskId } from "@/utils/task-helpers";
import useTaskStateComparison from "./use-task-position-comparison";
import handleOnError from "@/utils/handle-on-error";

const useDndHandlers = () => {
  const {
    columnTaskIds,
    getTask,
    moveTaskBetweenColumns,
    reorderTaskWithinColumn,
    activeTaskId,
    setActiveTask,
    getColumnTasks,
    rollback,
    captureSnapshot,
    clearSnapshot,
  } = useTaskStore(
    useShallow((state) => ({
      columnTaskIds: state.columnTaskIds,
      getTask: state.getTask,
      moveTaskBetweenColumns: state.moveTaskBetweenColumns,
      reorderTaskWithinColumn: state.reorderTaskWithinColumn,
      activeTaskId: state.activeTaskId,
      setActiveTask: state.setActiveTask,
      getColumnTasks: state.getColumnTasks,
      rollback: state.rollback,
      captureSnapshot: state.captureSnapshot,
      clearSnapshot: state.clearSnapshot,
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
      {} as Record<string, ClientTask[]>,
    );

  const handleDragStart = ({ active }: DragStartEvent) => {
    if (!active?.id) return;
    const task = getTask(String(active.id));

    if (!task) return;

    captureSnapshot();
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
      const destinationHasMore = Boolean(
        useTaskStore.getState().columnPages[toColumnId]?.nextCursor,
      );
      moveTaskBetweenColumns(
        activeId,
        fromColumnId,
        toColumnId,
        isOverTask ? overId : undefined,
        isOverTask || !destinationHasMore,
      );
    }

    if (isEnd) {
      const updatedTaskOrder =
        useTaskStore.getState().columnTaskIds[toColumnId] || [];
      if (
        hasTaskPositionChanged(getTasksByColumnId(), fromColumnId, toColumnId)
      ) {
        const taskIndex = updatedTaskOrder.indexOf(activeId);
        const previousTaskId = updatedTaskOrder[taskIndex - 1] ?? null;
        const nextTaskId = updatedTaskOrder[taskIndex + 1] ?? null;
        updateTaskPositionAction(
          activeId,
          toColumnId,
          previousTaskId,
          nextTaskId,
        )
          .then((result) => {
            if (!result.success) {
              handleOnError(result.message, "Failed to move task");
              rollback();
            } else {
              if (result.fields) {
                useTaskStore.getState().updateTask(activeId, result.fields);
              }
              useTaskStore.getState().clearSnapshot();
            }
          })
          .catch((error) => {
            handleOnError(error, "Failed to move task");
            rollback();
          });
      }
      if (
        !hasTaskPositionChanged(getTasksByColumnId(), fromColumnId, toColumnId)
      ) {
        clearSnapshot();
      }
      setActiveTask(null);
    }
  };

  const handleDragOver = debounce(({ active, over }: DragOverEvent) => {
    if (!active?.id || !over?.id) return;

    processDragEvent(String(active.id), String(over.id));
  }, 100);

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!active?.id || !over?.id) {
      setActiveTask(null);
      return;
    }

    processDragEvent(String(active.id), String(over.id), true);
  };

  return {
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel: () => {
      rollback();
      setActiveTask(null);
    },
  };
};

export default useDndHandlers;
