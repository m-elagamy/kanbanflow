import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";
import { Button } from "../ui/button";
import FloatingParticles from "./floating-particles";

export default function Hero() {
  return (
    <div className="grid h-[calc(100vh-64px)] place-content-center pb-8 text-center">
      <div className="relative mb-6">
        <FloatingParticles />
        <h1 className="bg-gradient-to-tr from-[#111] via-[#333] to-[#555] bg-clip-text text-4xl font-extrabold tracking-tighter text-transparent [text-shadow:_0_1px_2px_rgba(0,0,0,0.1)] dark:from-gray-300 dark:via-gray-400 dark:to-gray-200 dark:[text-shadow:_0_1px_2px_rgba(255,255,255,0.1)] md:text-6xl [&::selection]:bg-gray-700/90 [&::selection]:text-white dark:[&::selection]:bg-gray-300/90 dark:[&::selection]:text-gray-900">
          Streamline Your Workflow
        </h1>
      </div>
      <p className="mb-8 max-w-3xl text-sm text-muted-foreground md:text-base">
        Take control of your projects and achieve more with ease! KanbanFlow
        helps you manage tasks, organize projects, and boost productivity with
        real-time updates.
      </p>

      <div className="flex justify-center gap-4">
        <Button className="group rounded-full" asChild>
          <Link href="/login">
            <span className="relative z-10 flex items-center gap-2 font-semibold">
              Get Started
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-105" />
            </span>
          </Link>
        </Button>

        <Button
          variant="outline"
          className="group rounded-full hover:bg-accent/25"
          asChild
        >
          <Link href="/demo">
            View Demo
            <Eye className="transition-transform duration-300 group-hover:scale-110" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
