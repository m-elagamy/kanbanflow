"use client";

import { useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clipboard } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import useKanbanStore from "@/stores/use-kanban-store";
import { slugifyTitle } from "@/app/boards/utils/slugify";
import SidebarTitle from "./sidebar-title";
import SidebarActions from "./sidebar-actions";
import SidebarLabel from "./sidebar-label";

export function WorkspaceSidebar() {
  const pathname = usePathname();
  const boards = useKanbanStore(useCallback((state) => state.boards, []));

  const setActiveBoard = useKanbanStore(
    useCallback((state) => state.setActiveBoard, []),
  );

  return (
    <Sidebar collapsible="icon" className="top-16">
      <SidebarTitle />
      <SidebarContent>
        <SidebarGroup>
          <SidebarLabel />
          <SidebarGroupContent>
            <SidebarMenu>
              {boards?.map((board) => {
                const isActive =
                  pathname === `/boards/${slugifyTitle(board.title)}`;
                const href = `/boards/${slugifyTitle(board.title)}`;
                return (
                  <SidebarMenuItem key={board.id}>
                    <SidebarMenuButton
                      tooltip={board.title}
                      isActive={isActive}
                      asChild
                    >
                      <Link
                        href={href}
                        onClick={() => setActiveBoard(board.id)}
                      >
                        <Clipboard size={24} />
                        <span>{board.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarActions />
      </SidebarContent>
    </Sidebar>
  );
}
