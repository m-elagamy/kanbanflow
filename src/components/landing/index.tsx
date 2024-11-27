"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fadeIn, stagger } from "@/utils/motion-variants";
import { features } from "./data";

const Landing = () => {
  return (
    <motion.section
      initial="initial"
      animate="animate"
      variants={stagger}
      layout
      layoutId="landing"
    >
      <motion.div className="absolute -top-40 left-1/2 size-80 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20" />

      <div className="container relative pb-16 pt-32">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <motion.div className="relative mb-6" variants={fadeIn}>
            <h1 className="text-4xl font-extrabold tracking-tighter md:text-6xl">
              <span className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent dark:from-white dark:via-gray-200 dark:to-gray-300">
                Streamline Your Workflow
              </span>
            </h1>
            <motion.div
              className="absolute -left-4 -top-4 h-8 w-8 rounded-full bg-blue-500/10"
              animate={{
                scale: [1, 1.2, 1],
                transition: {
                  repeat: Infinity,
                  duration: 2,
                },
              }}
            />
            <motion.div
              className="absolute -bottom-4 -right-4 h-8 w-8 rounded-full bg-purple-500/10"
              animate={{
                scale: [1, 1.2, 1],
                transition: {
                  repeat: Infinity,
                  duration: 2,
                  delay: 0.5,
                },
              }}
            />
          </motion.div>

          <motion.p
            className="mb-8 text-sm text-muted-foreground md:text-base"
            variants={fadeIn}
          >
            Take control of your projects and achieve more with ease! KanbanFlow
            helps you manage tasks, organize projects, and boost productivity
            with real-time updates.
          </motion.p>

          <motion.div className="flex justify-center gap-4" variants={fadeIn}>
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

            <Button
              variant="outline"
              className="group hover:bg-accent/25"
              asChild
            >
              <Link href="/demo">
                View Demo
                <Eye className="transition-transform group-hover:scale-110" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          variants={fadeIn}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} variants={fadeIn}>
                <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <CardContent className="p-4 pt-4 md:pt-6">
                    <motion.div
                      className="mb-2 w-fit rounded-lg border p-2 transition-all duration-300 group-hover:scale-110 group-hover:border-blue-500/20 md:mb-4"
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="size-4 transition-colors duration-300 group-hover:text-blue-500" />
                    </motion.div>
                    <h2 className="mb-2 font-semibold transition-colors duration-300 group-hover:text-blue-500 dark:group-hover:text-blue-400">
                      {feature.title}
                    </h2>
                    <p className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-muted-foreground/80">
                      {feature.description}
                    </p>

                    <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-gradient-to-r from-blue-500/50 to-purple-500/50 transition-all duration-500 group-hover:w-full dark:from-blue-500/30 dark:to-purple-500/30" />
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Floating particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-blue-500/20"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3,
            delay: i * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.section>
  );
};

export default Landing;
