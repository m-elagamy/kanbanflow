import type { Column } from "@prisma/client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import columnStatusOptions from "../../data/column-status-options";

type ColumnStatusSelectProps = {
  columnStatus: string;
  handleUpdateColumn: (updates: Pick<Column, "status">) => Promise<void>;
};

export default function ColumnStatusSelect({
  columnStatus,
  handleUpdateColumn,
}: ColumnStatusSelectProps) {
  return (
    <Command>
      <CommandInput placeholder="Search..." className="h-9" />
      <CommandList>
        <CommandEmpty>No matching statuses found.</CommandEmpty>
        <CommandGroup>
          {Object.keys(columnStatusOptions)
            .filter((status) => status !== columnStatus)
            .map((status) => {
              const { icon: Icon, color } =
                columnStatusOptions[status as keyof typeof columnStatusOptions];

              return (
                <CommandItem
                  key={status}
                  value={status}
                  onSelect={(value) => {
                    handleUpdateColumn({ status: value });
                  }}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="flex items-center gap-2">
                    <Icon size={16} color={color} />
                    <span className="max-w-32 overflow-hidden text-ellipsis whitespace-nowrap">
                      {status}
                    </span>
                  </span>
                </CommandItem>
              );
            })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
