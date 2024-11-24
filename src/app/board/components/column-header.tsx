import { useState } from "react";
import { Ellipsis, Settings2, TrashIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ConfirmDeleteMessage from "./modals/confirm-delete-message";
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
      <CardHeader className="sticky top-0 z-[5] flex-row items-center justify-between border-b bg-card/80 p-2 px-3 drop-shadow-sm backdrop-blur-sm">
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
      <ConfirmDeleteMessage
        columnId={columnId}
        handleDeleteColumn={handleDeleteColumn}
        shouldShowDeleteDialog={shouldShowDeleteDialog}
        setShouldShowDeleteDialog={setShouldShowDeleteDialog}
      />
    </>
  );
}
