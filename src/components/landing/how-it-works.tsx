import { CheckCircle, ArrowRight, Play, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { steps } from "./data";

export function HowItWorks() {
  return (
    <section className="py-16">
      <div className="mb-12 text-center">
        <Badge
          variant="secondary"
          className="mb-4"
          icon={<Sparkles className="h-3.5 w-3.5" />}
        >
          How It Works
        </Badge>
        <h2 className="text-gradient mb-4 text-3xl font-bold tracking-tighter md:text-4xl">
          Simple Process to Get Started
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Get up and running in minutes with our simple 3-step process
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="relative">
              <Card className="group from-card to-card/50 h-full bg-gradient-to-b transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="relative animate-pulse">
                      <div className="bg-primary/10 rounded-full p-3">
                        <Icon className="text-primary h-6 w-6" />
                      </div>
                      <div className="bg-primary text-primary-foreground absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                        {step.number}
                      </div>
                    </div>
                  </div>
                  <h3 className="mb-3 font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </CardContent>
              </Card>

              {index < steps.length - 1 && (
                <div className="absolute top-1/2 -right-7 hidden -translate-y-1/2 transform lg:block">
                  <ArrowRight className="text-muted-foreground/30 h-6 w-6" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
