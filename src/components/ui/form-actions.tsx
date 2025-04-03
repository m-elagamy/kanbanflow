import { Loader } from "lucide-react";
import type { FormMode } from "@/lib/types";
import { DialogClose } from "./dialog";
import AnimatedButton from "./animated-button";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility

type FormActionsProps = {
  isFormInvalid?: boolean;
  isPending?: boolean;
  formMode?: FormMode;
  className?: string;
};

export default function FormActions({
  isFormInvalid,
  isPending,
  formMode = "create",
  className,
}: Readonly<FormActionsProps>) {
  const isDisabled = isFormInvalid || isPending;
  const isEditMode = formMode === "edit";

  const actionText = !isEditMode ? "Create" : "Save";
  const actionTextPlural = !isEditMode ? "Creating..." : "Saving...";
  const buttonText = isPending ? actionTextPlural || actionText : actionText;

  return (
    <div className={cn("flex items-center justify-end gap-2 pt-2", className)}>
      <DialogClose asChild>
        <AnimatedButton
          type="button"
          variant="outline"
          className="dark:hover:bg-accent/15"
          title="Close"
          disabled={isPending}
        >
          Close
        </AnimatedButton>
      </DialogClose>

      <AnimatedButton
        type="submit"
        title={isPending ? `${actionText}ing...` : actionText}
        disabled={isDisabled}
        aria-busy={isPending}
      >
        {isPending && <Loader className="animate-spin" aria-hidden="true" />}
        {buttonText}
      </AnimatedButton>
    </div>
  );
}
