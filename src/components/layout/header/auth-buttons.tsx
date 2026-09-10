"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { LayoutDashboard, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import UserAvatar from "./user-avatar";

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
  const { isLoaded, isSignedIn } = useAuth();

  if (!showSignIn && !showSignUp) return null;

  if (!isLoaded || isSignedIn) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {isLoaded ? (
          <>
            <Button size={variant === "compact" ? "sm" : "default"} asChild>
              <Link href="/dashboard">
                <LayoutDashboard />
                Dashboard
              </Link>
            </Button>
            <UserAvatar />
          </>
        ) : (
          <Button
            size={variant === "compact" ? "sm" : "default"}
            disabled
            aria-busy="true"
          >
            Loading…
          </Button>
        )}
      </div>
    );
  }

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
