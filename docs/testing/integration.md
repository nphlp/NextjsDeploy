[< docs](../README.md)

# Integration Tests

Auth flows tested with real database and Mailpit — **63 tests**.

## Setup

- **Runner:** `make test-integration`
- **Config:** `vitest.config.integration.mjs`
- **Structure:** `test/integration/`
- **Requirements:** PostgreSQL + Mailpit running

## Categories

| Directory                | Description                                                                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `test/integration/auth/` | Register, login, logout, password reset, change email, change password, TOTP, backup codes, passkeys, verify 2FA, session management |

## Helpers

- `test/integration/helpers/auth-api.ts` — Direct Better Auth API calls (registerUser, loginUser, verifyEmail, etc.)
- `test/integration/helpers/mailpit.ts` — Mailpit email retrieval and verification link extraction

## Pattern

- Real database (test fixtures)
- Real Mailpit (email verification)
- `x-captcha-response` header for captcha bypass
- `fileParallelism: false` to avoid Mailpit conflicts
- 30s timeout

[< docs](../README.md)
