"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorCard } from "@/components/ui/error-card";
import usePageMetadata from "@/hooks/use-page-metadata";

export default function BoardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  usePageMetadata(
    "Error | KanbanFlow",
    "An error occurred while loading this board. Please try again.",
  );

  const actions = (
    <>
      <Button size="sm" variant="outline" onClick={() => reset()}>
        Try again
      </Button>
      <Button size="sm" asChild>
        <Link href="/dashboard">Return to dashboard</Link>
      </Button>
    </>
  );

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorCard
      title="This board couldn't be loaded"
      description="Something went wrong while rendering this board."
      icon={<AlertTriangle className="size-8" />}
      actions={actions}
      helperText="If the problem persists, please try again later."
    />
  );
}
