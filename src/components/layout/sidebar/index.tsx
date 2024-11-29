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
} from "@/components/ui/sidebar";
import HeaderContent from "./header-content";
import useBoardStore from "@/store/useBoardStore";
import { slugifyTitle } from "@/app/boards/utils/slugify";
import BoardModal from "@/app/boards/components/board/board-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function WorkspaceSidebar() {
  const pathname = usePathname();
  const { boards } = useBoardStore();

  return (
    <Sidebar collapsible="icon" className="top-16">
      <SidebarHeader>
        <HeaderContent />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="justify-between">
            {boards.length > 0 ? (
              <>
                Boards
                <Badge variant="outline" className="h-5 px-2">
                  {boards.length}
                </Badge>
              </>
            ) : (
              <>No boards yet. Add your first board!</>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {boards.length > 0 &&
                boards.map((board) => {
                  return (
                    <SidebarMenuItem key={board.title}>
                      <SidebarMenuButton
                        tooltip={board.title}
                        asChild
                        isActive={
                          pathname === `/boards/${slugifyTitle(board.title)}`
                        }
                      >
                        <Link href={`/boards/${slugifyTitle(board.title)}`}>
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
                <SidebarMenuButton asChild>
                  <BoardModal
                    mode="create"
                    trigger={
                      <Button variant="ghost" className="group/icon h-8 w-full">
                        <CirclePlus className="!size-5 text-muted-foreground transition duration-300 ease-in-out group-hover/icon:rotate-90 group-hover/icon:scale-110 group-hover/icon:text-primary" />
                        <span className="sr-only">Add a Board</span>
                      </Button>
                    }
                  />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
