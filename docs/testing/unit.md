[< docs](../README.md)

# Unit Tests

Vitest unit test suite — **228 tests**.

## Setup

- **Runner:** `bun run test:unit`
- **Config:** `vitest.config.mjs`
- **Structure:** `test/unit/`

## Categories

| Directory            | Description                                                         |
| -------------------- | ------------------------------------------------------------------- |
| `test/unit/api/`     | oRPC API routes (user, fruit, basket CRUD, CSRF, cache)             |
| `test/unit/auth/`    | Auth callbacks, middleware, email templates, security notifications |
| `test/unit/actions/` | Server actions (contact, email sending)                             |

## Pattern

Tests mock Prisma client and auth context:

- `vi.mock("@lib/prisma")` — mock database calls
- `vi.mock("@lib/auth")` — mock authenticated session
- `vi.mock("@lib/activity")` — mock activity logging
- Each test calls the function directly and asserts the response

## Coverage

100% coverage on `api/**/*.ts` and `actions/**/*.ts` (excludes lib/, client files, infra).

[< docs](../README.md)
