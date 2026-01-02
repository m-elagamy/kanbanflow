import { cn } from "@/lib/utils";
import type React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  icon?: React.ReactNode;
  animate?: boolean;
}

export function Badge({
  children,
  className,
  variant = "primary",
  icon,
  animate = true,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all",
        "border border-transparent shadow-sm",
        `${animate && "animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-300"}`,
        variant === "primary" && "border-primary/20 bg-primary/10 text-primary",
        variant === "secondary" &&
          "border-secondary-foreground/15 bg-secondary/20 dark:border-secondary/30",
        variant === "outline" && "border-border bg-background",
        className,
      )}
      {...props}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}
