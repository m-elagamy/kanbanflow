"use client";

import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function SsoCallbackPage() {
  const clerk = useClerk();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();
  const hasRun = useRef(false);

  useEffect(() => {
    if (!clerk.loaded || hasRun.current) return;
    hasRun.current = true;
    const navigate = ({ session, decorateUrl }: { session?: { currentTask?: unknown }; decorateUrl: (url: string) => string }) => {
      if (session?.currentTask) return;
      router.push(decorateUrl("/welcome"));
    };

    (async () => {
      if (signIn.status === "complete")
        return void (await signIn.finalize({ navigate }));
      if (signUp.isTransferable) {
        await signIn.create({ transfer: true });
        if ((signIn.status as string) === "complete")
          return void (await signIn.finalize({ navigate }));
        return router.push("/sign-in");
      }
      if (
        signIn.status === "needs_first_factor" ||
        signIn.status === "needs_second_factor" ||
        signIn.status === "needs_new_password" ||
        signIn.status === "needs_client_trust"
      ) {
        return router.push("/sign-in");
      }
      if (signIn.isTransferable) {
        await signUp.create({ transfer: true });
        if ((signUp.status as string) === "complete")
          return void (await signUp.finalize({ navigate }));
        return router.push("/sign-in/continue");
      }
      if (signUp.status === "complete")
        return void (await signUp.finalize({ navigate }));
      const sessionId =
        signIn.existingSession?.sessionId ?? signUp.existingSession?.sessionId;
      if (sessionId)
        return void (await clerk.setActive({ session: sessionId, navigate }));
      router.push("/sign-in");
    })();
  }, [clerk, router, signIn, signUp]);

  return <div id="clerk-captcha" />;
}
