"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clipboard } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { slugify } from "@/utils/slugify";
import type { Board } from "@prisma/client";
import BoardActions from "@/app/dashboard/components/board/board-actions";

type BoardsListProps = {
  boards: Omit<Board, "userId">[];
};

export default function BoardsList({ boards }: BoardsListProps) {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {boards?.map((board) => {
        const isActive = pathname === `/dashboard/${slugify(board.title)}`;
        const href = `/dashboard/${slugify(board.title)}`;
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
