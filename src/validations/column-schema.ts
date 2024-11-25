import { z } from "zod";

const columnFormSchema = z.object({
  state: z.enum([
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
  ]),
});

export default columnFormSchema;
