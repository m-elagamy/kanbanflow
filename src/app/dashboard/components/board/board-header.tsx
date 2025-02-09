import { InfoIcon, PanelsTopLeft } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import BoardActions from "./board-actions";
import { TaskPriorityFilter } from "../task/tasks-filter";

type BoardHeaderProps = {
  boardId: string;
  boardTitle: string;
  boardDescription: string | null;
  boardSlug: string;
};

const BoardHeader = ({
  boardId,
  boardTitle,
  boardDescription,
  boardSlug,
}: BoardHeaderProps) => {
  return (
    <section className="mb-4 pb-6 pt-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PanelsTopLeft size={24} />
          <h1 className="text-base font-semibold capitalize md:text-lg">
            {boardTitle?.replace(/-/g, " ")}
          </h1>
          {boardDescription && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="size-4 text-muted-foreground hover:cursor-help hover:text-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-96">
                  {boardDescription}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="flex items-center gap-2">
          <TaskPriorityFilter boardSlug={boardSlug} />
          <BoardActions
            boardId={boardId}
            boardTitle={boardTitle}
            boardDescription={boardDescription}
          />
        </div>
      </div>
    </section>
  );
};

export default BoardHeader;
