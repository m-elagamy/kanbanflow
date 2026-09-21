"use client";

import { GoogleOneTap, useSignIn } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
  emailPasswordSchema,
  getFieldErrors,
  getValidationMessage,
} from "@/schemas/auth";
import {
  AuthEmailField,
  AuthPasswordField,
} from "../../components/auth-fields";
import {
  AuthProvider,
  SocialAuthButtons,
} from "../../components/social-auth-buttons";

function getClerkErrorMessage(error: unknown) {
  if (error && typeof error === "object") {
    const clerkError = error as {
      message?: string;
      errors?: Array<{ message?: string; code?: string }>;
    };
    const detail = clerkError.errors?.find((item) => item.message || item.code);
    if (detail)
      return [detail.message, detail.code ? `(${detail.code})` : null]
        .filter(Boolean)
        .join(" ");
    if (clerkError.message) return clerkError.message;
  }
  return "We couldn’t start sign-in with that provider. Please try again.";
}

export default function SignInPage() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [provider, setProvider] = useState<AuthProvider | null>(null);
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

  const navigate = ({
    decorateUrl,
  }: {
    decorateUrl: (url: string) => string;
  }) => router.push(decorateUrl("/welcome"));

  function clearFieldError(field: string) {
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validateField(
    field: string,
    value: string,
    schema: typeof emailPasswordSchema.shape.email,
  ) {
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
    const result = await signIn.password({
      emailAddress: validated.data.email,
      password: validated.data.password,
    });
    if (result.error || signIn.status !== "complete") return;
    await signIn.finalize({ navigate });
  }

  async function signInWithSso(strategy: AuthProvider) {
    setFormError(null);
    setProvider(strategy);
    try {
      const result = await Promise.race([
        signIn.sso({
          strategy,
          redirectUrl: "/welcome",
          redirectCallbackUrl: "/sso-callback",
        }),
        new Promise<never>((_, reject) =>
          window.setTimeout(
            () =>
              reject(
                new Error(
                  "Clerk did not respond while starting OAuth. Check the Clerk proxy configuration and try again.",
                ),
              ),
            15000,
          ),
        ),
      ]);
      if (result.error) {
        setFormError(getClerkErrorMessage(result.error));
        return;
        setProvider(null);
        setFormError(
          "We couldn’t start sign-in with that provider. Please try again.",
        );
      }
    } catch (error) {
      console.error("Unable to start sign-in with OAuth provider", error);
      setFormError(getClerkErrorMessage(error));
    } finally {
      setProvider(null);
    }
  }

  return (
    <>
      <Card className="mx-auto w-full border-0 bg-transparent shadow-none sm:w-96 md:w-[420px]">
        <CardHeader className="gap-3 px-6 pt-7 text-center sm:px-8">
          <CardTitle className="mx-auto">
            <KanbanLogo glow="auth" />
          </CardTitle>
          <CardDescription className="mx-auto max-w-sm leading-6">
            Welcome back. Sign in to continue to Kanbamy.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          {message && (
            <p role="alert" className="text-destructive text-sm">
              {message}
            </p>
          )}
          <SocialAuthButtons
            loading={loading}
            provider={provider}
            onProvider={(value) => void signInWithSso(value)}
          />
          <p className="text-muted-foreground before:bg-border flex items-center gap-3 text-sm before:h-px before:flex-1 after:h-px after:flex-1">
            or continue with email
          </p>
          <form className="grid gap-4" noValidate onSubmit={signInWithPassword}>
            <AuthEmailField
              id="sign-in-email"
              value={email}
              error={emailError}
              onChange={(value) => {
                setEmail(value);
                validateField("email", value, emailPasswordSchema.shape.email);
              }}
            />
            <AuthPasswordField
              id="sign-in-password"
              value={password}
              error={passwordError}
              forgotPassword={() => router.push("/forgot-password")}
              onChange={(value) => {
                setPassword(value);
                validateField(
                  "password",
                  value,
                  emailPasswordSchema.shape.password,
                );
              }}
            />
            <Button className="h-10" disabled={loading}>
              {loading && <Loader className="animate-spin" />}Continue
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-muted-foreground justify-center pt-1 text-sm">
          Don&apos;t have an account?
          <Button
            className="ps-1"
            variant="link"
            size="sm"
            onClick={() => router.push("/sign-up")}
          >
            Sign up
          </Button>
        </CardFooter>
      </Card>
      <GoogleOneTap />
    </>
  );
}
