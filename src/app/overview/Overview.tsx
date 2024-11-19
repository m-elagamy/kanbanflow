"use client";

import {
  ArrowRight,
  Shield,
  Gauge,
  Palette,
  Lock,
  Database,
  GripVertical,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import KanbanLogo from "@/app/overview/components/kanban-logo";
import NavigationButtons from "./components/navigation-buttons";
import { motion } from "framer-motion";
import { cloneElement } from "react";
import Link from "next/link";

const Overview = () => {
  const features = [
    {
      icon: <GripVertical />,
      title: "Effortless Drag & Drop",
      description:
        "Manage tasks with smooth, intuitive movements, powered by Framer Motion.",
    },
    {
      icon: <Database />,
      title: "Real-Time Collaboration",
      description:
        "Stay updated with real-time task changes through Firebase's synchronized database.",
    },
    {
      icon: <Lock />,
      title: "Security",
      description:
        "Secure your workflow with Kinde Auth's robust authentication system.",
    },
    {
      icon: <Palette />,
      title: "Modern UI",
      description:
        "Experience a beautiful and accessible interface built with shadcn/ui components.",
    },
    {
      icon: <Shield />,
      title: "Type Safety",
      description:
        "End-to-end TypeScript integration ensures reliable and maintainable code.",
    },
    {
      icon: <Gauge />,
      title: "Blazing Fast",
      description:
        "Lightning-quick performance with Next.js 15's latest optimizations.",
    },
  ];

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <>
      <header>
        <nav className="fixed left-0 right-0 top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
          <div className="container flex h-16 items-center justify-between">
            <KanbanLogo />
            <NavigationButtons />
          </div>
        </nav>
      </header>

      <motion.main
        className="min-h-dvh"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        <section className="container pb-16 pt-32 md:pb-24">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <motion.h1
              className="mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-3xl font-bold text-transparent md:text-4xl"
              variants={fadeIn}
            >
              Streamline Your Workflow
            </motion.h1>
            <motion.p
              className="mb-8 text-base text-muted-foreground md:text-lg"
              variants={fadeIn}
            >
              A Kanban board built with Next.js and modern web technologies,
              offering seamless task management with real-time updates and
              smooth interactions.
            </motion.p>
            <motion.div className="flex justify-center gap-4" variants={fadeIn}>
              <Button
                className="group relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
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
                  <h3 className="mb-2 font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </section>
      </motion.main>
    </>
  );
};

export default Overview;
