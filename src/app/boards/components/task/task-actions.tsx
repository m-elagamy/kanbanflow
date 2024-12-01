import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import useKanbanStore from "@/stores/use-kanban-store";
import { Ellipsis, Settings2, TrashIcon } from "lucide-react";
import TaskModal from "./task-modal";
import type Task from "@/lib/types/task";
import { useState } from "react";
import { toast } from "sonner";

interface TaskActionsProps {
  task: Task;
  columnId: string;
}

export default function TaskActions({ task, columnId }: TaskActionsProps) {
  const { activeBoardId: currentBoardId, deleteTask } = useKanbanStore();
  const [closeDropdown, setCloseDropdown] = useState(false);

  const handleDelete = () => {
    deleteTask(currentBoardId, columnId, task.id);
    toast.success("Task was deleted successfully!");
  };

  return (
    <DropdownMenu open={closeDropdown} onOpenChange={setCloseDropdown}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 transition-opacity group-hover:opacity-100 md:opacity-0"
        >
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Task Actions</DropdownMenuLabel>

        <TaskModal
          columnId={columnId}
          taskToEdit={task}
          setCloseDropdown={setCloseDropdown}
          trigger={
            <span className="flex cursor-default items-center gap-2 rounded p-2 py-1 text-sm font-normal hover:bg-muted">
              <Settings2 size={16} /> Edit
            </span>
          }
        />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={handleDelete}
        >
          <TrashIcon /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
