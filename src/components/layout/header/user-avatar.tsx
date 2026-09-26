import { Button } from "@/components/ui/button";
import UserAvatarMenu from "./user-avatar-menu";

type UserAvatarProps = {
  fullName: string | null;
  firstName: string | null;
  imageUrl: string;
};

const UserAvatar = ({ fullName, firstName, imageUrl }: UserAvatarProps) => {
  const name = fullName || firstName || "Your account";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <UserAvatarMenu>
      <Button type="button" variant="ghost" size="icon" effect="ringHover" className="rounded-full" aria-label="Open user menu">
        <span className="relative block">
          <span className="bg-muted relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-medium">
            {initials || "U"}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={name}
              className="absolute inset-0 aspect-square size-full"
            />
          </span>
          <span
            aria-hidden="true"
            className="absolute right-0 bottom-0 flex size-3 translate-x-0.5 translate-y-0.5 items-center justify-center"
          >
            <span className="border-background relative size-2.5 rounded-full border-2 bg-emerald-500 animate-pulse" />
          </span>
        </span>
      </Button>
    </UserAvatarMenu>
  );
};
export default UserAvatar;
