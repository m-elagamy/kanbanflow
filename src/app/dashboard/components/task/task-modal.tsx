import type { Task } from "@prisma/client";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useModalStore } from "@/stores/modal";
import type { formOperationMode, ButtonVariants } from "@/lib/types";

import TaskForm from "./task-form";
import { getModalTitle } from "../../utils/get-modal-title";
import { getModalDescription } from "../../utils/get-modal-description";

type TaskModalProps = {
  boardSlug?: string;
  columnId: string;
  trigger?: React.ReactNode;
  taskToEdit?: Task | null;
  mode: formOperationMode;
  variant?: ButtonVariants;
};

const TaskModal = ({
  boardSlug,
  columnId,
  trigger,
  taskToEdit,
  mode,
  variant = "ghost",
}: TaskModalProps) => {
  const openModal = useModalStore((state) => state.openModal);

  const modalId = taskToEdit ? `task-${taskToEdit.id}` : `new-task-${columnId}`;

  const handleOnClick = () => openModal("task", modalId);

  return (
    <>
      <Button
        className="!h-8"
        variant={variant}
        onClick={handleOnClick}
        asChild
      >
        {trigger}
      </Button>
      <Modal
        title={getModalTitle("task", mode)}
        description={getModalDescription("task", mode)}
        modalType="task"
        modalId={modalId}
      >
        <TaskForm
          boardSlug={boardSlug}
          formOperationMode={mode}
          modalId={modalId}
          initialState={{
            success: false,
            message: "",
            columnId,
            taskId: taskToEdit?.id ?? "",
            fields: {
              title: taskToEdit?.title ?? "",
              description: taskToEdit?.description ?? "",
              priority: taskToEdit?.priority ?? "medium",
            },
          }}
        />
      </Modal>
    </>
  );
};

export default TaskModal;
