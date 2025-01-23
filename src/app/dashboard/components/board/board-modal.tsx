import { Edit, PlusCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import BoardForm from "./board-form";
import type { Board } from "@prisma/client";
import { getInitialState } from "@/utils/board";

type BoardModalProps = {
  mode: "create" | "edit";
  board?: Pick<Board, "id" | "title" | "description">;
  trigger?: React.ReactNode;
};

const BoardModal = ({ mode, board, trigger }: BoardModalProps) => {
  const initialState = getInitialState(mode, board);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="group">
            <PlusCircle className="transition-transform group-hover:rotate-90" />
            Create your first board
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "create" ? (
              "Create New Board"
            ) : (
              <>
                <Edit size={16} /> Edit Board
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Set up your board with a name, description, and template."
              : "Modify the board details below."}
          </DialogDescription>
        </DialogHeader>
        {mode === "create" && (
          <BoardForm mode="create" initialState={initialState} />
        )}

        {mode === "edit" && board && (
          <BoardForm mode="edit" initialState={initialState} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BoardModal;
