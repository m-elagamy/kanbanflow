import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

function ErrorMessage({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.p
      id={id}
      className={`flex items-center gap-1 text-[0.8rem] text-destructive ${className}`}
      aria-live="polite"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <AlertCircle size={13} />
      {children}
    </motion.p>
  );
}

export default ErrorMessage;
