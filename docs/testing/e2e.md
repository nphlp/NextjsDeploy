[< docs](../README.md)

# E2E Tests — Auth

Playwright E2E test suite for all authentication flows — **57 tests across 10 specs**.

## Setup

- **Runner:** `make test` + `bun run test:e2e` (in another terminal)
- **Server:** `localhost:3000` (production build, rate limiting disabled via `NODE_ENV=test`)
- **Workers:** 10 (fully parallel — each spec creates its own users)
- **Email:** Mailpit at `localhost:8025` (cleared once via globalSetup)
- **Rate limit:** Disabled in test mode
- **Captcha:** Always-valid Turnstile test keys in `.env`

## Dependencies

| Need       | Package          | Usage                                                                   |
| ---------- | ---------------- | ----------------------------------------------------------------------- |
| TOTP codes | `otpauth`        | Generate 6-digit codes from secret                                      |
| Passkeys   | CDP (built-in)   | `WebAuthn.addVirtualAuthenticator` via `page.context().newCDPSession()` |
| Emails     | Mailpit REST API | Fetch verification/magic-link/reset emails                              |

### TOTP Helper

```ts
// test/e2e/helpers/totp.ts
import * as OTPAuth from "otpauth";

export function generateTOTP(secret: string): string {
    const totp = new OTPAuth.TOTP({ algorithm: "SHA1", digits: 6, period: 30, secret });
    return totp.generate();
}
```

### Passkey Setup (CDP Virtual Authenticator)

No dedicated helper file — the CDP virtual authenticator setup is inlined in `passkey.spec.ts` via `beforeAll`. Each test in the passkey spec shares a single `CDPSession` created at the top of the file.

### Mailpit Helper

```ts
// test/e2e/helpers/mailpit.ts
const MAILPIT_API = "http://localhost:8025/api/v1";

export async function getLatestEmail(to: string) {
    const res = await fetch(`${MAILPIT_API}/search?query=to:${to}&limit=1`);
    const data = await res.json();
    return data.messages[0];
}

export async function extractLink(to: string, pattern: RegExp): Promise<string> {
    const email = await getLatestEmail(to);
    const res = await fetch(`${MAILPIT_API}/message/${email.ID}`);
    const detail = await res.json();
    const match = detail.Text.match(pattern);
    if (!match) throw new Error("Link not found in email");
    return match[0];
}

export async function deleteAllEmails() {
    await fetch(`${MAILPIT_API}/messages`, { method: "DELETE" });
}
```

## Test Specs

### `test/e2e/login.spec.ts` — 7 tests

| #   | Test                                             |
| --- | ------------------------------------------------ |
| 1   | Setup: register user                             |
| 2   | Page accessible (h1 "Connexion")                 |
| 3   | Successful login → redirect `/`                  |
| 4   | Failed login (wrong password) → toast error      |
| 5   | Protected guard → redirect `/login?redirect=...` |
| 6   | Login with `?redirect=` → redirect target        |
| 7   | Guest-only guard → redirect `/`                  |

### `test/e2e/register.spec.ts` — 6 tests

| #   | Test                                            |
| --- | ----------------------------------------------- |
| 1   | Page accessible (h1 "S'inscrire")               |
| 2   | Client validation: empty fields show errors     |
| 3   | Client validation: weak password and mismatch   |
| 4   | Register success → redirect `/register/success` |
| 5   | Email verification via Mailpit auto-logs in     |
| 6   | Register existing email (anti-enum)             |

### `test/e2e/reset-password.spec.ts` — 6 tests

| #   | Test                                                                  |
| --- | --------------------------------------------------------------------- |
| 1   | Page accessible                                                       |
| 2   | Client validation: empty email shows error                            |
| 3   | Request reset → redirect success                                      |
| 4   | Full flow: register → verify → request reset → email → reset password |
| 5   | Login with new password                                               |
| 6   | Invalid reset token → error                                           |

### `test/e2e/magic-link.spec.ts` — 4 tests

