"use client";

import { cloneElement } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fadeIn, stagger } from "@/utils/motion-variants";
import { features } from "./data";

const Landing = () => {
  return (
    <motion.section initial="initial" animate="animate" variants={stagger}>
      <div className="container pb-16 pt-32 md:pb-24">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <motion.h1
            className="mb-6 bg-gradient-to-br from-black/80 via-neutral-600 to-neutral-700 bg-clip-text text-3xl font-extrabold text-transparent dark:from-white/80 dark:via-neutral-300 dark:to-neutral-400 md:text-5xl"
            variants={fadeIn}
          >
            Streamline Your Workflow
          </motion.h1>
          <motion.p
            className="mb-8 text-base text-muted-foreground md:text-lg"
            variants={fadeIn}
          >
            Take control of your projects and achieve more with ease! KanbanFlow
            helps you manage tasks, organize projects, and boost productivity
            with real-time updates.
          </motion.p>
          <motion.div className="flex justify-center gap-4" variants={fadeIn}>
            <Button
              className="group relative bg-gradient-to-r from-[#4F6373] via-[#3F8DA0] to-[#4DA3E8]"
              asChild
            >
              <Link href="/login">
                <span className="relative z-10 flex items-center gap-2 text-sm font-semibold">
                  Get Started
                  <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Button>

            <Button
              variant="outline"
              className="group hover:bg-muted/30"
              asChild
            >
              <Link href="/demo">
                <span className="flex items-center gap-2">
                  View Demo
                  <Eye className="transition-transform group-hover:scale-110" />
                </span>
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          variants={fadeIn}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group transition-transform duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-4 pt-4 md:pt-6">
                <div
                  className={`mb-2 w-fit rounded-lg border p-2 transition-transform duration-300 group-hover:scale-110 md:mb-4`}
                >
                  {cloneElement(feature.icon, {
                    className: "size-4",
                  })}
                </div>
                <h2 className="mb-2 font-semibold">{feature.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Landing;
