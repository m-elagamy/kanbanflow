import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import BoardCreationForm from "../forms/board-creation";

const BoardCreationModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="group">
          <PlusCircle className="transition-transform group-hover:rotate-90" />
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg">
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
          <DialogDescription>
            Set up your board with a name, description, and template.
          </DialogDescription>
        </DialogHeader>
        <BoardCreationForm />
      </DialogContent>
    </Dialog>
  );
};

export default BoardCreationModal;
