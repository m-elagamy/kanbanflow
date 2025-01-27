import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import getBadgeStyle from "../../utils/get-badge-style";
import taskPriorities from "../../data/task-priorities";
import { Label } from "@/components/ui/label";
import { useTaskAction } from "@/hooks/use-task-action";
import type { ActionMode } from "@/lib/types";
import type {
  CreateTaskActionState,
  EditTaskActionState,
} from "@/lib/types/task";
import RequiredFieldSymbol from "@/components/ui/required-field-symbol";
import ErrorMessage from "@/components/ui/error-message";
import FormActions from "@/components/ui/form-actions";

type TaskFormProps = {
  mode: ActionMode;
  initialState: CreateTaskActionState | EditTaskActionState;
  modalId: string;
};

const TaskForm = ({ mode, initialState, modalId }: TaskFormProps) => {
  const {
    serverState,
    serverError,
    isPending,
    titleRef,
    clearFieldValidationError,
    fieldErrors,
    handleServerAction,
    formValues,
  } = useTaskAction({
    initialState,
    actionMode: mode,
    modalId,
  });

  return (
    <form action={handleServerAction} className="space-y-4">
      <section className="space-y-2">
        <Label
          className={`${fieldErrors?.title || (serverError && !fieldErrors && !serverState.success) ? "text-destructive" : ""}`}
        >
          What&apos;s the task? <RequiredFieldSymbol />
        </Label>
        <Input
          type="hidden"
          name="columnId"
          value={initialState.fields?.columnId ?? ""}
        />

        {mode === "edit" && (
          <Input
            type="hidden"
            name="taskId"
            value={initialState.fields?.taskId ?? ""}
          />
        )}

        <Input
          ref={titleRef}
          name="title"
          placeholder="e.g., Create a stunning new landing page"
          defaultValue={
            (formValues.title as string) || serverState.fields?.title
          }
          onChange={() => clearFieldValidationError("title")}
          aria-required
        />
        {fieldErrors?.title || serverError ? (
          <ErrorMessage id="title-error">
            {fieldErrors?.title?._errors?.at(0) ?? serverError}
          </ErrorMessage>
        ) : null}
      </section>

      <section className="space-y-2">
        <Label>What needs to be done?</Label>
        <Textarea
          name="description"
          placeholder="e.g., Design a modern, mobile-friendly layout for the homepage"
          className="resize-none"
          defaultValue={
            (formValues.description as string) ||
            serverState.fields?.description
          }
        />
      </section>

      <section className="space-y-2">
        <Label>How urgent is this?</Label>
        <Select
          name="priority"
          defaultValue={
            (formValues.priority as string) || serverState.fields?.priority
          }
        >
          <SelectTrigger className="*:max-w-[120px]">
            <SelectValue placeholder="Select a template" />
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

      <FormActions isPending={isPending} mode={mode} />
    </form>
  );
};

export default TaskForm;
