import { useState } from "react";
import { Ellipsis, Loader, PlusIcon, Settings2, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskModal from "../task/task-modal";
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
import { useIsMobile } from "@/hooks/use-mobile";
import stateOptions from "../../data/column-state-options";
import { updateColumnAction } from "@/actions/column";
import type { Column } from "@prisma/client";

type ColumnActionsProps = {
  columnId: string;
  columnTitle: string;
  tasksCount: number;
  setShowAlertConfirmation: (value: boolean) => void;
  boardSlug: string;
};

const ColumnActions = ({
  columnId,
  columnTitle,
  tasksCount,
  boardSlug,
  setShowAlertConfirmation,
}: ColumnActionsProps) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [updating, setUpdating] = useState("");

  const handleUpdateColumn = async (updates: Pick<Column, "title">) => {
    setUpdating(updates.title);
    await updateColumnAction(columnId, boardSlug, {
      title: updates.title,
    });
    setIsOpen(false);
    setUpdating("");
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
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <Ellipsis />
            <span className="sr-only">Column Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={isMobile ? "start" : "center"}>
          <DropdownMenuLabel>Column Actions:</DropdownMenuLabel>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Settings2 />
              Change Status
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="p-0">
              <Command>
                <CommandInput
                  placeholder="Search for a status"
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
                            defaultValue={columnTitle}
                            onSelect={(value) => {
                              handleUpdateColumn({ title: value });
                            }}
                            disabled={updating !== "" && updating !== state}
                            className="flex items-center justify-between gap-2"
                          >
                            <span className="flex items-center gap-2">
                              <Icon size={16} color={color} />
                              <span className="max-w-32 overflow-hidden text-ellipsis whitespace-nowrap">
                                {state}
                              </span>
                            </span>
                            {updating === state && (
                              <Loader className="animate-spin" />
                            )}
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
  );
};
export default ColumnActions;
