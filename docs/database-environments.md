# Database environments

Kanbamy currently uses one Neon database connection for local development and deployment. Before the public launch, separate development work from production data by using Neon branches.

## Current status

- Local `.env` uses the Neon `development` branch.
- The existing Neon `main` branch remains the production data branch.
- Connection strings are kept out of Git. Keep the production connection string only in the hosting provider's Production environment variables.

## Recommended setup

Use two long-lived branches in the same Neon project:

```text
Kanbamy
|-- production
`-- development
```

The `development` branch can be created from `production`. It starts with a copy of the current schema and data, then changes independently.

## Setup checklist

1. Open the Kanbamy project in the Neon Console.
2. Open **Branches**.
3. Keep the current branch as `production` (or rename `main` to `production`).
4. Create a child branch named `development` from `production`.
5. Copy the connection string for the `development` branch.
6. Put the development connection string in the local `.env` file:

   ```env
   DATABASE_URL="development-connection-string"
   ```

7. Keep the production connection string only in the hosting provider's Production environment variables.
8. If preview deployments are enabled, connect them to `development` or short-lived preview branches, never directly to `production`.

Do not commit connection strings or other database credentials to Git.

## Prisma workflow

Create and test migrations against the development branch:

```bash
pnpm exec prisma migrate dev
```

Check pending migrations before a release:

```bash
pnpm exec prisma migrate status
```

Apply committed migrations during the production deployment:

```bash
pnpm exec prisma migrate deploy
```

Do not run `prisma migrate dev` or `prisma migrate reset` against the production branch.

## Before switching

- Confirm that the current production connection string is saved in the hosting provider.
- Create and test the development branch before changing the local `.env` file.
- Confirm the local application is connected to `development` before running seeds, experiments, or destructive migrations.
- Add `prisma migrate deploy` to the release workflow when deployment automation is ready.

References:

- [Neon database branching workflow](https://neon.com/docs/get-started-with-neon/workflow-primer)
- [Prisma development and production migrations](https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/development-and-production)
