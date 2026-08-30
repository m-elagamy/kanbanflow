# KanbanFlow — Release Readiness Audit

**Audited:** 2026-08-23 against `main @ 2e04a1c` · **62 findings** · static review of all 236 tracked files
**Full write-up (with detailed reasoning):** https://claude.ai/code/artifact/92e4eb8c-5019-4a98-89f4-fe25baf9118b

| Severity | Count |
| -------- | ----- |
| Critical | 7     |
| High     | 17    |
| Medium   | 25    |
| Low      | 13    |

**Verdict at time of audit: do not deploy.** `ensureAuthenticated` authenticates but never authorizes, so
every board/column/task mutation is an IDOR. Two server actions have no auth at all. Separately, CI applies
Prisma migrations to the production database on every pull request.

State at audit time: `pnpm type-check` passes clean · `pnpm lint` fails (1 error, 2 warnings) · no test suite.

## How to use this doc

- Tick boxes as you land fixes; the git history then shows when each finding was closed.
- IDs are stable and encode the category — `grep -n "SEC-" docs/release-audit.md` for all security items.
- Stages below are ordered by dependency, not by severity. Stage 1 is the only one that gates deployment.
- Detail for any finding: the artifact link above, or the reference section at the bottom of this file.

### Re-auditing later

This snapshot goes stale as the code changes. To regenerate against a newer commit, ask Claude Code:

> Re-run the release readiness audit in `docs/release-audit.md` against the current HEAD. Verify which
> findings are still open, note any new ones, and update the checkboxes and the commit SHA in the header.

---

## Stage 1 — Close the authorization hole, stop CI touching production (~2 days)

> Do `QUAL-02` first: moving the stray queries into the DAL is what makes the rest mechanical, because the
> DAL is where the auth wrappers live. `OPS-01` is a one-line change and should land immediately.

