import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import FloatingParticlesWrapper from "./floating-particles-wrapper";

export default function Hero() {
  return (
    <div className="my-20 grid min-h-96 place-content-center text-center">
      <div className="mb-4 flex items-center justify-center">
        <Badge
          variant="secondary"
          icon={
            <span className="relative flex h-2 w-2">
              <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
              <span className="bg-primary relative inline-flex h-2 w-2 rounded-full" />
            </span>
          }
        >
          Introducing KanbanFlow
        </Badge>
      </div>
      <div className="relative">
        <FloatingParticlesWrapper />
        <h1 className="text-gradient mb-6 text-4xl font-extrabold tracking-tighter md:text-5xl">
          Streamline Your Workflow
        </h1>
        <p className="text-muted-foreground mb-6 max-w-3xl md:text-xl">
          Stay organized, manage tasks effortlessly, and boost productivity with
          real-time updates. KanbanFlow helps you achieve more with a seamless
          and intuitive experience.
        </p>
      </div>
      <Button className="group mx-auto w-fit rounded-full" asChild>
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
