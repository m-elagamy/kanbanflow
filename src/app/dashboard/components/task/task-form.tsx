import { RefObject, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import type { FormMode, ClientTask } from "@/lib/types";
import { taskSchema, type TaskSchema } from "@/schemas/task";
import { useColumnStore } from "@/stores/column";
import useForm from "@/hooks/use-form";
import GenericForm from "@/components/ui/generic-form";
import FormField from "@/components/ui/form-field";
import { useTaskFormAction } from "@/hooks/use-task-form-action";
import taskPriorities from "../../data/task-priorities";
import columnStatusOptions from "../../data/column-status-options";

type TaskFormProps = {
  formMode: FormMode;
  task?: ClientTask;
  columnId?: string;
  boardId?: string;
  onClose: () => void;
};

type TaskSchemaWithId = TaskSchema & { id: string };

const TaskForm = ({
  formMode,
  task,
  onClose,
  columnId,
  boardId,
}: TaskFormProps) => {
  const columns = useColumnStore(
    useShallow((state) => {
      if (!boardId) return {};
      return state.columnsByBoard[boardId] || {};
    }),
  );

  const sortedColumns = useMemo(() => {
    return Object.values(columns).sort((a, b) => a.order - b.order);
  }, [columns]);

  const columnOptions = useMemo(() => {
    return sortedColumns.map((column) => {
      const statusOption =
        columnStatusOptions[
          column.status as keyof typeof columnStatusOptions
        ];

      return {
        id: column.id,
        label: column.status,
        icon: statusOption?.icon,
        iconColor: statusOption?.color,
      };
    });
  }, [sortedColumns]);

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
      columnId: columnId ?? sortedColumns[0]?.id ?? "",
    },
    taskSchema,
  );

  const { handleFormAction, isEditMode, isLoading } = useTaskFormAction({
    task,
    formMode,
    columnId,
    onClose,
    validateBeforeSubmit,
  });

  const showColumnSelector = !columnId && boardId;

  return (
    <GenericForm
      formRef={formRef as RefObject<HTMLFormElement>}
      onAction={handleFormAction}
      errors={errors}
      formMode={formMode}
      isLoading={isLoading}
      hasAvailableStatuses={!showColumnSelector || columnOptions.length > 0}
    >
      <FormField
        type="text"
        name="title"
        label="What's the task?"
        defaultValue={taskFormData.title}
        onChange={(value) => handleOnChange("title", value)}
        error={errors?.title}
        required
        maxLength={50}
        placeholder="e.g., Create a stunning new landing page"
      />

      {showColumnSelector ? (
        <FormField
          type="select"
          name="columnId"
          label="Which column?"
          defaultValue={taskFormData.columnId || columnOptions[0]?.id || ""}
          onChange={(value) => handleOnChange("columnId", value)}
          options={columnOptions}
          error={errors?.columnId}
          placeholder="Select a column"
        />
      ) : (
        columnId && (
          <FormField type="hidden" name="columnId" defaultValue={columnId} />
        )
      )}

      {isEditMode && (
        <FormField type="hidden" name="taskId" defaultValue={task?.id} />
      )}

      <FormField
        type="textarea"
        name="description"
        label="What needs to be done?"
        defaultValue={taskFormData.description}
        onChange={(value) => handleOnChange("description", value)}
        error={errors?.description}
        placeholder="e.g., Design a modern, mobile-friendly layout for the homepage"
        maxLength={2000}
      />

      <FormField
        type="select"
        name="priority"
        label="Priority"
        defaultValue={taskFormData.priority}
        onChange={(value) => handleOnChange("priority", value)}
        error={errors?.priority}
        options={taskPriorities}
        placeholder="Select priority"
      />

    </GenericForm>
  );
};

export default TaskForm;
