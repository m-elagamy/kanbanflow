"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Ellipsis, SquarePen, TrashIcon } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import type { Board } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { deleteBoardAction } from "@/actions/board";
import { SidebarMenuAction, useSidebar } from "@/components/ui/sidebar";
import useBoardStore from "@/stores/board";
import delay from "@/utils/delay";
import BoardModal from "./board-modal";

const AlertConfirmation = dynamic(
  () => import("@/components/ui/alert-confirmation"),
  {
    loading: () => null,
  },
);

type BoardActionsProps = {
  board: Pick<Board, "id" | "title" | "description" | "slug">;
  isSidebarTrigger?: boolean;
};

export default function BoardActions({
  board,
  isSidebarTrigger,
}: Readonly<BoardActionsProps>) {
  const router = useRouter();
  const param = useParams();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const { isMobile } = useSidebar();
  const { deleteBoardOptimistically, isDeleting, setIsDeleting } =
    useBoardStore(
      useShallow((state) => ({
        deleteBoardOptimistically: state.deleteBoard,
        isDeleting: state.loadingStates.deletingBoard[board.id],
        setIsDeleting: state.setDeletingBoard,
      })),
    );

  const handleOnClick = async () => {
    if (!board.id) return;

    setIsDeleting(board.id, true);
    try {
      if (param.board) {
        await delay(300);
        router.replace("/dashboard");
      }

      await delay(150);
      deleteBoardOptimistically(board.id);

      await deleteBoardAction(board.id);
    } catch (error) {
      console.error("Error deleting board:", error);
    } finally {
      setIsDeleting(board.id, false);
    }
  };

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
          variant="ghost"
          trigger={
            <DropdownMenuLabel className="w-full cursor-default justify-start rounded p-2">
              <SquarePen size={16} /> Edit
            </DropdownMenuLabel>
          }
          board={board}
        />
        <DropdownMenuItem
          className="h-[30px] p-2 !py-1 text-destructive focus:text-destructive"
          onClick={() => setIsAlertOpen(true)}
        >
          <TrashIcon /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      {isAlertOpen && (
        <AlertConfirmation
          open={isAlertOpen}
          setOpen={setIsAlertOpen}
          title={`Delete Board`}
          description="This action will permanently remove the board and all its data."
          onClick={handleOnClick}
          isPending={isDeleting}
        />
      )}
    </DropdownMenu>
  );
}
