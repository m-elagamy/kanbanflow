import { useState } from "react";
import { Ellipsis, Settings2, TrashIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
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
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TaskCreationModal from "./modals/task-creation";

type ColumnHeaderProps = {
  columnTitle: string;
  columnId: string;
  tasksCount: number;
  handleDeleteColumn: (id: string) => void;
};

export default function ColumnHeader({
  columnTitle,
  columnId,
  tasksCount,
  handleDeleteColumn,
}: ColumnHeaderProps) {
  const [shouldShowDeleteDialog, setShouldShowDeleteDialog] = useState(false);

  return (
    <>
      <CardHeader className="sticky top-0 flex-row items-center justify-between border-b bg-card/80 p-2 px-3 drop-shadow-sm backdrop-blur-sm">
        <CardTitle className="flex gap-2 text-sm">
          {columnTitle}
          {tasksCount > 0 && (
            <Badge variant="secondary" className="h-5">
              {tasksCount}
            </Badge>
          )}
        </CardTitle>

        <div className="flex items-center gap-1">
          {tasksCount >= 1 && <TaskCreationModal columnId={columnId} />}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Column Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Settings2 /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShouldShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <TrashIcon /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <AlertDialog
        open={shouldShowDeleteDialog}
        onOpenChange={setShouldShowDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Column</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this column and all its tasks. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteColumn(columnId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Column
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
