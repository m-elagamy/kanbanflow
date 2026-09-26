"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  BadgeCheck,
  CircleHelp,
  Home,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { ThemeSwitcher } from "@/components/layout/footer/theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type UserMenuContentProps = ComponentProps<typeof DropdownMenuContent> & {
  showDashboard?: boolean;
};

export default function UserMenuContent({
  showDashboard = false,
  ...props
}: UserMenuContentProps) {
  const { user } = useUser();
  const { openUserProfile, signOut } = useClerk();
  const pathname = usePathname();
  const name = user?.fullName || user?.firstName || "Your account";
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const initials =
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <DropdownMenuContent {...props}>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user?.imageUrl} alt={name} />
            <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{name}</span>
            <span className="truncate text-xs">{email}</span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        {showDashboard && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard">
              <LayoutDashboard /> Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        {pathname !== "/" && (
          <DropdownMenuItem asChild>
            <Link href="/">
              <Home /> Home page
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onSelect={() => openUserProfile()}>
          <BadgeCheck /> Manage account
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href="https://github.com/m-elagamy/kanbamy/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            <CircleHelp /> Help and feedback
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
      <DropdownMenuItem onSelect={() => void signOut({ redirectUrl: "/" })}>
        <LogOut /> Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
