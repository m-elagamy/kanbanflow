"use client";

import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import { LoaderCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import BackgroundEffect from "@/app/(auth)/components/background-effect";
import KanbanLogo from "@/components/layout/header/kanban-logo";
import { Button } from "@/components/ui/button";

type NavigateOptions = {
  session?: { currentTask?: unknown };
  decorateUrl: (url: string) => string;
};

export default function SsoCallbackPage() {
  const clerk = useClerk();
  const { signIn, errors: signInErrors } = useSignIn();
  const { signUp, errors: signUpErrors } = useSignUp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRun = useRef(false);
  const [message, setMessage] = useState("Completing your secure sign-in…");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clerk.loaded || hasRun.current) return;

    hasRun.current = true;
    const navigate = ({ session, decorateUrl }: NavigateOptions) => {
      if (session?.currentTask) {
        setMessage("Your account needs one more step to finish signing in.");
        return;
      }

      const url = decorateUrl("/welcome");
      if (url.startsWith("http")) {
        window.location.assign(url);
        return;
      }

      router.replace(url);
    };

    void (async () => {
      try {
        if (signIn.status === "complete") {
          await signIn.finalize({ navigate });
          return;
        }

        if (signUp.isTransferable) {
          setMessage("Matching your account…");
          await signIn.create({ transfer: true });
          if ((signIn.status as string) === "complete") {
            await signIn.finalize({ navigate });
            return;
          }
          router.replace("/sign-in");
          return;
        }

        if (
          signIn.status === "needs_first_factor" ||
          signIn.status === "needs_second_factor" ||
          signIn.status === "needs_new_password" ||
          signIn.status === "needs_client_trust"
        ) {
          router.replace("/sign-in");
          return;
        }

        if (signIn.isTransferable) {
          setMessage("Creating your account…");
          await signUp.create({ transfer: true });
          if ((signUp.status as string) === "complete") {
            await signUp.finalize({ navigate });
            return;
          }
          router.replace("/sign-in/continue");
          return;
        }

        if (signUp.status === "complete") {
          await signUp.finalize({ navigate });
          return;
        }

        const sessionId =
          signIn.existingSession?.sessionId ?? signUp.existingSession?.sessionId;
        if (sessionId) {
          await clerk.setActive({ session: sessionId, navigate });
          return;
        }

        const provider = searchParams.get("provider");
        const clerkError =
          signInErrors.global?.[0]?.message ??
          signUpErrors.global?.[0]?.message;
        if (clerkError) {
          setError(clerkError);
          return;
        }

        router.replace(
          `/sign-in?oauth=incomplete${provider ? `&provider=${provider}` : ""}`,
        );
      } catch {
        setError("We couldn’t complete the sign-in. Please try again.");
      }
    })();
  }, [
    clerk,
    router,
    searchParams,
    signIn,
    signInErrors.global,
    signUp,
    signUpErrors.global,
  ]);

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4">
      <BackgroundEffect />
      <section className="grid w-full max-w-sm justify-items-center gap-8 text-center [&>div:first-child]:!mx-auto">
        <KanbanLogo glow="auth" />
        {error ? (
          <div className="grid justify-items-center gap-4">
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
            <Button onClick={() => router.replace("/sign-in")}>Back to sign in</Button>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-full border bg-background/70 px-4 py-3 shadow-sm backdrop-blur">
            <LoaderCircle className="size-4 animate-spin text-primary" aria-hidden="true" />
            <p role="status" className="text-sm text-muted-foreground">
              {message}
            </p>
          </div>
        )}
      </section>
      <div id="clerk-captcha" />
    </main>
  );
}
