import { useShallow } from "zustand/react/shallow";
import { updateTaskPositionAction } from "@/actions/task";
import type {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { debounce } from "@/utils/debounce";
import { useTaskStore } from "@/stores/task";
import useTaskStateComparison from "./use-task-state-comparison";

export const useDndHandlers = ({ boardSlug }: { boardSlug?: string }) => {
  const {
    tasksByColumnId,
    moveTaskBetweenColumns,
    reorderTaskWithinColumn,
    activeTask,
    setActiveTask,
  } = useTaskStore(
    useShallow((state) => ({
      tasksByColumnId: state.tasks,
      moveTaskBetweenColumns: state.moveTaskBetweenColumns,
      reorderTaskWithinColumn: state.reorderTaskWithinColumn,
      activeTask: state.activeTask,
      setActiveTask: state.setActiveTask,
    })),
  );

  const { captureInitialState, hasStateChanged } = useTaskStateComparison();

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (!active?.id) return;

    const task = Object.values(tasksByColumnId)
      .flat()
      .find((task) => task.id === active.id);

    setActiveTask(task || null);

    captureInitialState(tasksByColumnId);
  };

  const handleDragOver = debounce((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over?.id) return;

    const activeTaskId = String(active.id);
    const overId = String(over.id);

    const fromColumnId = Object.keys(tasksByColumnId).find((columnId) =>
      tasksByColumnId[columnId].some((task) => task.id === activeTaskId),
    );
    const toColumnId = Object.keys(tasksByColumnId).find(
      (columnId) =>
        tasksByColumnId[columnId].some((task) => task.id === overId) ||
        columnId === overId,
    );

    if (!fromColumnId || !toColumnId) return;

    const isOverTask = Object.values(tasksByColumnId).some((tasks) =>
      tasks.some((task) => task.id === overId),
    );

    if (fromColumnId === toColumnId) {
      if (isOverTask) {
        reorderTaskWithinColumn(fromColumnId, activeTaskId, overId);
      }
    } else {
      moveTaskBetweenColumns(activeTaskId, fromColumnId, toColumnId, overId);
    }
  }, 150);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over?.id) return;

    const activeTaskId = String(active.id);
    const overId = String(over.id);

    const fromColumnId = Object.keys(tasksByColumnId).find((columnId) =>
      tasksByColumnId[columnId].some((task) => task.id === activeTaskId),
    );
    const toColumnId = Object.keys(tasksByColumnId).find(
      (columnId) =>
        columnId === overId ||
        tasksByColumnId[columnId].some((task) => task.id === overId),
    );

    if (!fromColumnId || !toColumnId) return;

    const taskToMove = tasksByColumnId[fromColumnId].find(
      (task) => task.id === activeTaskId,
    );

    if (!taskToMove) return;

    const updatedTaskOrder = tasksByColumnId[toColumnId].map((task) => task.id);

    if (!updatedTaskOrder.length) return;

    const hasChanges = hasStateChanged(
      tasksByColumnId,
      fromColumnId,
      toColumnId,
    );

    if (hasChanges) {
      await updateTaskPositionAction(
        activeTaskId,
        fromColumnId,
        toColumnId,
        updatedTaskOrder,
        boardSlug,
      );
    }

    setActiveTask(null);
  };

  const handleDragCancel = () => setActiveTask(null);

  return {
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  };
};
