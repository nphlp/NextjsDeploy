# PR 1 — `feat/lifecycle-hooks`

## 🇫🇷 Français

**Titre :** `feat: add lifecycle event callbacks for security-sensitive operations`

### Résumé

Better Auth dispose de hooks `before`/`after` (middleware générique sur tous les endpoints), mais il n'y a pas de callbacks ciblés pour réagir à des événements de sécurité spécifiques (connexion, déconnexion, changement de mot de passe, etc.).

Cette PR ajoute des **lifecycle callbacks** — des callbacks optionnels, configurés directement dans les options concernées, qui se déclenchent après des opérations sensibles. Ils permettent le logging, l'analytics, les notifications de sécurité, ou tout side-effect sans avoir à écrire un plugin ou un middleware `after` avec du matching de `ctx.path`.

### Callbacks ajoutés

**Core options :**

- `onLogin` — déclenché après la création d'une session (email/password, magic link, OAuth, passkey)
- `onLogout` — déclenché après la suppression d'une session

**emailAndPassword options :**

- `onPasswordChanged` — déclenché quand un utilisateur change son mot de passe depuis son profil
- `onResetPasswordRequested` — déclenché quand un reset de mot de passe est demandé (alongside `sendResetPassword`)

**emailVerification options :**

- `onEmailVerificationRequested` — déclenché quand un email de vérification est envoyé (alongside `sendVerificationEmail`)

**Two-Factor plugin :**

- `onTotpEnabled` / `onTotpDisabled` — déclenché quand la 2FA est activée/désactivée

**Passkey plugin :**

- `onPasskeyAdded` / `onPasskeyDeleted` — déclenché quand un passkey est ajouté/supprimé

**Magic Link plugin :**

- `onMagicLinkRequested` — déclenché quand un magic link est envoyé (alongside `sendMagicLink`)

### Cas d'usage

- **Notifications de sécurité** : envoyer un email d'alerte quand un utilisateur se connecte depuis un nouvel appareil (`onLogin`), change son mot de passe (`onPasswordChanged`), ou active/désactive la 2FA (`onTotpEnabled`/`onTotpDisabled`)
- **Audit / logging** : journaliser les événements sensibles (connexions, reset de mot de passe, ajout/suppression de passkeys) dans un système externe
- **Analytics** : tracker les événements d'authentification (taux de vérification d'email, adoption de la 2FA, usage du magic link)
- **Alertes anti-abus** : détecter des patterns suspects (multiples demandes de reset de mot de passe via `onResetPasswordRequested`)

### Choix techniques

- **`runInBackgroundOrAwait`** : tous les callbacks utilisent ce pattern existant — ils s'exécutent de manière synchrone par défaut, ou sont déférés si un handler `backgroundTasks` est configuré.
- **Callbacks observationnels** : les callbacks `onXxxRequested` tournent _alongside_ les callbacks fonctionnels (`sendResetPassword`, `sendVerificationEmail`, `sendMagicLink`), ils ne les remplacent pas. Cela permet de séparer l'envoi d'email (fonctionnel) du logging/analytics (observationnel).
- **Signature cohérente** : `(data: { ... }, request?: Request) => Promise<void>` pour tous les callbacks core. Les plugins suivent la signature de leur contexte (`GenericEndpointContext` pour magic-link).
- **JSDoc** sur chaque callback avec description claire.

### Correction

- `onPasswordReset` : le JSDoc disait "when a user's password is changed successfully" alors qu'il se déclenche lors du _reset via forgot-password_. Corrigé en "when a user's password is reset via forgot password flow".

### Tests

| Fichier                      | Callback testé                                                    |
| ---------------------------- | ----------------------------------------------------------------- |
| `sign-out.test.ts`           | `onLogout` — vérifie que le userId est bien transmis              |
| `password.test.ts`           | `onResetPasswordRequested` — vérifie l'appel avec l'email du user |
| `email-verification.test.ts` | `onEmailVerificationRequested` — vérifie l'appel lors de l'envoi  |
| `magic-link.test.ts`         | `onMagicLinkRequested` — vérifie l'appel avec l'email             |

### Documentation

- **`hooks.mdx`** : nouvelle section "Lifecycle Callbacks" avec exemples de code pour chaque callback, organisés par catégorie (Core, Email & Password, Email Verification, Plugins)

### Fichiers modifiés (18 fichiers, +473 −50)

- `packages/core/src/types/init-options.ts` — types pour onLogin, onLogout, onPasswordChanged, onResetPasswordRequested, onEmailVerificationRequested
- `packages/better-auth/src/api/routes/sign-in.ts` — implémentation onLogin
- `packages/better-auth/src/api/routes/sign-out.ts` — implémentation onLogout
- `packages/better-auth/src/api/routes/update-user.ts` — implémentation onPasswordChanged
- `packages/better-auth/src/api/routes/password.ts` — implémentation onResetPasswordRequested
- `packages/better-auth/src/api/routes/email-verification.ts` — implémentation onEmailVerificationRequested
- `packages/better-auth/src/plugins/two-factor/types.ts` + `index.ts` — onTotpEnabled / onTotpDisabled
- `packages/passkey/src/types.ts` + `routes.ts` — onPasskeyAdded / onPasskeyDeleted
- `packages/better-auth/src/plugins/magic-link/index.ts` — onMagicLinkRequested
- Tests : `sign-out.test.ts`, `password.test.ts`, `email-verification.test.ts`, `magic-link.test.ts`
- Docs : `hooks.mdx`

