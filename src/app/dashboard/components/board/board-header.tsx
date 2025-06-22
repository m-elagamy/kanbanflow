import { InfoIcon, PanelsTopLeft } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { BoardSummary } from "@/lib/types";
import BoardActions from "./board-actions";
import { TaskPriorityFilter } from "../task/tasks-filter";

type BoardHeaderProps = {
  board: BoardSummary;
};

const BoardHeader = ({ board }: BoardHeaderProps) => {
  return (
    <section className="flex-shrink-0 p-6 pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <PanelsTopLeft size={24} />
            <h1 className="text-xl font-semibold capitalize md:text-2xl">
              {board.title?.replace(/-/g, " ")}
            </h1>
            {board.description && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="text-muted-foreground hover:text-foreground size-4 hover:cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-96">
                    {board.description}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TaskPriorityFilter />
          <BoardActions board={board} />
        </div>
      </div>
    </section>
  );
};

export default BoardHeader;
