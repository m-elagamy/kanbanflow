# Prisma runtime logging

## Purpose

This operational guide is separate from the cache investigation. It keeps
database errors observable without permanently logging every SQL statement.

## Events

| Event | Enabled | Search in Vercel Logs |
| --- | --- | --- |
| Prisma error | Always | `prisma-error` |
| Prisma warning | Always | `prisma-warning` |
| SQL query and duration | `PRISMA_QUERY_LOG=true` only | `prisma-query` |

Entries are structured JSON. They include timestamp and Prisma target. Query
entries include SQL and duration, but never query parameters, which can contain
user content or identifiers.

## Local use

Errors and warnings appear in `pnpm dev`. For temporary SQL inspection, set the
following in `.env.local` and restart the server:

```text
PRISMA_QUERY_LOG=true
```

Remove the value or set it to `false` when the investigation is complete.

## Vercel use

Vercel Runtime Logs capture these server messages. Filter to the relevant route
and environment, then search for the event scope from the table above.

For SQL investigation, use a Preview deployment first. If production-only
behaviour must be checked, temporarily set `PRISMA_QUERY_LOG=true` in the
Production environment, redeploy, make one controlled request, inspect the
logs, then disable the variable and redeploy. Errors and warnings remain logged
at all times; only SQL logging is temporary.

## Boundaries

- Do not use `DEBUG=prisma*` for normal monitoring; it is much noisier.
- Do not log query parameters.
- For durable metrics, sampling, tracing, or alerts, use OpenTelemetry rather
  than permanent raw-SQL logs.

## References

- [Prisma logging](https://www.prisma.io/docs/orm/v7/prisma-client/observability-and-logging/logging)
- [Vercel Runtime Logs](https://vercel.com/docs/logs/runtime)
