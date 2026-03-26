# Testing Plan

## Types de tests

### Unitaire

Tester une **fonction isolée**. Toutes les dépendances sont mockées (DB, session, API, emails).
Rapide, déterministe, pas d'infra nécessaire. Le plus nombreux.

### Intégration

Tester une **fonction avec ses vraies dépendances** (DB PostgreSQL, Mailpit, Prisma).
Les appels HTTP internes et la DB sont réels, pas mockés. Nécessite Docker (Postgres + Mailpit).

### Fonctionnel

Tester une **fonctionnalité complète de bout en bout** côté serveur.
Seules les **API externes** sont mockées (HIBP, Disify, Turnstile). La DB, les emails, les sessions sont réels.
Utile pour valider des flows multi-étapes sans navigateur.

### E2E

Tester une **fonctionnalité dans un navigateur réel** (Playwright).
Aucun mocking. Clics, navigation, formulaires, emails. Le plus lent et le plus fragile.
Réservé aux **happy paths critiques** et aux interactions UI complexes.

---

## Register

### Unitaire

- [x] `sendVerificationEmail` avec user mocké -> appelle `SendEmailAction` avec le bon sujet et type `verification`
- [x] `customSyntheticUser` -> les clés JSON sont dans le même ordre que le vrai user
- [x] Auth middleware -> rejette les domaines email jetables (liste locale : Mailinator, Yopmail, etc.)
- [x] Auth middleware -> accepte les domaines email fiables (liste locale : Gmail, Outlook, etc.)
- [x] Auth middleware -> rejette un mot de passe trop court (< 14 caractères)
- [x] Auth middleware -> rejette un mot de passe sans majuscule/minuscule/nombre/spécial

### Intégration

- [x] Register un utilisateur -> crée le user en DB avec `emailVerified: false`
- [x] Register un utilisateur -> envoie un email de vérification (Mailpit)
- [x] Register un email déjà existant -> retourne un synthetic user (anti-enum)
- [x] Register un email déjà existant -> la réponse JSON a les mêmes clés dans le même ordre qu'un vrai user
- [x] Vérification email -> met à jour `emailVerified: true` en DB
- [x] Vérification email avec token expiré -> erreur
- [x] Register avec un domaine jetable (liste locale) -> erreur `EMAIL_INVALID`

### Fonctionnel

- [ ] Register avec domaine jetable détecté par Disify (API mockée) -> erreur `EMAIL_INVALID`
- [ ] Register avec domaine jetable, Disify en panne -> fallback MailCheck (API mockée) -> erreur
- [ ] Register avec domaine jetable, toutes les API en panne -> fallback MX records
- [ ] Register avec mot de passe compromis (HIBP API mockée) -> erreur `PASSWORD_COMPROMISED`
- [ ] Register complet -> register + vérification email + session créée (sans navigateur)

### E2E

- [x] Page accessible
- [x] Validation client (champs vides, mot de passe faible, mismatch)
- [x] Flow complet : register -> success page -> vérification email -> auto-login
- [x] Anti-enum : register existing email -> réponse JSON identique (clés dans le même ordre)

---

## Login

### Unitaire

- [x] `translateAuthError` -> traduit les codes d'erreur en français
- [x] `isValidationError` -> distingue les erreurs de validation des erreurs d'énumération

### Intégration

- [x] Login avec identifiants valides -> retourne une session
- [x] Login avec mauvais mot de passe -> erreur
- [x] Login avec email non-vérifié -> envoie un email de vérification
- [x] Login avec email inexistant -> erreur

### E2E

- [x] Page accessible
- [x] Login réussi -> redirect `/`
- [x] Mauvais mot de passe -> toast erreur
- [x] Route protégée -> redirect vers `/login?redirect=...`
- [x] Login avec redirect query param -> redirect vers la route demandée
- [x] Route guest-only -> redirect vers `/` si connecté

---

## Logout

### Intégration

- [x] Logout -> supprime la session en DB
- [x] Logout -> supprime le cookie de session

### E2E

