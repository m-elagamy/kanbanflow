"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CirclePlus, Clipboard } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import HeaderContent from "./header-content";
import useBoardStore from "@/stores/use-board-store";
import { slugifyTitle } from "@/app/boards/utils/slugify";
import BoardModal from "@/app/boards/components/board/board-modal";

export function WorkspaceSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { boards, setCurrentBoardId } = useBoardStore();

  return (
    <Sidebar collapsible="icon" className="top-16">
      <SidebarHeader>
        <HeaderContent />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="justify-between">
            Boards
            {boards.length > 0 && (
              <Badge variant="outline" className="h-5 px-2 text-[0.625rem]">
                {boards.length}
              </Badge>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {boards.length > 0 &&
                boards.map((board) => {
                  return (
                    <SidebarMenuItem key={board.id}>
                      <SidebarMenuButton
                        tooltip={board.title}
                        asChild
                        isActive={
                          pathname === `/boards/${slugifyTitle(board.title)}`
                        }
                      >
                        <Link
                          href={`/boards/${slugifyTitle(board.title)}`}
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
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <BoardModal
                  mode="create"
                  trigger={
                    <SidebarMenuButton
                      className={`group/icon ${state === "expanded" ? "justify-center" : "justify-start"}`}
                      tooltip="New Board"
                      variant="outline"
                    >
                      <CirclePlus className="text-muted-foreground transition-colors group-hover/icon:text-primary" />
                      <span>New Board</span>
                    </SidebarMenuButton>
                  }
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
