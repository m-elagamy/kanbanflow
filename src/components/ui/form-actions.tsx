import { Loader } from "lucide-react";
import type { ActionMode } from "@/lib/types";
import { Button } from "./button";
import { DialogClose } from "./dialog";

export default function FormActions({
  isPending,
  mode,
}: {
  isPending: boolean;
  mode?: ActionMode;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <DialogClose asChild>
        <Button type="button" className="px-2" variant="outline">
          Close
        </Button>
      </DialogClose>
      <Button type="submit" className="!mt-0 px-2" disabled={isPending}>
        {isPending && <Loader className="animate-spin" aria-hidden />}
        {mode === "create" ? "Create" : "Save"}
      </Button>
    </div>
  );
}
