[< docs](../README.md)

# Functional Tests

Full feature tests with real DB, Mailpit, and MSW for external APIs — **8 tests**.

## Setup

- **Runner:** `make test-functional`
- **Config:** `vitest.config.functional.mjs`
- **Structure:** `test/functional/`
- **Requirements:** PostgreSQL + Mailpit running

## MSW (Mock Service Worker)

External API calls are intercepted at HTTP level:

- **Disify** — disposable email detection
- **MailCheck.ai** — disposable email fallback
- **HIBP** — Have I Been Pwned password check

Internal services (DB, Mailpit) pass through.

## Categories

| File                                    | Description                                                       |
| --------------------------------------- | ----------------------------------------------------------------- |
| `test/functional/auth/register.test.ts` | Registration with disposable email detection, HIBP, DNS MX checks |

[< docs](../README.md)
