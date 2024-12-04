import { useState } from "react";
import { Ellipsis, Settings2, TrashIcon } from "lucide-react";
import { useShallow } from "zustand/shallow";
import clsx from "clsx";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AlertConfirmation from "../../../../components/ui/alert-confirmation";
import TaskModal from "../task/task-modal";
import stateOptions from "../../data/column-state-options";
import useKanbanStore from "@/stores/use-kanban-store";
import { useIsMobile } from "@/hooks/use-mobile";
import type Column from "@/lib/types/column";

export default function ColumnHeader({ column }: { column: Column }) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [showAlertConfirmation, setShowAlertConfirmation] = useState(false);
  const { activeBoardId, updateColumn, deleteColumn } = useKanbanStore(
    useShallow((state) => ({
      activeBoardId: state.activeBoardId,
      updateColumn: state.updateColumn,
      deleteColumn: state.deleteColumn,
    })),
  );

  const { id: columnId, title: columnTitle, tasks: tasksCount } = column;

  const { icon: Icon, color } =
    stateOptions[columnTitle as keyof typeof stateOptions];

  const handleUpdateColumn = (updates: Pick<Column, "title">) => {
    updateColumn(activeBoardId, column.id, (col) => ({ ...col, ...updates }));
    setIsOpen(false);
  };

  const handleDeleteColumn = () => {
    deleteColumn(activeBoardId, column.id);
  };

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
          {tasksCount && tasksCount.length > 0 && (
            <Badge variant="outline" className="h-5">
              {tasksCount.length}
            </Badge>
          )}
        </CardTitle>

        <div className="flex items-center gap-1">
          {tasksCount && tasksCount.length >= 1 && (
            <TaskModal columnId={columnId} />
          )}
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <Ellipsis />
                <span className="sr-only">Column Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isMobile ? "start" : "center"}>
              <DropdownMenuLabel>Column Actions</DropdownMenuLabel>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Settings2 />
                  Edit
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search column status..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No matching statuses found.</CommandEmpty>
                      <CommandGroup>
                        {Object.keys(stateOptions)
                          .filter((state) => state !== columnTitle)
                          .map((state) => {
                            const { icon: Icon, color } =
                              stateOptions[state as keyof typeof stateOptions];

                            return (
                              <CommandItem
                                key={state}
                                value={state}
                                onSelect={(value) => {
                                  handleUpdateColumn({ title: value });
                                }}
                              >
                                {<Icon size={16} color={color} />} {state}
                              </CommandItem>
                            );
                          })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </DropdownMenuSubContent>
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
      </CardHeader>
      <AlertConfirmation
        open={showAlertConfirmation}
        setOpen={setShowAlertConfirmation}
        title="Delete Column"
        description="Are you sure you want to delete this column? This action cannot be undone."
        onConfirm={handleDeleteColumn}
      />
    </>
  );
}
