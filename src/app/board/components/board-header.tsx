import {
  Ellipsis,
  InfoIcon,
  ListTodoIcon,
  Settings2,
  TrashIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import useBoardStore from "@/store/useBoardStore";

const BoardHeader = () => {
  const { getCurrentBoard } = useBoardStore();
  const currentBoard = getCurrentBoard();

  return (
    <div className="py-8">
      <div className="container flex items-center justify-between">
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Board Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Settings2 /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              // onClick={() => setShouldShowDeleteDialog(true)}
              className="text-destructive focus:text-destructive"
            >
              <TrashIcon /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default BoardHeader;
