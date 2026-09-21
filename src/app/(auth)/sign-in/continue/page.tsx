"use client";

import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserRound } from "lucide-react";
import KanbanLogo from "@/components/layout/header/kanban-logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContinueSignUpPage() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const error =
    errors.global?.[0]?.message ??
    errors.fields.firstName?.message ??
    errors.fields.lastName?.message;
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      (await signUp.update({ firstName, lastName })).error ||
      signUp.status !== "complete"
    )
      return;
    await signUp.finalize({
      navigate: ({ decorateUrl }) => router.push(decorateUrl("/welcome")),
    });
  }
  return (
    <Card className="mx-auto w-full border-0 bg-transparent shadow-none sm:w-96 md:w-[420px]">
      <CardHeader className="gap-3 px-6 pt-7 text-center sm:px-8">
        <CardTitle className="mx-auto">
          <KanbanLogo glow="auth" />
        </CardTitle>
        <CardDescription className="mx-auto max-w-sm leading-6">
          We need a few details to finish creating your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 sm:px-8">
        <form className="grid gap-4" onSubmit={submit}>
          {error && (
            <p role="alert" className="text-destructive text-sm">
              {error}
            </p>
          )}
          <div className="grid gap-2">
            <Label className="flex items-center gap-1.5" htmlFor="first-name">
              First name
              <UserRound className="text-muted-foreground size-3.5" />
            </Label>
            <Input
              className="border-border bg-background/80 h-10 dark:bg-input/50 shadow-xs"
              id="first-name"
              placeholder="Jane"
              required
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label className="flex items-center gap-1.5" htmlFor="last-name">
              Last name
              <UserRound className="text-muted-foreground size-3.5" />
            </Label>
            <Input
              className="border-border bg-background/80 h-10 dark:bg-input/50 shadow-xs"
              id="last-name"
              placeholder="Doe"
              required
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </div>
          <div id="clerk-captcha" />
          <Button disabled={fetchStatus === "fetching"}>Continue</Button>
        </form>
      </CardContent>
    </Card>
  );
}
