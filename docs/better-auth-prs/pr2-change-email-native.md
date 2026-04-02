# PR 2 — `feat/change-email-native`

## 🇫🇷 Français

**Titre :** `feat: native change-email flow via Verification table`

### Résumé

Le flow actuel de changement d'email repose sur des tokens JWT signés : le token contient le `newEmail` et est vérifié côté client via le endpoint générique `/verify-email`. Ce design pose des problèmes :

1. **Pas de `pendingEmail` visible** — impossible d'afficher l'email en attente dans l'UI
2. **Pas d'annulation** — une fois le token envoyé, l'utilisateur ne peut pas annuler
3. **Pas de callbacks** — aucun moyen de réagir aux étapes du flow (demande, validation, annulation)
4. **Token JWT dans l'URL** — le token contient des données sensibles, et le flow de vérification est mélangé avec la vérification d'email classique

Cette PR refactorise le changement d'email pour utiliser la **table `Verification`** (déjà utilisée pour le reset de mot de passe et l'OTP), avec un champ `pendingEmail` natif sur le modèle `User`.

### Changements

**Nouveau flow :**

1. `POST /change-email` → stocke `pendingEmail` + crée une entrée `Verification` → envoie un email via `sendVerificationEmail`
2. L'utilisateur clique le lien → `GET /verify-email-change/:userId/:token` → vérifie le token, met à jour l'email, supprime l'entrée Verification, crée une nouvelle session
3. (Optionnel) `POST /cancel-email-change` → supprime l'entrée Verification + efface `pendingEmail`

**Champ `pendingEmail` :**

- Ajouté conditionnellement à la table `user` quand `changeEmail.enabled: true`
- Champ en lecture seule (`input: false`), non modifiable directement par l'API

**Callback d'envoi dédié :**

- `sendVerificationEmail` — dans `user.changeEmail`, remplace la dépendance sur `emailVerification.sendVerificationEmail`. Permet un template d'email distinct pour le changement d'email vs la vérification de compte.

**Callbacks lifecycle :**

- `onChangeEmailRequested({ user, newEmail }, request)` — quand le changement est demandé
- `onChangeEmailCompleted({ user, oldEmail, newEmail }, request)` — quand le changement est vérifié et appliqué
- `onChangeEmailCancelled({ user }, request)` — quand le changement est annulé

**Options :**

- `revokeOtherSessions: true` — révoque toutes les autres sessions après un changement d'email

### Cas d'usage

- **Affichage de l'email en attente** : montrer `pendingEmail` dans le profil utilisateur avec un bouton "Annuler"
- **Notification de sécurité** : envoyer un email de confirmation à l'ancien email quand le changement est complété (`onChangeEmailCompleted`)
- **Audit** : journaliser les demandes, annulations et changements d'email effectifs
- **Révocation de sessions** : forcer la re-connexion sur tous les appareils après un changement d'email (`revokeOtherSessions`)

### Choix techniques

- **Verification table** plutôt que JWT : le token est stocké en base, ce qui permet l'annulation, l'unicité par utilisateur (`change-email:${userId}`), et la suppression après usage (one-time use).
- **Suppression de l'ancien flow** dans `email-verification.ts` : les 151 lignes du flow JWT sont supprimées. Le nouveau flow est entièrement dans `update-user.ts`.
- **Protection anti-énumération** : quand l'email cible existe déjà, l'endpoint simule la génération de token et retourne `{ status: true }` (aucune information ne fuite).
- **Client config** : `/cancel-email-change` est enregistré comme `POST` dans `pluginPathMethods`, et les `atomListeners` sont mis à jour pour rafraîchir l'état client.

### Tests (23 tests)

| Fichier                      | Couverture                                                                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `update-user.test.ts`        | pendingEmail stocké, vérification via Verification table, revoke other sessions, annulation, reject après annulation, callbacks, anti-énumération |
| `email-verification.test.ts` | change email via Verification table, onChangeEmailCompleted, emailVerified propagé sur toutes les sessions                                        |

### Documentation

- **`users-accounts.mdx`** : section "Change Email" entièrement réécrite — setup, flow, annulation, callbacks lifecycle, revokeOtherSessions, schéma pendingEmail, usage server + client

### Note

> This could also be implemented as a plugin for consistency with 2FA/passkey — open to feedback.

### Fichiers modifiés (11 fichiers, +536 −458)

