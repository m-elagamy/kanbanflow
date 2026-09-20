"use client";

import { useSignIn } from "@clerk/nextjs";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import KanbanLogo from "@/components/layout/header/kanban-logo";
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

type Step = "email" | "code" | "password";

export default function ForgotPasswordPage() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const loading = fetchStatus === "fetching";
  const clerkMessage =
    step === "email"
      ? errors.fields.identifier?.message
      : step === "code"
        ? errors.fields.code?.message
        : errors.fields.password?.message;
  const message = formError ?? clerkMessage ?? errors.global?.[0]?.message;

  const navigate = ({ decorateUrl }: { decorateUrl: (url: string) => string }) =>
    router.replace(decorateUrl("/welcome"));

  async function sendCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setNotice(null);

    const create = await signIn.create({ identifier: email });
    if (create.error) {
      setFormError("We couldn’t send a reset code. Check your email and try again.");
      return;
    }

    const send = await signIn.resetPasswordEmailCode.sendCode();
    if (send.error) return;
    setStep("code");
  }

  async function verifyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setNotice(null);

    const result = await signIn.resetPasswordEmailCode.verifyCode({ code });
    if (result.error) return;
    if (signIn.status !== "needs_new_password") {
      setFormError("We couldn’t verify that code. Please request a new one.");
      return;
    }

    setStep("password");
  }

  async function resetPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setNotice(null);

    if (password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }

    const result = await signIn.resetPasswordEmailCode.submitPassword({
      password,
      signOutOfOtherSessions: true,
    });
    if (result.error || signIn.status !== "complete") return;
    await signIn.finalize({ navigate });
  }

  async function resendCode() {
    setFormError(null);
    setNotice(null);
    const result = await signIn.resetPasswordEmailCode.sendCode();
    if (result.error) return;
    setNotice("A new code was sent to your email.");
  }

  return (
    <Card className="mx-auto w-full sm:w-96 md:w-[420px]">
      <CardHeader className="text-center">
        <CardTitle className="mx-auto">
          <KanbanLogo />
        </CardTitle>
        <CardDescription>
          {step === "email" && "Enter your email and we’ll send you a reset code."}
          {step === "code" && `Enter the code sent to ${email}.`}
          {step === "password" && "Choose a new password for your account."}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {message && (
          <p role="alert" className="text-sm text-destructive">
            {message}
          </p>
        )}
        {notice && <p role="status" className="text-sm text-muted-foreground">{notice}</p>}

        {step === "email" && (
          <form className="grid gap-3" onSubmit={sendCode}>
            <Label htmlFor="reset-email">Email address</Label>
            <Input
              id="reset-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Button disabled={loading}>
              {loading && <LoaderCircle className="animate-spin" />}
              Send reset code
            </Button>
          </form>
        )}

        {step === "code" && (
          <form className="grid gap-3" onSubmit={verifyCode}>
            <Label htmlFor="reset-code">Reset code</Label>
            <Input
              id="reset-code"
              autoFocus
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              value={code}
              onChange={(event) => setCode(event.target.value)}
            />
            <Button disabled={loading}>
              {loading && <LoaderCircle className="animate-spin" />}
              Verify code
            </Button>
            <Button type="button" variant="link" disabled={loading} onClick={() => void resendCode()}>
              Send a new code
            </Button>
          </form>
        )}

        {step === "password" && (
          <form className="grid gap-3" onSubmit={resetPassword}>
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button disabled={loading}>
              {loading && <LoaderCircle className="animate-spin" />}
              Reset password
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <Button variant="link" onClick={() => router.replace("/sign-in")}>
          Back to sign in
        </Button>
      </CardFooter>
    </Card>
  );
}
