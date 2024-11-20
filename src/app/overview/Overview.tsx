"use client";

import { ArrowRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cloneElement } from "react";
import Link from "next/link";
import { fadeIn, stagger } from "@/utils/motion-variants";
import { features } from "./data";

const Overview = () => {
  return (
    <motion.main
      className="min-h-dvh"
      initial="initial"
      animate="animate"
      variants={stagger}
    >
      <section className="container pb-16 pt-32 md:pb-24">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <motion.h1
            className="mb-6 bg-gradient-to-r from-[#4A90E2] via-[#3b4a56] to-[#667eea] bg-clip-text text-3xl font-bold text-transparent md:text-4xl"
            variants={fadeIn}
          >
            Streamline Your Workflow
          </motion.h1>
          <motion.p
            className="mb-8 text-base text-muted-foreground md:text-lg"
            variants={fadeIn}
          >
            A Kanban board built with Next.js and modern web technologies,
            offering seamless task management with real-time updates and smooth
            interactions.
          </motion.p>
          <motion.div className="flex justify-center gap-4" variants={fadeIn}>
            <Button
              className="group relative bg-gradient-to-r from-[#3b4a56] to-[#4A90E2]"
              asChild
            >
              <Link href="/login">
                <span className="relative z-10 flex items-center gap-2">
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

        <motion.div
          className="grid gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-3"
          variants={fadeIn}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group transition-transform duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-4 pt-4 md:pt-6">
                <div
                  className={`mb-2 w-fit rounded-lg border p-2 transition-transform duration-300 group-hover:scale-110 md:mb-4 md:p-3`}
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
      </section>
    </motion.main>
  );
};

export default Overview;
