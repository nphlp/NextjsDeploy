# PLAN — Audit Sécurité & Conformité Légale

## Contexte

Audit du boilerplate NextjsDeploy suite aux retours sur l'authentification et la conformité légale.
Références : OWASP, CNIL, RGPD, ANSSI.

---

## Phase 1 — Audit & Recherche

> Comprendre les exigences avant d'implémenter.

- [x] Lire les recommandations OWASP pour l'authentification (ASVS)
- [x] Lire les exigences CNIL / RGPD pour un site web français
- [x] Lire les recommandations ANSSI pour la sécurité des applications web
- [x] Vérifier ce que Better Auth supporte nativement (plugins disponibles)
- [x] Définir les solutions techniques pour chaque point
- [x] Rédiger `docs/security/standards.md` — synthèse OWASP, RGPD/CNIL, ANSSI

---

## Phase 2 — Renforcement Authentification

### 2.1 Inscription

- [x] **Règles de mot de passe** — minuscule, majuscule, chiffre, spécial, 14+ chars
    - Validation Zod côté client (progressive : onChange/onBlur/submit)
    - Validation serveur (auth-middleware)
    - Indicateur de force visuel (PasswordStrength)
- [x] **Confirmation de mot de passe** — second champ password
- [x] **CAPTCHA** — Cloudflare Turnstile (gratuit, RGPD-friendly)
    - Sur inscription et reset password
    - Hook `useTurnstile` avec animation Motion
- [x] **Protection emails jetables** — liste locale + Disify API + MailCheck.ai + DNS MX
- [x] **Vérification email améliorée** — bloquer l'accès tant que non vérifié
- [x] **Hashing sécurisé** — scrypt (natif Better Auth) + salt 16 bytes par mot de passe
- [x] **Have I Been Pwned** — blocage des mots de passe compromis (plugin Better Auth, k-anonymity)
- [x] **Anti-énumération email** — empêche de savoir si un email est déjà utilisé
    - Inscription classique : proxy retourne fake 200 si l'email existe déjà (pas d'email envoyé)
    - Magic link : envoie "Créez votre compte" si l'email n'existe pas, sinon lien de connexion
