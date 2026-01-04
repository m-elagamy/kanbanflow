import type { Task } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useModalStore } from "@/stores/modal";
import type { FormMode, ButtonVariants } from "@/lib/types";
import TaskForm from "./task-form";
import { getModalTitle } from "../../utils/get-modal-title";
import { getModalDescription } from "../../utils/get-modal-description";

type TaskModalProps = {
  columnId?: string;
  boardId?: string;
  trigger?: React.ReactNode;
  task?: Task;
  mode: FormMode;
  variant?: ButtonVariants;
};

const TaskModal = ({
  columnId,
  boardId,
  trigger,
  task,
  mode,
  variant = "ghost",
}: TaskModalProps) => {
  const openModal = useModalStore((state) => state.openModal);

  const modalId = task
    ? `task-${task.id}`
    : columnId
      ? `new-task-${columnId}`
      : `new-task-board-${boardId}`;

  const handleOnClick = () => openModal("task", modalId);

  return (
    <>
      <Button
        className=""
        variant={variant}
        onClick={handleOnClick}
        size="lg"
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
          columnId={columnId}
          boardId={boardId}
          modalId={modalId}
          task={task}
          formMode={mode}
        />
      </Modal>
    </>
  );
};

export default TaskModal;
