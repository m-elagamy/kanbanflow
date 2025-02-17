"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clipboard } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import type { Board } from "@prisma/client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import BoardActions from "@/app/dashboard/components/board/board-actions";
import useBoardStore from "@/stores/board";
import BoardsSkeleton from "./boards-skeleton";

type BoardsListProps = {
  boards: Omit<Board, "userId">[];
};

export function BoardsList({ boards: initialBoards }: BoardsListProps) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  const { boards, setBoards } = useBoardStore(
    useShallow((state) => {
      return {
        boards: state.boards,
        setBoards: state.setBoards,
      };
    }),
  );

  useEffect(() => {
    if (!initialBoards) return;

    setBoards(initialBoards);
    setIsLoading(false);
  }, [initialBoards, setBoards]);

  if (isLoading) {
    return <BoardsSkeleton skeletonsLength={initialBoards.length} />;
  }

  return (
    <SidebarMenu>
      {boards.map((board) => {
        const isActive = pathname === `/dashboard/${board.slug}`;
        const href = `/dashboard/${board.slug}`;
        return (
          <SidebarMenuItem key={board.id} className="flex">
            <SidebarMenuButton
              tooltip={board.title}
              isActive={isActive}
              asChild
            >
              <Link href={href}>
                <Clipboard size={24} />
                <span dir="auto">{board.title}</span>
              </Link>
            </SidebarMenuButton>
            <BoardActions
              boardId={board.id}
              boardTitle={board.title}
              boardDescription={board.description}
              isSidebarTrigger
            />
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
