import { Loader } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "./button";

type AlertConfirmationProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  formAction: (payload: FormData) => void;
  isPending: boolean;
  columnId?: string;
  boardId?: string;
  boardSlug?: string;
  columnConfirmation?: boolean;
};

const AlertConfirmation = ({
  open,
  setOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  formAction,
  isPending,
  columnId,
  boardId,
  boardSlug,
  columnConfirmation,
}: AlertConfirmationProps) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="p-4">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}?</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="justify-center">
          <AlertDialogCancel className="px-2">{cancelLabel}</AlertDialogCancel>
          <form action={formAction}>
            <input
              type="hidden"
              name={columnConfirmation ? "columnId" : "boardId"}
              value={columnId ?? boardId}
            />
            {columnConfirmation && (
              <input type="hidden" name="boardSlug" value={boardSlug} />
            )}
            <Button
              className="w-full gap-1 bg-destructive px-2 text-destructive-foreground hover:bg-destructive/90"
              disabled={isPending}
            >
              {isPending && <Loader className="animate-spin" aria-hidden />}
              {confirmLabel}
            </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertConfirmation;
