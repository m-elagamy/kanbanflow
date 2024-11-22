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
};

const TaskCreationModal = ({ columnId }: AddTaskModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <PlusIcon />
        </Button>
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