- [x] Logout -> redirect vers `/`
- [x] Après logout -> route protégée redirect vers login

---

## Reset password

### Unitaire

- [x] `sendResetPassword` avec user mocké -> appelle `SendEmailAction` avec le bon sujet et type `reset`

### Intégration

- [x] Demande de reset -> envoie un email avec un lien (Mailpit)
- [x] Demande de reset pour email inexistant -> même comportement (anti-enum)
- [x] Reset avec token valide -> met à jour le mot de passe en DB
- [x] Reset avec token expiré -> erreur
- [x] Reset avec mot de passe faible -> erreur `PASSWORD_INVALID`
- [x] Après reset -> `emailVerified: true` (callback `onPasswordReset`)

### Fonctionnel

- [ ] Reset avec mot de passe compromis (HIBP API mockée) -> erreur `PASSWORD_COMPROMISED`

### E2E

- [x] Validation client (email vide)
- [x] Flow complet : register -> verify -> request reset -> email -> reset -> login
- [x] Login avec nouveau mot de passe
- [x] Token de reset invalide -> erreur

---

## Magic link

### Unitaire

- [x] `sendMagicLink` avec user existant -> envoie un email de type `magic-link`
- [x] `sendMagicLink` avec user inexistant -> envoie un email de type `magic-link-no-account` (anti-enum)

### Intégration

- [ ] Magic link avec user existant -> crée une session
- [ ] Magic link avec user inexistant -> envoie un email vers `/register` (anti-enum)
- [ ] Magic link avec token expiré -> erreur

### E2E

- [x] Flow complet : envoi -> email -> clic lien -> auto-login
- [x] Lien invalide -> erreur
- [x] Magic link vers user inexistant -> envoie un email d'inscription (anti-enum)

---

## Change email

### Unitaire

- [x] `afterEmailVerification` avec JWT change-email -> clear `pendingEmail` et envoie 2 emails
- [x] `afterEmailVerification` avec JWT vérification classique -> ne fait rien
- [x] Route handler `/verify-email` -> bloque le lien si `pendingEmail` est null (annulé)
- [x] Route handler `/verify-email` -> laisse passer si `pendingEmail` correspond
- [x] Auth middleware -> valide le domaine email sur `/change-email` avec `ctx.body.newEmail`

### Intégration

- [x] `changeEmail` -> crée un token JWT avec `updateTo`
- [x] `changeEmail` -> envoie un email de vérification au nouvel email (Mailpit)
- [x] `userSetPendingEmail` -> met à jour `pendingEmail` en DB
- [ ] `userSetPendingEmail` -> envoie un email de notification à l'ancien email (Mailpit)
- [x] `userCancelPendingEmail` -> clear `pendingEmail` en DB
- [ ] `userCancelPendingEmail` -> envoie un email de notification d'annulation (Mailpit)
- [ ] Vérification du nouvel email -> met à jour `email` en DB
- [ ] Vérification du nouvel email -> clear `pendingEmail` en DB
- [ ] Vérification du nouvel email -> envoie email "modifié" à l'ancien + "confirmé" au nouveau (Mailpit)
- [ ] Vérification après annulation -> rejeté (pendingEmail null)
- [x] `changeEmail` avec email déjà utilisé -> réponse identique (anti-enum)
- [x] `changeEmail` avec même email -> erreur "identique à l'actuelle"

### Fonctionnel

- [ ] Change email avec domaine jetable détecté par Disify (API mockée) -> erreur `EMAIL_INVALID`

### E2E

- [x] Section visible dans l'onglet sécurité
- [x] Validation client (champ vide, même email)
- [x] Pending email visible dans le profil
- [x] AlertDialog d'annulation (fermer sans annuler, confirmer l'annulation)
- [x] Lien de vérification rejeté après annulation
- [x] Flow complet : changement -> vérification -> login avec nouvel email
- [x] Login avec ancien email échoue
- [x] Anti-enum : email existant -> page succès

---

## Update password

### Unitaire

