"use client";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  ArrowRight,
  Grip,
  Users,
  Code,
  Sparkles,
  Shield,
  Zap,
  Moon,
  Sun,
  Github,
  Flame,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const LandingPage = () => {
  const { theme, setTheme } = useTheme();

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

  const features = [
    {
      icon: <Grip className="h-6 w-6" />,
      title: "Intuitive Drag & Drop",
      description: "Smooth animations powered by Framer Motion",
    },
    {
      icon: <Flame className="h-6 w-6" />,
      title: "Real-time Firebase",
      description: "Instant updates with Firebase Realtime Database",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Secure Auth",
      description: "Enterprise authentication with Kinde",
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Modern UI",
      description: "Beautiful components with shadcn/ui",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Type-Safe",
      description: "End-to-end type safety with TypeScript",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Optimized performance with Next.js 15",
    },
  ];

  const techStack = [
    {
      icon: <Code className="h-6 w-6" />,
      name: "Next.js 15",
      description: "Latest features including Server Actions",
    },
    {
      icon: <Flame className="h-6 w-6" />,
      name: "Firebase",
      description: "Real-time Database & Storage",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      name: "Kinde Auth",
      description: "Secure Authentication",
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      name: "shadcn/ui",
      description: "Beautiful, accessible components",
    },
  ];

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <motion.div className="container mx-auto flex h-16 items-center justify-between px-6">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="h-8 w-8 rotate-45 transform rounded-lg bg-primary transition-transform hover:rotate-90" />
            <span className="text-2xl font-bold text-primary">KanbanFlow</span>
          </motion.div>

          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button variant="outline">Try Demo</Button>
            <Button>Sign In</Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </motion.div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <motion.section
        className="container mx-auto px-6 pb-24 pt-32 text-center"
        initial="initial"
        animate="animate"
        variants={stagger}
      >
        <motion.h1 className="mb-6 text-6xl font-bold" variants={fadeIn}>
          Elevate Your Workflow!
        </motion.h1>
        <motion.p
          className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground"
          variants={fadeIn}
        >
          A Kanban board built with Next.js and modern web technologies,
          offering seamless task management with real-time updates and smooth
          interactions.
        </motion.p>
        <motion.div className="space-x-4" variants={fadeIn}>
          <Button className="gap-2">
            Get Started <ArrowRight />
          </Button>
          <Button variant="outline">Try Demo</Button>
        </motion.div>
      </motion.section>

      {/* Features Grid */}
      <motion.section
        className="container mx-auto px-6 py-24"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={stagger}
      >
        <motion.h2
          className="mb-16 text-center text-3xl font-bold"
          variants={fadeIn}
        >
          Powered by Modern Tech
        </motion.h2>
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div key={index} variants={fadeIn} whileHover={{ y: -5 }}>
              <Card>
                <CardHeader>
                  <div className="mb-4 flex size-14 items-center justify-center rounded-lg bg-primary/10 p-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Tech Stack */}
      <section className="container mx-auto px-6 py-24">
        <Card className="mx-auto max-w-4xl">
          <CardHeader>
            <h2 className="text-center text-3xl font-bold">
              Built with Modern Tech
            </h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              {techStack.map((tech, index) => (
                <div key={index}>
                  <div className="flex items-center gap-4">
                    <div className={`rounded-lg p-2`}>{tech.icon}</div>
                    <div>
                      <h3 className="font-semibold">{tech.name}</h3>
                      <p className="text-muted-foreground">
                        {tech.description}
                      </p>
                    </div>
                  </div>
                  {index < techStack.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <motion.section
        className="container mx-auto px-6 py-24"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <Card className="mx-auto max-w-4xl p-12 text-center">
          <CardContent className="space-y-4">
            <h3 className="text-4xl font-bold">Ready to Get Started?</h3>
            <p className="text-xl text-muted-foreground">
              Experience the next evolution in task management.
            </p>
            <Button>
              Get Started <ArrowRight />
            </Button>
          </CardContent>
        </Card>
      </motion.section>

      <footer className="container mx-auto border-t px-6 py-8 text-center text-muted-foreground">
        <p className="text-sm">© 2024 KanbanFlow. All rights reserved.</p>
        <div className="mt-4 flex items-center justify-center">
          <Button variant="ghost" size="sm" asChild>
            <a href="https://agamy.netlify.app" target="_blank">
              <Globe />
              <span>Portfolio</span>
            </a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="https://github.com/Mahmoud-Elagamy" target="_blank">
              <Github />
              <span>GitHub</span>
            </a>
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
