import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { after } from "next/server";
import WelcomeSetup from "./components/welcome-setup";
import { getUserOnboardingStateAction } from "@/actions/user";
import { prepareUserRecord } from "@/lib/dal/user";
import {
  getAuthenticatedUser,
  requireAuth,
} from "@/utils/auth";

const WelcomePage = async () => {
  await requireAuth();
  const user = await getAuthenticatedUser();

  const onboardingState = await getUserOnboardingStateAction();

  const boardsCount = onboardingState.fields?.boardsCount ?? 0;
  const hasCreatedBoardOnce =
    onboardingState.fields?.hasCreatedBoardOnce ?? false;

  if (boardsCount !== 0 || hasCreatedBoardOnce) redirect("/dashboard");

  // Server Components must read request data before after().
  const email = user.primaryEmailAddress?.emailAddress;
  if (email) {
    const profile = { id: user.id, name: user.fullName, email };
    after(async () => {
      try {
        await prepareUserRecord(profile);
      } catch (error) {
        console.error("Background account preparation failed:", error);
      }
    });
  }

  return <WelcomeSetup firstName={user.firstName?.trim() || null} />;
};

export const metadata: Metadata = {
  title: "Welcome",
  description: "Create your first board and start organizing work quickly.",
};

export default WelcomePage;
