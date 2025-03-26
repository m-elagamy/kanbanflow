"use client";

import { Ellipsis, Loader, Settings2, TrashIcon } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import type { Task } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import TaskModal from "./task-modal";
import { deleteTaskAction } from "@/actions/task";
import { useTaskStore } from "@/stores/task";
import useLoadingStore from "@/stores/loading";
import delay from "@/utils/delay";

type TaskActionsProps = {
  task: Task;
  columnId: string;
};

export default function TaskActions({
  task,
  columnId,
}: Readonly<TaskActionsProps>) {
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const { isLoading, setIsLoading } = useLoadingStore(
    useShallow((state) => ({
      isLoading: state.isLoading("task", "deleting"),
      setIsLoading: state.setIsLoading,
    })),
  );

  const handleDelete = async () => {
    setIsLoading("task", "deleting", true, task.id);
    await delay(400);
    deleteTask(columnId, task.id);
    await deleteTaskAction(task.id);
    setIsLoading("task", "deleting", false, task.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="z-10">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 transition-opacity group-hover:opacity-100 md:opacity-0"
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

        <Button
          className="flex h-7 w-full cursor-default items-center justify-start gap-2 rounded-lg p-2 text-destructive hover:bg-accent hover:text-destructive focus:text-destructive"
          variant="ghost"
          onClick={handleDelete}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader size={16} className="animate-spin" />
          ) : (
            <TrashIcon size={16} />
          )}
          Delete
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
