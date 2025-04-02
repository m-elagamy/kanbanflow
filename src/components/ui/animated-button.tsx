import { motion } from "framer-motion";
import { Button } from "./button";

type AnimatedButtonProps = React.ComponentProps<typeof Button> & {
  disabled?: boolean;
};

export default function AnimatedButton({
  children,
  disabled,
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.05 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      transition={{ type: "spring", stiffness: 200, damping: 10 }}
      className="mb-0"
    >
      <Button disabled={disabled} {...props}>
        {children}
      </Button>
    </motion.div>
  );
}
