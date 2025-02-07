import type { BoardFormSchema } from "@/schemas/board";
import type { TaskSchema } from "@/schemas/task";

export type BoardActionState = Partial<{
  boardId: string;
  boardSlug: string;
  success: boolean;
  message: string;
  fields?: Partial<BoardFormSchema>;
  isUpdating: boolean;
}>;

export type TaskActionState = {
  success: boolean;
  message: string;
  taskId: string;
  columnId: string;
  fields?: Partial<TaskSchema>;
  boardSlug?: string;
  isUpdating?: boolean;
};

export type formOperationMode = "create" | "edit";

export type ModalType = "task" | "board";

export type ActionResult<T> = { success: boolean; message: string; data?: T };

export type ButtonVariants =
  | "default"
  | "link"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | null
  | undefined;

export type FormErrors<T> = {
  clientErrors: Partial<Record<keyof T, string>>;
  serverError: string;
};
