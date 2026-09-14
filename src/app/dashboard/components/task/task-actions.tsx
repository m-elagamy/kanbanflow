"use client";

import { useState } from "react";
import { ArrowRight, Ellipsis, Settings2, TrashIcon } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import type { ClientTask } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import AlertConfirmation from "@/components/ui/alert-confirmation";
import { useColumnStore } from "@/stores/column";
import useBoardStore from "@/stores/board";
import TaskModal from "./task-modal";
import { deleteTaskAction, updateTaskPositionAction } from "@/actions/task";
import { useTaskStore } from "@/stores/task";
import useLoadingStore from "@/stores/loading";
import handleOnError from "@/utils/handle-on-error";

type TaskActionsProps = {
  task: ClientTask;
  columnId: string;
};

export default function TaskActions({
  task,
  columnId,
}: Readonly<TaskActionsProps>) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const boardId = useBoardStore((state) => state.activeBoardId);
  const columns = useColumnStore((state) =>
    boardId ? state.columnsByBoard[boardId] : undefined,
  );
  const destinations = Object.values(columns ?? {})
    .filter((column) => column.id !== columnId)
    .sort((a, b) => a.order - b.order);
  const { deleteTask, rollback, clearSnapshot } = useTaskStore(
    useShallow((state) => ({
      deleteTask: state.deleteTask,
      rollback: state.rollback,
      clearSnapshot: state.clearSnapshot,
    })),
  );
  const { isLoading, isMoving, setIsLoading } = useLoadingStore(
    useShallow((state) => ({
      isLoading: state.isLoading("task", "deleting"),
      isMoving: state.isLoading("task", "updating", task.id),
      setIsLoading: state.setIsLoading,
    })),
  );

  const handleDelete = async () => {
    if (isLoading || isMoving) return;
    setConfirmDelete(false);
    setIsLoading("task", "deleting", true, task.id);
    deleteTask(columnId, task.id);

    try {
      const result = await deleteTaskAction(task.id);

      if (!result.success) {
        handleOnError(result.message, "Failed to delete task");
        rollback();
      } else {
        toast.success(result.message);
      }
    } catch (error) {
      handleOnError(error, "Failed to delete task");
      rollback();
    } finally {
      setIsLoading("task", "deleting", false, task.id);
    }
  };

  const handleMove = async (destinationId: string) => {
    if (isMoving || isLoading) return;
    setIsLoading("task", "updating", true, task.id);
    const store = useTaskStore.getState();
    try {
      const result = await updateTaskPositionAction(
        task.id,
        destinationId,
        null,
        null,
      );
      if (!result.success) {
        handleOnError(result.message, "Failed to move task");
        return;
      }
      if (useBoardStore.getState().activeBoardId === boardId) {
        const destinationHasMore = Boolean(
          store.columnPages[destinationId]?.nextCursor,
        );
        store.moveTaskBetweenColumns(
          task.id,
          columnId,
          destinationId,
          undefined,
          !destinationHasMore,
        );
        if (result.fields) store.updateTask(task.id, result.fields);
        clearSnapshot();
      }
      toast.success(result.message);
    } catch (error) {
      handleOnError(error, "Failed to move task");
    } finally {
      setIsLoading("task", "updating", false, task.id);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="z-10">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            disabled={isMoving}
            aria-label={`Actions for ${task.title}`}
          >
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Task Actions:</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <TaskModal
              mode="edit"
              columnId={columnId}
              task={task}
              trigger={
                <DropdownMenuLabel className="h-7 w-full cursor-default justify-start rounded-lg p-2">
                  <Settings2 size={16} /> Edit
                </DropdownMenuLabel>
              }
            />
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger
              disabled={isMoving || isLoading || destinations.length === 0}
            >
              <ArrowRight size={16} /> Move to column
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {destinations.map((column) => (
                <DropdownMenuItem
                  key={column.id}
                  onSelect={() => void handleMove(column.id)}
                >
                  {column.status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem
            className="text-destructive hover:bg-accent hover:text-destructive focus:text-destructive flex h-7 w-full cursor-default items-center justify-start gap-2 rounded-lg p-2"
            onSelect={() => setConfirmDelete(true)}
            disabled={isLoading || isMoving}
          >
            <TrashIcon size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertConfirmation
        open={confirmDelete}
        setOpen={setConfirmDelete}
        title="Delete task"
        description={`Permanently delete "${task.title}"? This action cannot be undone.`}
        confirmLabel="Delete task"
        isPending={isLoading}
        onClick={handleDelete}
      />
    </>
  );
}
