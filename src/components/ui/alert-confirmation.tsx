import dynamic from "next/dynamic";
import { Loader } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "./button";

const AlertDialogContent = dynamic(
  () =>
    import("@/components/ui/alert-dialog").then(
      (mod) => mod.AlertDialogContent,
    ),
  { loading: () => null },
);

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
      {/* TODO: Lazy load this component. */}
      {open && (
        <AlertDialogContent className="p-4">
          <AlertDialogHeader>
            <AlertDialogTitle>{title}?</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="justify-center">
            <AlertDialogCancel className="px-2">
              {cancelLabel}
            </AlertDialogCancel>
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
      )}
    </AlertDialog>
  );
};

export default AlertConfirmation;