- [x] **QUAL-02** `src/actions/board.ts:78,103` · `src/actions/task.ts:27,83,106,189` — six Prisma queries live outside `src/lib/dal/`, bypassing the auth layer by construction _(folded into the SEC items)_ — moved into `src/lib/dal/board.ts` and `src/lib/dal/task.ts` as `getBoardForRename`/`countBoardsBySlug`/`findTaskByColumnAndTitle`/`getTaskForRename`/`findDuplicateTaskTitle`/`updateTaskPosition`
- [x] **SEC-01** `src/utils/auth-wrappers.ts:18-27` — `ensureAuthenticated` performs no ownership check; replace with ownership-resolving wrappers _(6–10 h)_ — added `withOwnership` (resolves the resource's owning `userId` via a relation lookup, 404s on mismatch); all board/column/task mutations now go through it
- [x] **SEC-02** `src/actions/board.ts:139-153` — any signed-in user can delete any board by ID; scope with `deleteMany({ where: { id, userId } })` _(30 min)_ — `deleteBoard` now checked via `withOwnership` and the delete query itself is scoped `{ id, userId }`
- [x] **SEC-03** `src/actions/task.ts:174-237` — `updateTaskPositionAction` has no authentication at all _(2–3 h)_ — moved to `updateTaskPosition` in the DAL, wrapped with `withOwnership`; verifies ownership of both the source task and the destination column
- [x] **SEC-04** `src/actions/user.ts:14-38` — `insertUserAction` is unauthenticated and trusts a client-supplied user id _(1 h inline / 3 h via Clerk webhook)_ — now requires `auth().userId === data.id`; `insertUser` DAL fn wrapped with `ensureAuthenticated`
- [x] **SEC-05** `src/actions/column.ts:8,28,48` — all three column actions are unscoped; delete cascades to another user's tasks _(1.5 h)_ — all three now go through `withOwnership`
- [x] **SEC-06** `src/actions/task.ts:9,65,141` — task create/update/delete are unscoped _(1.5 h)_ — all three now go through `withOwnership`
- [x] **SEC-07** `src/actions/column.ts:8-12` · `src/actions/task.ts:141,174` — server actions skip Zod validation _(2 h)_ — `createColumnAction`/`updateColumnAction` validate against `columnStatusSchema`; `updateTaskPositionAction` validates against the new `taskPositionSchema`
- [x] **SEC-09** `src/lib/db/index.ts` — add `import "server-only"` to the Prisma singleton _(2 min)_
- [x] **OPS-01** `package.json:9` · `.github/workflows/ci.yml:13,44` — `postinstall` runs `prisma migrate deploy`; CI passes the production `DATABASE_URL`, so every PR migrates production _(1.5 h)_ — `postinstall` now runs `prisma generate` only; `prisma migrate deploy` moved to a dedicated step in `deploy.yml` (push-to-main only)
- [x] **OPS-02** `.github/workflows/deploy.yml:52-55` — deploy job's final step is an `echo` placeholder _(2 h to implement / 10 min to delete)_ — removed; left a comment pointing at wiring in a real deploy step or removing the workflow if deploys already happen via Vercel's Git integration
- [x] **OPS-03** `.github/workflows/deploy.yml:39` — `actions/cache@v3` is retired and fails the job _(2 min)_ — bumped to `actions/cache@v4`

## Stage 2 — Make failures visible (~1 day)

> `BUG-06` first — the task store's rollback is a prerequisite for `BUG-05` and `BUG-07`.

- [x] **BUG-06** `src/stores/task.ts` — task store has no `previousState`/`rollback()`; all optimistic task mutations are unrecoverable _(3–4 h)_ — added a `previousState` snapshot (`tasks` + `columnTaskIds`) taken before every mutating action, plus a `rollback()` action, mirroring the column store's pattern
- [x] **BUG-05** `src/app/dashboard/components/task/task-actions.tsx:37-43` — task deletion has no error path _(30 min)_ — now awaits `deleteTaskAction`, checks `result.success`, toasts and calls `rollback()` on failure or thrown error
- [x] **BUG-07** `src/hooks/use-dnd-handlers.ts:86-91` — drag-and-drop persistence is fire-and-forget, no `await`, no `.catch()` _(1 h)_ — `updateTaskPositionAction` call now has `.then()`/`.catch()` handling that toasts and rolls back the optimistic move on failure
- [x] **BUG-02** `src/hooks/use-task-form-action.ts:100-101` — failed task creation re-keys the card to `""`, leaving a phantom _(1 h)_ — `updateTaskId` only runs when `res.success && res.fields?.id`; otherwise `rollback()` removes the optimistic card entirely
- [x] **BUG-03** `src/hooks/use-task-form-action.ts:93` — `updateTaskAction` result discarded; server errors never surface _(45 min)_ — result is checked; failure toasts and calls `rollback()`
- [x] **BUG-01** `src/app/dashboard/components/board/board-search.tsx:50` — `react-hooks/set-state-in-effect` fails `pnpm lint`, so CI is red _(20 min)_ — already fixed by a prior commit (task search feature rewrite); verified clean via a fresh `pnpm lint` run, no changes needed
- [x] **BUG-04** `src/actions/task.ts` · `src/actions/column.ts` — no `revalidateTag`; dashboard totals go stale _(1 h)_ — added `revalidateUserBoards()` calls after task create/delete/priority-change and column create/delete
- [x] **PERF-03** `src/lib/dal/user.ts:66,88,127` — cache tags are global; one user's write evicts every user's cache _(do with BUG-04)_ — cache tags scoped to `user-boards-${userId}`; added `src/utils/revalidate-user-boards.ts` so every action revalidates only the current user's tag
- [x] **BUG-11** `src/actions/board.ts:51-54` — `finally` marks onboarding complete even when creation failed _(20 min)_ — `markUserHasCreatedBoardOnce()` (and the cache revalidation) moved into the success path, out of `finally`
- [x] **BUG-13** `src/actions/board.ts:139-153` — `deleteBoardAction` always returns `success: true` _(15 min)_ — fixed incidentally by the SEC-02 rewrite, which now checks `result.success` from `deleteBoard` before returning

## Stage 3 — Remove what is fake, fix what is misleading (~1 day)

> Cheapest stage, biggest change in how the project reads to a reviewer.

- [x] **UX-02** `src/app/dashboard/components/task/task-card.tsx:63,135-140,145-153` — every card shows a fabricated "Est: 2h" and the current viewer as a pseudo-assignee _(30 min)_ — removed the estimate/progress block and the pseudo-assignee avatar; card now only shows real fields (priority, title, description, due date)
- [x] **PERF-02** `src/app/dashboard/components/task/task-card.tsx:24` — `useUser()` in every card _(resolved by UX-02)_ — `useUser()` removed along with the fake avatar
- [x] **UX-03** 7 `delay() `calls across form/action hooks — ~1.5 s of artificial latency, applied *before* the optimistic update _(1 h)_ — removed the 8 `delay()` calls sitting directly before an optimistic store mutation (task create/update/delete, column create/update/delete, board update) across `use-task-form-action.ts`, `task-actions.tsx`, `column-actions.tsx`, `column-form.tsx`, `board-actions.tsx`, `use-board-form-action.ts`; left the 4 in `use-board-retry.tsx`/board-create-navigation alone since they don't fit that pattern (failure-recovery pacing / post-update navigation stagger, not "artificial wait before an optimistic update")
- [x] **UX-01** `src/app/dashboard/components/task/tasks-filter.tsx` — priority filter in the board toolbar is inert _(3 h to wire / 5 min to remove)_ — wired up via a new `useTaskFilterStore`; filters visible tasks per column client-side (board's tasks are all loaded upfront, not paginated, so this is correct — would need to move server-side if tasks are ever paginated)
- [x] **UX-04** `src/app/dashboard/boards/page.tsx` — placeholder page is routable and shadows the `[board]` segment _(5 min)_ — built a real paginated all-boards page (`getUserBoardsPage` DAL fn, `BOARDS_PAGE_SIZE`); also added `RESERVED_BOARD_SLUGS` + a `boardSchema` refine so a board can never be named/slugged "boards" and collide with this route
- [x] **FEAT-04** `src/app/dashboard/components/task/task-card.tsx:55-66` — progress read from a field that never existed _(20 min)_ — removed; deleted the now-unreferenced `task-progress.tsx`
- [x] **FEAT-03** `src/app/dashboard/components/task/task-card.tsx:145-153` — avatar implies assignees; no such model exists _(15 min to remove)_ — removed
- [x] **QUAL-03** 10 unreferenced files (see reference section) _(45 min)_ — deleted 7; kept `get-toast-message.ts`, `info-toast.tsx`, `boards-skeleton.tsx` since they're partial implementations of still-open Stage 5 items (UX-08, UX-05) — revisit when we get there
- [x] **QUAL-07** `src/actions/task.ts:6-7` · `src/components/layout/sidebar/index.tsx:7` — two lint warnings _(5 min)_ — already fixed by a prior commit; verified clean via `pnpm lint`
- [x] **SEO-03** `src/app/layout.tsx:16` — title template has leading/trailing spaces _(1 min)_ — fixed: `"%s | KanbanFlow"`

## Stage 4 — Accessibility and the drag layer (~2 days)

> `A11Y-01`'s dedicated grip element is the keystone; it also gives `MOB-02` a surface for `touch-action`.

- [x] **A11Y-01** `src/app/dashboard/components/task/task-card.tsx:74-78` — whole card is the drag handle and wraps a button _(2–3 h)_ — added a dedicated grip button (`GripVertical`, `aria-label="Drag to reorder task"`) that alone carries `{...attributes} {...listeners}`; the rest of the card (including the actions dropdown button) is no longer part of the draggable region
- [x] **MOB-02** `src/providers/dnd-provider.tsx:37-41` — touch drag competes with two nested scroll containers _(3–4 h, needs device testing)_ — resolved as a side effect of A11Y-01: `touch-none` now sits only on the small grip handle, so touching anywhere else on the card scrolls normally; **real-device verification still recommended**, not done here
- [x] **A11Y-03** `src/providers/dnd-provider.tsx` — no dnd-kit announcements or screen-reader instructions _(2 h)_ — added `src/utils/dnd-announcements.ts` with custom `announcements`/`screenReaderInstructions` (names the task and destination column/position instead of dnd-kit's generic defaults), wired via `DndContext`'s `accessibility` prop
- [x] **A11Y-02** `src/app/globals.css` — no `prefers-reduced-motion` anywhere; 18 files import `motion` _(1.5 h)_ — added a `@media (prefers-reduced-motion: reduce)` block collapsing CSS transitions/animations, plus `<MotionConfig reducedMotion="user">` in `providers/index.tsx` so every framer-motion animation also respects the OS setting
- [x] **A11Y-04** `src/app/globals.css:252-256` · `src/app/welcome/page.tsx:68` — custom surfaces have no `:focus-visible` _(1 h)_ — added a global `*:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }` rule so every focusable element gets a visible keyboard ring, not just ones with an existing utility class
- [x] **BUG-12** `src/app/dashboard/components/board/board-search.tsx:90-97` — `DialogTitle` outside `DialogContent`; dialog has no accessible name _(5 min)_ — moved `DialogHeader` inside `DialogContent`
- [x] **BUG-08** `prisma/schema.prisma:53` — `@@unique([columnId, title])` makes a drag throw `P2002` _(1 h to handle)_ — already resolved as a side effect of the Stage 2 `BUG-07` fix: `updateTaskPositionAction`'s try/catch + `handlePrismaError` turns the P2002 into a clean `ServerActionResult` failure, and the client already rolls back + toasts on it
- [x] **BUG-09** `src/hooks/use-dnd-handlers.ts:103-107` — `onDragEnd` is debounced, dropping fast successive drags _(30 min)_ — removed the debounce; `onDragEnd` fires once per gesture already, so debouncing it only added a 300ms lag and silently dropped a drop if another drag started within that window
- [x] **MOB-01** `src/app/dashboard/components/column/column-card.tsx:31` — `100vh` should be `h-full`/`dvh` _(30 min)_ — `max-h-[calc(100vh-82px)]` → `max-h-[calc(100dvh-82px)]`

## Stage 5 — Polish for the portfolio audience (~2 days)

- [x] **UX-05** no `loading.tsx` in any segment; `boards-skeleton.tsx` written but unused _(1.5 h)_ — added `loading.tsx` to `/dashboard`, `/dashboard/[board]` (reuses `BoardSkeleton` with generic placeholder counts), and `/dashboard/boards`; new `DashboardSkeleton` built for the grid. Split `DashboardSidebar` into a static shell + async `BoardsSection`, wrapped in `<Suspense>` with `BoardsSkeleton` as the fallback — the previously-unused skeleton is now wired up
- [x] **UX-06** only one `error.tsx`; no `global-error.tsx` _(1.5 h)_ — added `src/app/global-error.tsx` (deliberately minimal — no shared UI imports, since it fires when the root layout/`Providers` itself throws and can't assume the theme/Clerk providers mounted) and `src/app/dashboard/[board]/error.tsx` (reuses `ErrorCard`, mirroring the existing `/dashboard` boundary) so a board render error no longer escapes and unmounts the sidebar
- [x] **UX-07** `src/app/dashboard/[board]/page.tsx:14` — missing board 404s on the client after shipping HTML _(2 h)_ — `page.tsx` now calls `notFound()` on the server unless a `?new=1` search param is present (only set by `use-board-form-action.ts` right after creating a board); every other missing-board case gets a real server 404 instead of a client-side flash. Known residual edge case: a `?new=1` link bookmarked mid-creation and opened later, after the board was deleted, still falls back to the client shell — but the empty Zustand store on a fresh load still resolves to `notFound()` there too, just one hydration later
- [x] **UX-08** `toast.success` is never called anywhere _(1 h)_ — added `toast.success(result.message)` to the success branch of task create/update/delete, column update/delete, and board update/delete. Board creation reuses the existing `useBoardRetry` failure UI, so only its success case was touched. While wiring this up, found and fixed three previously-untracked silent-failure gaps that a blind success toast would have made worse: `use-board-form-action.ts`'s board-edit and board-create paths, and both handlers in `column-actions.tsx`, none of which checked `result.success` before this — a real failure (validation, ownership, not-found) went completely unnoticed with the optimistic UI left uncorrected
- [x] **SEO-01** no `robots.ts`, no `sitemap.ts` _(45 min)_ — added `src/app/robots.ts` (disallows `/dashboard`, `/welcome`) and `src/app/sitemap.ts` listing the public routes; both build as static `/robots.txt` and `/sitemap.xml`
- [x] **SEO-02** `src/app/layout.tsx:13-38` — no `metadataBase`, no OG image, no Twitter card _(2 h)_ — added `metadataBase` (using `SITE_URL`), `src/app/opengraph-image.tsx` (generated PNG via `next/og`, auto-wired to both `og:image` and `twitter:image`), and `metadata.twitter.card: "summary_large_image"`. Verified by hitting the running dev server, not just `pnpm build`, which caught a real bug: **`src/proxy.ts`'s middleware was redirecting `/robots.txt`, `/sitemap.xml`, and `/opengraph-image` to `/sign-in` for every logged-out request** — none of the three have an extension the middleware's static-file exclusion recognizes, so Clerk's `auth.protect()` ran on them. This means SEO-01 was never actually reachable by crawlers since it was written; `pnpm build`'s static generation never exercises middleware, so it looked fine. Fixed by adding all three to `isPublicRoute` in `proxy.ts`
- [x] **PERF-01** `src/app/dashboard/page.tsx:12` — `currentUser()` where `auth()` would do, awaited serially _(1 h)_ — auth guard now uses `auth()` (local, no Clerk API round-trip); `currentUser()` runs in `Promise.all` alongside the onboarding query instead of blocking before it
- [x] **BUG-10** `src/hooks/use-board-form-action.ts:94-115` — board creation persisted from a detached `setTimeout` _(1.5 h)_ — removed the `setTimeout(..., 50)` wrapper; `createBoardAction` now fires immediately after the optimistic store update, running concurrently with the (intentionally-kept, see UX-03) 600ms navigation delay instead of being gated behind it
- [x] **QUAL-05** `src/hooks/use-page-metadata.ts` — imperative `document.title` mutation, never restored _(1 h)_ — `unauthorized.tsx` needed no client interactivity, so it's now a Server Component with a real `export const metadata`, dropping `usePageMetadata` entirely. `not-found.tsx` and both `error.tsx` boundaries genuinely need to stay client components (`router.back()`, `reset()`) and error boundaries can't export `metadata` at all in Next, so for those the hook itself now captures and restores the previous title and meta description on cleanup, removing the tag entirely if it created one
- [ ] **OPS-07** no `engines` field, no `.nvmrc` _(20 min)_

## Stage 6 — Durability (~3 days)

> Do `OPS-04` before `FEAT-01`: column reordering rebuilds the same ordering-persistence logic that
> `BUG-07`/`BUG-08` are about, and should be built against a suite that already covers the task case.

- [ ] **OPS-04** no test runner, no tests, no `test` script _(1 day for stores+utils · 2–3 days with E2E)_
- [ ] **OPS-05** no error monitoring; 13 `console.error` calls are the only sink _(3 h)_
- [ ] **OPS-06** database backups unverified (provider-level) _(1 h)_
- [x] **QUAL-01** Prisma model types cross into client components _(3 h)_ — added `ClientTask` (plain object, `dueDate: string | null`) to `src/lib/types/index.ts`; `getBoardBySlug` in the DAL now converts `dueDate` to an ISO string at the server boundary before it ever reaches the client. Replaced `import type { Task } from "@prisma/client"` with `ClientTask` across all 10 client-side consumers (task store + its types, both DnD/position-comparison hooks, `use-initialize-board.ts`, and the board/task-card/task-actions/task-modal components); `task-card.tsx` simplified from `formatDate(task.dueDate.toISOString())` to `formatDate(task.dueDate)` now that it's already a string. Verified with `pnpm type-check` — no lingering Date-vs-string mismatches anywhere in the chain
- [ ] **QUAL-04** `src/components/ui/modal.tsx:59-74` — `DialogContent` nested inside `DialogOverlay` _(30 min)_
- [ ] **QUAL-06** `prisma/schema.prisma:34` — `Column.status` is an unconstrained `String` _(30 min / 2 h with migration)_
- [ ] **SEC-08** `src/schemas/task.ts:6-9` — unbounded description, untrimmed title _(10 min)_
- [ ] **PERF-04** `src/stores/loading.ts:17-22` — `isLoading` scans the whole map per render _(1.5 h)_
- [ ] **PERF-05** `src/utils/performance.ts` — dead code _(5 min)_
- [ ] **FEAT-01** column reordering does not exist despite being marked done _(6–8 h)_
- [ ] **FEAT-02** `Task.dueDate` is stored and rendered but cannot be set _(3–4 h)_

---

## Reference

### Checklist corrections

The original release checklist claimed several things the code does not do:

| Claimed                                | Reality                                                  | Ref             |
| -------------------------------------- | -------------------------------------------------------- | --------------- |
| Reorder Columns / Column DND — done     | Does not exist. No sortable context, no persist action.   | FEAT-01         |
| Tasks — rollback handling               | Impossible; task store has no rollback.                   | BUG-06          |
| Loading states / skeletons              | No `loading.tsx` anywhere.                                | UX-05           |
| Toast notifications — success           | `toast.success` never called.                             | UX-08           |
| Server — ownership validation           | Absent on every mutation except `updateBoardAction`.      | SEC-01…06       |
| No ESLint errors                        | One error; CI gate is red.                                | BUG-01          |
| SEO — OG / Twitter / sitemap / robots   | Base metadata only; the other four absent.                | SEO-01, SEO-02  |

Confirmed working as claimed: Clerk auth flows, route protection (`proxy.ts` + `unauthorized()`), theming via
`next-themes`, dynamic imports, column rollback, search empty states, and `pnpm type-check`.

### Unreferenced files (QUAL-03)

Deleted (no other findings depended on them):

```
src/app/dashboard/utils/accent-styles.ts
src/app/dashboard/utils/process-form-data.ts
src/components/ui/border-trail.tsx
src/components/ui/clock.tsx
src/hooks/use-boards-list.ts
src/hooks/use-modal-close.ts
src/utils/performance.ts
```

Kept for now — partial implementations of still-open Stage 5 items, reuse them when we get there instead of
rebuilding from scratch:

```
src/app/dashboard/utils/get-toast-message.ts     # most of the work for UX-08
src/components/layout/sidebar/boards-skeleton.tsx # most of the work for UX-05
src/components/ui/info-toast.tsx                  # most of the work for UX-08
```

### Root causes worth understanding

Most of the 62 findings trace to four underlying decisions:

1. **`ensureAuthenticated` is misnamed.** It reads like an authorization guard at every call site but only
   checks that a session exists. This produced SEC-01 through SEC-06.
2. **Queries escaped the DAL.** The auth wrappers live in `src/lib/dal/`, so any query written directly in an
   action skips them by construction (QUAL-02). The one action that scopes correctly, `updateBoardAction`,
   does it inline — which is why the correct pattern never propagated.
3. **Server action results are not inspected.** The optimistic store is updated, the action is called, and the
   returned `ServerActionResult` is discarded (BUG-02, BUG-03, BUG-05, BUG-07). The messages already exist.
4. **Placeholders were left rendering.** Fabricated estimates, a pseudo-assignee avatar, an inert filter, and a
   stub route all ship to users (UX-01, UX-02, UX-04, FEAT-03, FEAT-04).
