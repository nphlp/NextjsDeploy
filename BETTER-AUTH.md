# Better Auth PR

## Bug

- [ ] Le hook `before` ne se déclenche pas pour les endpoints GET (`/verify-email`) — les hooks devraient couvrir tous les endpoints
- [ ] Prisma adapter : erreur P2025 sur `Verification.delete` (race condition passkey/OTP) — [#7129](https://github.com/better-auth/better-auth/issues/7129), [#6267](https://github.com/better-auth/better-auth/issues/6267)
- [ ] Prisma adapter : `TwoFactor.delete({ where: { userId } })` non-unique — [#5929](https://github.com/better-auth/better-auth/issues/5929) (fix PR #7096)

## Enhancement (high impact)

- [ ] Changement d'email
    - [ ] Stocker le nouvel email en attente (`pendingEmail` natif)
    - [ ] Pouvoir annuler un changement d'email en cours (passer par la table `Verification`)
    - [ ] Envoyer des email :
        - À l'ancien email, avant et après confirmation (2 callbacks)
        - À l'ancien email, en cas d'annulation (1 callback)
        - Au nouvel email, avant et après confirmation (2 callbacks)
    - [ ] Ajouter un settings pour `revokeOtherSessions` après confirmation

- [ ] Renommer les callbacks d'email ?
    - `sendResetPassword` → `onResetPasswordRequested`
    - `sendVerificationEmail` → `onEmailVerificationRequested`
    - `sendMagicLink` -> `onMagicLinkRequested`

- [ ] `revokeOtherSessions` pour `changeEmail` (comme pour `changePassword`)

## Enhancement (low impact)

- [ ] `afterEmailVerification` devrait recevoir le JWT décodé dans ses paramètres (pas seulement `user` et `request`)

- [ ] Exporter les noms de cookies en constantes (`better-auth.two_factor`, `better-auth.session_token`, etc.)

## Feature

- [ ] Lifecycle events (hooks)
    - [ ] onLogin
    - [ ] onEmailVerificationRequested / onEmailVerificationCompleted
    - [ ] onChangeEmailRequested / onChangeEmailCancelled / onChangeEmailCompleted
    - [ ] onPasswordChanged (depuis le profil, distinct de onPasswordReset)
    - [ ] onResetPasswordRequested / onResetPasswordCompleted
    - [ ] onTotpEnabled / onTotpDisabled
    - [ ] onPasskeyAdded / onPasskeyDeleted
