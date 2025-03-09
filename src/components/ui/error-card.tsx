import { ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";

interface ErrorCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  actions: ReactNode;
}

export const ErrorCard = ({
  title,
  description,
  icon,
  actions,
}: ErrorCardProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-2 text-center">
          {/* Icon above the title */}
          <div className="mx-auto">{icon}</div>
          <CardTitle className="text-xl font-semibold text-muted-foreground">
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardFooter className="items-center justify-center gap-4">
          {actions}
        </CardFooter>
      </Card>
    </div>
  );
};
