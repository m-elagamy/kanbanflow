import { useState } from "react";
import dynamic from "next/dynamic";
import { useShallow } from "zustand/react/shallow";
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
import { deleteColumnAction, updateColumnAction } from "@/actions/column";
import { useColumnStore } from "@/stores/column";
import TaskModal from "../task/task-modal";
import delay from "@/utils/delay";
import useLoadingStore from "@/stores/loading";
import useBoardStore from "@/stores/board";

const AlertConfirmation = dynamic(
  () => import("@/components/ui/alert-confirmation"),
  {
    loading: () => null,
  },
);

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
};

const ColumnActions = ({
  columnId,
  columnStatus,
  tasksCount,
}: ColumnActionsProps) => {
  const isMobile = useIsMobile();
  const [isMainDropdownOpen, setIsMainDropdownOpen] = useState(false);
  const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);
  const [showAlertConfirmation, setShowAlertConfirmation] = useState(false);

  const activeBoardId = useBoardStore((state) => state.activeBoardId);

  const { deleteColumn, updateColumn, revertToPrevious } = useColumnStore(
    useShallow((state) => ({
      updateColumn: state.updateColumn,
      revertToPrevious: state.revertToPrevious,
      deleteColumn: state.deleteColumn,
    })),
  );

  const { isLoading, setIsLoading } = useLoadingStore(
    useShallow((state) => ({
      isLoading: state.isLoading("column", "deleting"),
      setIsLoading: state.setIsLoading,
    })),
  );

  const handleUpdateColumn = async (updates: Pick<Column, "status">) => {
    if (!activeBoardId || !columnId) return;

    setIsLoading("column", "updating", true, columnId);

    await delay(300);
    updateColumn(activeBoardId, columnId, updates);
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
    } finally {
      setIsLoading("column", "updating", false, columnId);
    }
  };

  const handleOnClick = async () => {
    if (activeBoardId && columnId) {
      setIsLoading("column", "deleting", true, columnId);
      await delay(500);
      deleteColumn(activeBoardId, columnId);
      setIsLoading("column", "deleting", false, columnId);

      try {
        await deleteColumnAction(columnId);
      } catch (error) {
        console.error("Error deleting column:", error);
        revertToPrevious();
        toast.error("Failed to delete column", {
          description:
            "An error occurred while deleting the column. Please try again.",
          duration: 5000,
          icon: "🚨",
        });
      }
    }
  };

  return (
    <div className="flex items-center gap-1">
      {tasksCount >= 1 && (
        <TaskModal
          mode="create"
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
            className="h-7 text-destructive focus:text-destructive"
          >
            <TrashIcon /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {showAlertConfirmation && (
        <AlertConfirmation
          open={showAlertConfirmation}
          setOpen={setShowAlertConfirmation}
          title="Delete Column"
          description="Are you sure you want to delete this column? This action cannot be undone."
          isPending={isLoading}
          onClick={handleOnClick}
        />
      )}
    </div>
  );
};
export default ColumnActions;
