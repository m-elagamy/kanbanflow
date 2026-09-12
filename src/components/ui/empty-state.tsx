import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  illustration: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  size?: "compact" | "default";
  className?: string;
};

export function EmptyState({
  illustration,
  title,
  description,
  action,
  size = "default",
  className,
}: EmptyStateProps) {
  const compact = size === "compact";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "min-h-52 px-3 py-8" : "min-h-80 px-6 py-12",
        className,
      )}
    >
      {illustration}
      <h2
        className={cn(
          "font-semibold",
          compact ? "mt-4 text-sm" : "mt-5 text-xl",
        )}
      >
        {title}
      </h2>
      <p
        className={cn(
          "text-muted-foreground leading-relaxed",
          compact
            ? "mt-1 max-w-48 text-xs"
            : "mt-2 max-w-md text-sm md:text-base",
        )}
      >
        {description}
      </p>
      {action && <div className={compact ? "mt-5" : "mt-6"}>{action}</div>}
    </div>
  );
}
