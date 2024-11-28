"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";

export default function Hero() {
  return (
    <div className="mx-auto max-w-3xl pb-8 text-center">
      <div className="relative mb-6">
        <h1 className="text-4xl font-extrabold tracking-tighter md:text-6xl">
          <span className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent dark:from-white dark:via-gray-200 dark:to-gray-300">
            Streamline Your Workflow
          </span>
        </h1>
        <motion.div
          className="absolute -left-2 -top-4 h-8 w-8 rounded-full bg-blue-500/10"
          animate={{
            scale: [1, 1.2, 1],
            transition: {
              repeat: Infinity,
              duration: 2,
            },
          }}
        />
        <motion.div
          className="absolute -bottom-4 -right-2 h-8 w-8 rounded-full bg-purple-500/10"
          animate={{
            scale: [1, 1.2, 1],
            transition: {
              repeat: Infinity,
              duration: 2,
              delay: 0.5,
            },
          }}
        />
      </div>

      <p className="mb-8 text-sm text-muted-foreground md:text-base">
        Take control of your projects and achieve more with ease! KanbanFlow
        helps you manage tasks, organize projects, and boost productivity with
        real-time updates.
      </p>

      <div className="flex justify-center gap-4">
        <Button
          className="group relative overflow-hidden hover:bg-accent/25"
          variant="outline"
          asChild
        >
          <Link href="/login">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/5"
              animate={{
                x: ["-100%", "100%"],
                transition: {
                  repeat: Infinity,
                  duration: 2,
                  ease: "linear",
                },
              }}
            />
            <span className="relative z-10 flex items-center gap-2 font-semibold">
              Get Started
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </Button>

        <Button variant="outline" className="group hover:bg-accent/25" asChild>
          <Link href="/demo">
            View Demo
            <Eye className="transition-transform group-hover:scale-110" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
