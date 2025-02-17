import { z } from "zod";

const columnStatusSchema = z.object({
  status: z.enum([
    "To_Do",
    "In_Progress",
    "Done",
    "Blocked",
    "On_Hold",
    "Testing",
    "Under_Review",
    "Cancelled",
    "Backlog",
    "Ready_For_Development",
    "Deployed",
    "Ready_For_Review",
  ]),
});

export default columnStatusSchema;
