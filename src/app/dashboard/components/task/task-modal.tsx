import { Slot } from "@radix-ui/react-slot";
import Modal from "@/components/ui/modal";
import { useModalStore } from "@/stores/modal";
import type { FormMode, ClientTask } from "@/lib/types";
import TaskForm from "./task-form";
import { getModalTitle } from "../../utils/get-modal-title";
import { getModalDescription } from "../../utils/get-modal-description";

type TaskModalProps = {
  columnId?: string;
  boardId?: string;
  trigger?: React.ReactNode;
  task?: ClientTask;
  mode: FormMode;
  modalId?: string;
};

const TaskModal = ({
  columnId,
  boardId,
  trigger,
  task,
  mode,
  modalId: providedModalId,
}: TaskModalProps) => {
  const openModal = useModalStore((state) => state.openModal);

  const modalId =
    providedModalId ??
    (task
      ? `task-${task.id}`
      : columnId
        ? `new-task-${columnId}`
        : `new-task-board-${boardId}`);

  const handleOnClick = () => openModal("task", modalId);

  return (
    <>
      {trigger && (
        <Slot onClick={handleOnClick}>
          {trigger}
        </Slot>
      )}
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
