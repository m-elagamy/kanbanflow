"use client";

import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

export type AuthProvider = "oauth_google" | "oauth_github";

export function SocialAuthButtons({
  loading,
  provider,
  onProvider,
}: {
  loading: boolean;
  provider: AuthProvider | null;
  onProvider: (provider: AuthProvider) => void;
}) {
  const buttons = [
    ["oauth_google", <Icons.google key="google" />, "Continue with Google"],
    ["oauth_github", <Icons.gitHub key="github" />, "Continue with GitHub"],
  ] as const;

  return (
    <div className="grid gap-3">
      {buttons.map(([value, icon, label]) => (
        <Button
          key={value}
          className="border-border bg-background/80 hover:bg-accent/70 dark:bg-input/50 dark:hover:bg-accent/60 h-10 shadow-xs"
          type="button"
          variant="outline"
          disabled={loading || provider !== null}
          onClick={() => onProvider(value)}
        >
          {provider === value ? <Loader className="animate-spin" /> : icon}{" "}
          {label}
        </Button>
      ))}
    </div>
  );
}
