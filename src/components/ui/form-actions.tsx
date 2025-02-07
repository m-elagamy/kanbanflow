import { Loader } from "lucide-react";
import type { formOperationMode } from "@/lib/types";
import { Button } from "./button";
import { DialogClose } from "./dialog";

type FormActionsProps = {
  isFormInvalid?: boolean;
  isPending: boolean;
  formOperationMode: formOperationMode;
};

export default function FormActions({
  isFormInvalid,
  isPending,
  formOperationMode,
}: Readonly<FormActionsProps>) {
  return (
    <div className="flex items-center justify-end gap-2">
      <DialogClose asChild>
        <Button type="button" className="px-2" variant="outline">
          Close
        </Button>
      </DialogClose>
      <Button
        type="submit"
        className="!mt-0 px-2"
        disabled={isFormInvalid || isPending}
      >
        {isPending && <Loader className="animate-spin" aria-hidden />}
        {formOperationMode === "create" ? "Create" : "Save"}
      </Button>
    </div>
  );
}
