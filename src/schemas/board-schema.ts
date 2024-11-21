import { z } from "zod";

const boardSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Board name must be at least 3 characters" })
    .max(50, { message: "Board name must be less than 50 characters" }),
  description: z.string().optional(),
});

export default boardSchema;
