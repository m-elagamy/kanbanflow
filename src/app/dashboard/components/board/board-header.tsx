"use client";

import { InfoIcon, ListTodoIcon } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import BoardActions from "./board-actions";

type BoardHeaderProps = {
  id: string;
  title: string;
  description: string | null;
};

const BoardHeader = ({ id, title, description }: BoardHeaderProps) => {
  return (
    <section className="mb-4 border-b pb-6 pt-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListTodoIcon size={24} />
          <h1 className="text-base font-semibold capitalize md:text-lg">
            {title?.replace(/-/g, " ")}
          </h1>
          {description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="size-4 text-muted-foreground hover:cursor-help hover:text-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-96">
                  {description}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <BoardActions id={id} title={title} description={description} />
      </div>
    </section>
  );
};

export default BoardHeader;
