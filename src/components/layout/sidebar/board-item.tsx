import Link from "next/link";
import { Clipboard } from "lucide-react";
import BoardActions from "@/app/dashboard/components/board/board-actions";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { Board } from "@prisma/client";

type BoardItemProps = {
  board: Omit<Board, "userId" | "order">;
  isActive: boolean;
  href: string;
  setActiveBoardId: (boardId: string | null) => void;
};

export default function BoardItem({
  board,
  isActive,
  href,
  setActiveBoardId,
}: BoardItemProps) {
  return (
    <SidebarMenuItem key={board.id} className="flex">
      <SidebarMenuButton tooltip={board.title} isActive={isActive} asChild>
        <Link
          href={href}
          onClick={() => setActiveBoardId(board.id)}
          aria-label={`Go to board ${board.title}`}
        >
          <Clipboard size={24} />
          <span dir="auto">{board.title}</span>
        </Link>
      </SidebarMenuButton>
      <BoardActions board={board} isSidebarTrigger />
    </SidebarMenuItem>
  );
}
