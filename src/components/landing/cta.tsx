"use client";

import Link from "next/link";
import { Kanban, Zap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "../ui/button";
import { fadeIn, gridVariants } from "@/utils/motion-variants";

export default function Cta() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-background relative my-20 overflow-hidden rounded-2xl border p-12 md:p-16">
      {/* Grid pattern background */}
      <motion.div
        className="absolute inset-0"
        variants={shouldReduceMotion ? undefined : gridVariants}
        animate={!shouldReduceMotion ? "animate" : undefined}
      >
        <div className="absolute inset-0 -z-10 h-full bg-[linear-gradient(to_right,rgba(229,229,229,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(229,229,229,0.5)_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_70%_at_50%_0%,#000_60%,transparent_110%)] bg-size-[3rem_3rem] dark:bg-[linear-gradient(to_right,rgba(55,55,55,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(55,55,55,0.5)_1px,transparent_1px)]" />
      </motion.div>
      <div className="bg-primary/50 absolute inset-x-0 top-0 mx-auto h-1/12 w-1/3 blur-[8rem]" />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center"
        variants={shouldReduceMotion ? undefined : fadeIn}
        initial="initial"
        animate="animate"
      >
        {/* Logo/Icon */}
        <div className="mb-8 flex items-center justify-center">
          <div className="bg-foreground flex size-16 items-center justify-center rounded-full">
            <Kanban className="text-background size-8" />
          </div>
        </div>

        {/* Headline with gradient on key word */}
        <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
          <span className="text-foreground">Ready to </span>
          <span className="bg-linear-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
            streamline
          </span>
          <br />
          <span className="text-foreground">your workflow?</span>
        </h2>

        {/* Descriptive paragraph */}
        <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg leading-relaxed">
          Experience the power of KanbanFlow for yourself, or explore the code
          to see how it&apos;s built. Start organizing your tasks today.
        </p>

        {/* CTA Button - White with dark text */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Button size="lg" asChild>
            <Link href="/sign-up">
              <span className="flex items-center gap-2">
                Start for free
                <Zap className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
