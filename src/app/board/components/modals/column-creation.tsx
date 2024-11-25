import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddColumnCard from "../add-column-card";
import AddColumnForm from "../forms/column-creation";
import { useState } from "react";

const ColumnCreationModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger className="max-h-[550px] outline-none">
        <AddColumnCard />
      </DialogTrigger>
      <DialogContent className="rounded-lg">
        <DialogHeader>
          <DialogTitle>Create New Column</DialogTitle>
          <DialogDescription>
            Pick a state for your new column like &apos;To Do&apos; or &apos;In
            Progress&apos; to keep your tasks organized.
          </DialogDescription>
        </DialogHeader>
        <AddColumnForm setIsModalOpen={setIsModalOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default ColumnCreationModal;