| #   | Test                                                   |
| --- | ------------------------------------------------------ |
| 1   | Send magic link → redirect to success page             |
| 2   | Click email link → auto-login → redirect `/`           |
| 3   | Invalid magic link → error                             |
| 4   | Magic link to non-existing user → sends register email |

### `test/e2e/passkey.spec.ts` — 6 tests

| #   | Test                                       |
| --- | ------------------------------------------ |
| 1   | Setup: register user                       |
| 2   | Add passkey from profile → list updated    |
| 3   | Login with passkey → redirect `/`          |
| 4   | Delete passkey from profile → list updated |
| 5   | Login with deleted passkey → error         |
| 6   | Cancel passkey prompt → error              |

### `test/e2e/totp.spec.ts` — 6 tests

| #   | Test                                                                 |
| --- | -------------------------------------------------------------------- |
| 1   | Setup: register user                                                 |
| 2   | Enable 2FA from profile (password → QR → verify code → backup codes) |
| 3   | Login with TOTP → `/verify-2fa` → code → redirect `/`                |
| 4   | Wrong TOTP → error                                                   |
| 5   | Trust device → next login skips 2FA                                  |
| 6   | Disable 2FA → next login skips `/verify-2fa`                         |

### `test/e2e/backup-codes.spec.ts` — 4 tests

| #   | Test                                        |
| --- | ------------------------------------------- |
| 1   | View backup codes during 2FA setup          |
| 2   | Login with backup code → redirect `/`       |
| 3   | Used backup code cannot be reused → error   |
| 4   | Regenerate backup codes → old codes invalid |

### `test/e2e/verify-2fa.spec.ts` — 6 tests

| #   | Test                                       |
| --- | ------------------------------------------ |
| 1   | Setup: register user and enable 2FA        |
| 2   | Page accessible when 2FA pending           |
| 3   | Redirect to `/login` when no 2FA pending   |
| 4   | Redirect to `/` when already authenticated |
| 5   | Cancel 2FA → return to `/login`            |
| 6   | Switch between TOTP and backup code tabs   |

### `test/e2e/profile.spec.ts` — 9 tests

| #   | Test                                        |
| --- | ------------------------------------------- |
| 1   | Setup: register user                        |
| 2   | Auth guard redirects to login               |
| 3   | Profile tab: page accessible with user info |
| 4   | Edition tab: update lastname and firstname  |
| 5   | Edition tab: password validation errors     |
| 6   | Full flow: change password                  |
| 7   | Wrong current password → error              |
| 8   | Session revoke single                       |
| 9   | Session revoke all                          |

### `test/e2e/logout.spec.ts` — 3 tests

| #   | Test                                              |
| --- | ------------------------------------------------- |
| 1   | Setup: register user                              |
| 2   | Logout → redirect `/` → no session                |
| 3   | After logout, protected route → redirect `/login` |

## Gaps — Remaining

### Not Testable in E2E (infra/server)

- Rate limiting (disabled in test mode)
- CSRF protection (Better Auth internal)
- CSP headers (server)
- Session expiration (temporal)
- Password compromised HIBP (external API)

### Features Not Yet Implemented

- OAuth providers (Google, GitHub)
- Middleware Next.js (route protection)
- Email change
- Last login method
- Email OTP (2FA by email)

## Notes

- **Chromium only** — passkey tests require CDP, only available on Chromium
- **Hard navigation** — Login uses `window.location.href` (not `router.push`). Use `page.waitForURL()` to handle
- **TOTP secret** — Extract from `totpURI` during 2FA setup: `new URL(totpUri).searchParams.get("secret")`
- **Mailpit** — Cleared once via `globalSetup` before the entire suite. Individual specs use `deleteAllEmails()` only when needed (e.g. magic-link)
- **Captcha** — Always-valid test keys auto-complete the widget. No interaction needed
- **Independence** — Each spec creates its own users via `register()`. No shared fixtures between specs
- **Email OTP** — Not implemented in E2E tests (only TOTP + backup codes are tested for 2FA)

[< docs](../README.md)
