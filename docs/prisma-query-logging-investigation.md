# Prisma Query Logging Investigation

## Purpose

Next.js route logs show that the application handled a request, for example:

```text
GET /dashboard/boards?page=2 200 in 48ms
```

They do not show whether Prisma sent SQL to PostgreSQL. A route request can still
be served from the Next.js Data Cache. Temporary Prisma query logging would let
us distinguish:

- Route request + cache hit: Next.js logs the request, but Prisma logs no SQL.
- Route request + cache miss: Next.js logs the request and Prisma logs SQL.
- Search request: the current non-empty Boards search intentionally bypasses the
  page cache, so Prisma should log its result and count queries.

This document records a future investigation. Query logging is not enabled by
the current change.

## Current project context

- Prisma ORM: 7.10.x.
- PostgreSQL is accessed through `@prisma/adapter-pg`.
- The singleton Prisma Client is created in `src/lib/db/index.ts`.
- Normal All Boards pages use `unstable_cache`, keyed by the authenticated user
  and page number.
- Non-empty Board searches run directly because caching arbitrary typed queries
  would create an unbounded set of cache entries.

## Recommended temporary approach

Use event-based query logging behind an explicit development-only environment
flag. Event logging is preferable to unconditional stdout logging because it
lets us print only the information needed for this investigation.

Conceptual configuration for `src/lib/db/index.ts`:

```ts
const shouldLogQueries =
  process.env.NODE_ENV === "development" &&
  process.env.PRISMA_QUERY_LOG === "true";

const client = new PrismaClient({
  adapter,
  log: shouldLogQueries
    ? [{ emit: "event", level: "query" }]
    : [],
});

if (shouldLogQueries) {
  client.$on("query", (event) => {
    console.info(`[prisma:query] ${event.duration}ms ${event.query}`);
  });
}
```

The exact TypeScript shape must be verified against the generated Prisma 7.10
client before implementation, especially because conditional `log` options can
affect the inferred event types.

Do not print `event.params` by default. Query parameters may contain board
titles, descriptions, user identifiers, or future sensitive values. SQL text
and duration are enough to determine whether a database query ran.

## Proposed test procedure

1. Add `PRISMA_QUERY_LOG=true` to the local development environment only.
2. Restart the development server so the Prisma singleton is recreated with the
   logging configuration.
3. Load `/dashboard/boards` once and record the Prisma query lines.
4. Navigate to page 2 for the first time and record the query lines.
5. Navigate between pages 1 and 2 several times.
6. Search for a non-empty term, pause typing, and record the query lines.
7. Clear the search and revisit both normal pages.
8. Create or edit a disposable Board only if cache invalidation also needs to be
   verified; avoid this step when read-only verification is sufficient.
9. Remove the environment flag and temporary logging code after collecting the
   evidence.

Expected observations:

| Action | Route request | Prisma SQL |
| --- | --- | --- |
| First uncached visit to page 1 | Yes | Yes |
| Revisit cached page 1 | Yes | No |
| First uncached visit to page 2 | Yes | Yes |
| Revisit cached page 2 | Yes | No |
| Non-empty search after debounce | Yes | Yes |
| First page visit after board-cache invalidation | Yes | Yes |

Development hot reloads, server restarts, cache-key changes, and explicit cache
invalidation can create a fresh cache miss. The test should therefore be run in
one uninterrupted server session.

## What to capture

For each action, record:

- Requested URL.
- Whether a Prisma query event appeared.
- Number of emitted SQL statements.
- Duration of each statement.
- Total route duration reported by Next.js.
- Whether the result was expected to be cached.

This separates database time from proxy, React Server Component rendering, and
other application work. A fast route request alone is supporting evidence of a
cache hit, not proof.

## Decision criteria

Keep the current caching design if repeated normal-page navigation produces no
Prisma query events and interaction remains fast.

Investigate further if:

- Cached navigation still emits SQL.
- One navigation emits unexpected duplicate queries.
- A query duration is consistently high.
- Search produces more requests than expected after the 250 ms debounce.
- Cache invalidation fails to make the next read query PostgreSQL.

If basic logging is insufficient, the next step should be structured tracing
with OpenTelemetry rather than permanent raw SQL logging.

## References

- [Prisma ORM logging](https://docs.prisma.io/docs/orm/v7/prisma-client/observability-and-logging/logging)
- [Prisma Client `log` and `$on()` reference](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#log)
- [Next.js `unstable_cache`](https://nextjs.org/docs/app/api-reference/functions/unstable_cache)
- [Next.js prefetching](https://nextjs.org/docs/app/guides/prefetching)
