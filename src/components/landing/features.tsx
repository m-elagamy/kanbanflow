import { Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { features } from "./data";

export default function Features() {
  return (
    <>
      <div className="mb-4 flex items-center justify-center">
        <Badge variant="secondary" icon={<Sparkles className="h-3.5 w-3.5" />}>
          Features
        </Badge>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 pb-12 text-center">
        <h2 className="text-gradient text-2xl font-bold tracking-tighter md:text-3xl">
          What&apos;s in KanbanFlow?
        </h2>
        <p className="text-muted-foreground md:text-xl">
          Discover the powerful features that make project management intuitive,
          and effortlessly efficient.
        </p>
      </div>
      <div className="grid gap-4 pb-16 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card
              key={index}
              className="group bg-card from-card to-card/50 relative overflow-hidden bg-gradient-to-b p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-blue-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <CardContent className="p-6">
                <div className="mb-2 w-fit rounded-lg border p-2 transition-all duration-300 group-hover:scale-110 group-hover:border-blue-500/20 md:mb-4">
                  <Icon className="size-5 transition-colors duration-300 group-hover:text-blue-500" />
                </div>
                <h2 className="mb-2 font-semibold transition-colors duration-300 group-hover:text-blue-500 dark:group-hover:text-blue-400">
                  {feature.title}
                </h2>
                <p className="text-muted-foreground group-hover:text-muted-foreground/80 text-sm transition-colors duration-300">
                  {feature.description}
                </p>

                <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-linear-to-r from-blue-500/50 to-purple-500/50 transition-all duration-500 group-hover:w-full dark:from-blue-500/30 dark:to-purple-500/30" />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
