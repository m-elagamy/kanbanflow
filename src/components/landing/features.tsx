import { Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { features } from "./data";

export default function Features() {
  return (
    <>
      <div className="mb-6 flex items-center justify-center">
        <Badge
          variant="outline"
          className="border-primary/20 bg-primary/5"
          icon={<Sparkles className="h-3.5 w-3.5" />}
        >
          Features
        </Badge>
      </div>
      <div className="mb-16 flex flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-gradient text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
          What&apos;s in KanbanFlow?
        </h2>
        <p className="text-muted-foreground max-w-2xl text-base leading-relaxed md:text-lg">
          Discover the powerful features that make project management intuitive,
          and effortlessly efficient.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card
              key={index}
              className="group bg-card/50 hover:border-primary/20 hover:bg-card hover:shadow-primary/5 relative overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
            >
              <div className="to-primary/5 absolute inset-0 bg-linear-to-br from-transparent via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <CardContent className="relative p-6">
                <div className="group-hover:border-primary/30 group-hover:bg-primary/5 border-primary/25 mb-4 w-fit rounded-lg border p-3 shadow-sm transition-all duration-300 group-hover:scale-110">
                  <Icon className="group-hover:text-primary size-5 transition-colors duration-300" />
                </div>
                <h3 className="group-hover:text-primary/90 mb-2 text-lg font-semibold transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground group-hover:text-foreground/70 text-sm leading-relaxed transition-colors duration-300">
                  {feature.description}
                </p>

                <div className="from-primary/50 to-secondary/50 absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r transition-all duration-500 group-hover:w-full" />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
