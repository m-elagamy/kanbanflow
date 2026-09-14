"use client";

import Link from "next/link";
import { LayoutDashboard, ListTodo } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export default function WorkspaceNavigation() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="uppercase">Workspace</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Overview"
              isActive={pathname === "/dashboard"}
              asChild
            >
              <Link href="/dashboard">
                <LayoutDashboard />
                <span>Overview</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Tasks"
              isActive={pathname === "/dashboard/tasks"}
              asChild
            >
              <Link href="/dashboard/tasks">
                <ListTodo />
                <span>Tasks</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
