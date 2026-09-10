"use client";

import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserMenuContent from "@/components/layout/user-menu-content";

const UserAvatar = () => {
  const { user } = useUser();
  const name = user?.fullName || user?.firstName || "Your account";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="rounded-full"
          aria-label="Open user menu"
        >
          <Avatar>
            <AvatarImage src={user?.imageUrl} alt={name} />
            <AvatarFallback>{initials || "U"}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <UserMenuContent align="end" className="min-w-56 rounded-lg" />
    </DropdownMenu>
  );
};
export default UserAvatar;
