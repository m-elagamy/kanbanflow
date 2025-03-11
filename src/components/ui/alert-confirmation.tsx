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
      <AlertDialogContent className="max-w-md p-4">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex flex-col items-center gap-1">
            <Trash2 size={20} />
            {title}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="justify-center">
          <AlertDialogCancel className="px-2">{cancelLabel}</AlertDialogCancel>
          <Button
            className="gap-1 bg-destructive px-2 text-destructive-foreground hover:bg-destructive/90"
            disabled={isPending}
            onClick={onClick}
          >
            {isPending && <Loader className="animate-spin" aria-hidden />}
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertConfirmation;
