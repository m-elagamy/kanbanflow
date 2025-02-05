import { Button } from "@/components/ui/button";
import TaskForm from "./task-form";
import type { Task } from "@prisma/client";
import type { ActionMode, ButtonVariants } from "@/lib/types";
import Modal from "@/components/ui/modal";
import { getModalTitle } from "../../utils/get-modal-title";
import { getModalDescription } from "../../utils/get-modal-description";
import { useModalStore } from "@/stores/modal";

type TaskModalProps = {
  columnId: string;
  trigger?: React.ReactNode;
  taskToEdit?: Task | null;
  mode: ActionMode;
  variant?: ButtonVariants;
};

const TaskModal = ({
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
    </>
  );
};

export default TaskModal;
