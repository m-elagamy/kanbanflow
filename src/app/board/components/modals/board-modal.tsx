"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, PlusCircle } from "lucide-react";
import BoardForm from "../forms/board-form";
import { useState } from "react";

type BoardModalProps = {
  mode: "create" | "edit";
  trigger?: React.ReactNode;
};

const BoardModal = ({ mode, trigger }: BoardModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
        <BoardForm mode={mode} setIsModalOpen={setIsModalOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default BoardModal;
