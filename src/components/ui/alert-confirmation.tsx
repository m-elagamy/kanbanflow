import { Loader } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogOverlay,
  AlertDialogPortal,
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
      <AlertDialogPortal>
        <AlertDialogOverlay>
          <AlertDialogContent className="max-w-sm p-4">
            <AlertDialogHeader className="gap-1">
              <AlertDialogTitle>{title}?</AlertDialogTitle>
              <AlertDialogDescription>{description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="justify-center">
              <AlertDialogCancel className="h-8 px-2">
                {cancelLabel}
              </AlertDialogCancel>
              <Button
                className="px-2"
                size="sm"
                variant="destructive"
                disabled={isPending}
                onClick={onClick}
              >
                {isPending ? (
                  <>
                    <Loader className="animate-spin" aria-hidden /> Deleting...
                  </>
                ) : (
                  confirmLabel
                )}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialogPortal>
    </AlertDialog>
  );
};

export default AlertConfirmation;
