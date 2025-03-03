import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const BaseInput = forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<"input">
>(({ className, ...props }, ref) => (
  <Input ref={ref} className={cn("input-class", className)} {...props} />
));

BaseInput.displayName = "BaseInput";

const MotionInput = motion(BaseInput);

export { MotionInput };
