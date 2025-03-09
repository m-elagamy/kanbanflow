"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import usePageMetadata from "@/hooks/use-page-metadata";
import { ErrorCard } from "@/components/ui/error-card";

export default function NotFound() {
  const router = useRouter();

  usePageMetadata(
    "404 - Page Not Found | KanbanFlow",
    "We apologize, but the page you're looking for doesn't exist. Please return to the dashboard or go back to the previous page.",
  );

  const handleGoBack = () => router.back();

  const actions = (
    <>
      <Button size="sm" onClick={handleGoBack}>
        <ArrowLeft /> Go Back
      </Button>
      <Button size="sm" asChild variant="outline">
        <Link href="/">
          <Home />
          Return Home
        </Link>
      </Button>
    </>
  );

  return (
    <ErrorCard
      title="404 - Page Not Found"
      description="We apologize, the page you're looking for doesn't exist."
      icon={
        <AlertCircle className="size-6 animate-pulse text-muted-foreground" />
      }
      actions={actions}
      helperText="Please check the URL or return to the homepage."
    />
  );
}