- [ ] **Email contextuel à l'inscription** — envoyer un email "vous avez déjà un compte" si l'email existe déjà
    - Actuellement aucun email n'est envoyé lors de l'inscription avec un email existant
    - Amélioration possible upstream par Better Auth ([#7972](https://github.com/better-auth/better-auth/issues/7972))
- [x] **Codes d'erreur standardisés** — auth-middleware → auth-errors.ts (traduction FR côté client)
- [x] **IDs nanoid** — Better Auth utilise nanoid (cohérent avec Prisma @default(nanoid()))

### 2.2 Connexion

- [x] **Rate limiting** — natif Better Auth
    - 20 req/10s global, 3 req/10s sur login/signup/reset
    - Par IP (cf-connecting-ip, x-forwarded-for, x-client-ip)
    - IPv6 subnet /64 (empêche rotation IPv6)
- [x] **2FA / MFA** — TOTP + codes de récupération
    - Plugin Better Auth `twoFactor` (TOTP + backup codes)
    - QR code setup + secret copiable + vérification + backup codes
    - Page `/verify-2fa` avec formulaires TOTP, backup code + trust device
    - Onglet Sécurité dans le profil (activer/désactiver, gérer backup codes)
    - UX : bouton Coller (clipboard) intégré dans InputOtp, bouton Copier les backup codes, avertissement stockage séparé
    - Email OTP non implémenté
- [x] **Passkeys (WebAuthn)** — inscription, connexion, gestion
    - Plugin Better Auth `passkey`
    - Ajout/suppression dans le profil + bouton passkey sur le login
- [x] **Connexion par email** — connexion sans mot de passe
    - Plugin Better Auth `magicLink`
    - Page `/magic-link` + formulaire email
    - Anti-énumération : si l'email n'existe pas, envoie un email "Créez votre compte" avec lien vers `/register` (même page de succès dans les deux cas)
- [ ] **OAuth providers** — Google, GitHub (minimum)
    - Plugin Better Auth `socialProviders`
- [x] **Changement d'email** — permettre à l'utilisateur de changer son email
    - API native Better Auth `changeEmail`
    - Emails de notification (ancien + nouveau, avant + après confirmation + annulation)
    - Indicateur "En attente" dans le profil avec annulation
    - Invalidation du token si changement annulé (custom GET handler)
- [ ] **Session revocation après changement d'email** — `revokeOtherSessions` n'existe pas dans `changeEmail`
    - Bloqué par Better Auth — voir `BETTER-AUTH.md`
    - L'implémenter côté app serait trop bricolé (token stale dans `afterEmailVerification`, race conditions avec `refreshUserSessions`)
- [ ] **Last login method** — tracer la dernière méthode de connexion utilisée
    - Plugin Better Auth `lastLoginMethod` ([docs](https://www.better-auth.com/docs/plugins/last-login-method))

### 2.3 Sécurité générale

- [x] **Protection des routes privées** — `unauthorized()` par route (Next.js 16 `authInterrupts`) + `proxy.ts`
- [x] **CSP strict** — `unsafe-eval` et Scalar uniquement en dev (`isDev` check dans `next.config.mts`)
- [x] **Logging sécurité** — table `ActivityHistory` (login, email, password, TOTP, passkey)
    - 7 types d'événements, rétention 90 jours, CRON de nettoyage
    - Affichage dans l'onglet Profil avec popover explicatif
    - À ajouter : `ACCOUNT_DELETED`, `DATA_DOWNLOADED` quand ces features seront implémentées
- [x] **Notifications de sécurité** — emails fire-and-forget pour toutes les opérations sensibles
    - Changement d'email (5 emails), mot de passe, TOTP, passkeys

---

## Phase 3 — Conformité Légale (RGPD / CNIL)

### 3.1 Cookie Banner

- [ ] **Composant Cookie Banner** — consentement granulaire
    - Cookies essentiels (session, thème) : pas de consentement requis
    - Cookies analytics (Umami) : consentement requis
    - Boutons : Accepter tout / Refuser tout / Personnaliser
    - Stocker le choix dans un cookie
    - Bloquer Umami tant que pas de consentement
- [ ] **Page politique de cookies** — détail de chaque cookie

### 3.2 Pages légales

- [ ] **Mentions légales** (`/legal/mentions`)
    - Identité de l'éditeur, hébergeur, contact, directeur de publication
- [ ] **Politique de confidentialité** (`/legal/privacy`)
    - Données collectées, finalités, durée de conservation
    - Base légale (consentement, intérêt légitime, contrat)
    - Droits des utilisateurs (accès, rectification, suppression, portabilité)
    - Contact DPO / responsable
- [ ] **Politique de cookies** (`/legal/cookies`)
    - Liste des cookies, durée, finalité
    - Comment modifier ses préférences
- [ ] **Politique de rétention des données** (`/legal/data-retention`)
    - Durée de conservation par type de donnée
    - Procédure de suppression
    - Archivage

### 3.3 Footer & Navigation

- [ ] **Liens dans le footer** vers toutes les pages légales
- [ ] **Lien cookie settings** pour rouvrir la banner

---

## Phase 4 — Implémentation

> Ordre d'implémentation à définir après la phase 1.

---

## Inventaire actuel

### Cookies actifs

| Cookie                      | Type                   | Durée    | httpOnly | Consentement requis |
| --------------------------- | ---------------------- | -------- | -------- | ------------------- |
| `better-auth.session_token` | Essentiel              | 24h      | Oui      | Non                 |
| `theme`                     | Essentiel (préférence) | 365j     | Non      | Non                 |
| `basket-cookie`             | Fonctionnel            | 30j      | Non      | Non                 |
| Cookies Umami               | Analytics              | Variable | ?        | **Oui**             |

### Auth — État actuel

| Fonctionnalité             | Statut                                                         |
| -------------------------- | -------------------------------------------------------------- |
| Email/Password             | ✅ OK                                                          |
| Vérification email         | ✅ OK (envoi à l'inscription + blocage si non vérifié)         |
| Reset password             | ✅ OK (email + token)                                          |
| Sessions multi-devices     | ✅ OK (visible sur /profile)                                   |
| Règles mot de passe        | ✅ 14+ chars, maj/min/chiffre/spécial (client Zod + server)    |
| Confirmation mot de passe  | ✅ OK                                                          |
| CAPTCHA                    | ✅ Turnstile (inscription + reset password)                    |
| Rate limiting              | ✅ 20/10s global, 3/10s endpoints sensibles                    |
| Hashing                    | ✅ scrypt + salt 16 bytes (natif Better Auth)                  |
| Protection emails jetables | ✅ Liste locale + Disify + MailCheck + DNS MX                  |
| Have I Been Pwned          | ✅ Plugin Better Auth (k-anonymity)                            |
| Anti-énumération email     | ✅ Proxy fake 200 + magic link contextuel                      |
| Codes d'erreur             | ✅ Standardisés + traduction FR côté client                    |
| IDs nanoid                 | ✅ Better Auth + Prisma cohérents                              |
| 2FA / MFA                  | ✅ TOTP + backup codes (Email OTP non implémenté)              |
| Passkeys (WebAuthn)        | ✅ Ajout/suppression/connexion                                 |
| Connexion par email        | ✅ Connexion sans mot de passe                                 |
| Changement d'email         | ✅ OK (notifications, annulation, invalidation token)          |
| Session revocation (email) | ❌ Bloqué par Better Auth — voir `BETTER-AUTH.md`              |
| Notifications sécurité     | ✅ Emails fire-and-forget (email, mdp, TOTP, passkey)          |
| Activity History           | ✅ 7 événements, rétention 90j, CRON cleanup, affichage profil |
| Tests                      | ✅ 373 tests (228 unit, 63 integ, 8 func, 74 E2E)              |
| OAuth providers            | ❌ À faire                                                     |
| Protection des routes      | ✅ `unauthorized()` par route + `proxy.ts` (Next.js 16)        |

### Légal — État actuel

| Page                         | Statut    |
| ---------------------------- | --------- |
| Cookie banner                | ❌ Absent |
| Mentions légales             | ❌ Absent |
| Politique de confidentialité | ❌ Absent |
| Politique de cookies         | ❌ Absent |
| Politique de rétention       | ❌ Absent |
| CGU/CGV                      | ❌ Absent |
| Liens footer                 | ❌ Absent |

### Sécurité — État actuel

| Mesure                 | Statut                                         |
| ---------------------- | ---------------------------------------------- |
| HSTS                   | ✅ `max-age=31536000; includeSubDomains`       |
| Headers CSP            | ✅ OK (strict en prod, `unsafe-eval` dev only) |
| X-Frame-Options        | ✅ DENY                                        |
| X-Content-Type-Options | ✅ nosniff                                     |
| Referrer-Policy        | ✅ strict-origin-when-cross-origin             |
| Permissions-Policy     | ✅ camera/micro/geo désactivés                 |
| CSRF                   | ✅ Via Better Auth (sameSite cookies)          |
| Rate limiting          | ✅ Natif Better Auth                           |
| Logging sécurité       | ✅ ActivityHistory (7 events, 90j)             |
