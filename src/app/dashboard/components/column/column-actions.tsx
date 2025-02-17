import { useState } from "react";
import dynamic from "next/dynamic";
import { Ellipsis, PlusIcon, Settings2, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import type { Column } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { updateColumnAction } from "@/actions/column";
import { useColumnStore } from "@/stores/column";
import TaskModal from "../task/task-modal";

const DropdownMenuSubContent = dynamic(
  () =>
    import("@/components/ui/dropdown-menu").then(
      (mod) => mod.DropdownMenuSubContent,
    ),
  {
    loading: () => null,
  },
);
const ColumnStatusSelect = dynamic(() => import("./column-status-select"), {
  loading: () => null,
});

type ColumnActionsProps = {
  columnId: string;
  columnStatus: string;
  tasksCount: number;
  setShowAlertConfirmation: (value: boolean) => void;
  boardSlug: string;
};

const ColumnActions = ({
  columnId,
  columnStatus,
  tasksCount,
  boardSlug,
  setShowAlertConfirmation,
}: ColumnActionsProps) => {
  const isMobile = useIsMobile();
  const [isMainDropdownOpen, setIsMainDropdownOpen] = useState(false);
  const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);

  const updateColumnOptimistically = useColumnStore(
    (state) => state.updateColumn,
  );
  const revertToPrevious = useColumnStore((state) => state.revertToPrevious);

  const handleUpdateColumn = async (updates: Pick<Column, "status">) => {
    updateColumnOptimistically(columnId, updates);
    setIsMainDropdownOpen(false);

    try {
      await updateColumnAction(columnId, updates);
    } catch (error) {
      console.error("Error updating column:", error);
      revertToPrevious();
      toast.error("Failed to update column", {
        description:
          "An error occurred while updating the column. Please try again.",
        duration: 5000,
        icon: "🚨",
      });
    }
  };

  return (
    <div className="flex items-center gap-1">
      {tasksCount >= 1 && (
        <TaskModal
          mode="create"
          boardSlug={boardSlug}
          columnId={columnId}
          trigger={
            <Button variant="ghost" size="icon" className="size-8">
              <PlusIcon />
              <span className="sr-only">New Task</span>
            </Button>
          }
        />
      )}
      <DropdownMenu
        open={isMainDropdownOpen}
        onOpenChange={setIsMainDropdownOpen}
      >
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <Ellipsis />
            <span className="sr-only">Column Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={isMobile ? "start" : "center"}>
          <DropdownMenuLabel>Column Actions:</DropdownMenuLabel>
          <DropdownMenuSub
            open={isSubDropdownOpen}
            onOpenChange={setIsSubDropdownOpen}
          >
            <DropdownMenuSubTrigger
              onMouseEnter={() => setIsSubDropdownOpen(true)}
            >
              <Settings2 />
              Change Status
            </DropdownMenuSubTrigger>
            {isSubDropdownOpen && (
              <DropdownMenuSubContent className="p-0">
                <ColumnStatusSelect
                  columnStatus={columnStatus}
                  handleUpdateColumn={handleUpdateColumn}
                />
              </DropdownMenuSubContent>
            )}
          </DropdownMenuSub>
          <DropdownMenuItem
            onClick={() => setShowAlertConfirmation(true)}
            className="text-destructive focus:text-destructive"
          >
            <TrashIcon /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default ColumnActions;
