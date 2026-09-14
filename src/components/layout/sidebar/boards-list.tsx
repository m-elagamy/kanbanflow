"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { SidebarMenu, SidebarMenuSubButton } from "@/components/ui/sidebar";
import type { SimplifiedBoard } from "@/lib/types/stores/board";
import { BOARDS_LIST_LIMIT } from "@/lib/constants";
import BoardItem from "./board-item";

type BoardsListProps = {
  boards: SimplifiedBoard[];
};

export function BoardsList({ boards }: BoardsListProps) {
  const pathname = usePathname();

  const isActiveBoard = (boardSlug: string) => {
    return decodeURIComponent(pathname) === `/dashboard/${boardSlug}`;
  };

  const collapsedBoards = new Set(boards.slice(0, 6).map((board) => board.id));
  const activeBoard = boards.find((board) => isActiveBoard(board.slug));

  if (activeBoard && !collapsedBoards.has(activeBoard.id)) {
    const lastVisibleBoard = boards[5];
    if (lastVisibleBoard) collapsedBoards.delete(lastVisibleBoard.id);
    collapsedBoards.add(activeBoard.id);
  }

  return (
    <>
      <SidebarMenu>
        {boards.map((board) => {
          const isActive = isActiveBoard(board.slug);
          const href = `/dashboard/${board.slug}`;

          return (
            <BoardItem
              key={board.title}
              board={board}
              isActive={isActive}
              href={href}
              hideWhenCollapsed={!collapsedBoards.has(board.id)}
            />
          );
        })}
      </SidebarMenu>

      {boards.length === BOARDS_LIST_LIMIT && (
        <SidebarMenuSubButton
          asChild
          className="text-muted-foreground group/link hover:text-foreground mt-2 w-fit cursor-pointer gap-[2px] hover:bg-transparent hover:underline hover:underline-offset-2"
          size="sm"
        >
          <Link href="/dashboard/boards" className="flex items-center gap-1">
            View All
            <ChevronRight className="group-hover/link:text-foreground !size-[14px] transition-all group-hover/link:translate-x-[2px]" />
          </Link>
        </SidebarMenuSubButton>
      )}
    </>
  );
}
