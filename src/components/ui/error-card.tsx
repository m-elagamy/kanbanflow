import { ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";

type ErrorCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  actions: ReactNode;
  helperText?: string;
};

export const ErrorCard = ({
  title,
  description,
  icon,
  actions,
  helperText,
}: ErrorCardProps) => {
  return (
    <div className="flex min-h-screen grow items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto">{icon}</div>
          <CardTitle className="text-xl font-semibold text-muted-foreground">
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col">
          {
            <div className="flex items-center justify-center gap-4">
              {actions}
            </div>
          }
          {helperText && (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              {helperText}
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
