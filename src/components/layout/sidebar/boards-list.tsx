"use client";

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
            />
          );
        })}
      </SidebarMenu>
      {boards.length === BOARDS_LIST_LIMIT && (
        <SidebarMenuSubButton
          className="text-muted-foreground group/link hover:text-foreground mt-2 cursor-pointer gap-[2px] hover:bg-transparent hover:underline hover:underline-offset-2"
          size="sm"
        >
          {/* <Link href="/dashboard/boards" className="flex items-center gap-1"> */}
          View All
          <ChevronRight className="group-hover/link:text-foreground !size-[14px] transition-all group-hover/link:translate-x-[2px]" />
          {/* </Link> */}
        </SidebarMenuSubButton>
      )}
    </>
  );
}
