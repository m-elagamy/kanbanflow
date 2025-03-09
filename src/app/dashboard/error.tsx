"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorCard } from "@/components/ui/error-card";
import usePageMetadata from "@/hooks/use-page-metadata";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  usePageMetadata(
    "Error | KanbanFlow",
    "An error occurred while processing your request. Please try again.",
  );

  const actions = (
    <>
      <Button size="sm" onClick={() => reset()}>
        Try again
      </Button>
      <Button size="sm" variant="outline" asChild>
        <Link href="/dashboard">Return to dashboard</Link>
      </Button>
    </>
  );

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorCard
      title="Something went wrong!"
      description="We apologize for the inconvenience."
      icon={<AlertTriangle className="size-8" />}
      actions={actions}
      helperText="If the problem persists, please try again later."
    />
  );
}
