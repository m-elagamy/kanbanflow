"use client";

import { motion } from "motion/react";
import {
  AlertCircle,
  CheckCircle,
  FileX,
  InfoIcon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type MessageVariant =
  | "error"
  | "warning"
  | "info"
  | "success"
  | "neutral"
  | "helper";

type FormMessageProps = {
  children: React.ReactNode;
  id?: string;
  className?: string;
  icon?: LucideIcon;
  variant?: MessageVariant;
  animated?: boolean;
  error?: boolean;
};

const variantStyles = {
  error: "text-destructive",
  warning:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-400",
  info: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-400",
  success:
    "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/50 dark:text-green-400",
  neutral:
    "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400",
  helper: "text-muted-foreground", // Style for helper text
};

const variantIcons = {
  error: AlertCircle,
  warning: AlertCircle,
  info: InfoIcon,
  success: CheckCircle,
  neutral: FileX,
  helper: InfoIcon,
};

function FormMessage({
  id,
  children,
  className,
  icon,
  variant = "neutral",
  animated = false,
  error: hasError,
}: FormMessageProps) {
  const Icon = icon || variantIcons[variant];
  const isHelper = variant === "helper";

  const content = (
    <div
      id={id}
      className={cn(
        "flex items-center gap-1",
        !isHelper && "rounded-md",
        variantStyles[variant],
        isHelper && hasError && "opacity-50",
        !isHelper && !hasError && "opacity-100",
        className,
      )}
      aria-live={variant === "error" ? "assertive" : "polite"}
    >
      <Icon size={13} className="mb-0 shrink-0" aria-hidden="true" />
      <p className="text-[0.8rem] font-medium">{children}</p>
    </div>
  );

  if (!animated) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {content}
    </motion.div>
  );
}

export default FormMessage;
