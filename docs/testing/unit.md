[< docs](../README.md)

# Unit Tests

Vitest unit test suite for oRPC API routes — **13 tests**.

## Setup

- **Runner:** `pnpm test:run`
- **Config:** `vitest.config.mjs`
- **Structure:** `test/unit/`

## Test Files

| File                               | Tests | Description          |
| ---------------------------------- | ----- | -------------------- |
| `user/create.test.ts`              | 1     | Create user          |
| `user/delete.test.ts`              | 1     | Delete user          |
| `user/find-first.test.ts`          | 1     | Find first user      |
| `user/find-many.test.ts`           | 1     | Find many users      |
| `user/find-unique.test.ts`         | 1     | Find unique user     |
| `user/update.test.ts`              | 1     | Update user          |
| `fruit/count.test.ts`              | 1     | Count fruits         |
| `fruit/create.test.ts`             | 1     | Create fruit         |
| `fruit/find-many.test.ts`          | 1     | Find many fruits     |
| `fruit/find-unique.test.ts`        | 1     | Find unique fruit    |
| `basket/find-many-by-user.test.ts` | 1     | Find baskets by user |
| `csrf.test.ts`                     | 1     | CSRF protection      |
| `cache.test.ts`                    | 1     | Cache behavior       |

## Pattern

Tests mock Prisma client and auth context:

- `vi.mock("@lib/prisma")` — mock database calls
- `vi.mock("@lib/auth")` — mock authenticated session
- Each test calls the oRPC procedure directly and asserts the response

## Gaps

- No unit tests for auth logic (server-side validation, middleware)
- No unit tests for Zod schemas
- No unit tests for utility functions/hooks

[< docs](../README.md)
