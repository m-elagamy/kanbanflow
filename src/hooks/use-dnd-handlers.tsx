import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useKanbanStore } from "@/stores/kanban";
import {
  moveTaskBetweenColumnsAction,
  updateTaskOrderAction,
} from "@/actions/task";
import type { Task } from "@prisma/client";
import { debounce } from "@/utils/debounce";

export const useDndHandlers = () => {
  const { columns, setColumns } = useKanbanStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const debouncedUpdateTaskOrder = debounce(
    async (columnId: string, taskIds: string[]) => {
      await updateTaskOrderAction(columnId, taskIds);
    },
    300,
  );

  const debouncedMoveTask = debounce(
    async (
      oldColumnId: string,
      newColumnId: string,
      task: Task,
      newTaskIds: string[],
    ) => {
      await moveTaskBetweenColumnsAction(
        task.id,
        oldColumnId,
        newColumnId,
        newTaskIds,
      );
    },
    300,
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = columns
      .flatMap((column) => column.tasks)
      .find((task) => task.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeTaskId = active.id;
    const overId = over.id;

    const oldColumnIndex = columns.findIndex((col) =>
      col.tasks.some((task) => task.id === activeTaskId),
    );

    const newColumnIndex = columns.findIndex(
      (col) =>
        col.id === overId || col.tasks.some((task) => task.id === overId),
    );

    if (oldColumnIndex === -1 || newColumnIndex === -1) return;

    const newColumns = [...columns];
    const oldColumn = newColumns[oldColumnIndex];

    const taskToMove = oldColumn.tasks.find((task) => task.id === activeTaskId);
    if (!taskToMove) return;

    if (oldColumnIndex === newColumnIndex) {
      await reorderTasksInSameColumn(
        oldColumnIndex,
        String(activeTaskId),
        String(overId),
      );
    } else {
      await moveTaskBetweenColumns(
        oldColumnIndex,
        newColumnIndex,
        String(activeTaskId),
        String(overId),
        taskToMove,
      );
    }

    setActiveTask(null);
  };

  const reorderTasksInSameColumn = async (
    columnIndex: number,
    activeTaskId: string,
    overId: string,
  ) => {
    const oldIndex = columns[columnIndex].tasks.findIndex(
      (task) => task.id === activeTaskId,
    );
    const newIndex = columns[columnIndex].tasks.findIndex(
      (task) => task.id === overId,
    );

    if (newIndex === -1) return;

    const newColumns = [...columns];
    newColumns[columnIndex] = {
      ...columns[columnIndex],
      tasks: arrayMove(columns[columnIndex].tasks, oldIndex, newIndex),
    };

    setColumns(newColumns);

    debouncedUpdateTaskOrder(
      columns[columnIndex].id,
      newColumns[columnIndex].tasks.map((task) => task.id),
    );
  };

  const moveTaskBetweenColumns = async (
    oldColumnIndex: number,
    newColumnIndex: number,
    activeTaskId: string,
    overId: string,
    taskToMove: Task,
  ) => {
    const oldColumn = columns[oldColumnIndex];
    const newColumn = columns[newColumnIndex];
    const newColumns = [...columns];

    newColumns[oldColumnIndex] = {
      ...oldColumn,
      tasks: oldColumn.tasks.filter((task) => task.id !== activeTaskId),
    };

    let newTaskIndex = newColumn.tasks.findIndex((task) => task.id === overId);

    if (newTaskIndex === -1) {
      newTaskIndex = newColumn.tasks.length;
    }

    newColumns[newColumnIndex] = {
      ...newColumn,
      tasks: [
        ...newColumn.tasks.slice(0, newTaskIndex),
        taskToMove,
        ...newColumn.tasks.slice(newTaskIndex),
      ],
    };

    setColumns(newColumns);

    debouncedMoveTask(
      oldColumn.id,
      newColumn.id,
      taskToMove,
      newColumns[newColumnIndex].tasks.map((task) => task.id),
    );
  };

  const handleDragCancel = () => setActiveTask(null);

  return { activeTask, handleDragStart, handleDragEnd, handleDragCancel };
};