- [x] `SendSecurityNotificationAction("password-changed")` -> appelle `SendEmailAction` avec sujet "mot de passe"
- [x] Auth middleware -> rejette un nouveau mot de passe trop faible sur `/change-password`

### Intégration

- [x] `changePassword` avec bon mot de passe actuel -> met à jour en DB
- [x] `changePassword` avec mauvais mot de passe actuel -> erreur
- [x] `changePassword` -> révoque les autres sessions (`revokeOtherSessions: true`)
- [x] `changePassword` -> envoie un email de notification (Mailpit)
- [x] `changePassword` avec mot de passe faible -> erreur `PASSWORD_INVALID`

### Fonctionnel

- [ ] `changePassword` avec mot de passe compromis (HIBP API mockée) -> erreur `PASSWORD_COMPROMISED`

### E2E

- [x] Validation client (champs vides, mot de passe faible, mismatch)
- [x] Flow complet : changement -> toast succès -> login avec nouveau mot de passe
- [x] Notification email reçue (Mailpit)
- [x] Mauvais mot de passe actuel -> toast erreur

---

## TOTP (2FA)

### Unitaire

- [x] `SendSecurityNotificationAction("totp-enabled")` -> bon sujet
- [x] `SendSecurityNotificationAction("totp-disabled")` -> bon sujet

### Intégration

- [ ] `twoFactor.enable` -> crée un enregistrement TwoFactor en DB
- [ ] `twoFactor.verifyTotp` avec bon code -> active 2FA (`twoFactorEnabled: true`)
- [ ] `twoFactor.verifyTotp` avec mauvais code -> erreur
- [ ] `twoFactor.disable` -> supprime le TwoFactor et met `twoFactorEnabled: false`
- [ ] `twoFactor.generateBackupCodes` -> retourne des codes valides
- [ ] Login avec 2FA activé -> redirige vers `/verify-2fa`
- [ ] Vérification TOTP -> crée la session
- [ ] Login avec backup code -> crée la session
- [ ] Backup code utilisé -> ne peut pas être réutilisé
- [ ] Régénération des backup codes -> invalide les anciens
- [ ] Trust device -> skip 2FA pendant 30 jours
- [ ] Enable TOTP -> envoie un email de notification (Mailpit)
- [ ] Disable TOTP -> envoie un email de notification (Mailpit)

### E2E

- [x] Enable 2FA depuis le profil (password -> QR -> code -> backup codes)
- [x] Login TOTP -> /verify-2fa -> code -> redirect /
- [x] Mauvais code TOTP -> erreur
- [x] Trust device -> next login skip 2FA
- [x] Disable 2FA -> next login skip /verify-2fa
- [x] Notification email reçue (Mailpit)

---

## Backup codes

### E2E

- [x] View backup codes pendant le setup 2FA
- [x] Login avec backup code -> redirect /
- [x] Backup code utilisé ne peut pas être réutilisé
- [x] Régénération des codes invalide les anciens

---

## Passkey (WebAuthn)

### Unitaire

- [x] `SendSecurityNotificationAction("passkey-added")` -> bon sujet
- [x] `SendSecurityNotificationAction("passkey-deleted")` -> bon sujet

### Intégration

- [ ] `passkey.addPasskey` -> crée un Passkey en DB
- [ ] `passkey.deletePasskey` -> supprime le Passkey de la DB
- [ ] `passkey.listUserPasskeys` -> retourne les passkeys du user
- [ ] Add passkey -> envoie un email de notification (Mailpit)
- [ ] Delete passkey -> envoie un email de notification (Mailpit)

### E2E

- [x] Ajouter une passkey depuis le profil
- [x] Login avec passkey -> redirect /
- [x] Supprimer une passkey -> liste mise à jour
- [x] Login avec passkey supprimée -> erreur
- [x] Annuler le prompt passkey -> erreur
- [x] Notification email reçue (Mailpit)

---

## Verify 2FA

### E2E

