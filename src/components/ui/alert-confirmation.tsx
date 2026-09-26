import { Loader, Trash2 } from "lucide-react";
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
  onClick: () => void;
  isPending?: boolean;
};

const AlertConfirmation = ({
  open,
  setOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onClick,
  isPending,
}: AlertConfirmationProps) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-sm gap-5 p-5">
        <AlertDialogHeader className="gap-3 text-left sm:text-left">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <Trash2 className="size-5" aria-hidden="true" />
            </div>
            <div className="space-y-1.5">
              <AlertDialogTitle>{title}?</AlertDialogTitle>
              <AlertDialogDescription>{description}</AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:justify-end">
          <AlertDialogCancel className="mt-0 h-9 px-4">
            {cancelLabel}
          </AlertDialogCancel>
          <Button
            className="h-9 px-4"
            size="sm"
            variant="destructive"
            disabled={isPending}
            onClick={onClick}
          >
            {isPending ? (
              <>
                <Loader className="size-4 animate-spin" aria-hidden />
                Deleting...
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertConfirmation;
