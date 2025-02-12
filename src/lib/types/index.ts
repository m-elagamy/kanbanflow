import type { BoardFormSchema } from "@/schemas/board";
import type { TaskSchema } from "@/schemas/task";

export type BoardActionState = Partial<{
  boardId: string;
  boardSlug: string;
  success: boolean;
  message: string;
  fields?: Partial<BoardFormSchema>;
}>;

export type TaskActionState = {
  success: boolean;
  message: string;
  taskId: string;
  columnId: string;
  fields?: Partial<TaskSchema>;
  boardSlug?: string;
};

export type formOperationMode = "create" | "edit";

export type ServerActionResult<T> = {
  success: boolean;
  message: string;
  fields?: T;
};

export type ButtonVariants =
  | "default"
  | "link"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | null
  | undefined;

export type ServerErrors = {
  specific: string | null;
  generic: string | null;
};

export type FormErrors<T> = {
  clientErrors: Partial<Record<keyof T, string>>;
  serverErrors: ServerErrors;
};

export type ActionStateResponse = {
  success?: boolean;
  message?: string;
};
