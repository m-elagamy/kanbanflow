"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import HeaderContent from "./header-content";

export function WorkspaceSidebar() {
  const pathname = usePathname();

  const items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Inbox",
      url: "/boards/inbox",
      icon: Inbox,
    },
    {
      title: "Calendar",
      url: "/boards/calendar",
      icon: Calendar,
    },
    {
      title: "Search",
      url: "/boards/search",
      icon: Search,
    },
    {
      title: "Settings",
      url: "/boards/settings",
      icon: Settings,
    },
  ];
  return (
    <Sidebar collapsible="icon" className="top-16 border-b">
      <SidebarHeader>
        <HeaderContent />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
