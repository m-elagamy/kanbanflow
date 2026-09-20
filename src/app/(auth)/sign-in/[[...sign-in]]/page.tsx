"use client";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import KanbanLogo from "@/components/layout/header/kanban-logo";
export default function SignInPage() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const r = useRouter();
  const [e, se] = useState("");
  const [c, sc] = useState("");
  const [s, ss] = useState<"email" | "code">("email");
  const [p, sp] = useState<"oauth_google" | "oauth_github" | null>(null);
  const loading = fetchStatus === "fetching";
  const msg =
    (s === "email" ? errors.fields.identifier : errors.fields.code)?.message ??
    errors.global?.[0]?.message;
  const nav = ({ decorateUrl }: { decorateUrl: (x: string) => string }) =>
    r.push(decorateUrl("/welcome"));
  async function email(x: React.FormEvent) {
    x.preventDefault();
    if ((await signIn.create({ identifier: e })).error) return;
    if (!(await signIn.emailCode.sendCode()).error) ss("code");
  }
  async function code(x: React.FormEvent) {
    x.preventDefault();
    if (
      (await signIn.emailCode.verifyCode({ code: c })).error ||
      signIn.status !== "complete"
    )
      return;
    await signIn.finalize({ navigate: nav });
  }
  async function sso(x: "oauth_google" | "oauth_github") {
    sp(x);
    const { error } = await signIn.sso({
      strategy: x,
      redirectUrl: "/welcome",
      redirectCallbackUrl: "/sso-callback",
    });
    if (error) sp(null);
  }
  return (
    <Card className="mx-auto w-full sm:w-96 md:w-[420px]">
      <CardHeader className="text-center">
        <CardTitle className="mx-auto">
          <KanbanLogo />
        </CardTitle>
        <CardDescription>
          {s === "email"
            ? "Welcome back! Use Google, GitHub, or an email code to sign in."
            : `Enter the verification code sent to ${e}.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {msg && <p className="text-destructive text-sm">{msg}</p>}
        {s === "email" ? (
          <>
            <div className="grid gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={loading || p !== null}
                onClick={() => void sso("oauth_google")}
              >
                {p === "oauth_google" ? (
                  <Loader className="animate-spin" />
                ) : (
                  <Icons.google />
                )}
                Continue with Google
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={loading || p !== null}
                onClick={() => void sso("oauth_github")}
              >
                {p === "oauth_github" ? (
                  <Loader className="animate-spin" />
                ) : (
                  <Icons.gitHub />
                )}
                Continue with GitHub
              </Button>
            </div>
            <p className="text-muted-foreground text-center text-sm">
              or continue with email
            </p>
            <form className="grid gap-3" onSubmit={email}>
              <Label>Email address</Label>
              <Input
                type="email"
                required
                value={e}
                onChange={(x) => se(x.target.value)}
              />
              <Button disabled={loading}>Continue</Button>
            </form>
          </>
        ) : (
          <form className="grid gap-3" onSubmit={code}>
            <Label>Email verification code</Label>
            <Input
              autoFocus
              required
              value={c}
              onChange={(x) => sc(x.target.value)}
            />
            <Button disabled={loading}>Verify</Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="justify-center">
        Don&apos;t have an account?
        <Button variant="link" onClick={() => r.push("/sign-up")}>
          Sign up
        </Button>
      </CardFooter>
    </Card>
  );
}
