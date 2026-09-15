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
import columnStatusOptions from "../../data/column-status-options";
import { useModalStore } from "@/stores/modal";

type TaskActionsProps = {
  task: ClientTask;
  columnId: string;
};

export default function TaskActions({
  task,
  columnId,
}: Readonly<TaskActionsProps>) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const openModal = useModalStore((state) => state.openModal);
  const editModalId = `task-${task.id}`;
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
          <DropdownMenuItem
            className="h-8 gap-2 px-2 py-1.5"
            onSelect={() => openModal("task", editModalId)}
          >
            <Settings2 size={16} /> Edit
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger
              className="h-8 gap-2 px-2 py-1.5"
              disabled={isMoving || isLoading || destinations.length === 0}
            >
              <ArrowRight size={16} /> Move to column
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {destinations.map((column) => {
                const statusOption =
                  columnStatusOptions[
                    column.status as keyof typeof columnStatusOptions
                  ];
                const StatusIcon = statusOption?.icon;

                return (
                  <DropdownMenuItem
                    key={column.id}
                    className="h-8 gap-2 px-2 py-1.5"
                    onSelect={() => void handleMove(column.id)}
                  >
                    {StatusIcon && (
                      <StatusIcon
                        size={16}
                        color={statusOption.color}
                        aria-hidden="true"
                      />
                    )}
                    {column.status}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem
            variant="destructive"
            className="h-8 gap-2 px-2 py-1.5"
            onSelect={() => setConfirmDelete(true)}
            disabled={isLoading || isMoving}
          >
            <TrashIcon size={16} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <TaskModal
        mode="edit"
        columnId={columnId}
        task={task}
        modalId={editModalId}
      />
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
