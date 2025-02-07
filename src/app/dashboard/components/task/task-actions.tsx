"use client";

import { Ellipsis, Settings2, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import TaskModal from "./task-modal";
import { toast } from "sonner";
import { Task } from "@prisma/client";
import { deleteTaskAction } from "@/actions/task";

type TaskActionsProps = {
  task: Task;
  columnId: string;
  boardSlug?: string;
};

export default function TaskActions({
  task,
  columnId,
  boardSlug,
}: TaskActionsProps) {
  const handleDelete = async () => {
    await deleteTaskAction(task.id, boardSlug ?? "");
    toast.success("Task was deleted successfully!");
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
            taskToEdit={task}
            trigger={
              <DropdownMenuLabel className="w-full cursor-default justify-start rounded p-2">
                <Settings2 size={16} /> Edit
              </DropdownMenuLabel>
            }
          />
        </DropdownMenuItem>

        <DropdownMenuItem
          className="h-[30px] p-2 !py-1 text-destructive focus:text-destructive"
          onClick={handleDelete}
        >
          <TrashIcon /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
