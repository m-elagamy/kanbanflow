import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import getBadgeStyle from "../../utils/get-badge-style";
import taskPriorities from "../../data/task-priorities";
import { Task } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { useTaskAction } from "@/hooks/use-task-action";
import type { Mode } from "@/lib/types";
import type {
  CreateTaskActionState,
  EditTaskActionState,
} from "@/lib/types/task";
import RequiredFieldSymbol from "@/components/ui/required-field-symbol";
import ErrorMessage from "@/components/ui/error-message";
import { Loader } from "lucide-react";

type TaskFormProps = {
  setIsModalOpen?: (isOpen: boolean) => void;
  taskToEdit?: Task | null;
  setCloseDropdown?: (isOpen: boolean) => void;
  mode: Mode;
  initialState: CreateTaskActionState | EditTaskActionState;
};

const TaskForm = ({
  setIsModalOpen,
  taskToEdit,
  setCloseDropdown,
  mode,
  initialState,
}: TaskFormProps) => {
  const {
    state,
    formAction,
    isPending,
    validationErrors,
    errorMessage,
    clearError,
    titleRef,
  } = useTaskAction({
    initialState,
    mode,
  });

  return (
    <form action={formAction} className="space-y-4">
      <section className="space-y-2">
        <Label
          className={`${validationErrors?.title || (errorMessage && !validationErrors && !state.success) ? "text-destructive" : ""}`}
        >
          What&apos;s the task? <RequiredFieldSymbol />
        </Label>
        <Input
          type="hidden"
          name="columnId"
          value={state.fields?.columnId ?? ""}
        />
        {mode === "edit" && (
          <Input
            type="hidden"
            name="taskId"
            value={state.fields?.taskId ?? ""}
          />
        )}
        <Input
          ref={titleRef}
          name="title"
          placeholder="e.g., Create a stunning new landing page"
          defaultValue={state.fields?.title ?? ""}
          onChange={() => clearError("title")}
          aria-invalid={
            !!validationErrors?.title || !!(errorMessage && !validationErrors)
          }
          aria-describedby="title-error"
          aria-required
        />
        {validationErrors?.title ||
        (errorMessage && !validationErrors && !state.success) ? (
          <ErrorMessage id="title-error">
            {validationErrors?.title?._errors?.at(0) ?? errorMessage}
          </ErrorMessage>
        ) : null}
      </section>

      <section className="space-y-2">
        <Label>What needs to be done?</Label>
        <Textarea
          name="description"
          placeholder="e.g., Design a modern, mobile-friendly layout for the homepage"
          className="resize-none"
          defaultValue={state.fields?.description ?? ""}
        />
      </section>

      <section className="space-y-2">
        <Label>How urgent is this?</Label>
        <Select name="priority" defaultValue={state.fields?.priority ?? ""}>
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

      <div className="!mt-6 flex items-center justify-end gap-2">
        <Button className="px-2" type="button" variant="ghost">
          Cancel
        </Button>
        <Button className="px-2" disabled={isPending}>
          {isPending && <Loader className="animate-spin" />}
          {mode === "edit" ? "Update" : "Add Task"}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
