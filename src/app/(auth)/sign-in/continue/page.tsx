"use client";

import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContinueSignUpPage() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const error = errors.global?.[0]?.message ?? errors.fields.firstName?.message ?? errors.fields.lastName?.message;
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if ((await signUp.update({ firstName, lastName })).error || signUp.status !== "complete") return;
    await signUp.finalize({ navigate: ({ decorateUrl }) => router.push(decorateUrl("/welcome")) });
  }
  return <Card className="mx-auto w-full sm:w-96"><CardHeader><CardTitle>Complete your profile</CardTitle><CardDescription>We need a few details to finish creating your account.</CardDescription></CardHeader><CardContent><form className="grid gap-4" onSubmit={submit}>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<div className="grid gap-2"><Label htmlFor="first-name">First name</Label><Input id="first-name" required value={firstName} onChange={(event) => setFirstName(event.target.value)} /></div><div className="grid gap-2"><Label htmlFor="last-name">Last name</Label><Input id="last-name" required value={lastName} onChange={(event) => setLastName(event.target.value)} /></div><div id="clerk-captcha" /><Button disabled={fetchStatus === "fetching"}>Continue</Button></form></CardContent></Card>;
}
