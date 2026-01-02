import { Badge } from "../ui/badge";
import FloatingParticlesWrapper from "./floating-particles-wrapper";
import DashboardPreview from "./dashboard-preview";
import { Tilt } from "../ui/tilt";
import CtaButton from "./cta-button";

export default function Hero() {
  return (
    <div className="my-20 grid min-h-96 text-center md:mt-40">
      <div className="mb-4 flex items-center justify-center">
        <Badge
          variant="outline"
          className="border-primary/20 bg-primary/5"
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
      <div className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both relative duration-500">
        <FloatingParticlesWrapper />
        <h1 className="text-gradient mb-6 text-4xl font-extrabold tracking-tighter md:text-5xl lg:text-6xl">
          Streamline Your Workflow
        </h1>
        <p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-base leading-relaxed md:text-lg">
          Stay organized, manage tasks effortlessly, and boost productivity with
          real-time updates. KanbanFlow helps you achieve more with a seamless
          and intuitive experience.
        </p>
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500">
        <CtaButton variant="cta-section" className="mx-auto w-fit" />
      </div>
      <div className="mt-8 md:mt-12">
        <Tilt rotationFactor={2} isRevese>
          <DashboardPreview />
        </Tilt>
      </div>
    </div>
  );
}
