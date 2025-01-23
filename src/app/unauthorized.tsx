import Link from "next/link";
import { ShieldAlertIcon, Home, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="mb-4 flex justify-center">
            <ShieldAlertIcon className="h-12 w-12 text-muted-foreground" />
          </div>
          <CardTitle className="text-center text-2xl font-semibold">
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            You don't have permission to access this page. Please log in or
            return to the homepage.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button asChild>
            <Link href="/sign-in">
              <LogIn />
              Log In
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <Home />
              Homepage
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
