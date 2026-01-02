import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthCardProps = {
  title: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function AuthCard({
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <Card className="mx-auto w-full sm:w-96 md:w-[420px]">
      <CardHeader className="text-center">
        <CardTitle className="mx-auto">{title}</CardTitle>
        {<CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="grid gap-y-4">{children}</CardContent>
      <CardFooter>
        <div className="grid w-full gap-y-4">{footer}</div>
      </CardFooter>
    </Card>
  );
}