---

## 🇬🇧 English

**Title:** `feat: add lifecycle event callbacks for security-sensitive operations`

### Summary

Better Auth has generic `before`/`after` hooks (middleware that intercepts all endpoints), but there are no purpose-built callbacks for reacting to specific security events (login, logout, password change, etc.).

This PR adds **lifecycle callbacks** — optional callbacks configured directly in the relevant options section, triggered after security-sensitive operations. They enable logging, analytics, security notifications, or any side-effect without writing a plugin or an `after` hook with `ctx.path` matching.

### Added callbacks

**Core options:**

- `onLogin` — triggered after a session is created (email/password, magic link, OAuth, passkey)
- `onLogout` — triggered after a session is deleted

**emailAndPassword options:**

- `onPasswordChanged` — triggered when a user changes their password from their profile
- `onResetPasswordRequested` — triggered when a password reset is requested (runs alongside `sendResetPassword`)

**emailVerification options:**

- `onEmailVerificationRequested` — triggered when a verification email is sent (runs alongside `sendVerificationEmail`)

**Two-Factor plugin:**

- `onTotpEnabled` / `onTotpDisabled` — triggered when 2FA is enabled/disabled

**Passkey plugin:**

- `onPasskeyAdded` / `onPasskeyDeleted` — triggered when a passkey is added/deleted

**Magic Link plugin:**

- `onMagicLinkRequested` — triggered when a magic link is sent (runs alongside `sendMagicLink`)

### Use cases

- **Security notifications**: send an alert email when a user logs in from a new device (`onLogin`), changes their password (`onPasswordChanged`), or enables/disables 2FA (`onTotpEnabled`/`onTotpDisabled`)
- **Audit / logging**: log security-sensitive events (logins, password resets, passkey additions/deletions) to an external system
- **Analytics**: track authentication events (email verification rate, 2FA adoption, magic link usage)
- **Abuse detection**: detect suspicious patterns (multiple password reset requests via `onResetPasswordRequested`)

### Technical decisions

- **`runInBackgroundOrAwait`**: all callbacks use this existing pattern — they execute synchronously by default, or are deferred when a `backgroundTasks` handler is configured.
- **Observational callbacks**: the `onXxxRequested` callbacks run _alongside_ functional callbacks (`sendResetPassword`, `sendVerificationEmail`, `sendMagicLink`), they don't replace them. This separates email delivery (functional) from logging/analytics (observational).
- **Consistent signature**: `(data: { ... }, request?: Request) => Promise<void>` for all core callbacks. Plugins follow their own context signature (`GenericEndpointContext` for magic-link).
- **JSDoc** on every callback with clear description.

### Fix

- `onPasswordReset`: JSDoc said "when a user's password is changed successfully" but it fires on _forgot-password reset_. Fixed to "when a user's password is reset via forgot password flow".

### Tests

| File                         | Callback tested                                            |
| ---------------------------- | ---------------------------------------------------------- |
| `sign-out.test.ts`           | `onLogout` — verifies userId is passed correctly           |
| `password.test.ts`           | `onResetPasswordRequested` — verifies call with user email |
| `email-verification.test.ts` | `onEmailVerificationRequested` — verifies call on send     |
| `magic-link.test.ts`         | `onMagicLinkRequested` — verifies call with email          |

### Documentation

- **`hooks.mdx`**: new "Lifecycle Callbacks" section with code examples for each callback, organized by category (Core, Email & Password, Email Verification, Plugins)

### Changed files (18 files, +473 −50)

- `packages/core/src/types/init-options.ts` — types for onLogin, onLogout, onPasswordChanged, onResetPasswordRequested, onEmailVerificationRequested
- `packages/better-auth/src/api/routes/sign-in.ts` — onLogin implementation
- `packages/better-auth/src/api/routes/sign-out.ts` — onLogout implementation
- `packages/better-auth/src/api/routes/update-user.ts` — onPasswordChanged implementation
- `packages/better-auth/src/api/routes/password.ts` — onResetPasswordRequested implementation
- `packages/better-auth/src/api/routes/email-verification.ts` — onEmailVerificationRequested implementation
- `packages/better-auth/src/plugins/two-factor/types.ts` + `index.ts` — onTotpEnabled / onTotpDisabled
- `packages/passkey/src/types.ts` + `routes.ts` — onPasskeyAdded / onPasskeyDeleted
- `packages/better-auth/src/plugins/magic-link/index.ts` — onMagicLinkRequested
- Tests: `sign-out.test.ts`, `password.test.ts`, `email-verification.test.ts`, `magic-link.test.ts`
- Docs: `hooks.mdx`
