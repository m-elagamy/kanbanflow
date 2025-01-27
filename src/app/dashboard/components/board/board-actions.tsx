import { useActionState, useState } from "react";
import { Ellipsis, SquarePen, TrashIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import AlertConfirmation from "../../../../components/ui/alert-confirmation";
import BoardModal from "./board-modal";
import { deleteBoardAction } from "@/actions/board";
import { SidebarMenuAction, useSidebar } from "@/components/ui/sidebar";

type BoardActionsProps = {
  id: string;
  title: string;
  description: string | null;
  isSidebarTrigger?: boolean;
};

export default function BoardActions({
  id,
  title,
  description,
  isSidebarTrigger,
}: BoardActionsProps) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { isMobile } = useSidebar();

  const [, formAction, isPending] = useActionState(deleteBoardAction, {
    success: false,
    message: "",
    error: "",
    fields: { boardId: id },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isSidebarTrigger ? (
          <SidebarMenuAction
            className="!top-[3px] size-7 peer-data-[active=true]/menu-button:opacity-100"
            showOnHover
          >
            <Ellipsis />
            <span className="sr-only">Open menu</span>
          </SidebarMenuAction>
        ) : (
          <Button variant="ghost" size="icon" className="size-8">
            <Ellipsis />
            <span className="sr-only">Open menu</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={isSidebarTrigger && !isMobile ? "right" : "bottom"}
        align={isSidebarTrigger ? "start" : "end"}
      >
        <DropdownMenuLabel>Board Actions:</DropdownMenuLabel>
        <BoardModal
          mode="edit"
          trigger={
            <span className="flex cursor-default items-center gap-2 rounded p-2 py-1 text-sm font-normal hover:bg-muted">
              <SquarePen size={16} /> Edit
            </span>
          }
          board={{
            id,
            title,
            description,
          }}
        />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => setIsAlertOpen(true)}
        >
          <TrashIcon /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      <AlertConfirmation
        open={isAlertOpen}
        setOpen={setIsAlertOpen}
        title={`Delete Board`}
        description="This action will permanently remove the board and all its data."
        formAction={formAction}
        isPending={isPending}
        boardId={id}
      />
    </DropdownMenu>
  );
}
