import type { ColumnStatus } from "@/schemas/column";
import type { Column } from "@prisma/client";
import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

const getAvailableStatusOptions = (
  columns: Column[],
  statusOptions: Record<
    ColumnStatus,
    {
      icon: ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
      >;
      color: string;
    }
  >,
) => {
  const existingStatuses =
    Object.values(columns).map((column) => column.status) ?? [];
  return Object.entries(statusOptions).filter(
    ([status]) => !existingStatuses.includes(status as ColumnStatus),
  );
};

export default getAvailableStatusOptions;
