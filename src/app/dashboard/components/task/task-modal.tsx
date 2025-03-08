import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useModalStore } from "@/stores/modal";
import type { FormMode, ButtonVariants } from "@/lib/types";
import type { SimplifiedTask } from "@/lib/types/stores/task";
import TaskForm from "./task-form";
import { getModalTitle } from "../../utils/get-modal-title";
import { getModalDescription } from "../../utils/get-modal-description";

type TaskModalProps = {
  columnId: string;
  trigger?: React.ReactNode;
  task?: SimplifiedTask;
  mode: FormMode;
  variant?: ButtonVariants;
};

const TaskModal = ({
  columnId,
  trigger,
  task,
  mode,
  variant = "ghost",
}: TaskModalProps) => {
  const openModal = useModalStore((state) => state.openModal);

  const modalId = task ? `task-${task.id}` : `new-task-${columnId}`;

  const handleOnClick = () => openModal("task", modalId);

  return (
    <>
      <Button className="" variant={variant} onClick={handleOnClick} asChild>
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
          modalId={modalId}
          task={task}
          formMode={mode}
        />
      </Modal>
    </>
  );
};

export default TaskModal;
