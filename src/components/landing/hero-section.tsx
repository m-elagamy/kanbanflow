import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import FloatingParticles from "./floating-particles";

export default function Hero() {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] place-content-center text-center">
      <div className="relative mb-6">
        <FloatingParticles />
        <h1 className="text-gradient text-4xl font-extrabold tracking-tighter md:text-6xl">
          Streamline Your Workflow
        </h1>
      </div>
      <p className="mb-8 max-w-3xl text-sm text-muted-foreground md:text-base">
        Take control of your projects and achieve more with ease! KanbanFlow
        helps you manage tasks, organize projects, and boost productivity with
        real-time updates.
      </p>
      <Button className="group mx-auto w-fit" asChild>
        <Link href="/sign-up">
          <span className="relative z-10 flex items-center gap-2 font-semibold">
            Get Started
            <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-105" />
          </span>
        </Link>
      </Button>
    </div>
  );
}
