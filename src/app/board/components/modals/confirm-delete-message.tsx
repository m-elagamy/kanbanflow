import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useBoardStore from "@/store/useBoardStore";

type ConfirmDeleteMessageProps = {
  shouldShowDeleteDialog: boolean;
  setShouldShowDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  columnId: string;
};

export default function ConfirmDeleteMessage({
  shouldShowDeleteDialog,
  setShouldShowDeleteDialog,
  columnId,
}: ConfirmDeleteMessageProps) {
  const { currentBoardId, deleteColumn } = useBoardStore();

  const handleDeleteColumn = () => {
    deleteColumn(currentBoardId as string, columnId);
  };

  return (
    <AlertDialog
      open={shouldShowDeleteDialog}
      onOpenChange={setShouldShowDeleteDialog}
    >
      <AlertDialogContent className="max-w-96 rounded-lg p-4">
        <AlertDialogHeader className="items-center">
          <AlertDialogTitle>
            <Trash2 className="mx-auto text-red-500" />
            Delete this column?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            This action will permanently remove the column and all its tasks.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="justify-center">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteColumn}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
