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

- [ ] **BUG-06** `src/stores/task.ts` — task store has no `previousState`/`rollback()`; all optimistic task mutations are unrecoverable _(3–4 h)_
- [ ] **BUG-05** `src/app/dashboard/components/task/task-actions.tsx:37-43` — task deletion has no error path _(30 min)_
- [ ] **BUG-07** `src/hooks/use-dnd-handlers.ts:86-91` — drag-and-drop persistence is fire-and-forget, no `await`, no `.catch()` _(1 h)_
- [ ] **BUG-02** `src/hooks/use-task-form-action.ts:100-101` — failed task creation re-keys the card to `""`, leaving a phantom _(1 h)_
- [ ] **BUG-03** `src/hooks/use-task-form-action.ts:93` — `updateTaskAction` result discarded; server errors never surface _(45 min)_
- [ ] **BUG-01** `src/app/dashboard/components/board/board-search.tsx:50` — `react-hooks/set-state-in-effect` fails `pnpm lint`, so CI is red _(20 min)_
- [ ] **BUG-04** `src/actions/task.ts` · `src/actions/column.ts` — no `revalidateTag`; dashboard totals go stale _(1 h)_
- [ ] **PERF-03** `src/lib/dal/user.ts:66,88,127` — cache tags are global; one user's write evicts every user's cache _(do with BUG-04)_
- [ ] **BUG-11** `src/actions/board.ts:51-54` — `finally` marks onboarding complete even when creation failed _(20 min)_
- [x] **BUG-13** `src/actions/board.ts:139-153` — `deleteBoardAction` always returns `success: true` _(15 min)_ — fixed incidentally by the SEC-02 rewrite, which now checks `result.success` from `deleteBoard` before returning

## Stage 3 — Remove what is fake, fix what is misleading (~1 day)

> Cheapest stage, biggest change in how the project reads to a reviewer.

- [ ] **UX-02** `src/app/dashboard/components/task/task-card.tsx:63,135-140,145-153` — every card shows a fabricated "Est: 2h" and the current viewer as a pseudo-assignee _(30 min)_
- [ ] **PERF-02** `src/app/dashboard/components/task/task-card.tsx:24` — `useUser()` in every card _(resolved by UX-02)_
- [ ] **UX-03** 7 `delay()` calls across form/action hooks — ~1.5 s of artificial latency, applied *before* the optimistic update _(1 h)_
- [ ] **UX-01** `src/app/dashboard/components/task/tasks-filter.tsx` — priority filter in the board toolbar is inert _(3 h to wire / 5 min to remove)_
- [ ] **UX-04** `src/app/dashboard/boards/page.tsx` — placeholder page is routable and shadows the `[board]` segment _(5 min)_
- [ ] **FEAT-04** `src/app/dashboard/components/task/task-card.tsx:55-66` — progress read from a field that never existed _(20 min)_
- [ ] **FEAT-03** `src/app/dashboard/components/task/task-card.tsx:145-153` — avatar implies assignees; no such model exists _(15 min to remove)_
- [ ] **QUAL-03** 10 unreferenced files (see reference section) _(45 min)_
- [ ] **QUAL-07** `src/actions/task.ts:6-7` · `src/components/layout/sidebar/index.tsx:7` — two lint warnings _(5 min)_
- [ ] **SEO-03** `src/app/layout.tsx:16` — title template has leading/trailing spaces _(1 min)_

## Stage 4 — Accessibility and the drag layer (~2 days)

> `A11Y-01`'s dedicated grip element is the keystone; it also gives `MOB-02` a surface for `touch-action`.

- [ ] **A11Y-02** `src/app/globals.css` — no `prefers-reduced-motion` anywhere; 18 files import `motion` _(1.5 h)_
- [ ] **A11Y-01** `src/app/dashboard/components/task/task-card.tsx:74-78` — whole card is the drag handle and wraps a button _(2–3 h)_
- [ ] **A11Y-03** `src/providers/dnd-provider.tsx` — no dnd-kit announcements or screen-reader instructions _(2 h)_
- [ ] **MOB-02** `src/providers/dnd-provider.tsx:37-41` — touch drag competes with two nested scroll containers _(3–4 h, needs device testing)_
- [ ] **A11Y-04** `src/app/globals.css:252-256` · `src/app/welcome/page.tsx:68` — custom surfaces have no `:focus-visible` _(1 h)_
- [ ] **BUG-12** `src/app/dashboard/components/board/board-search.tsx:90-97` — `DialogTitle` outside `DialogContent`; dialog has no accessible name _(5 min)_
- [ ] **BUG-08** `prisma/schema.prisma:53` — `@@unique([columnId, title])` makes a drag throw `P2002` _(1 h to handle)_
- [ ] **BUG-09** `src/hooks/use-dnd-handlers.ts:103-107` — `onDragEnd` is debounced, dropping fast successive drags _(30 min)_
- [ ] **MOB-01** `src/app/dashboard/components/column/column-card.tsx:31` — `100vh` should be `h-full`/`dvh` _(30 min)_

## Stage 5 — Polish for the portfolio audience (~2 days)

- [ ] **UX-05** no `loading.tsx` in any segment; `boards-skeleton.tsx` written but unused _(1.5 h)_
- [ ] **UX-06** only one `error.tsx`; no `global-error.tsx` _(1.5 h)_
- [ ] **UX-07** `src/app/dashboard/[board]/page.tsx:14` — missing board 404s on the client after shipping HTML _(2 h)_
- [ ] **UX-08** `toast.success` is never called anywhere _(1 h)_
- [ ] **SEO-01** no `robots.ts`, no `sitemap.ts` _(45 min)_
- [ ] **SEO-02** `src/app/layout.tsx:13-38` — no `metadataBase`, no OG image, no Twitter card _(2 h)_
- [ ] **PERF-01** `src/app/dashboard/page.tsx:12` — `currentUser()` where `auth()` would do, awaited serially _(1 h)_
- [ ] **BUG-10** `src/hooks/use-board-form-action.ts:94-115` — board creation persisted from a detached `setTimeout` _(1.5 h)_
- [ ] **QUAL-05** `src/hooks/use-page-metadata.ts` — imperative `document.title` mutation, never restored _(1 h)_
- [ ] **OPS-07** no `engines` field, no `.nvmrc` _(20 min)_

## Stage 6 — Durability (~3 days)

> Do `OPS-04` before `FEAT-01`: column reordering rebuilds the same ordering-persistence logic that
> `BUG-07`/`BUG-08` are about, and should be built against a suite that already covers the task case.

- [ ] **OPS-04** no test runner, no tests, no `test` script _(1 day for stores+utils · 2–3 days with E2E)_
- [ ] **OPS-05** no error monitoring; 13 `console.error` calls are the only sink _(3 h)_
- [ ] **OPS-06** database backups unverified (provider-level) _(1 h)_
- [ ] **QUAL-01** Prisma model types cross into client components _(3 h)_
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

```
src/app/dashboard/utils/accent-styles.ts
src/app/dashboard/utils/get-toast-message.ts     # most of the work for UX-08
src/app/dashboard/utils/process-form-data.ts
src/components/layout/sidebar/boards-skeleton.tsx # most of the work for UX-05
src/components/ui/border-trail.tsx
src/components/ui/clock.tsx
src/components/ui/info-toast.tsx                  # most of the work for UX-08
src/hooks/use-boards-list.ts
src/hooks/use-modal-close.ts
src/utils/performance.ts
```

Read `get-toast-message.ts`, `info-toast.tsx`, and `boards-skeleton.tsx` before deleting — they are partial
implementations of findings still open above.

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
