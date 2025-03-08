import { useShallow } from "zustand/react/shallow";
import type { FormMode } from "@/lib/types";
import taskPriorities from "../../data/task-priorities";
import { taskSchema, type TaskSchema } from "@/schemas/task";
import type { Task } from "@prisma/client";
import { createTaskAction, updateTaskAction } from "@/actions/task";
import { useTaskStore } from "@/stores/task";
import generateUUID from "@/utils/generate-UUID";
import { useModalStore } from "@/stores/modal";
import useForm from "@/hooks/use-form";
import { pick } from "@/utils/object";
import GenericForm from "@/components/ui/generic-form";
import handleOnError from "@/utils/handle-on-error";
import FormField from "@/components/ui/form-field";

type TaskFormProps = {
  formMode: FormMode;
  task?: Pick<Task, "id" | "title" | "description" | "priority">;
  columnId: string;
  modalId: string;
};

const TaskForm = ({ formMode, task, modalId, columnId }: TaskFormProps) => {
  const isEditMode = formMode === "edit";

  const { addTask, updateTask, deleteTask, updateTaskId, getColumnTasks } =
    useTaskStore(
      useShallow((state) => ({
        addTask: state.addTask,
        updateTask: state.updateTask,
        deleteTask: state.deleteTask,
        updateTaskId: state.updateTaskId,
        getColumnTasks: state.getColumnTasks,
      })),
    );
  const closeModal = useModalStore((state) => state.closeModal);

  const {
    formValues: taskFormData,
    handleOnChange,
    formRef,
    errors,
    validateBeforeSubmit,
  } = useForm<TaskSchema>(
    {
      title: task?.title ?? "",
      description: task?.description ?? "",
      priority: task?.priority ?? "medium",
    },
    taskSchema,
  );

  const columnTasks = getColumnTasks(columnId);

  const existingTasks = columnTasks.map((task) => {
    return {
      id: task.id,
      title: task.title,
    };
  });

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
        updateTask(
          task?.id,
          pick(optimisticTask, ["title", "description", "priority"]),
        );
        closeModal("task", modalId);

        await updateTaskAction(formData);
      } else {
        addTask(columnId, optimisticTask);
        closeModal("task", modalId);

        const res = await createTaskAction(formData);

        updateTaskId(optimisticTask.id, res.fields?.id ?? "");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      if (isEditMode && task) updateTask(task.id, task);
      deleteTask(columnId, optimisticTask.id);
      handleOnError(error, "Failed to process your request.");
    }
  };

  return (
    <GenericForm
      formRef={formRef}
      onAction={handleFormAction}
      errors={errors}
      formMode={formMode}
    >
      <FormField
        type="text"
        name="title"
        label="What's the task?"
        defaultValue={taskFormData.title}
        onChange={(value) => handleOnChange("title", value)}
        error={errors?.title}
        required
        placeholder="e.g., Create a stunning new landing page"
      />

      <FormField type="hidden" name="columnId" defaultValue={columnId} />
      <FormField type="hidden" name="taskId" defaultValue={task?.id} />

      <FormField
        type="textarea"
        name="description"
        label="What needs to be done?"
        defaultValue={taskFormData.description}
        onChange={(value) => handleOnChange("description", value)}
        placeholder="e.g., Design a modern, mobile-friendly layout for the homepage"
      />

      <FormField
        type="select"
        name="priority"
        label="How urgent is this?"
        defaultValue={taskFormData.priority}
        onChange={(value) => handleOnChange("priority", value)}
        options={taskPriorities}
        helperText="Select a priority level to manage urgency."
        placeholder="Select a Priority"
      />
    </GenericForm>
  );
};

export default TaskForm;
