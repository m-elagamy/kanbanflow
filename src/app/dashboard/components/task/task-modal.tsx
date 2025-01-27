import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskForm from "./task-form";
import type { Task } from "@prisma/client";
import type { ActionMode } from "@/lib/types";
import Modal from "@/components/ui/modal";
import { getModalTitle } from "../../utils/get-modal-title";
import { getModalDescription } from "../../utils/get-modal-description";

type TaskModalProps = {
  columnId: string;
  trigger?: React.ReactNode;
  taskToEdit?: Task | null;
  mode: ActionMode;
};

const TaskModal = ({ columnId, trigger, taskToEdit, mode }: TaskModalProps) => {
  const modalId = taskToEdit ? `task-${taskToEdit.id}` : `new-task-${columnId}`;

  return (
    <Modal
      trigger={
        trigger || (
          <Button variant="ghost" size="icon" className="size-8">
            <PlusIcon />
            <span className="sr-only">New Task</span>
          </Button>
        )
      }
      title={getModalTitle("task", mode)}
      description={getModalDescription("task", mode)}
      modalType="task"
      modalId={modalId}
    >
      <TaskForm
        mode={mode}
        initialState={{
          success: false,
          message: "",
          errors: undefined,
          fields: {
            columnId,
            taskId: taskToEdit?.id,
            title: taskToEdit?.title ?? "",
            description: taskToEdit?.description ?? "",
            priority: taskToEdit?.priority ?? "medium",
          },
        }}
        modalId={modalId}
      />
    </Modal>
  );
};

export default TaskModal;
