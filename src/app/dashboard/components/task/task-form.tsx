import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import getBadgeStyle from "../../utils/get-badge-style";
import taskPriorities from "../../data/task-priorities";
import { Label } from "@/components/ui/label";
import useTaskAction from "@/hooks/use-task-action";
import type { formOperationMode } from "@/lib/types";
import RequiredFieldSymbol from "@/components/ui/required-field-symbol";
import ErrorMessage from "@/components/ui/error-message";
import FormActions from "@/components/ui/form-actions";
import type { TaskActionState } from "@/lib/types/task";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    clearError,
    isFormInvalid,
    inputRef,
  } = useTaskAction({
    initialState,
    isEditMode,
    modalId,
  });

  return (
    <form action={handleAction} className="space-y-4">
      <section className="space-y-2">
        <Label
          className={`${errors.clientErrors.title || errors.serverError ? "text-destructive" : ""}`}
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
          ref={inputRef}
          name="title"
          placeholder="e.g., Create a stunning new landing page"
          defaultValue={taskFormData.title || state.data?.title}
          onChange={() => clearError("title")}
          aria-invalid={!!errors}
          aria-describedby="title-error"
          aria-required
        />
        {(errors.clientErrors.title || errors.serverError) && (
          <ErrorMessage id="title-error">
            {errors.clientErrors.title || errors.serverError}
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
            (taskFormData.description || state.data?.description) ?? ""
          }
        />
      </section>

      <section className="space-y-2">
        <Label>How urgent is this?</Label>
        <Select
          name="priority"
          defaultValue={taskFormData.priority || state.data?.priority}
        >
          <SelectTrigger className="*:max-w-[120px]">
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
