# Better Auth PR

## Bug

- [ ] Le hook `before` ne se déclenche pas pour les endpoints GET (`/verify-email`) — les hooks devraient couvrir tous les endpoints
- [ ] Prisma adapter : erreur P2025 sur `Verification.delete` (race condition passkey/OTP) — [#7129](https://github.com/better-auth/better-auth/issues/7129), [#6267](https://github.com/better-auth/better-auth/issues/6267)
- [ ] Prisma adapter : `TwoFactor.delete({ where: { userId } })` non-unique — [#5929](https://github.com/better-auth/better-auth/issues/5929) (fix PR #7096)

## Enhancement (high impact)

- [ ] Renommer les callbacks d'email ?
    - `sendResetPassword` → `onResetPasswordRequested`
    - `sendVerificationEmail` → `onEmailVerificationRequested`
    - `sendMagicLink` -> `onMagicLinkRequested`

## Enhancement (low impact)

- [ ] Exporter les noms de cookies en constantes (`better-auth.two_factor`, `better-auth.session_token`, etc.)

## Feature

## Done

### Branch `feat/lifecycle-hooks`

- [x] Lifecycle events (hooks)
    - [x] onLogin — core options, triggered after session creation
    - [x] onLogout — core options, triggered before session deletion
    - [x] onPasswordChanged — emailAndPassword options, triggered after password change from profile
    - [x] onTotpEnabled / onTotpDisabled — TwoFactorOptions
    - [x] onPasskeyAdded / onPasskeyDeleted — PasskeyOptions

- [x] Testing
    - [x] `sign-in.test.ts` — session creation, IP/user-agent, CSRF, form-data, additionalFields
    - [x] `sign-out.test.ts` — session deletion + afterSessionDeleted hook
    - [x] `password.test.ts` — reset flow, token expiry, anti-énumération, revokeSessionsOnPasswordReset
    - [x] `update-user.test.ts` — password change, updatedAt, wrong password rejection
    - [x] `two-factor.test.ts` — enable/disable, TOTP verify, backup codes, trust device, OTP storage modes, passwordless
    - [x] `passkey.test.ts` — register/authenticate options, list/update/delete, afterVerification callback

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
