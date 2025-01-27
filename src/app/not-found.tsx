"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  const router = useRouter();
  const { isSignedIn: isAuthenticated } = useAuth();

  const handleGoBack = () => {
    router.back();
  };

  useEffect(() => {
    document.title = "KanbanFlow | 404 - Page Not Found";

    const metaDescription = document.querySelector('meta[name="description"]');

    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "We apologize, but the page you're looking for doesn't exist. Please return to the dashboard or go back to the previous page.",
      );
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg border-none">
        <CardHeader className="text-center">
          <AlertCircle className="mx-auto size-10 animate-pulse text-muted-foreground" />
          <CardTitle className="mt-6 text-2xl font-semibold text-muted-foreground">
            404 - Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            We apologize, the page you're looking for doesn't exist.
          </p>
        </CardContent>
        <CardFooter className="items-center justify-center gap-4">
          <Button onClick={handleGoBack}>
            <ArrowLeft /> Go Back
          </Button>
          <Button asChild variant="outline">
            <Link href={isAuthenticated ? "/dashboard" : "/"}>
              <Home />
              {isAuthenticated ? "Return to Dashboard" : "Go to Home"}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
