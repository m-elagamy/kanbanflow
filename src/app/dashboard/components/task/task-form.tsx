import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ErrorMessage from "@/components/ui/error-message";
import FormActions from "@/components/ui/form-actions";
import RequiredFieldSymbol from "@/components/ui/required-field-symbol";
import useTaskAction from "@/hooks/use-task-action";
import type { formOperationMode, TaskActionState } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import getBadgeStyle from "../../utils/get-badge-style";
import taskPriorities from "../../data/task-priorities";

type TaskFormProps = {
  formOperationMode: formOperationMode;
  initialState: TaskActionState;
  modalId: string;
  boardSlug?: string;
};

const TaskForm = ({
  formOperationMode,
  initialState,
  modalId,
  boardSlug,
}: TaskFormProps) => {
  const isEditMode = formOperationMode === "edit";

  const {
    handleAction,
    state,
    isPending,
    taskFormData,
    errors,
    isFormInvalid,
    formRef,
    handleFieldChange,
  } = useTaskAction({
    initialState,
    isEditMode,
    modalId,
  });

  return (
    <form ref={formRef} action={handleAction} className="space-y-4">
      {errors.serverErrors.generic && (
        <ErrorMessage id="server-error" className="justify-center">
          {errors.serverErrors.generic}
        </ErrorMessage>
      )}

      <section className="space-y-2">
        <Label
          className={`${errors.clientErrors.title || errors.serverErrors.specific ? "text-destructive" : ""}`}
        >
          What&apos;s the task? <RequiredFieldSymbol />
        </Label>
        <Input
          type="hidden"
          name="columnId"
          value={initialState.columnId ?? ""}
        />
        <Input type="hidden" name="boardSlug" value={boardSlug ?? ""} />

        {isEditMode && (
          <Input
            type="hidden"
            name="taskId"
            value={initialState.taskId ?? ""}
          />
        )}

        <Input
          name="title"
          placeholder="e.g., Create a stunning new landing page"
          defaultValue={taskFormData.title || state.fields?.title}
          onChange={(e) => handleFieldChange("title", e.target.value)}
          aria-invalid={
            !!errors.clientErrors.title || !!errors.serverErrors.specific
          }
          aria-describedby="title-error"
          aria-required
        />
        {(errors.clientErrors.title || errors.serverErrors.specific) && (
          <ErrorMessage id="title-error">
            {errors.clientErrors.title || errors.serverErrors.specific}
          </ErrorMessage>
        )}
      </section>

      <section className="space-y-2">
        <Label>What needs to be done?</Label>
        <Textarea
          name="description"
          placeholder="e.g., Design a modern, mobile-friendly layout for the homepage"
          className="resize-none"
          defaultValue={
            (taskFormData.description || state.fields?.description) ?? ""
          }
          onChange={(e) => handleFieldChange("description", e.target.value)}
        />
      </section>

      <section className="space-y-2">
        <Label htmlFor="priority">How urgent is this?</Label>
        <Select
          name="priority"
          defaultValue={taskFormData.priority || state.fields?.priority}
          onValueChange={(value) => handleFieldChange("priority", value)}
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
      </section>

      <FormActions
        isFormInvalid={isFormInvalid}
        isPending={isPending}
        formOperationMode={formOperationMode}
      />
    </form>
  );
};

export default TaskForm;
