"use client";

import { useSignUp } from "@clerk/nextjs";
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
import { OtpInput } from "@/components/ui/otp-input";
import { Icons } from "@/components/ui/icons";
import KanbanLogo from "@/components/layout/header/kanban-logo";
import { emailPasswordSchema, getFieldErrors, getValidationMessage, verificationCodeSchema } from "@/schemas/auth";

type Provider = "oauth_google" | "oauth_github";

export default function SignUpPage() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [provider, setProvider] = useState<Provider | null>(null);
  const loading = fetchStatus === "fetching";
  const message =
    formError ??
    (step === "email"
      ? errors.fields.emailAddress?.message ?? errors.fields.password?.message
      : errors.fields.code?.message) ??
    errors.global?.[0]?.message;
  const navigate = ({
    decorateUrl,
  }: {
    decorateUrl: (url: string) => string;
  }) => router.push(decorateUrl("/welcome"));
  function validateField(field: string, value: string, schema: typeof emailPasswordSchema.shape.email) {
    const message = getValidationMessage(schema, value);
    setFieldErrors((current) => message ? { ...current, [field]: message } : Object.fromEntries(Object.entries(current).filter(([key]) => key !== field)));
  }

  async function startEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    const validated = emailPasswordSchema.safeParse({ email, password });
    if (!validated.success) {
      setFieldErrors(getFieldErrors(validated.error));
      return;
    }
    setFieldErrors({});
    if ((await signUp.create({ emailAddress: validated.data.email, password: validated.data.password })).error) return;
    if (!(await signUp.verifications.sendEmailCode()).error) setStep("code");
  }
  async function verifyCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validated = verificationCodeSchema.safeParse({ code });
    if (!validated.success) {
      setFieldErrors(getFieldErrors(validated.error));
      return;
    }
    setFieldErrors({});
    if (
      (await signUp.verifications.verifyEmailCode(validated.data)).error ||
      signUp.status !== "complete"
    )
      return;
    await signUp.finalize({ navigate });
  }
  async function startSso(strategy: Provider) {
    setProvider(strategy);
    const { error } = await signUp.sso({
      strategy,
      redirectUrl: "/welcome",
      redirectCallbackUrl: "/sso-callback",
    });
    if (error) setProvider(null);
  }

  return (
    <Card className="mx-auto w-full sm:w-96 md:w-[420px]">
      <CardHeader className="text-center">
        <CardTitle className="mx-auto">
          <KanbanLogo />
        </CardTitle>
        <CardDescription>
          {step === "email"
            ? "Create your account with Google, GitHub, or your email and password."
            : `Enter the verification code sent to ${email}.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {message && (
          <p role="alert" className="text-destructive text-sm">
            {message}
          </p>
        )}
        {step === "email" ? (
          <>
            <div className="grid gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={loading || provider !== null}
                onClick={() => void startSso("oauth_google")}
              >
                {provider === "oauth_google" ? (
                  <Loader className="animate-spin" />
                ) : (
                  <Icons.google />
                )}{" "}
                Continue with Google
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={loading || provider !== null}
                onClick={() => void startSso("oauth_github")}
              >
                {provider === "oauth_github" ? (
                  <Loader className="animate-spin" />
                ) : (
                  <Icons.gitHub />
                )}{" "}
                Continue with GitHub
              </Button>
            </div>
            <p className="text-muted-foreground before:bg-border flex items-center gap-3 text-sm before:h-px before:flex-1 after:h-px after:flex-1">
              or continue with email
            </p>
            <form className="grid gap-3" noValidate onSubmit={startEmail}>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(event) => { setEmail(event.target.value); validateField("email", event.target.value, emailPasswordSchema.shape.email); }}
              />
              {fieldErrors.email && <p className="text-destructive text-sm">{fieldErrors.email}</p>}
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="new-password" value={password} onChange={(event) => { setPassword(event.target.value); validateField("password", event.target.value, emailPasswordSchema.shape.password); }} />
              {fieldErrors.password && <p className="text-destructive text-sm">{fieldErrors.password}</p>}
              <div id="clerk-captcha" />
              <Button disabled={loading}>
                {loading ? <Loader className="animate-spin" /> : "Continue"}
              </Button>
            </form>
          </>
        ) : (
          <form className="grid gap-3" noValidate onSubmit={verifyCode}>
            <Label htmlFor="code">Email verification code</Label>
            <OtpInput id="code" disabled={loading} value={code} onChange={(value) => { setCode(value); validateField("code", value, verificationCodeSchema.shape.code); }} />
            {fieldErrors.code && <p className="text-destructive text-sm">{fieldErrors.code}</p>}
            <Button disabled={loading}>
              {loading ? <Loader className="animate-spin" /> : "Verify"}
            </Button>
            <Button
              type="button"
              variant="link"
              disabled={loading}
              onClick={() => void signUp.verifications.sendEmailCode()}
            >
              Resend code
            </Button>
            <Button
              type="button"
              variant="link"
              disabled={loading}
              onClick={() => setStep("email")}
            >
              Change email address
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="text-muted-foreground justify-center text-sm">
        Already have an account?
        <Button
          variant="link"
          size="sm"
          onClick={() => router.push("/sign-in")}
        >
          Sign in
        </Button>
      </CardFooter>
    </Card>
  );
}
