import type { z } from "zod";
import type boardSchema from "@/schemas/board-schema";

type FormData = z.infer<typeof boardSchema>;

export default FormData;
