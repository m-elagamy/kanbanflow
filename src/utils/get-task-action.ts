import { createTaskAction, updateTaskAction } from "@/actions/task";
import type { Mode } from "@/lib/types";
import type {
  CreateTaskActionState,
  EditTaskActionState,
} from "@/lib/types/task";

type TaskActionState = CreateTaskActionState | EditTaskActionState;

const getTaskAction = (mode: Mode) => {
  return (
    state: TaskActionState,
    formData: FormData,
  ): Promise<TaskActionState> => {
    if (mode === "create") {
      return createTaskAction(state as CreateTaskActionState, formData);
    } else {
      return updateTaskAction(state as EditTaskActionState, formData);
    }
  };
};

export default getTaskAction;
