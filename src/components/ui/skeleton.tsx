import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const skeletonVariants = cva(
  "relative overflow-hidden rounded-lg  bg-gray-200 dark:bg-muted/30",
  {
    variants: {
      variant: {
        default: "",
        shimmer:
          "after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer after:bg-gradient-to-r after:from-transparent after:via-white/30 after:dark:via-muted/25 after:to-transparent",
      },
    },
    defaultVariants: {
      variant: "shimmer",
    },
  },
);

const Skeleton = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof skeletonVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(skeletonVariants({ variant, className }))}
    {...props}
  />
));
Skeleton.displayName = "Skeleton";

export { Skeleton };
