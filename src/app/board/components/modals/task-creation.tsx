import { useState } from "react";
import { PlusIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TaskCreationForm from "../forms/task-creation";

type AddTaskModalProps = {
  columnId: string;
  trigger?: React.ReactNode;
};

const TaskCreationModal = ({ columnId, trigger }: AddTaskModalProps) => {
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
          <DialogTitle>New Task</DialogTitle>
        </DialogHeader>
        <TaskCreationForm columnId={columnId} setIsModalOpen={setIsModalOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default TaskCreationModal;
