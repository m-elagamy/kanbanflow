import { cva } from "class-variance-authority";

const accentStyles = cva(
  "absolute bottom-0 left-0 h-[1px] w-0 transition-all duration-300",
  {
    variants: {
      priority: {
        low: "bg-gradient-to-r from-green-400/50 via-green-500/50 to-green-600/50",
        medium:
          "bg-gradient-to-r from-yellow-400/50 via-yellow-500/50 to-yellow-600/50",
        high: "bg-gradient-to-r from-red-400/50 via-red-500/50 to-red-600/50",
      },
    },
    defaultVariants: {
      priority: "medium",
    },
  },
);

export default accentStyles;
