"use client";

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
import useBoardStore from "@/stores/use-board-store";
import { slugifyTitle } from "@/app/boards/utils/slugify";
import SidebarTitle from "./sidebar-title";
import SidebarActions from "./sidebar-actions";
import SidebarLabel from "./sidebar-label";

export function WorkspaceSidebar() {
  const pathname = usePathname();
  const { boards, setCurrentBoardId } = useBoardStore();

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
                      asChild
                      isActive={isActive}
                    >
                      <Link
                        href={href}
                        onClick={() => setCurrentBoardId(board.id)}
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
