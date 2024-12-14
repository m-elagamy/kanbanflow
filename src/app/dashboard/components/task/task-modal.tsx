import { useState } from "react";
import { CirclePlus, Edit, PlusIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TaskForm from "./task-form";
import type Task from "@/lib/types/task";

type TaskModalProps = {
  columnId: string;
  trigger?: React.ReactNode;
  taskToEdit?: Task | null;
  setCloseDropdown?: (isOpen: boolean) => void;
};

const TaskModal = ({
  columnId,
  trigger,
  taskToEdit,
  setCloseDropdown,
}: TaskModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="size-8">
            <PlusIcon />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {taskToEdit ? <Edit size={16} /> : <CirclePlus size={16} />}
            {taskToEdit ? "Edit Task" : "New Task"}
          </DialogTitle>
        </DialogHeader>
        <TaskForm
          columnId={columnId}
          setIsModalOpen={setIsModalOpen}
          taskToEdit={taskToEdit}
          setCloseDropdown={setCloseDropdown}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
