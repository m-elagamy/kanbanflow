"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import SocialConnectionButtons from "../../components/social-connection-buttons";
import AuthStrategiesSeparator from "../../components/auth-strategies-separator";
import EmailInput from "../../components/email-input";
import { LegalDocumentModal } from "../../components/legal-document";
import BackgroundEffect from "../../components/background-effect";
import { fadeIn } from "@/utils/motion-variants";
import { AuthCard } from "../../components/auth-card";
import KanbanLogo from "@/components/layout/header/components/kanban-logo";
import SubmitButton from "../../components/submit-button";
import AuthModeSwitcher from "../../components/auth-mode-switcher";
import ResendCodeButton from "../../components/resend-code-button";

export default function SignUpPage() {
  return (
    <main className="relative grid min-h-dvh w-full grow items-center overflow-hidden px-4 sm:justify-center">
      <BackgroundEffect />
      <motion.section variants={fadeIn} initial="initial" animate="animate">
        <SignUp.Root>
          <Clerk.Loading>
            {(isGlobalLoading) => (
              <>
                <SignUp.Step name="start">
                  <AuthCard
                    title={<KanbanLogo />}
                    description="Welcome! Please fill in the details to get started."
                    footer={
                      <>
                        <SignUp.Captcha className="empty:hidden" />
                        <SignUp.Action submit asChild>
                          <SubmitButton isGlobalLoading={isGlobalLoading} />
                        </SignUp.Action>
                        <AuthModeSwitcher
                          message="Already have an account?"
                          linkText="Sign in"
                          linkHref="sign-in"
                        />
                      </>
                    }
                  >
                    <SocialConnectionButtons
                      isGlobalLoading={isGlobalLoading}
                    />
                    <AuthStrategiesSeparator />
                    <EmailInput inputName="emailAddress" />
                    <Clerk.Field name="password" className="space-y-2">
                      <Clerk.Label asChild>
                        <Label className="flex items-center gap-1">
                          <Lock size={14} />
                          Password
                        </Label>
                      </Clerk.Label>
                      <Clerk.Input
                        type="password"
                        placeholder="••••••••"
                        required
                        asChild
                      >
                        <Input />
                      </Clerk.Input>
                      <Clerk.FieldError className="block text-sm text-destructive" />
                    </Clerk.Field>
                  </AuthCard>
                </SignUp.Step>

                <SignUp.Step name="verifications">
                  <SignUp.Strategy name="email_code">
                    <AuthCard
                      title="Verify your email"
                      description="Use the verification link sent to your email address"
                      footer={
                        <SignUp.Action submit asChild>
                          <SubmitButton isGlobalLoading={isGlobalLoading} />
                        </SignUp.Action>
                      }
                    >
                      <div className="grid items-center justify-center gap-y-2">
                        <Clerk.Field name="code" className="space-y-2">
                          <Clerk.Label className="sr-only">
                            Email address
                          </Clerk.Label>
                          <div className="flex justify-center text-center">
                            <Clerk.Input
                              type="otp"
                              className="flex justify-center has-[:disabled]:opacity-50"
                              autoSubmit
                              render={({ value, status }) => {
                                return (
                                  <div
                                    data-status={status}
                                    className={cn(
                                      "relative flex size-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
                                      {
                                        "z-10 ring-2 ring-ring ring-offset-background":
                                          status === "cursor" ||
                                          status === "selected",
                                      },
                                    )}
                                  >
                                    {value}
                                    {status === "cursor" && (
                                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                        <div className="animate-caret-blink h-4 w-px bg-foreground duration-1000" />
                                      </div>
                                    )}
                                  </div>
                                );
                              }}
                            />
                          </div>
                          <Clerk.FieldError className="block text-center text-sm text-destructive" />
                        </Clerk.Field>
                        <ResendCodeButton />
                      </div>
                    </AuthCard>
                  </SignUp.Strategy>
                </SignUp.Step>
              </>
            )}
          </Clerk.Loading>
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">
              By signing up, you agree to our
            </span>
            <LegalDocumentModal />
          </div>
        </SignUp.Root>
      </motion.section>
    </main>
  );
}
