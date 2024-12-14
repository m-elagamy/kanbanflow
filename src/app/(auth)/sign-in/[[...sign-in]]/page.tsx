"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";

import SocialConnectionButtons from "../../components/social-connection-buttons";
import AuthStrategiesSeparator from "../../components/auth-strategies-separator";
import EmailInput from "../../components/email-input";
import { AuthCard } from "../../components/auth-card";
import SubmitButton from "../../components/submit-button";
import KanbanLogo from "@/components/layout/header/kanban-logo";
import AuthModeSwitcher from "../../components/auth-mode-switcher";
import ResendCodeButton from "../../components/resend-code-button";

export default function SignInPage() {
  return (
    <SignIn.Root>
      <Clerk.Loading>
        {(isGlobalLoading) => (
          <>
            <SignIn.Step name="start">
              <AuthCard
                title={<KanbanLogo />}
                description="Welcome back! Please sign in to continue."
                footer={
                  <>
                    <SignIn.Action submit asChild>
                      <SubmitButton isGlobalLoading={isGlobalLoading} />
                    </SignIn.Action>
                    <AuthModeSwitcher
                      message="Don't have an account?"
                      linkHref="sign-up"
                      linkText="Sign up"
                    />
                  </>
                }
              >
                <SocialConnectionButtons isGlobalLoading={isGlobalLoading} />
                <AuthStrategiesSeparator />
                <EmailInput inputName="identifier" />
              </AuthCard>
            </SignIn.Step>

            <SignIn.Step name="verifications">
              <SignIn.Strategy name="email_code">
                <AuthCard
                  title="Check your email"
                  description="Enter the verification code sent to your email"
                  footer={
                    <div className="grid w-full gap-y-4">
                      <SignIn.Action submit asChild>
                        <SubmitButton isGlobalLoading={isGlobalLoading} />
                      </SignIn.Action>
                    </div>
                  }
                >
                  <Clerk.Field name="code">
                    <Clerk.Label className="sr-only">
                      Email verification code
                    </Clerk.Label>
                    <div className="grid items-center justify-center gap-y-2">
                      <div className="flex justify-center text-center">
                        <Clerk.Input
                          type="otp"
                          autoSubmit
                          autoFocus
                          className="flex justify-center has-[:disabled]:opacity-50"
                          render={({ value, status }) => {
                            return (
                              <div
                                data-status={status}
                                className="relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md data-[status=cursor]:ring-1 data-[status=selected]:ring-1 data-[status=cursor]:ring-ring data-[status=selected]:ring-ring"
                              >
                                {value}
                              </div>
                            );
                          }}
                        />
                      </div>
                      <Clerk.FieldError className="block text-center text-sm text-destructive" />
                      <ResendCodeButton />
                    </div>
                  </Clerk.Field>
                </AuthCard>
              </SignIn.Strategy>
            </SignIn.Step>
          </>
        )}
      </Clerk.Loading>
    </SignIn.Root>
  );
}
