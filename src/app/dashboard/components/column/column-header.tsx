"use client";

import { useActionState, useState } from "react";
import clsx from "clsx";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AlertConfirmation from "../../../../components/ui/alert-confirmation";
import columnStatusOptions from "../../data/column-status-options";
import { Column } from "@prisma/client";
import { deleteColumnAction } from "@/actions/column";
import ColumnActions from "./column-actions";
import { useColumnStore } from "@/stores/column";
import delay from "@/utils/delay";
import { toast } from "sonner";

type ColumnHeaderProps = {
  tasksCount: number;
  column: Column;
  boardSlug: string;
};

export default function ColumnHeader({
  tasksCount,
  column,
  boardSlug,
}: ColumnHeaderProps) {
  const [showAlertConfirmation, setShowAlertConfirmation] = useState(false);

  const { id: columnId, status: columnStatus } = column;

  const { icon: Icon, color } =
    columnStatusOptions[columnStatus as keyof typeof columnStatusOptions];

  const deleteColumnOptimistically = useColumnStore(
    (state) => state.deleteColumn,
  );
  const isLoading = useColumnStore((state) => state.isLoading);
  const setIsLoading = useColumnStore((state) => state.setIsLoading);
  const revertToPrevious = useColumnStore((state) => state.revertToPrevious);

  const handleFormAction = async (formData: FormData) => {
    if (columnId) {
      setIsLoading(true);
      await delay(300);
      deleteColumnOptimistically(columnId);
      setIsLoading(false);

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
    <>
      <CardHeader className="sticky top-0 z-[5] flex-row items-center justify-between border-b bg-card/80 p-2 px-3 drop-shadow-sm backdrop-blur-sm">
        <CardTitle className="flex items-center gap-2 text-ellipsis whitespace-nowrap text-sm">
          {<Icon size={16} color={color} />}
          <span
            className={clsx(
              columnStatus.length > 15 && "necessary-ellipsis max-w-[115px]",
            )}
            title={columnStatus.length > 15 ? columnStatus : ""}
          >
            {columnStatus}
          </span>
          {tasksCount > 0 && (
            <Badge variant="outline" className="h-5 px-[7px] text-[0.690rem]">
              {tasksCount}
            </Badge>
          )}
        </CardTitle>
        <ColumnActions
          columnId={columnId}
          columnStatus={columnStatus}
          tasksCount={tasksCount}
          setShowAlertConfirmation={setShowAlertConfirmation}
          boardSlug={boardSlug}
        />
      </CardHeader>

      <AlertConfirmation
        open={showAlertConfirmation}
        setOpen={setShowAlertConfirmation}
        title="Delete Column"
        description="Are you sure you want to delete this column? This action cannot be undone."
        columnId={columnId}
        isPending={isLoading}
        formAction={handleFormAction}
      />
    </>
  );
}
