"use client";

import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import UserMenuContent from "@/components/layout/user-menu-content";

export default function UserAvatarMenu({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <UserMenuContent align="end" className="min-w-56 rounded-lg" />
    </DropdownMenu>
  );
}
