import { z } from "zod";

const AddTaskSchema = z.object({
  title: z.string().min(3, "Task name must be at least 3 characters").max(50),
  description: z.string().optional(),
  priority: z.string().default("medium"),
  tags: z.string().optional(),
});

export default AddTaskSchema;
