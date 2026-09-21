"use client";

import { useSignIn } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import KanbanLogo from "@/components/layout/header/kanban-logo";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OtpInput } from "@/components/ui/otp-input";
import { emailPasswordSchema, getFieldErrors, getValidationMessage, verificationCodeSchema } from "@/schemas/auth";

type Provider = "oauth_google" | "oauth_github";
type Step = "password" | "code";

export default function SignInPage() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<Step>("password");
  const [provider, setProvider] = useState<Provider | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const loading = fetchStatus === "fetching";
  const emailError = fieldErrors.email ?? errors.fields.identifier?.message;
  const passwordError = fieldErrors.password ?? errors.fields.password?.message;
  const codeError = fieldErrors.code ?? errors.fields.code?.message;
  const message =
    formError ??
    (searchParams.get("oauth") === "incomplete"
      ? "Google sign-in was cancelled or not completed. You can try again or use another method."
      : null) ??
    errors.global?.[0]?.message;

  const navigate = ({ decorateUrl }: { decorateUrl: (url: string) => string }) =>
    router.push(decorateUrl("/welcome"));

  function clearFieldError(field: string) {
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validateField(field: string, value: string, schema: typeof emailPasswordSchema.shape.email) {
    const message = getValidationMessage(schema, value);
    if (!message) {
      clearFieldError(field);
      return;
    }
    setFieldErrors((current) => ({ ...current, [field]: message }));
  }

  async function signInWithPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    const validated = emailPasswordSchema.safeParse({ email, password });
    if (!validated.success) {
      setFieldErrors(getFieldErrors(validated.error));
      return;
    }

    setFieldErrors({});
    const result = await signIn.password({ emailAddress: validated.data.email, password: validated.data.password });
    if (result.error || signIn.status !== "complete") return;
    await signIn.finalize({ navigate });
  }

  async function sendEmailCode() {
    setFormError(null);
    const validated = emailPasswordSchema.shape.email.safeParse(email);
    if (!validated.success) {
      setFieldErrors({ email: validated.error.issues[0].message });
      return;
    }

    setFieldErrors({});
    if ((await signIn.create({ identifier: validated.data })).error) return;
    if (!(await signIn.emailCode.sendCode()).error) setStep("code");
  }

  async function verifyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    const validated = verificationCodeSchema.safeParse({ code });
    if (!validated.success) {
      setFieldErrors(getFieldErrors(validated.error));
      return;
    }

    setFieldErrors({});
    const result = await signIn.emailCode.verifyCode(validated.data);
    if (result.error || signIn.status !== "complete") return;
    await signIn.finalize({ navigate });
  }

  async function signInWithSso(strategy: Provider) {
    setFormError(null);
    setProvider(strategy);
    const reset = await signIn.reset();
    if (reset.error) {
      setProvider(null);
      setFormError("Unable to start a new sign-in attempt. Please try again.");
      return;
    }
    const result = await signIn.sso({ strategy, redirectUrl: "/welcome", redirectCallbackUrl: "/sso-callback" });
    if (result.error) {
      setProvider(null);
      setFormError("We couldn’t start sign-in with that provider. Please try again.");
    }
  }

  return (
    <Card className="mx-auto w-full border-0 bg-transparent shadow-none sm:w-96 md:w-[420px]">
      <CardHeader className="gap-2 text-center"><CardTitle className="mx-auto"><KanbanLogo /></CardTitle><CardDescription>{step === "password" ? "Welcome back. Sign in to continue to Kanbamy." : `Enter the verification code sent to ${email}.`}</CardDescription></CardHeader>
      <CardContent className="grid gap-5">
        {message && <p role="alert" className="text-destructive text-sm">{message}</p>}
        {step === "password" ? <>
          <div className="grid gap-3">
            <Button className="border-border/80 bg-muted/60 hover:bg-muted h-10 dark:bg-input/30 dark:hover:bg-input/50" type="button" variant="outline" disabled={loading || provider !== null} onClick={() => void signInWithSso("oauth_google")}>{provider === "oauth_google" ? <Loader className="animate-spin" /> : <Icons.google />} Continue with Google</Button>
            <Button className="border-border/80 bg-muted/60 hover:bg-muted h-10 dark:bg-input/30 dark:hover:bg-input/50" type="button" variant="outline" disabled={loading || provider !== null} onClick={() => void signInWithSso("oauth_github")}>{provider === "oauth_github" ? <Loader className="animate-spin" /> : <Icons.gitHub />} Continue with GitHub</Button>
          </div>
          <p className="text-muted-foreground text-center text-sm">or continue with email</p>
          <form className="grid gap-4" noValidate onSubmit={signInWithPassword}>
            <div className="grid gap-2"><Label htmlFor="sign-in-email">Email address</Label><Input className="border-border/90 bg-muted/45 focus-visible:border-primary/60 focus-visible:ring-primary/30 h-10 dark:bg-input/30" id="sign-in-email" type="email" autoComplete="email" aria-invalid={Boolean(emailError)} aria-describedby={emailError ? "sign-in-email-error" : undefined} value={email} onChange={(event) => { setEmail(event.target.value); validateField("email", event.target.value, emailPasswordSchema.shape.email); }} />{emailError && <p id="sign-in-email-error" className="text-destructive text-sm">{emailError}</p>}</div>
            <div className="grid gap-2"><Label htmlFor="sign-in-password">Password</Label><Input className="border-border/90 bg-muted/45 focus-visible:border-primary/60 focus-visible:ring-primary/30 h-10 dark:bg-input/30" id="sign-in-password" type="password" autoComplete="current-password" aria-invalid={Boolean(passwordError)} aria-describedby={passwordError ? "sign-in-password-error" : undefined} value={password} onChange={(event) => { setPassword(event.target.value); validateField("password", event.target.value, emailPasswordSchema.shape.password); }} />{passwordError && <p id="sign-in-password-error" className="text-destructive text-sm">{passwordError}</p>}</div>
            <Button type="button" variant="link" className="h-auto justify-self-end p-0 text-sm" disabled={loading} onClick={() => router.push("/forgot-password")}>Forgot password?</Button>
            <Button className="h-10" disabled={loading}>{loading && <Loader className="animate-spin" />}Continue</Button>
            <Button type="button" variant="link" disabled={loading} onClick={() => void sendEmailCode()}>Use an email code instead</Button>
          </form>
        </> : <form className="grid gap-3" noValidate onSubmit={verifyCode}>
          <Label htmlFor="sign-in-code">Email verification code</Label><OtpInput id="sign-in-code" disabled={loading} aria-invalid={Boolean(codeError)} aria-describedby={codeError ? "sign-in-code-error" : undefined} value={code} onChange={(value) => { setCode(value); validateField("code", value, verificationCodeSchema.shape.code); }} />{codeError && <p id="sign-in-code-error" className="text-destructive text-sm">{codeError}</p>}<Button disabled={loading}>{loading && <Loader className="animate-spin" />}Verify</Button>
        </form>}
      </CardContent>
      <CardFooter className="justify-center pt-1">Don&apos;t have an account?<Button variant="link" onClick={() => router.push("/sign-up")}>Sign up</Button></CardFooter>
    </Card>
  );
}
