import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "./button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

function BoardErrorCard({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="animate-fadeIn mx-auto w-full max-w-md border border-border bg-background shadow-lg">
      <CardHeader className="flex-col items-center">
        <AlertCircle className="h-6 w-6 text-destructive" aria-hidden />
        <CardTitle className="text-xl font-semibold">
          Board Creation Failed
        </CardTitle>
        <CardDescription className="text-center">
          Oops! We couldn’t save your board due to a server error. Please choose
          whether to try again or return to the dashboard.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button
          variant="outline"
          className="group/return w-full sm:w-auto"
          asChild
        >
          <Link href="/dashboard" aria-label="Return to Dashboard">
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover/return:-translate-x-1" />
            Return to Dashboard
          </Link>
        </Button>
        <Button
          className="group/retry-button w-full sm:w-auto"
          onClick={onRetry}
        >
          <RefreshCw className="size-4 transition-transform duration-300 group-hover/retry-button:rotate-180" />
          Retry Creation
        </Button>
      </CardFooter>
    </Card>
  );
}

export default BoardErrorCard;