- [x] Page accessible quand 2FA en attente
- [x] Redirect vers /login quand pas de 2FA pending
- [x] Redirect vers / quand déjà authentifié
- [x] Annuler 2FA -> retour /login
- [x] Switch entre TOTP et backup code tabs

---

## Session management

### Intégration

- [x] `getSession` -> retourne la session courante
- [x] `getSessionList` -> retourne toutes les sessions du user
- [ ] `revokeSession` -> supprime une session spécifique
- [ ] `revokeOtherSessions` -> supprime toutes les sessions sauf la courante
- [x] Extended session -> inclut `lastname`, `role`, `pendingEmail`

### E2E

- [x] Révoquer une session spécifique (AlertDialog)
- [x] Révoquer toutes les sessions

---

## Profile (edition)

### E2E

- [x] Auth guard -> redirect vers /login
- [x] Page accessible avec infos user
- [x] Update lastname et firstname
- [x] Validation erreurs mot de passe

---

## Contact

### Unitaire

- [x] `SendContactAction` -> envoie au `SUPPORT_EMAIL` avec `replyTo` de l'expéditeur
- [x] `SendContactAction` -> envoie un email de confirmation à l'expéditeur

### Intégration

- [x] Soumission du formulaire -> email reçu dans Mailpit avec sujet `[Contact]`
- [x] Soumission du formulaire -> email de confirmation reçu par l'expéditeur (Mailpit)

### E2E

- [x] Page accessible
- [x] Pré-sélection du sujet via query params
- [x] Validation client (champs vides)
- [x] Flow complet : soumission (non connecté, avec email)
- [x] Flow complet : soumission (connecté, sans champ email)
- [x] Lien footer -> navigation vers /contact

---

## Auth middleware

### Unitaire

- [x] Domaines jetables -> rejeté (liste locale)
- [x] Domaines de confiance -> accepté (liste locale, skip API)
- [x] Mot de passe trop court -> rejeté
- [x] Mot de passe sans critères -> rejeté (majuscule, minuscule, nombre, spécial)
- [x] Path `/sign-up/email` -> valide email + password
- [x] Path `/change-email` -> valide email via `newEmail` (pas `email`)
- [x] Path `/change-password` -> valide password via `newPassword`
- [x] Path `/reset-password` -> valide password via `newPassword`

### Fonctionnel

- [ ] Domaine inconnu -> vérifie via API Disify (mock HTTP) puis fallback MailCheck
- [ ] Domaine sans MX records -> rejeté
- [ ] Toutes les API en panne -> fallback MX records uniquement

---

## Email templates

### Unitaire

- [x] Chaque `EmailType` -> rend un HTML valide
- [x] `SMTP_FROM_NAME` est utilisé dans le header (pas hardcodé)
- [x] `ContactEmailTemplate` -> rend le sujet, email expéditeur, message

---

## CSRF

### Unitaire

- [x] Méthodes non-mutation (GET, HEAD, OPTIONS) -> passent
- [x] Méthodes mutation sans headers -> bloquées
- [x] Méthodes mutation avec origin invalide -> bloquées
- [x] Méthodes mutation avec origin valide -> passent

---

## User CRUD (oRPC)

### Unitaire

- [x] Create : permissions (visitor/user/admin), duplicate email, minimal/full data
- [x] FindUnique : permissions (visitor/user own/other/admin), not found
- [x] FindMany : permissions (visitor/user/admin), pagination
- [x] FindFirst : permissions, search, partial matches
- [x] Update : permissions (visitor/user own/other/admin/role change), field updates
- [x] Delete : permissions (visitor/user/admin own/other), not found

---

## Coverage cible

| Type        | Objectif                                      | Actuel    |
| ----------- | --------------------------------------------- | --------- |
| Unitaire    | Toutes les fonctions auth, middleware, emails | 223 tests |
| Intégration | Tous les flows auth avec DB réelle + Mailpit  | 34 tests  |
| Fonctionnel | API externes (HIBP, Disify, Turnstile, MX)    | Aucun     |
| E2E         | Flows critiques (happy path + sécurité)       | 74 tests  |
