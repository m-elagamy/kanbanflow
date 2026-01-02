"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";

interface DashboardPreviewProps {
  /**
   * Path to the dashboard screenshot image
   * Path should be relative to the public directory (e.g., /assets/images/dashboard-preview.png)
   * Recommended: 1920x1080px or 16:9 aspect ratio
   */
  imageSrc?: string;
  imageAlt?: string;
}

export default function DashboardPreview({
  imageSrc = "/assets/images/dashboard-preview.png",
  imageAlt = "KanbanFlow Dashboard Preview",
}: DashboardPreviewProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto max-w-5xl">
      {/* Background glow effect */}
      <div className="bg-primary/10 absolute inset-0 -z-10 rounded-2xl blur-3xl" />

      {/* Browser mockup frame */}
      <motion.div
        className="border-border/50 bg-card/50 relative overflow-hidden rounded-xl border shadow-2xl"
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
        animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Browser chrome */}
        <div className="border-border/50 bg-muted/30 flex items-center gap-2 border-b px-4 py-3">
          <div className="flex gap-1.5">
            <div className="bg-destructive/80 h-3 w-3 rounded-full" />
            <div className="bg-muted-foreground/40 h-3 w-3 rounded-full" />
            <div className="bg-secondary/80 h-3 w-3 rounded-full" />
          </div>
          <div className="bg-background border-border/50 text-muted-foreground mx-auto flex h-8 flex-1 items-center justify-center rounded-md border px-4 text-xs">
            kanbanflow.app/dashboard
          </div>
        </div>

        {/* Dashboard screenshot */}
        <div className="bg-background relative">
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover object-top"
              priority
              quality={90}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1280px"
              onError={(e) => {
                // Fallback if image doesn't exist
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const fallback = target.parentElement?.querySelector(
                  ".fallback-placeholder",
                ) as HTMLElement;
                if (fallback) fallback.style.display = "flex";
              }}
            />
            {/* Fallback placeholder */}
            <div className="fallback-placeholder from-muted/20 via-background to-muted/10 hidden h-full items-center justify-center bg-linear-to-br">
              <div className="text-center">
                <p className="text-muted-foreground mb-2 text-sm">
                  Dashboard Preview
                </p>
                <p className="text-muted-foreground/70 text-xs">
                  Add your screenshot at: public/images/dashboard-preview.png
                </p>
              </div>
            </div>

            {/* Subtle overlay gradient for depth */}
            <div className="to-background/10 absolute inset-0 bg-linear-to-t from-transparent via-transparent" />
          </div>

          {/* Shine effect on hover */}
          <motion.div
            className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500"
            whileHover={{ opacity: 1 }}
          />
        </div>
      </motion.div>

      {/* Floating accent elements */}
      {!shouldReduceMotion && (
        <>
          <motion.div
            className="bg-primary/20 absolute -top-4 -right-4 h-20 w-20 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="bg-secondary/20 absolute -bottom-4 -left-4 h-16 w-16 rounded-full blur-xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </>
      )}
    </div>
  );
}
