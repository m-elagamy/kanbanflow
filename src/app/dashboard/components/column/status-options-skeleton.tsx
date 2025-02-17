import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatusOptionsSkeleton() {
  return (
    <div className="relative mb-2 overflow-hidden rounded-md">
      <Skeleton className="h-6 w-full" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
        initial={{ translateX: "-100%" }}
        animate={{ translateX: "100%" }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    </div>
  );
}
