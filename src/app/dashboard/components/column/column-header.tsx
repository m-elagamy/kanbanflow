"use client";

import clsx from "clsx";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SimplifiedColumn } from "@/lib/types/stores/column";
import ColumnActions from "./column-actions";
import columnStatusOptions from "../../data/column-status-options";

type ColumnHeaderProps = {
  tasksCount: number;
  column: SimplifiedColumn;
};

export default function ColumnHeader({
  tasksCount,
  column,
}: ColumnHeaderProps) {
  const { id: columnId, status: columnStatus } = column;

  const { icon: Icon, color } =
    columnStatusOptions[columnStatus as keyof typeof columnStatusOptions];

  return (
    <CardHeader className="sticky top-0 z-5 flex flex-row items-center justify-between border-b p-4 pb-3!">
      <CardTitle className="flex items-center gap-2 text-sm text-ellipsis whitespace-nowrap">
        {<Icon size={16} color={color} />}
        <span
          className={clsx(
            columnStatus.length > 21 && "necessary-ellipsis max-w-[152px]",
          )}
          title={columnStatus.length > 21 ? columnStatus : ""}
        >
          {columnStatus}
        </span>
        {tasksCount > 0 && (
          <Badge
            variant="outline"
            className="h-5 rounded-md px-[7px] text-[0.690rem]"
          >
            {tasksCount}
          </Badge>
        )}
      </CardTitle>
      <ColumnActions
        columnId={columnId}
        columnStatus={columnStatus}
        tasksCount={tasksCount}
      />
    </CardHeader>
  );
}
