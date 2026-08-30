import { z } from "zod";

const columnStatusSchema = z.object({
  status: z.enum([
    "To Do",
    "In Progress",
    "Done",
    "Blocked",
    "On Hold",
    "Testing",
    "Under Review",
    "Cancelled",
    "Backlog",
    "Ready for Development",
    "Deployed",
    "Ready for Review",
  ]),
});

export type ColumnStatus = z.infer<typeof columnStatusSchema.shape.status>;

export const columnPositionSchema = z.object({
  boardId: z.string().min(1),
  newColumnOrder: z.array(z.string().min(1)).min(1),
});

export type ColumnPositionSchema = z.infer<typeof columnPositionSchema>;

export default columnStatusSchema;
