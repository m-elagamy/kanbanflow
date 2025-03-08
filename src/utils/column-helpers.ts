import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { LucideProps } from "lucide-react";
import type { SimplifiedColumn } from "@/lib/types/stores/column";
import type { ColumnStatus } from "@/schemas/column";

const getAvailableStatusOptions = (
  columns: SimplifiedColumn[],
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
