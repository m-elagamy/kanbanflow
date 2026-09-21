"use client";

import { useSignIn } from "@clerk/nextjs";
import { Eye, EyeOff, Loader, LockKeyhole, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import KanbanLogo from "@/components/layout/header/kanban-logo";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { emailPasswordSchema, getFieldErrors, getValidationMessage } from "@/schemas/auth";

type Provider = "oauth_google" | "oauth_github";
export default function SignInPage() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const loading = fetchStatus === "fetching";
  const emailError = fieldErrors.email ?? errors.fields.identifier?.message;
  const passwordError = fieldErrors.password ?? errors.fields.password?.message;
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
      <CardHeader className="gap-3 px-6 pt-7 text-center sm:px-8"><CardTitle className="mx-auto"><KanbanLogo /></CardTitle><CardDescription className="mx-auto max-w-sm leading-6">Welcome back. Sign in to continue to Kanbamy.</CardDescription></CardHeader>
      <CardContent className="grid gap-5">
        {message && <p role="alert" className="text-destructive text-sm">{message}</p>}
        <div className="grid gap-3">
            <Button className="border-border bg-background/80 hover:bg-accent/70 h-10 shadow-xs dark:bg-input/50 dark:hover:bg-accent/60" type="button" variant="outline" disabled={loading || provider !== null} onClick={() => void signInWithSso("oauth_google")}>{provider === "oauth_google" ? <Loader className="animate-spin" /> : <Icons.google />} Continue with Google</Button>
            <Button className="border-border bg-background/80 hover:bg-accent/70 h-10 shadow-xs dark:bg-input/50 dark:hover:bg-accent/60" type="button" variant="outline" disabled={loading || provider !== null} onClick={() => void signInWithSso("oauth_github")}>{provider === "oauth_github" ? <Loader className="animate-spin" /> : <Icons.gitHub />} Continue with GitHub</Button>
          </div>
          <p className="text-muted-foreground before:bg-border flex items-center gap-3 text-sm before:h-px before:flex-1 after:h-px after:flex-1">or continue with email</p>
          <form className="grid gap-4" noValidate onSubmit={signInWithPassword}>
            <div className="grid gap-2"><Label className="flex items-center gap-1.5" htmlFor="sign-in-email"><Mail className="text-muted-foreground size-3.5" />Email address</Label><Input className="border-border bg-background/80 focus-visible:border-primary/60 focus-visible:ring-primary/30 h-10 shadow-xs dark:bg-input/50" id="sign-in-email" type="email" autoComplete="email" placeholder="name@example.com" aria-invalid={Boolean(emailError)} aria-describedby={emailError ? "sign-in-email-error" : undefined} value={email} onChange={(event) => { setEmail(event.target.value); validateField("email", event.target.value, emailPasswordSchema.shape.email); }} />{emailError && <p id="sign-in-email-error" className="text-destructive text-sm">{emailError}</p>}</div>
            <div className="grid gap-2"><div className="flex items-center justify-between gap-3"><Label className="flex items-center gap-1.5" htmlFor="sign-in-password"><LockKeyhole className="text-muted-foreground size-3.5" />Password</Label><Button type="button" variant="link" className="h-auto p-0 text-sm" disabled={loading} onClick={() => router.push("/forgot-password")}>Forgot password?</Button></div><div className="relative"><Input className="border-border bg-background/80 focus-visible:border-primary/60 focus-visible:ring-primary/30 h-10 pr-10 shadow-xs dark:bg-input/50" id="sign-in-password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="••••••••" aria-invalid={Boolean(passwordError)} aria-describedby={passwordError ? "sign-in-password-error" : undefined} value={password} onChange={(event) => { setPassword(event.target.value); validateField("password", event.target.value, emailPasswordSchema.shape.password); }} /><Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground absolute top-1/2 right-0 size-10 -translate-y-1/2" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((current) => !current)}>{showPassword ? <EyeOff /> : <Eye />}</Button></div>{passwordError && <p id="sign-in-password-error" className="text-destructive text-sm">{passwordError}</p>}</div>
            <Button className="h-10" disabled={loading}>{loading && <Loader className="animate-spin" />}Continue</Button>
          </form>
      </CardContent>
      <CardFooter className="text-muted-foreground justify-center pt-1 text-sm">Don&apos;t have an account?<Button className="ps-1" variant="link" size="sm" onClick={() => router.push("/sign-up")}>Sign up</Button></CardFooter>
    </Card>
  );
}
