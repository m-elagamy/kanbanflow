"use client";

import { InfoIcon, ListTodoIcon } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import BoardActions from "./board-actions";
import useKanbanStore from "@/stores/use-kanban-store";

const BoardHeader = () => {
  const currentBoard = useKanbanStore((state) => state.getCurrentBoard());

  return (
    <div className="py-8 md:mr-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListTodoIcon size={24} />
          <h1 className="text-base font-semibold capitalize md:text-lg">
            {currentBoard?.title?.replace(/-/g, " ")}
          </h1>
          {currentBoard?.description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="size-4 text-muted-foreground hover:cursor-help hover:text-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-96">
                  {currentBoard?.description}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <BoardActions />
      </div>
    </div>
  );
};

export default BoardHeader;
