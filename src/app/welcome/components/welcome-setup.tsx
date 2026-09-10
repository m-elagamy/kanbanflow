"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, LoaderCircle, Plus, Sparkles } from "lucide-react";
import columnsTemplates from "@/app/dashboard/data/columns-templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBoardRetry } from "@/hooks/use-board-retry";
import type { Templates } from "@/lib/types";
import { cn } from "@/lib/utils";
import { boardSchema } from "@/schemas/board";
import generateUUID from "@/utils/generate-UUID";

const setupOptions: Record<
  Templates,
  { label: string; description: string; title: string }
> = {
  personal: {
    label: "My tasks",
    description: "Make room for what matters each day.",
    title: "Personal Tasks",
  },
  agile: {
    label: "A development project",
    description: "Take work from backlog to delivery.",
    title: "My Project",
  },
  "bug-tracking": {
    label: "Bugs & issues",
    description: "Track issues from report to resolution.",
    title: "Bug Tracker",
  },
  custom: {
    label: "Start from scratch",
    description: "Choose your own columns as you go.",
    title: "My Board",
  },
};

export default function WelcomeSetup({
  firstName,
}: {
  firstName: string | null;
}) {
  const [selected, setSelected] = useState<Templates>("personal");
  const [customTitle, setCustomTitle] = useState<string | null>(null);
  const [titleError, setTitleError] = useState<string>();
  const [isOpening, setIsOpening] = useState(false);
  const submitting = useRef(false);
  const {
    submitBoardCreation,
    retryBoardCreation,
    isCreating,
    hasError,
    failedBoard,
  } = useBoardRetry();
  const needsRetry = hasError && !!failedBoard;
  const busy = isCreating || isOpening;
  const locked = busy || needsRetry;
  const templateId = needsRetry ? (failedBoard.template ?? selected) : selected;
  const template = columnsTemplates.find((item) => item.id === templateId)!;
  const title = needsRetry
    ? failedBoard.title
    : (customTitle ?? setupOptions[selected].title);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || busy) return;
    const result = boardSchema.safeParse({
      title,
      template: selected,
      description: "",
    });
    if (!needsRetry && !result.success) {
      setTitleError(result.error.issues[0]?.message);
      return;
    }
    submitting.current = true;
    try {
      const created = needsRetry
        ? await retryBoardCreation()
        : result.success &&
          (await submitBoardCreation({ ...result.data, id: generateUUID() }));
      if (created) setIsOpening(true);
    } finally {
      submitting.current = false;
    }
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center px-5 py-12 sm:px-8 sm:py-16">
      <div className="welcome-gradient pointer-events-none absolute inset-0" />
      <section className="relative mx-auto w-full max-w-5xl">
        <header className="mb-10 space-y-4">
          <div className="text-muted-foreground flex items-center gap-3 text-xs tracking-[0.3em] uppercase sm:text-sm">
            <Sparkles className="size-4" aria-hidden="true" />
            Welcome to KanbanFlow 👋
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {firstName
              ? `Let’s set up your first board, ${firstName}!`
              : "Let’s set up your first board!"}
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Choose a template or start from scratch to organize your work.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          noValidate
          aria-busy={busy}
          className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12"
        >
          <fieldset disabled={locked} className="min-w-0 space-y-3">
            <legend className="mb-4 text-sm font-medium">
              What would you like to organize?
            </legend>
            {columnsTemplates.map((item) => {
              const id = item.id as Templates;
              const option = setupOptions[id];
              const Icon = item.icon;
              const active = templateId === id;
              return (
                <label
                  key={id}
                  className={cn(
                    "focus-within:ring-ring relative flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors focus-within:ring-2 focus-within:ring-offset-2",
                    active
                      ? "border-primary/60 bg-primary/5"
                      : "border-border/70 bg-background/70 hover:bg-muted/60",
                    id === "custom" && "border-dashed",
                    locked && "cursor-default opacity-70",
                  )}
                >
                  <input
                    type="radio"
                    name="template"
                    value={id}
                    checked={active}
                    onChange={() => {
                      setSelected(id);
                      setTitleError(undefined);
                    }}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-lg",
                      active
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">
                      {option.label}
                    </span>
                    <span className="text-muted-foreground mt-1 block text-xs leading-relaxed">
                      {option.description}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full border",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border",
                    )}
                  >
                    {active && <Check className="size-3" />}
                  </span>
                </label>
              );
            })}
          </fieldset>

          <div className="min-w-0 space-y-6">
            <div className="border-border bg-card space-y-3 rounded-xl border p-4 shadow-sm sm:p-5">
              <div className="space-y-1">
                <label
                  htmlFor="welcome-board-name"
                  className="block text-base font-semibold"
                >
                  Name your board
                </label>
                <p
                  id="welcome-name-hint"
                  className="text-muted-foreground text-sm"
                >
                  We’ve suggested a name. You can change it now or anytime
                  later.
                </p>
              </div>
              <Input
                id="welcome-board-name"
                name="title"
                value={title}
                disabled={locked}
                maxLength={50}
                required
                aria-invalid={!!titleError}
                aria-describedby={
                  titleError
                    ? "welcome-name-error welcome-name-hint"
                    : "welcome-name-hint"
                }
                onChange={(event) => {
                  setCustomTitle(event.target.value);
                  setTitleError(undefined);
                }}
                className="border-foreground/20 bg-background h-12 px-4 text-base font-medium shadow-sm"
              />
              {titleError && (
                <p
                  id="welcome-name-error"
                  role="alert"
                  className="text-destructive text-sm"
                >
                  {titleError}
                </p>
              )}
            </div>

            <section
              aria-label="Board preview"
              className="border-border/70 bg-background overflow-hidden rounded-2xl border shadow-sm"
            >
              <div className="border-border/60 space-y-2 border-b px-5 py-5">
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Your board preview
                </p>
                <h2 className="truncate text-lg font-semibold">
                  {title.trim() || "Your board"}
                </h2>
                <p className="text-muted-foreground text-xs" aria-live="polite">
                  {template.status.length
                    ? `${template.status.length} columns ready for your tasks`
                    : "A blank board to build your own workflow"}
                </p>
              </div>
              <div className="bg-muted/30 p-4 sm:p-5">
                {template.status.length ? (
                  <div className="grid min-h-44 grid-cols-2 gap-3 sm:flex">
                    {template.status.map((status, index) => (
                      <div
                        key={status}
                        className="border-border/50 bg-muted/40 min-w-0 flex-1 rounded-lg border px-3 py-3"
                      >
                        <div className="flex items-start gap-2 text-xs font-medium">
                          <span
                            aria-hidden="true"
                            className={cn(
                              "mt-1 size-1.5 shrink-0 rounded-full",
                              index === template.status.length - 1
                                ? "bg-emerald-500"
                                : index === 0
                                  ? "bg-muted-foreground/50"
                                  : "bg-primary/70",
                            )}
                          />
                          <span>{status}</span>
                        </div>
                        <div
                          aria-hidden="true"
                          className="text-muted-foreground/40 mt-6 flex justify-center"
                        >
                          <Plus className="size-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-border text-muted-foreground flex min-h-44 flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-5 text-center">
                    <Plus className="size-5" aria-hidden="true" />
                    <p className="text-sm">
                      Add your first column once you’re inside.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {needsRetry && (
              <p role="alert" className="text-destructive text-sm">
                We couldn’t confirm your board was saved. Retry to finish
                creating this same board.
              </p>
            )}
            <Button
              type="submit"
              disabled={busy}
              size="lg"
              className="h-11 w-full rounded-lg"
            >
              {busy ? (
                <LoaderCircle className="animate-spin" aria-hidden="true" />
              ) : null}
              {isOpening
                ? "Opening your board…"
                : isCreating
                  ? "Creating your board…"
                  : needsRetry
                    ? "Retry creating my board"
                    : "Create my board"}
              {!busy && <ArrowRight aria-hidden="true" />}
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
