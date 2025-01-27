import { addTaskSchema } from "@/schemas/task";
import getTaskAction from "@/utils/get-task-action";
import type {
  CreateTaskActionState,
  EditTaskActionState,
} from "@/lib/types/task";
import { useAction } from "./use-action";
import type { ActionMode } from "@/lib/types";

type UseTaskAction = {
  initialState: CreateTaskActionState | EditTaskActionState;
  actionMode: ActionMode;
  modalId: string;
};

export function useTaskAction({
  initialState,
  actionMode,
  modalId,
}: UseTaskAction) {
  return useAction({
    initialState,
    actionMode,
    getAction: getTaskAction,
    schema: addTaskSchema,
    fields: ["title"],
    modalType: "task",
    modalId,
  });
}
