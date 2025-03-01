"use client";

import type { Board } from "@prisma/client";
import { SidebarMenu } from "@/components/ui/sidebar";
import { useBoardsList } from "@/hooks/use-boards-list";
import BoardsSkeleton from "./boards-skeleton";
import BoardItem from "./board-item";

type BoardsListProps = {
  boards: Omit<Board, "userId" | "order">[];
};

export function BoardsList({ boards: initialBoards }: BoardsListProps) {
  const { boards, activeBoardId, setActiveBoardId, isLoading } =
    useBoardsList(initialBoards);

  if (isLoading) {
    return <BoardsSkeleton skeletonsLength={initialBoards.length} />;
  }

  return (
    <SidebarMenu>
      {Object.values(boards).map((board) => {
        const isActive = activeBoardId === board.id;
        const href = `/dashboard/${board.slug}`;

        return (
          <BoardItem
            key={board.title}
            board={board}
            isActive={isActive}
            href={href}
            setActiveBoardId={setActiveBoardId}
          />
        );
      })}
    </SidebarMenu>
  );
}
