import { Card, CardContent } from "../ui/card";
import { features } from "./data";

export function Features() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <Card
            key={index}
            className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <CardContent className="p-4 pt-4 md:pt-6">
              <div className="mb-2 w-fit rounded-lg border p-2 transition-all duration-300 group-hover:scale-110 group-hover:border-blue-500/20 md:mb-4">
                <Icon className="size-4 transition-colors duration-300 group-hover:text-blue-500" />
              </div>
              <h2 className="mb-2 font-semibold transition-colors duration-300 group-hover:text-blue-500 dark:group-hover:text-blue-400">
                {feature.title}
              </h2>
              <p className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-muted-foreground/80">
                {feature.description}
              </p>

              <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-gradient-to-r from-blue-500/50 to-purple-500/50 transition-all duration-500 group-hover:w-full dark:from-blue-500/30 dark:to-purple-500/30" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
