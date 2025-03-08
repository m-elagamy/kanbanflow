import { useShallow } from "zustand/react/shallow";
import { createTaskAction, updateTaskAction } from "@/actions/task";
import type { FormMode, TaskSummary } from "@/lib/types";
import type { TaskSchema } from "@/schemas/task";
import { useModalStore } from "@/stores/modal";
import { useTaskStore } from "@/stores/task";
import generateUUID from "@/utils/generate-UUID";

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
      title,
      description,
      priority,
      order: 0,
    };

    try {
      if (isEditMode && task) {
        updateTask(task.id, { title, description, priority });
        closeModal("task", modalId);
        await updateTaskAction(formData);
      } else {
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
    }
  };

  return { handleFormAction, isEditMode };
}
