import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface AuthButtonsProps {
  variant?: "default" | "compact";
  showSignIn?: boolean;
  showSignUp?: boolean;
  className?: string;
}

export default function AuthButtons({
  variant = "default",
  showSignIn = true,
  showSignUp = true,
  className,
}: AuthButtonsProps) {
  if (!showSignIn && !showSignUp) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showSignIn && (
        <Button
          variant="ghost"
          size={variant === "compact" ? "sm" : "default"}
          className="group"
          asChild
        >
          <Link href={AUTH_ROUTES.SIGN_IN} className="flex items-center gap-2">
            <LogIn className="transition-transform duration-300 group-hover:translate-x-1" />
            <span className="relative z-10">Sign In</span>
          </Link>
        </Button>
      )}
      {showSignUp && (
        <Button
          size={variant === "compact" ? "sm" : "default"}
          className="group"
          asChild
        >
          <Link href={AUTH_ROUTES.SIGN_UP} className="flex items-center gap-2">
            <UserPlus className="transition-transform duration-300 group-hover:translate-x-1" />
            <span className="relative z-10">Sign Up</span>
          </Link>
        </Button>
      )}
    </div>
  );
}
