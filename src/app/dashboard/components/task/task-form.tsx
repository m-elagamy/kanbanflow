import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ErrorMessage from "@/components/ui/error-message";
import RequiredFieldSymbol from "@/components/ui/required-field-symbol";
import type { FormMode } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import getBadgeStyle from "../../utils/get-badge-style";
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
import HelperText from "@/components/ui/helper-text";

type TaskFormProps = {
  formMode: FormMode;
  task?: Pick<Task, "id" | "title" | "description" | "priority">;
  columnId: string;
  modalId: string;
};

type TaskFormValues = TaskSchema & { id: string };

const TaskForm = ({ formMode, task, modalId, columnId }: TaskFormProps) => {
  const isEditMode = formMode === "edit";

  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const updateTaskId = useTaskStore((state) => state.updateTaskId);
  const closeModal = useModalStore((state) => state.closeModal);

  const {
    formValues: taskFormData,
    handleOnChange,
    formRef,
    errors,
    validateBeforeSubmit,
  } = useForm<TaskFormValues>(
    {
      id: task?.id ?? "",
      title: task?.title ?? "",
      description: task?.description ?? "",
      priority: task?.priority ?? "medium",
    },
    taskSchema,
  );

  const existingTasks = Object.values(tasks).flatMap((tasksArray) =>
    tasksArray.map(({ id, title }) => ({ id, title })),
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
        updateTask(
          columnId,
          task?.id,
          pick(optimisticTask, ["title", "description", "priority"]),
        );
        closeModal("task", modalId);

        await updateTaskAction(formData);
      } else {
        addTask(columnId, optimisticTask);
        closeModal("task", modalId);

        const res = await createTaskAction(formData);

        updateTaskId(columnId, optimisticTask.id, res.fields?.id ?? "");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      if (isEditMode && task) updateTask(columnId, task.id, task);
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
      <section className="space-y-2">
        <Label className={`${errors?.title ? "text-destructive" : ""}`}>
          What&apos;s the task? <RequiredFieldSymbol />
        </Label>
        <Input type="hidden" name="columnId" value={columnId ?? ""} />

        {isEditMode && <Input type="hidden" name="taskId" value={task?.id} />}

        <Input
          name="title"
          placeholder="e.g., Create a stunning new landing page"
          defaultValue={taskFormData.title}
          onChange={(e) => handleOnChange("title", e.target.value)}
          aria-invalid={!!errors?.title}
          aria-describedby="title-error"
          aria-required
        />
        {errors?.title && (
          <ErrorMessage id="title-error">{errors?.title}</ErrorMessage>
        )}
      </section>

      <section className="space-y-2">
        <Label>What needs to be done?</Label>
        <Textarea
          name="description"
          placeholder="e.g., Design a modern, mobile-friendly layout for the homepage"
          className="resize-none"
          defaultValue={taskFormData.description}
          onChange={(e) => handleOnChange("description", e.target.value)}
        />
      </section>

      <section className="space-y-2">
        <Label htmlFor="priority">How urgent is this?</Label>
        <Select
          defaultValue="medium"
          name="priority"
          onValueChange={(value) => handleOnChange("priority", value)}
        >
          <SelectTrigger id="priority" className="*:max-w-[120px]">
            <SelectValue placeholder="Select a Priority" />
          </SelectTrigger>
          <SelectContent>
            {taskPriorities.map((priority) => (
              <SelectItem key={priority} value={priority}>
                <div className="flex items-center">
                  <span
                    className={`mr-2 h-2 w-2 rounded-full ${getBadgeStyle(
                      priority,
                    )}`}
                  ></span>
                  <h2 className="text-xs font-semibold capitalize md:text-sm">
                    {priority}
                  </h2>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <HelperText>Select a priority level to manage urgency.</HelperText>
      </section>
    </GenericForm>
  );
};

export default TaskForm;
