"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Ellipsis, SquarePen, TrashIcon } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
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
import BoardModal from "./board-modal";
import useLoadingStore from "@/stores/loading";
import type { BoardSummary } from "@/lib/types";
import handleOnError from "@/utils/handle-on-error";
import { useModalStore } from "@/stores/modal";

const AlertConfirmation = dynamic(
  () => import("@/components/ui/alert-confirmation"),
  {
    loading: () => null,
  },
);

type BoardActionsProps = {
  board: BoardSummary;
  isSidebarTrigger?: boolean;
};

export function BoardActionsTrigger({
  interactive = true,
}: {
  interactive?: boolean;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8"
      aria-disabled={!interactive || undefined}
      tabIndex={interactive ? undefined : -1}
    >
      <Ellipsis />
      <span className="sr-only">Open menu</span>
    </Button>
  );
}

export default function BoardActions({
  board,
  isSidebarTrigger,
}: Readonly<BoardActionsProps>) {
  const router = useRouter();
  const params = useParams();
  const { isMobile } = useSidebar();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const openModal = useModalStore((state) => state.openModal);
  const editModalId = `edit-board-${board.id}`;

  const { isDeleting, setIsDeleting } = useLoadingStore(
    useShallow((state) => ({
      isDeleting: state.isLoading("board", "deleting"),
      setIsDeleting: state.setIsLoading,
    })),
  );

  const deleteBoard = useBoardStore((state) => state.deleteBoard);

  const handleOnClick = async () => {
    if (!board.id) return;

    setIsDeleting("board", "deleting", true, board.id);

    try {
      const { success, message } = await deleteBoardAction(board.id);
      if (!success) {
        handleOnError(message, "Failed to delete board");
        setIsAlertOpen(false);
        return;
      }

      setTimeout(() => {
        redirectIfActiveBoard(board.slug);
      }, 0);

      deleteBoard(board.id);
      toast.success(message);
    } catch (error) {
      handleOnError(error, "Failed to delete board");
      setIsAlertOpen(false);
    } finally {
      setIsDeleting("board", "deleting", false, board.id);
    }
  };

  const redirectIfActiveBoard = (boardSlug: string) => {
    if (params.board === boardSlug) {
      router.replace("/dashboard");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isSidebarTrigger ? (
          <SidebarMenuAction
            className="top-[3px]! size-7 peer-data-[active=true]/menu-button:opacity-100"
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
        <DropdownMenuItem
          className="h-8 gap-2 px-2 py-1.5"
          onSelect={() => openModal("board", editModalId)}
        >
          <SquarePen size={16} /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          className="h-8 gap-2 px-2 py-1.5"
          onSelect={() => setIsAlertOpen(true)}
        >
          <TrashIcon /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      <BoardModal
        mode="edit"
        board={board}
        modalId={editModalId}
      />
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
