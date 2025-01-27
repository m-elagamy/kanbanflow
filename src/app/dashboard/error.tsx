"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-grow flex-col items-center justify-center bg-background p-4 text-foreground">
      <h1 className="mb-2 text-4xl font-bold">Something went wrong!</h1>
      <p className="mb-8 text-xl">We apologize for the inconvenience.</p>
      <div className="flex space-x-4">
        <Button onClick={() => reset()} variant="outline">
          Try again
        </Button>
        <Button asChild>
          <Link href="/dashboard">Go to homepage</Link>
        </Button>
      </div>
      <p className="mt-8 text-sm text-muted-foreground">
        If the problem persists, please try again later.
      </p>
    </div>
  );
}
