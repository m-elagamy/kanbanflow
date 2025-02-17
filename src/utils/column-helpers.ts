import type { Column } from "@prisma/client";
import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

const getAvailableStatusOptions = (
  columns: Column[],
  statusOptions: Record<
    string,
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
    ([status]) => !existingStatuses.includes(status),
  );
};

export default getAvailableStatusOptions;
