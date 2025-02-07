import type { TaskSchema } from "@/schemas/task";
import type { Priority } from "@prisma/client";

export type Task = {
  id: string;
  columnId: string;
  order: number;
  title: string;
  description: string;
  priority: Priority;
  tag: string[];
};

export type TaskActionState = {
  success: boolean;
  message: string;
  taskId: string;
  columnId: string;
  fields?: Partial<TaskSchema>;
  boardSlug?: string;
  isUpdating?: boolean;
};
