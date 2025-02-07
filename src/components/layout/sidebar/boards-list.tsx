"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clipboard } from "lucide-react";

import type { Board } from "@prisma/client";
import BoardActions from "@/app/dashboard/components/board/board-actions";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type BoardsListProps = {
  boards: Omit<Board, "userId">[];
};

export default function BoardsList({ boards }: BoardsListProps) {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {boards?.map((board) => {
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
              isSidebarTrigger
              id={board.id}
              title={board.title}
              description={board.description}
            />
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
