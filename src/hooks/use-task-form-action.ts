import { useShallow } from "zustand/react/shallow";
import { createTaskAction, updateTaskAction } from "@/actions/task";
import type { FormMode, TaskSummary } from "@/lib/types";
import type { TaskSchema } from "@/schemas/task";
import { useModalStore } from "@/stores/modal";
import { useTaskStore } from "@/stores/task";
import generateUUID from "@/utils/generate-UUID";
import useLoadingStore from "@/stores/loading";
import delay from "@/utils/delay";

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
  columnId: string;
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

  const { addTask, updateTask, deleteTask, updateTaskId } = useTaskStore(
    useShallow((state) => ({
      addTask: state.addTask,
      updateTask: state.updateTask,
      deleteTask: state.deleteTask,
      updateTaskId: state.updateTaskId,
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
      columnId,
      title,
      description,
      priority,
      order: 0,
    };

    try {
      if (isEditMode && task) {
        setIsLoading("task", "updating", true, task.id);

        await delay(250);
        updateTask(task.id, { title, description, priority });
        closeModal("task", modalId);
        await updateTaskAction(formData);
      } else {
        setIsLoading("task", "creating", true, optimisticTask.id);

        await delay(300);
        addTask(columnId, optimisticTask);
        closeModal("task", modalId);
        const res = await createTaskAction(formData);
        updateTaskId(optimisticTask.id, res.fields?.id || "");
      }
    } catch (error) {
      console.error("Error processing task:", error);
      if (isEditMode && task) {
        updateTask(task.id, task);
      } else {
        deleteTask(columnId, optimisticTask.id);
      }
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
