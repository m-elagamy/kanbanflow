import { InfoIcon, ListTodoIcon, PlusIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

type BoardHeaderProps = {
  title: string;
  description?: string;
  onAddColumn: () => void;
};

const BoardHeader = ({ title, description, onAddColumn }: BoardHeaderProps) => (
  <div className="flex items-center justify-between py-8">
    <div className="flex items-center gap-2">
      <ListTodoIcon size={24} />
      <h1 className="text-base font-semibold capitalize md:text-lg">
        {title.replace(/-/g, " ")}
      </h1>
      {description && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="size-4 text-muted-foreground hover:cursor-help hover:text-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-96">{description}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
    <Button
      className="h-7 gap-0 p-1 md:mr-8 md:h-8 md:p-3"
      onClick={onAddColumn}
    >
      <PlusIcon />
      <span className="text-xs">Add Column</span>
    </Button>
  </div>
);

export default BoardHeader;
