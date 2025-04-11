import Link from "next/link";
import { Clipboard } from "lucide-react";
import BoardActions from "@/app/dashboard/components/board/board-actions";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { SimplifiedBoard } from "@/lib/types/stores/board";

type BoardItemProps = {
  board: SimplifiedBoard;
  isActive: boolean;
  href: string;
};

export default function BoardItem({ board, isActive, href }: BoardItemProps) {
  return (
    <SidebarMenuItem key={board.id} className="flex">
      <SidebarMenuButton tooltip={board.title} isActive={isActive} asChild>
        <Link href={href} aria-label={`Go to board ${board.title}`}>
          <Clipboard size={24} />
          <span dir="auto">{board.title}</span>
        </Link>
      </SidebarMenuButton>
      <BoardActions board={board} isSidebarTrigger />
    </SidebarMenuItem>
  );
}
