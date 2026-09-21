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
import { OtpInput } from "@/components/ui/otp-input";
import { emailPasswordSchema, emailSchemaForAuth, getFieldErrors, getValidationMessage, verificationCodeSchema } from "@/schemas/auth";

type Step = "email" | "code" | "password";

export default function ForgotPasswordPage() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
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
  function validateField(field: string, value: string, schema: typeof emailPasswordSchema.shape.email) {
    const message = getValidationMessage(schema, value);
    setFieldErrors((current) => message ? { ...current, [field]: message } : Object.fromEntries(Object.entries(current).filter(([key]) => key !== field)));
  }

  async function sendCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setNotice(null);
    const validated = emailSchemaForAuth.safeParse({ email });
    if (!validated.success) {
      setFieldErrors(getFieldErrors(validated.error));
      return;
    }
    setFieldErrors({});

    const create = await signIn.create({ identifier: validated.data.email });
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
    const validated = verificationCodeSchema.safeParse({ code });
    if (!validated.success) {
      setFieldErrors(getFieldErrors(validated.error));
      return;
    }
    setFieldErrors({});

    const result = await signIn.resetPasswordEmailCode.verifyCode(validated.data);
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

    const validated = emailPasswordSchema.shape.password.safeParse(password);
    if (!validated.success) {
      setFieldErrors({ password: validated.error.issues[0].message });
      return;
    }
    setFieldErrors({});

    const result = await signIn.resetPasswordEmailCode.submitPassword({
      password: validated.data,
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
          <form className="grid gap-3" noValidate onSubmit={sendCode}>
            <Label htmlFor="reset-email">Email address</Label>
            <Input
              id="reset-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => { setEmail(event.target.value); validateField("email", event.target.value, emailSchemaForAuth.shape.email); }}
            />
            {fieldErrors.email && <p className="text-destructive text-sm">{fieldErrors.email}</p>}
            <Button disabled={loading}>
              {loading && <LoaderCircle className="animate-spin" />}
              Send reset code
            </Button>
          </form>
        )}

        {step === "code" && (
          <form className="grid gap-3" noValidate onSubmit={verifyCode}>
            <Label htmlFor="reset-code">Reset code</Label>
            <OtpInput id="reset-code" disabled={loading} value={code} onChange={(value) => { setCode(value); validateField("code", value, verificationCodeSchema.shape.code); }} />
            {fieldErrors.code && <p className="text-destructive text-sm">{fieldErrors.code}</p>}
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
          <form className="grid gap-3" noValidate onSubmit={resetPassword}>
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => { setPassword(event.target.value); validateField("password", event.target.value, emailPasswordSchema.shape.password); }}
            />
            {fieldErrors.password && <p className="text-destructive text-sm">{fieldErrors.password}</p>}
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
