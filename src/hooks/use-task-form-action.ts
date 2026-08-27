import { useShallow } from "zustand/react/shallow";
import { createTaskAction, updateTaskAction } from "@/actions/task";
import type { FormMode, TaskSummary } from "@/lib/types";
import type { TaskSchema } from "@/schemas/task";
import { useModalStore } from "@/stores/modal";
import { useTaskStore } from "@/stores/task";
import generateUUID from "@/utils/generate-UUID";
import useLoadingStore from "@/stores/loading";
import delay from "@/utils/delay";
import handleOnError from "@/utils/handle-on-error";

type UseTaskFormAction = {
  formMode: FormMode;
  validateBeforeSubmit: (
    formData: FormData,
    isEditMode: boolean,
    existingBoards: { id: string; title: string }[],
    subsetFields: (keyof TaskSchema)[],
    entityType: "board" | "task",
  ) => { success: boolean; data?: TaskSchema; error?: string };
  task?: TaskSummary;
  columnId?: string;
  existingTasks: { id: string; title: string }[];
  modalId: string;
};

export function useTaskFormAction({
  formMode,
  validateBeforeSubmit,
  task,
  columnId,
  existingTasks,
  modalId,
}: UseTaskFormAction) {
  const isEditMode = formMode === "edit";

  const { addTask, updateTask, updateTaskId, rollback } = useTaskStore(
    useShallow((state) => ({
      addTask: state.addTask,
      updateTask: state.updateTask,
      updateTaskId: state.updateTaskId,
      rollback: state.rollback,
    })),
  );
  const closeModal = useModalStore((state) => state.closeModal);
  const { isLoading, setIsLoading } = useLoadingStore(
    useShallow((state) => ({
      isLoading:
        state.isLoading("task", "creating") ||
        state.isLoading("task", "updating"),
      setIsLoading: state.setIsLoading,
    })),
  );

  const handleFormAction = async (formData: FormData) => {
    // Get columnId from formData if not provided as prop (when creating from board header)
    const formColumnId = formData.get("columnId") as string;
    const finalColumnId = columnId || formColumnId;

    if (!finalColumnId) {
      console.error("Column ID is required");
      return;
    }

    const { success, data: validatedData } = validateBeforeSubmit(
      formData,
      isEditMode,
      existingTasks,
      ["title", "description", "priority"],
      "task",
    );

    if (!success || !validatedData) return;

    const { title, description = "", priority = "medium" } = validatedData;

    const optimisticTask = {
      id: generateUUID(),
      columnId: finalColumnId,
      title,
      description,
      priority,
      order: 0,
      dueDate: null,
    };

    try {
      if (isEditMode && task) {
        setIsLoading("task", "updating", true, task.id);

        await delay(250);
        updateTask(task.id, { title, description, priority });
        closeModal("task", modalId);

        const result = await updateTaskAction(formData);
        if (!result.success) {
          handleOnError(result.message, "Failed to update task");
          rollback();
        }
      } else {
        setIsLoading("task", "creating", true, optimisticTask.id);

        await delay(300);
        addTask(finalColumnId, optimisticTask);
        closeModal("task", modalId);

        const res = await createTaskAction(formData);
        if (!res.success || !res.fields?.id) {
          handleOnError(res.message, "Failed to create task");
          rollback();
        } else {
          updateTaskId(optimisticTask.id, res.fields.id);
        }
      }
    } catch (error) {
      console.error("Error processing task:", error);
      handleOnError(
        error,
        isEditMode ? "Failed to update task" : "Failed to create task",
      );
      rollback();
    } finally {
      if (isEditMode && task) {
        setIsLoading("task", "updating", false, task.id);
      } else {
        setIsLoading("task", "creating", false, optimisticTask.id);
      }
    }
  };

  return { handleFormAction, isEditMode, isLoading };
}
