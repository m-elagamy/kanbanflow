"use client";

import Link from "next/link";
import { Home, LogIn, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import usePageMetadata from "@/hooks/use-page-metadata";
import { ErrorCard } from "@/components/ui/error-card";

export default function Unauthorized() {
  usePageMetadata(
    "Access Denied | KanbanFlow",
    "You do not have permission to access this page. Please log in or return to the homepage.",
  );

  const actions = (
    <>
      <Button size="sm" asChild>
        <Link href="/sign-in">
          <LogIn />
          Log In
        </Link>
      </Button>
      <Button size="sm" asChild variant="secondary">
        <Link href="/">
          <Home />
          Homepage
        </Link>
      </Button>
    </>
  );

  return (
    <ErrorCard
      title="Access Denied"
      description="You don't have permission to access this page. Please log in or return to the homepage."
      icon={<Lock className="size-6 text-muted-foreground" aria-hidden />}
      actions={actions}
    />
  );
}
