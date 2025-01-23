import { z } from "zod";

export const addTaskSchema = z.object({
  title: z.string().min(3, "Task name must be at least 3 characters").max(50),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export type AddTask = z.infer<typeof addTaskSchema>;
