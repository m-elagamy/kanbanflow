import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ellipsis, Settings2, TrashIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import useKanbanStore from "@/stores/use-kanban-store";
import AlertConfirmation from "../../../../components/ui/alert-confirmation";
import BoardModal from "./board-modal";

export default function BoardActions() {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { getCurrentBoard, deleteBoard } = useKanbanStore();
  const router = useRouter();
  const currentBoard = getCurrentBoard();

  const handleDeleteBoard = () => {
    deleteBoard(currentBoard?.id ?? "");
    setIsAlertOpen(false);
    router.push("/boards");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Board Actions</DropdownMenuLabel>
        <BoardModal
          mode="edit"
          trigger={
            <span className="flex cursor-default items-center gap-2 rounded p-2 py-1 text-sm font-normal hover:bg-muted">
              <Settings2 size={16} /> Edit
            </span>
          }
        />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => setIsAlertOpen(true)}
        >
          <TrashIcon /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      <AlertConfirmation
        open={isAlertOpen}
        setOpen={setIsAlertOpen}
        title={`Delete the board "${currentBoard?.title}"?`}
        description="This action will permanently remove the board and all its data."
        onConfirm={handleDeleteBoard}
      />
    </DropdownMenu>
  );
}
