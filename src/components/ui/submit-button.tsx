import { Loader } from "lucide-react";
import type { FormMode } from "@/lib/types";
import { DialogClose } from "./dialog";
import AnimatedButton from "./animated-button";

type SubmitButtonProps = {
  isFormInvalid?: boolean;
  isPending?: boolean;
  formMode?: FormMode;
};

export default function SubmitButton({
  isFormInvalid,
  isPending,
  formMode,
}: Readonly<SubmitButtonProps>) {
  const isDisabled = isFormInvalid || isPending;
  const isEditMode = formMode === "edit";

  return (
    <div className="flex items-center justify-end gap-2 pt-2">
      <DialogClose asChild>
        <AnimatedButton
          type="button"
          size="sm"
          variant="outline"
          className="dark:hover:bg-accent/15"
          title="Close"
        >
          Close
        </AnimatedButton>
      </DialogClose>

      <AnimatedButton
        size="sm"
        type="submit"
        title={!isEditMode ? "Create" : "Save"}
        disabled={isDisabled}
      >
        {isPending && <Loader className="animate-spin" aria-hidden />}
        {!isEditMode ? "Create" : "Save"}
      </AnimatedButton>
    </div>
  );
}