- `packages/core/src/types/init-options.ts` — types onChangeEmail\*, changeEmail config + `sendVerificationEmail` dédié
- `packages/core/src/db/get-tables.ts` — champ pendingEmail conditionnel
- `packages/better-auth/src/api/routes/update-user.ts` — changeEmail, cancelEmailChange, verifyEmailChange
- `packages/better-auth/src/api/routes/email-verification.ts` — suppression ancien flow JWT
- `packages/better-auth/src/api/index.ts` — enregistrement nouveaux endpoints
- `packages/better-auth/src/client/config.ts` — pluginPathMethods + atomListeners
- `packages/telemetry/src/detectors/detect-auth-config.ts` — détection changeEmail options
- Tests + Docs

---

## 🇬🇧 English

**Title:** `feat: native change-email flow via Verification table`

### Summary

The current change-email flow relies on signed JWT tokens: the token contains the `newEmail` and is verified through the generic `/verify-email` endpoint. This design has several issues:

1. **No visible `pendingEmail`** — no way to show the pending email in the UI
2. **No cancellation** — once the token is sent, the user cannot cancel
3. **No callbacks** — no way to react to flow steps (request, completion, cancellation)
4. **JWT token in URL** — the token contains sensitive data, and the verification flow is mixed with regular email verification

This PR refactors change-email to use the **`Verification` table** (already used for password reset and OTP), with a native `pendingEmail` field on the `User` model.

### Changes

**New flow:**

1. `POST /change-email` → stores `pendingEmail` + creates a `Verification` entry → sends email via `sendVerificationEmail`
2. User clicks the link → `GET /verify-email-change/:userId/:token` → verifies token, updates email, deletes Verification entry, creates new session
3. (Optional) `POST /cancel-email-change` → deletes Verification entry + clears `pendingEmail`

**`pendingEmail` field:**

- Conditionally added to the `user` table when `changeEmail.enabled: true`
- Read-only field (`input: false`), not directly modifiable via API

**Dedicated sending callback:**

- `sendVerificationEmail` — in `user.changeEmail`, replaces the dependency on `emailVerification.sendVerificationEmail`. Allows a distinct email template for email change vs account verification.

**Lifecycle callbacks:**

- `onChangeEmailRequested({ user, newEmail }, request)` — when the change is requested
- `onChangeEmailCompleted({ user, oldEmail, newEmail }, request)` — when the change is verified and applied
- `onChangeEmailCancelled({ user }, request)` — when the change is cancelled

**Options:**

- `revokeOtherSessions: true` — revokes all other sessions after email change

### Use cases

- **Display pending email**: show `pendingEmail` in the user profile with a "Cancel" button
- **Security notification**: send a confirmation email to the old address when the change is completed (`onChangeEmailCompleted`)
- **Audit**: log email change requests, cancellations, and completions
- **Session revocation**: force re-login on all devices after an email change (`revokeOtherSessions`)

### Technical decisions

- **Verification table** over JWT: token is stored in the database, enabling cancellation, per-user uniqueness (`change-email:${userId}`), and deletion after use (one-time use).
- **Removal of old flow** from `email-verification.ts`: the 151-line JWT flow is removed. The new flow lives entirely in `update-user.ts`.
- **Email enumeration protection**: when the target email already exists, the endpoint simulates token generation and returns `{ status: true }` (no information leaks).
- **Client config**: `/cancel-email-change` is registered as `POST` in `pluginPathMethods`, and `atomListeners` are updated to refresh client state.

### Tests (23 tests)

| File                         | Coverage                                                                                                                                        |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `update-user.test.ts`        | pendingEmail stored, verification via Verification table, revoke other sessions, cancellation, reject after cancel, callbacks, anti-enumeration |
| `email-verification.test.ts` | change email via Verification table, onChangeEmailCompleted, emailVerified propagated to all sessions                                           |

### Documentation

- **`users-accounts.mdx`**: "Change Email" section fully rewritten — setup, flow, cancellation, lifecycle callbacks, revokeOtherSessions, pendingEmail schema, server + client usage

### Note

> This could also be implemented as a plugin for consistency with 2FA/passkey — open to feedback.

### Changed files (11 files, +536 −458)

- `packages/core/src/types/init-options.ts` — onChangeEmail\*, changeEmail config types + dedicated `sendVerificationEmail`
- `packages/core/src/db/get-tables.ts` — conditional pendingEmail field
- `packages/better-auth/src/api/routes/update-user.ts` — changeEmail, cancelEmailChange, verifyEmailChange
- `packages/better-auth/src/api/routes/email-verification.ts` — removed old JWT flow
- `packages/better-auth/src/api/index.ts` — register new endpoints
- `packages/better-auth/src/client/config.ts` — pluginPathMethods + atomListeners
- `packages/telemetry/src/detectors/detect-auth-config.ts` — changeEmail options detection
- Tests + Docs
