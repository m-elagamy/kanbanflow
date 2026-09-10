"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <Link href="/dashboard" aria-label="Open dashboard">
      <Avatar>
        <AvatarImage src={user?.imageUrl} alt={name} />
        <AvatarFallback>{initials || "U"}</AvatarFallback>
      </Avatar>
    </Link>
  );
};
export default UserAvatar;
