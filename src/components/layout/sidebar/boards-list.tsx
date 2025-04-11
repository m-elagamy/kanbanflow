"use client";

import { usePathname } from "next/navigation";
import { SidebarMenu } from "@/components/ui/sidebar";
import type { SimplifiedBoard } from "@/lib/types/stores/board";
import BoardItem from "./board-item";

type BoardsListProps = {
  boards: SimplifiedBoard[];
};

export function BoardsList({ boards }: BoardsListProps) {
  const pathname = usePathname();

  const isActiveBoard = (boardSlug: string) => {
    return decodeURIComponent(pathname) === `/dashboard/${boardSlug}`;
  };

  return (
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
          />
        );
      })}
    </SidebarMenu>
  );
}
