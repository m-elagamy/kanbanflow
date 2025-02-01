import { useShallow } from "zustand/react/shallow";
import { useKanbanStore } from "@/stores/kanban";
import { updateTaskPositionAction } from "@/actions/task";
import type {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { debounce } from "@/utils/debounce";

export const useDndHandlers = () => {
  const {
    columns,
    moveTaskBetweenColumns,
    reorderTaskWithinColumn,
    activeTask,
    setActiveTask,
  } = useKanbanStore(
    useShallow((state) => ({
      columns: state.columns,
      moveTaskBetweenColumns: state.moveTaskBetweenColumns,
      reorderTaskWithinColumn: state.reorderTaskWithinColumn,
      activeTask: state.activeTask,
      setActiveTask: state.setActiveTask,
    })),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (!active?.id) return;

    const task = columns
      .flatMap((column) => column.tasks)
      .find((task) => task.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = debounce((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over?.id) return;

    const activeTaskId = String(active.id);
    const overId = String(over.id);

    const fromColumn = columns.find((col) =>
      col.tasks.some((task) => task.id === activeTaskId),
    );
    const toColumn = columns.find(
      (col) =>
        col.tasks.some((task) => task.id === overId) || col.id === overId,
    );

    if (!fromColumn || !toColumn) return;

    const isOverTask = columns.some((col) =>
      col.tasks.some((task) => task.id === overId),
    );

    if (fromColumn.id === toColumn.id) {
      if (isOverTask) {
        reorderTaskWithinColumn(fromColumn.id, activeTaskId, overId);
      }
    } else {
      moveTaskBetweenColumns(activeTaskId, fromColumn.id, toColumn.id, overId);
    }
  }, 150);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over?.id) return;

    const activeTaskId = String(active.id);
    const overId = String(over.id);

    const fromColumn = columns.find((col) =>
      col.tasks.some((task) => task.id === activeTaskId),
    );
    const toColumn = columns.find(
      (col) =>
        col.id === overId || col.tasks.some((task) => task.id === overId),
    );

    if (!fromColumn || !toColumn) {
      return;
    }

    const taskToMove = fromColumn.tasks.find(
      (task) => task.id === activeTaskId,
    );
    if (!taskToMove) {
      return;
    }

    const updatedTaskOrder = toColumn.tasks.map((task) => task.id);

    if (!fromColumn.id || !toColumn.id || !updatedTaskOrder.length) {
      return;
    }

    await updateTaskPositionAction(
      activeTaskId,
      fromColumn.id,
      toColumn.id,
      updatedTaskOrder,
    );

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
