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
import useKanbanStore from "@/stores/kanban";

export default function BoardsList() {
  const pathname = usePathname();
  const boards = useKanbanStore((state) => state.boards);
  const setActiveBoard = useKanbanStore((state) => state.setActiveBoard);

  return (
    <SidebarMenu>
      {boards?.map((board) => {
        const isActive = pathname === `/dashboard/${slugify(board.title)}`;
        const href = `/dashboard/${slugify(board.title)}`;
        return (
          <SidebarMenuItem key={board.id}>
            <SidebarMenuButton
              tooltip={board.title}
              isActive={isActive}
              asChild
            >
              <Link href={href} onClick={() => setActiveBoard(board.id)}>
                <Clipboard size={24} />
                <span>{board.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
