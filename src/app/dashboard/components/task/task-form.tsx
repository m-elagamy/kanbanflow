import { useShallow } from "zustand/react/shallow";
import type { FormMode, TaskSummary } from "@/lib/types";
import { taskSchema, type TaskSchema } from "@/schemas/task";
import { useTaskStore } from "@/stores/task";
import useForm from "@/hooks/use-form";
import GenericForm from "@/components/ui/generic-form";
import FormField from "@/components/ui/form-field";
import { useTaskFormAction } from "@/hooks/use-task-form-action";
import taskPriorities from "../../data/task-priorities";

type TaskFormProps = {
  formMode: FormMode;
  task?: TaskSummary;
  columnId: string;
  modalId: string;
};

type TaskSchemaWithId = TaskSchema & { id: string };

const TaskForm = ({ formMode, task, modalId, columnId }: TaskFormProps) => {
  const getColumnTasks = useTaskStore(
    useShallow((state) => state.getColumnTasks),
  );

  const columnTasks = getColumnTasks(columnId);

  const existingTasks = columnTasks.map((task) => {
    return {
      id: task.id,
      title: task.title,
    };
  });

  const {
    formValues: taskFormData,
    handleOnChange,
    formRef,
    errors,
    validateBeforeSubmit,
  } = useForm<TaskSchemaWithId, TaskSchema>(
    {
      id: task?.id ?? "",
      title: task?.title ?? "",
      description: task?.description ?? "",
      priority: task?.priority ?? "medium",
    },
    taskSchema,
  );

  const { handleFormAction, isEditMode, isLoading } = useTaskFormAction({
    task,
    existingTasks,
    formMode,
    columnId,
    modalId,
    validateBeforeSubmit,
  });

  return (
    <GenericForm
      formRef={formRef}
      onAction={handleFormAction}
      errors={errors}
      formMode={formMode}
      isLoading={isLoading}
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
      {isEditMode && (
        <FormField type="hidden" name="taskId" defaultValue={task?.id} />
      )}

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
