import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "./button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./card";

function BoardErrorCard({
  onRetry,
  onBack,
  isPending = false,
}: {
  onRetry: () => void;
  onBack: () => void;
  isPending?: boolean;
}) {
  return (
    <Card
      className="border-border bg-background mx-auto w-full max-w-md border shadow-lg"
      aria-busy={isPending}
    >
      <CardHeader className="flex-col items-center">
        <AlertCircle className="text-destructive h-6 w-6" aria-hidden />
        <CardTitle className="text-center text-xl font-semibold">
          We couldn’t confirm your board was saved
        </CardTitle>
        <CardDescription className="text-center">
          Retry to finish creating it or recover the saved board. Retrying this
          attempt won’t create a duplicate.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={onBack}
          disabled={isPending}
        >
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Button>
        <Button
          type="button"
          className="w-full sm:w-auto"
          onClick={onRetry}
          disabled={isPending}
        >
          <RefreshCw className={`size-4 ${isPending ? "animate-spin" : ""}`} />
          {isPending ? "Retrying…" : "Retry"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default BoardErrorCard;
