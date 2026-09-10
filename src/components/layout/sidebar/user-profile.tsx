"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  BadgeCheck,
  ChevronsUpDown,
  CircleHelp,
  Home,
  LogOut,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/layout/footer/theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function UserProfile() {
  const { isMobile } = useSidebar();
  const { isLoaded, user } = useUser();
  const { openUserProfile, signOut } = useClerk();

  const name = user?.fullName || user?.firstName || "Your account";
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const initials =
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const identity = (
    <>
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={user?.imageUrl} alt={name} />
        <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
      </Avatar>
      <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">
          {isLoaded ? name : "Loading…"}
        </span>
        <span className="truncate text-xs">{email}</span>
      </div>
    </>
  );

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                className="data-[state=open]:bg-sidebar-accent border-border dark:border-border/60 data-[state=open]:text-sidebar-accent-foreground border"
                size="lg"
                disabled={!isLoaded}
              >
                {identity}
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  {identity}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/">
                    <Home />
                    Home page
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => openUserProfile()}>
                  <BadgeCheck />
                  Manage account
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    href="https://github.com/m-elagamy/kanbanflow/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CircleHelp />
                    Help and feedback
                  </a>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-muted-foreground px-2 py-1 text-xs font-medium">
                  Preferences
                </DropdownMenuLabel>
                <div className="flex items-center justify-between px-2 py-1.5 text-sm">
                  Theme
                  <ThemeSwitcher size="sm" />
                </div>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => void signOut({ redirectUrl: "/" })}
              >
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
