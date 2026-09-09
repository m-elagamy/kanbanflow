# KanbanFlow

A full-stack Kanban board for organizing personal work — boards, columns, and tasks with drag-and-drop reordering, priorities, and due dates.

**[Live app →](https://kanbanflow-app.vercel.app)**

## Engineering decisions worth reading

This project went through a structured self-audit before launch: [`docs/release-audit.md`](docs/release-audit.md) documents 62 findings (7 critical) found by reviewing the codebase against the standard of a production application, and every fix applied since. A few of the more interesting ones:

- **Ownership over authentication.** Every mutation is scoped by a `withOwnership` wrapper (`src/utils/auth-wrappers.ts`) that resolves the resource's actual owner through a relation lookup before the query runs, rather than trusting a client-supplied ID. The wrapper lives in the Data Access Layer, so a query written outside it can't skip the check by construction.
- **Optimistic UI with real rollback.** Drag-and-drop, task edits, and column reordering update the Zustand store immediately, then reconcile with the server action's result — every mutating action snapshots `previousState` and calls `rollback()` on failure, with a toast explaining what happened.
- **Accessible drag-and-drop.** Cards and columns drag from a dedicated grip handle, not the whole surface, with custom screen-reader announcements (`src/utils/dnd-announcements.ts`) that name the task and its destination instead of relying on dnd-kit's generic defaults.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Prisma 7 (`pg` adapter) · PostgreSQL (Neon) · Clerk · Zustand + Immer · dnd-kit · Zod 4 · Tailwind CSS v4 · Shadcn UI

## Features

- Boards with slug-based routing, templates (Personal Productivity, Agile Development, Bug Tracking, or a custom workflow), and pagination
- Columns and tasks reorderable via drag-and-drop, with keyboard-safe rollback on a failed save
- Task priorities, optional due dates, and per-column search/filtering
- Optimistic UI throughout — every mutation reflects instantly and reconciles with the server
- Server Actions validated with Zod, authorization enforced in the Data Access Layer

## Running locally

```bash
git clone https://github.com/m-elagamy/kanbanflow.git
cd kanbanflow
pnpm install
```

Copy `.env.example` to `.env` and fill in a PostgreSQL connection string and [Clerk](https://dashboard.clerk.com) API keys, then:

```bash
pnpm prisma migrate deploy
pnpm dev
```

### Authentication settings

The custom signup and sign-in screens use email verification codes, Google, and GitHub. In the Clerk instance used by your deployment, enable email-address signup and email-code sign-in, require email-code verification at signup, and keep passwords optional or disabled. These screens do not collect passwords. Keep Google and GitHub enabled if their buttons are displayed, and avoid requiring additional signup fields or authentication factors without adding the corresponding screens.

The locally configured instance was inspected on September 9, 2026: email-code signup verification and sign-in were enabled, passwords were optional and unused for sign-in, and MFA was not required. A separate production instance must use matching settings. See [Clerk's authentication settings documentation](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options).

### Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint |
| `pnpm type-check` | Type check (runs `next typegen` first) |

## Project structure

```
src/
  actions/      # Server Actions — Zod validation, then delegate to the DAL
  app/          # Next.js App Router pages
  components/   # Shared UI, layout, landing page
  hooks/        # Client-side hooks
  lib/
    dal/        # Data Access Layer — all Prisma queries, ownership-checked
    types/      # Shared types (ServerActionResult, store types, ...)
  providers/    # Drag-and-drop, theme
  schemas/      # Zod schemas, shared between actions and forms
  stores/       # Zustand stores, one per domain
  utils/        # Pure utility functions
```

## License

MIT
