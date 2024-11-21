import { z } from "zod";

const AddTaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(50),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  tags: z.string().optional(),
});

export default AddTaskSchema;
