# E2E Tests — Auth

Playwright E2E test plan for all authentication flows.

## Setup

- **Runner:** `make test` + `pnpm test:e2e` (in another terminal)
- **Server:** `localhost:3000` (production build, rate limiting disabled via `NODE_ENV=test`)
- **Workers:** 5 (fully parallel — each spec creates its own users)
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

### Passkey Helper (CDP Virtual Authenticator)

```ts
// test/e2e/helpers/passkey.ts
import type { Page } from "@playwright/test";

export async function setupVirtualAuthenticator(page: Page) {
    const client = await page.context().newCDPSession(page);
    await client.send("WebAuthn.enable");
    const { authenticatorId } = await client.send("WebAuthn.addVirtualAuthenticator", {
        options: {
            protocol: "ctap2",
            transport: "internal",
            hasResidentKey: true,
            hasUserVerification: true,
            isUserVerified: true,
            automaticPresenceSimulation: true,
        },
    });
    return { client, authenticatorId };
}
```

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

### `test/e2e/login.spec.ts` — Done

| #   | Test                                             | Status |
| --- | ------------------------------------------------ | ------ |
| 1   | Page accessible (h1 "Connexion")                 | Done   |
| 2   | Login success → redirect `/`                     | Done   |
| 3   | Login failed (wrong password) → toast error      | Done   |
| 4   | Protected guard → redirect `/login?redirect=...` | Done   |
| 5   | Login with `?redirect=` → redirect target        | Done   |
| 6   | Guest-only guard → redirect `/`                  | Done   |

### `test/e2e/register.spec.ts`

| #   | Test                                                         | Deps             |
| --- | ------------------------------------------------------------ | ---------------- |
| 1   | Page accessible (h1 "S'inscrire")                            |                  |
| 2   | Register success → redirect `/register/success`              | Captcha          |
| 3   | Register failed (existing email) → toast error               | Captcha          |
| 4   | Email verification → click link → auto-login                 | Captcha, Mailpit |
| 5   | Register validation (weak password, mismatch) → field errors |                  |

### `test/e2e/reset-password.spec.ts`

| #   | Test                                                    | Deps             |
| --- | ------------------------------------------------------- | ---------------- |
| 1   | Page accessible (h1)                                    |                  |
| 2   | Request reset → redirect `/reset-password/success`      | Captcha, Mailpit |
| 3   | Click email link → reset form with token                | Mailpit          |
| 4   | Submit new password → toast success → redirect `/login` | Mailpit          |
| 5   | Invalid token → error                                   |                  |

### `test/e2e/magic-link.spec.ts`

| #   | Test                                         | Deps    |
| --- | -------------------------------------------- | ------- |
| 1   | Send magic link → redirect `/login/success`  |         |
| 2   | Click email link → auto-login → redirect `/` | Mailpit |
| 3   | Invalid/expired link → error                 |         |

### `test/e2e/passkey.spec.ts`

| #   | Test                                       | Deps                          |
| --- | ------------------------------------------ | ----------------------------- |
| 1   | Add passkey from profile → list updated    | CDP WebAuthn                  |
| 2   | Login with passkey → redirect `/`          | CDP WebAuthn                  |
| 3   | Delete passkey from profile → list updated | CDP WebAuthn                  |
| 4   | Login with deleted passkey → toast error   | CDP WebAuthn                  |
| 5   | Cancel passkey prompt → toast error        | CDP (`isUserVerified: false`) |

### `test/e2e/totp.spec.ts`

| #   | Test                                                                 | Deps      |
| --- | -------------------------------------------------------------------- | --------- |
| 1   | Enable 2FA from profile (password → QR → verify code → backup codes) | `otpauth` |
| 2   | Login with 2FA → `/verify-2fa` → submit TOTP → redirect `/`          | `otpauth` |
| 3   | Login with 2FA → submit wrong TOTP → toast error                     |           |
| 4   | Trust device → next login skips 2FA                                  | `otpauth` |
| 5   | Disable 2FA from profile → next login skips `/verify-2fa`            | `otpauth` |

### `test/e2e/backup-codes.spec.ts`

| #   | Test                                               | Deps      |
| --- | -------------------------------------------------- | --------- |
| 1   | View backup codes during 2FA setup                 | `otpauth` |
| 2   | Login with 2FA → submit backup code → redirect `/` | `otpauth` |
| 3   | Used backup code cannot be reused → error          | `otpauth` |
| 4   | Regenerate backup codes → old codes invalid        | `otpauth` |

### `test/e2e/verify-2fa.spec.ts`

| #   | Test                                       | Deps |
| --- | ------------------------------------------ | ---- |
| 1   | Page accessible when 2FA pending           |      |
| 2   | Redirect to `/login` when no 2FA pending   |      |
| 3   | Redirect to `/` when already authenticated |      |
| 4   | Cancel 2FA → return to `/login`            |      |
| 5   | Switch between TOTP and backup code tabs   |      |

### `test/e2e/profile.spec.ts`

| #   | Test                                                | Deps |
| --- | --------------------------------------------------- | ---- |
| 1   | Page accessible (h1 "Profil")                       |      |
| 2   | Update firstname → success                          |      |
| 3   | Update lastname → success                           |      |
| 4   | Change password (current + new + confirm) → success |      |
| 5   | Change password (wrong current) → error             |      |
| 6   | Revoke single session                               |      |
| 7   | Revoke all other sessions                           |      |
| 8   | Tabs navigation (Profil / Edition / Securite)       |      |

### `test/e2e/logout.spec.ts`

| #   | Test                                              | Deps |
| --- | ------------------------------------------------- | ---- |
| 1   | Logout → redirect `/` → no session                |      |
| 2   | After logout, protected route → redirect `/login` |      |

## Notes

- **Chromium only** — passkey tests require CDP, only available on Chromium
- **Hard navigation** — Login uses `window.location.href` (not `router.push`). Use `page.waitForURL()` to handle
- **TOTP secret** — Extract from `totpURI` during 2FA setup: `new URL(totpUri).searchParams.get("secret")`
- **Mailpit** — Cleared once via `globalSetup` before the entire suite. Individual specs use `deleteAllEmails()` only when needed (e.g. magic-link)
- **Captcha** — Always-valid test keys auto-complete the widget. No interaction needed
- **Independence** — Each spec creates its own users via `register()`. No shared fixtures between specs
