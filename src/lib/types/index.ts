import type { TaskSchema } from "@/schemas/task";
import type { Board, Column, Task } from "@prisma/client";

export type BoardActionState = {
  success: boolean;
  message: string;
  board?: Board & {
    columns: (Column & { tasks: Task[] })[];
  };
};

export type TaskActionState = {
  success: boolean;
  message: string;
  taskId: string;
  columnId: string;
  fields?: Partial<TaskSchema>;
  boardSlug?: string;
};

export type FormMode = "create" | "edit";

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

export type ActionStateResponse = {
  success?: boolean;
  message?: string;
};

export type Templates = "personal" | "agile" | "bug-tracking" | "custom";

export type FormErrors<T> = Partial<Record<keyof T, string>> & {
  generic?: string;
};

export type EntityType = "board" | "task" | "column";

export type Operation = "fetching" | "creating" | "updating" | "deleting";
