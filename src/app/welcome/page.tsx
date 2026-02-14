import { redirect, unauthorized } from "next/navigation";
import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowRight, Sparkles } from "lucide-react";
import BoardModal from "@/app/dashboard/components/board/board-modal";
import columnsTemplates from "@/app/dashboard/data/columns-templates";
import { getUserOnboardingStateAction, insertUserAction } from "@/actions/user";
import type { Templates } from "@/lib/types";
import { after } from "next/server";

const WelcomePage = async () => {
  const user = await currentUser();

  if (!user) unauthorized();

  const onboardingState = await getUserOnboardingStateAction();

  const boardsCount = onboardingState.fields?.boardsCount ?? 0;
  const hasCreatedBoardOnce =
    onboardingState.fields?.hasCreatedBoardOnce ?? false;

  if (boardsCount !== 0 || hasCreatedBoardOnce) redirect("/dashboard");

  after(() => {
    insertUserAction({
      id: user.id,
      name: user.fullName,
      email: user.emailAddresses[0].emailAddress,
      hasCreatedBoardOnce: false,
    }).catch((error) => console.error("Failed to insert user:", error));
  });

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_55%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.12),transparent_50%)]" />
      <section className="relative z-10 mx-auto w-full max-w-4xl">
        <div className="border-border/60 bg-background/90 rounded-3xl border p-8 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.5)] backdrop-blur md:p-12">
          <div className="flex flex-col gap-6">
            <div className="text-muted-foreground flex items-center gap-3 text-sm tracking-[0.3em] uppercase">
              <Sparkles className="h-4 w-4" />
              Welcome to KanbanFlow 👋
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold text-balance md:text-4xl">
                Let’s set up your first board
              </h1>
              <p className="text-muted-foreground max-w-2xl text-base md:text-lg">
                Choose a template or start from scratch to organize your work.
              </p>
            </div>
            <BoardModal
              mode="create"
              modalId="welcome-create-board"
              trigger={
                <button className="inline-flex items-center gap-2 text-base">
                  Create your first board
                  <ArrowRight className="h-4 w-4" />
                </button>
              }
              defaultTemplate="personal"
            />
          </div>

          <div className="mt-10">
            <div className="text-muted-foreground mb-4 text-xs font-semibold tracking-[0.25em] uppercase">
              Templates
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {columnsTemplates.map((template) => {
                const Icon = template.icon;

                return (
                  <BoardModal
                    key={template.id}
                    mode="create"
                    modalId={`welcome-template-${template.id}`}
                    defaultTemplate={template.id as Templates}
                    variant="outline"
                    trigger={
                      <button className="border-border/70 bg-background/70 hover:border-primary/40 flex h-auto w-full items-center justify-between gap-4 rounded-2xl border p-4 text-start shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <div className="flex min-w-51 items-center gap-4 md:min-w-xs">
                          <span className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-2xl">
                            <Icon className="h-5 w-5" />
                          </span>
                          <div>
                            <div className="text-sm font-semibold">
                              {template.label}
                            </div>
                            <div className="text-muted-foreground text-xs">
                              {template.status.length
                                ? `${template.status.length} columns ready`
                                : "Start from scratch"}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="text-muted-foreground h-4 w-4" />
                      </button>
                    }
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export const metadata: Metadata = {
  title: "Welcome",
  description: "Create your first board and start organizing work quickly.",
};

export default WelcomePage;
