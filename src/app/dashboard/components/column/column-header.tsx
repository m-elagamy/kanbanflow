"use client";

import { useActionState, useState } from "react";
import clsx from "clsx";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AlertConfirmation from "../../../../components/ui/alert-confirmation";
import stateOptions from "../../data/column-state-options";
import { Column } from "@prisma/client";
import { deleteColumnAction } from "@/actions/column";
import ColumnActions from "./column-actions";

export default function ColumnHeader({
  tasksCount,
  column,
  boardTitle,
}: {
  tasksCount: number;
  column: Column;
  boardTitle: string;
}) {
  const [showAlertConfirmation, setShowAlertConfirmation] = useState(false);

  const [, formAction, isPending] = useActionState(deleteColumnAction, {
    success: false,
    message: "",
  });

  const { id: columnId, title: columnTitle } = column;

  const { icon: Icon, color } =
    stateOptions[columnTitle as keyof typeof stateOptions];

  return (
    <>
      <CardHeader className="sticky top-0 z-[5] flex-row items-center justify-between border-b bg-card/80 p-2 px-3 drop-shadow-sm backdrop-blur-sm">
        <CardTitle className="flex items-center gap-2 text-ellipsis whitespace-nowrap text-sm">
          {<Icon size={16} color={color} />}
          <span
            className={clsx(
              columnTitle.length > 15 && "necessary-ellipsis max-w-[115px]",
            )}
            title={columnTitle.length > 15 ? columnTitle : ""}
          >
            {columnTitle}
          </span>
          {tasksCount > 0 && (
            <Badge variant="outline" className="h-5 px-[7px] text-[0.690rem]">
              {tasksCount}
            </Badge>
          )}
        </CardTitle>
        <ColumnActions
          columnId={columnId}
          columnTitle={columnTitle}
          tasksCount={tasksCount}
          setShowAlertConfirmation={setShowAlertConfirmation}
          boardTitle={boardTitle}
        />
      </CardHeader>

      <AlertConfirmation
        open={showAlertConfirmation}
        setOpen={setShowAlertConfirmation}
        title="Delete Column"
        description="Are you sure you want to delete this column? This action cannot be undone."
        formAction={formAction}
        isPending={isPending}
        columnId={columnId}
        boardTitle={boardTitle}
        columnConfirmation
      />
    </>
  );
}
