import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { steps } from "./data";
import HowItWorksBackground from "./how-it-works-background";

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden py-16">
      <HowItWorksBackground />
      <div className="relative z-10">
        <div className="mb-16 text-center">
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/5 mb-4"
            icon={<Sparkles className="h-3.5 w-3.5" />}
          >
            How It Works
          </Badge>
          <h2 className="text-gradient mb-4 text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
            Simple Process to Get Started
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed md:text-lg">
            Get up and running in minutes with our simple 3-step process
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <Card className="group border-border/50 bg-card/50 hover:border-primary/20 hover:bg-card relative h-full overflow-hidden border transition-all duration-300 hover:shadow-md">
                  <CardContent className="relative text-center">
                    <div className="mb-6 flex items-center justify-center">
                      <div className="relative">
                        <div className="bg-primary/10 group-hover:bg-primary/20 rounded-full p-4 transition-colors duration-300">
                          <Icon className="text-primary h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                        </div>
                        <div className="bg-primary text-primary-foreground shadow-primary/30 absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shadow-lg">
                          {step.number}
                        </div>
                      </div>
                    </div>
                    <h3 className="mb-3 text-lg font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>

                {index < steps.length - 1 && (
                  <div className="absolute top-1/2 -right-7 hidden -translate-y-1/2 transform lg:block">
                    <ArrowRight className="text-muted-foreground/40 group-hover:text-primary/50 h-6 w-6 transition-colors duration-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
