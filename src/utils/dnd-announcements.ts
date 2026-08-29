import type { Announcements, ScreenReaderInstructions } from "@dnd-kit/core";
import { useTaskStore } from "@/stores/task";
import { useColumnStore } from "@/stores/column";
import useBoardStore from "@/stores/board";
import { findColumnIdByTaskId } from "@/utils/task-helpers";

const getTaskTitle = (taskId: string): string =>
  useTaskStore.getState().tasks[taskId]?.title ?? "task";

const resolveColumnId = (overId: string): string | undefined => {
  const { columnTaskIds } = useTaskStore.getState();
  if (columnTaskIds[overId]) return overId;
  return findColumnIdByTaskId(columnTaskIds, overId);
};

const getColumnStatus = (columnId: string | undefined): string | null => {
  if (!columnId) return null;
  const boardId = useBoardStore.getState().activeBoardId;
  if (!boardId) return null;
  return useColumnStore.getState().columnsByBoard[boardId]?.[columnId]?.status ?? null;
};

const getPositionInColumn = (
  taskId: string,
  columnId: string,
): { index: number; total: number } | null => {
  const taskIds = useTaskStore.getState().columnTaskIds[columnId];
  if (!taskIds) return null;

  const index = taskIds.indexOf(taskId);
  if (index === -1) return null;

  return { index: index + 1, total: taskIds.length };
};

const describeDrop = (taskId: string, overId: string | undefined): string => {
  const title = getTaskTitle(taskId);
  const columnId = overId ? resolveColumnId(overId) : undefined;
  const status = getColumnStatus(columnId);

  if (!columnId || !status) return `Task "${title}".`;

  const position = getPositionInColumn(taskId, columnId);
  if (!position) return `Task "${title}" in the "${status}" column.`;

  return `Task "${title}" in the "${status}" column, position ${position.index} of ${position.total}.`;
};

export const screenReaderInstructions: ScreenReaderInstructions = {
  draggable: `
    To pick up a task, press space or enter.
    While dragging, use the arrow keys to move the task over another task or column.
    Press space or enter again to drop the task in its new position, or press escape to cancel.
  `,
};

export const dndAnnouncements: Announcements = {
  onDragStart({ active }) {
    return `Picked up ${describeDrop(String(active.id), undefined)}`;
  },
  onDragOver({ active, over }) {
    if (!over) return undefined;
    return `${describeDrop(String(active.id), String(over.id))} is over the drop target.`;
  },
  onDragEnd({ active, over }) {
    if (!over) return `${describeDrop(String(active.id), undefined)} was dropped.`;
    return `${describeDrop(String(active.id), String(over.id))} was dropped.`;
  },
  onDragCancel({ active }) {
    return `Dragging ${describeDrop(String(active.id), undefined)} was cancelled.`;
  },
};
