import type { Metadata } from "next";
import Link from "next/link";
import { Home, LogIn, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorCard } from "@/components/ui/error-card";

export const metadata: Metadata = {
  title: "Access Denied",
  description:
    "You do not have permission to access this page. Please log in or return to the homepage.",
};

export default function Unauthorized() {
  const actions = (
    <>
      <Button size="sm" asChild variant="outline">
        <Link href="/">
          <Home />
          Homepage
        </Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/sign-in">
          <LogIn />
          Log In
        </Link>
      </Button>
    </>
  );

  return (
    <ErrorCard
      title="Access Denied"
      description="You don't have permission to access this page."
      icon={<Lock className="text-muted-foreground size-6" aria-hidden />}
      actions={actions}
      helperText="Your session may have expired. Please log in again."
    />
  );
}
