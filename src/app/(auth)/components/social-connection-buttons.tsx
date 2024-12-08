import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import * as Clerk from "@clerk/elements/common";
import { Loader } from "lucide-react";

export default function SocialConnectionButtons({
  isGlobalLoading,
}: {
  isGlobalLoading: boolean;
}) {
  return (
    <div className="grid gap-y-4">
      <Clerk.Connection name="google" asChild>
        <Button
          variant="outline"
          type="button"
          aria-label="Sign in with GitHub"
          className="relative z-[2] dark:hover:bg-accent/25"
          disabled={isGlobalLoading}
        >
          <Clerk.Loading scope="provider:google">
            {(isLoading) =>
              isLoading ? (
                <Loader className="animate-spin" />
              ) : (
                <>
                  <Icons.google className="" />
                  Continue with Google
                </>
              )
            }
          </Clerk.Loading>
        </Button>
      </Clerk.Connection>
      <Clerk.Connection name="github" asChild>
        <Button
          variant="outline"
          type="button"
          aria-label="Sign in with GitHub"
          className="relative z-[2] dark:hover:bg-accent/25"
          disabled={isGlobalLoading}
        >
          <Clerk.Loading scope="provider:github">
            {(isLoading) =>
              isLoading ? (
                <Loader className="animate-spin" />
              ) : (
                <>
                  <Icons.gitHub />
                  Continue with GitHub
                </>
              )
            }
          </Clerk.Loading>
        </Button>
      </Clerk.Connection>
    </div>
  );
}
