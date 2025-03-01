import { Loader } from "lucide-react";
import type { FormMode } from "@/lib/types";
import { Button } from "./button";
import { DialogClose } from "./dialog";

type SubmitButtonProps = {
  isFormInvalid?: boolean;
  isPending?: boolean;
  formMode: FormMode;
};

export default function SubmitButton({
  isFormInvalid,
  isPending,
  formMode,
}: Readonly<SubmitButtonProps>) {
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
        {formMode === "create" ? "Create" : "Save"}
      </Button>
    </div>
  );
}
