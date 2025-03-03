import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
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
  onClick: () => void;
  isPending?: boolean;
  triggerSource?: "board" | "column";
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
  triggerSource = "board",
}: AlertConfirmationProps) => {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (open && triggerSource === "board" && params?.board) {
      router.prefetch("/dashboard");
    }
  }, [open, params.board, triggerSource, router]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="p-4">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}?</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
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
