# Better Auth PR

## Enhancement

- [ ] Exporter les noms de cookies en constantes (`better-auth.two_factor`, `better-auth.session_token`, etc.)

## Feature

## Done

### Branch `feat/lifecycle-hooks`

- [x] Lifecycle events (hooks)
    - [x] onLogin — core options, triggered after session creation
    - [x] onLogout — core options, triggered after session deletion
    - [x] onPasswordChanged — emailAndPassword options, triggered after password change from profile
    - [x] onTotpEnabled / onTotpDisabled — TwoFactorOptions
    - [x] onPasskeyAdded / onPasskeyDeleted — PasskeyOptions
    - [x] onResetPasswordRequested — emailAndPassword options, alongside sendResetPassword
    - [x] onEmailVerificationRequested — emailVerification options, alongside sendVerificationEmail
    - [x] onMagicLinkRequested — magic-link plugin options, alongside sendMagicLink

- [x] Testing
    - [x] `sign-in.test.ts` — session creation, IP/user-agent, CSRF, form-data, additionalFields
    - [x] `sign-out.test.ts` — session deletion + afterSessionDeleted hook + onLogout callback
    - [x] `password.test.ts` — reset flow, token expiry, anti-énumération, revokeSessionsOnPasswordReset, onResetPasswordRequested
    - [x] `update-user.test.ts` — password change, updatedAt, wrong password rejection
    - [x] `two-factor.test.ts` — enable/disable, TOTP verify, backup codes, trust device, OTP storage modes, passwordless
    - [x] `passkey.test.ts` — register/authenticate options, list/update/delete, afterVerification callback
    - [x] `email-verification.test.ts` — onEmailVerificationRequested callback
    - [x] `magic-link.test.ts` — onMagicLinkRequested callback

- [x] Documentation
    - [x] `hooks.mdx` — section Lifecycle Callbacks (core, email & password, email verification, plugins)

### Branch `feat/change-email-native`

- [x] Lifecycle events (hooks)
    - [x] onChangeEmailRequested / onChangeEmailCancelled / onChangeEmailCompleted

- [x] `pendingEmail` natif (champ conditionnel dans `get-tables.ts`)
- [x] Flow de changement d'email via la table `Verification` (single entry per user)
- [x] Endpoint `cancelEmailChange` (POST, supprime Verification + clear pendingEmail)
- [x] Endpoint `verifyEmailChange` (GET /:userId/:token)
- [x] `revokeOtherSessions` option pour `changeEmail`
- [x] Client config (`pluginPathMethods` + `atomListeners`)

- [x] Testing
    - [x] `update-user.test.ts` — pendingEmail stocké (pas d'update immédiat), verify via Verification table, revoke other sessions
    - [x] `update-user.test.ts` — annulation (cancel + reject verification after cancel), callbacks (onChangeEmailRequested/Completed/Cancelled)
    - [x] `update-user.test.ts` — anti-énumération (200 si email existe déjà, pas de changement effectif)
    - [x] `email-verification.test.ts` — change email via Verification table (secondary storage), onChangeEmailCompleted callback
    - [x] `email-verification.test.ts` — emailVerified propagé sur toutes les sessions

- [x] Documentation
    - [x] `users-accounts.mdx` — section Change Email réécrite (flow natif, cancel, callbacks, revokeOtherSessions)
