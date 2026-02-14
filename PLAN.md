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
- [x] Rédiger `docs/security-reference.md` — synthèse OWASP, RGPD/CNIL, ANSSI

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
- [x] **Anti-énumération email** — proxy route masque USER_ALREADY_EXISTS en fake 200 (OWASP)
- [x] **Codes d'erreur standardisés** — auth-middleware → auth-errors.ts (traduction FR côté client)
- [x] **IDs nanoid** — Better Auth utilise nanoid (cohérent avec Prisma @default(nanoid()))

### 2.2 Connexion

- [x] **Rate limiting** — natif Better Auth
    - 20 req/10s global, 3 req/10s sur login/signup/reset
    - Par IP (cf-connecting-ip, x-forwarded-for, x-client-ip)
    - IPv6 subnet /64 (empêche rotation IPv6)
- [ ] **2FA / MFA** — TOTP (authenticator app)
    - Plugin Better Auth `twoFactor`
    - QR code setup + codes de récupération
- [ ] **OAuth providers** — Google, GitHub (minimum)
    - Plugin Better Auth `socialProviders`

### 2.3 Sécurité générale

- [ ] **Middleware Next.js** — protection automatique des routes privées
- [ ] **CSP strict** — retirer `unsafe-eval` si possible en production
- [ ] **Logging sécurité** — log des tentatives échouées

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

| Fonctionnalité             | Statut                                                      |
| -------------------------- | ----------------------------------------------------------- |
| Email/Password             | ✅ OK                                                       |
| Vérification email         | ✅ OK (envoi à l'inscription + blocage si non vérifié)      |
| Reset password             | ✅ OK (email + token)                                       |
| Sessions multi-devices     | ✅ OK (visible sur /profile)                                |
| Règles mot de passe        | ✅ 14+ chars, maj/min/chiffre/spécial (client Zod + server) |
| Confirmation mot de passe  | ✅ OK                                                       |
| CAPTCHA                    | ✅ Turnstile (inscription + reset password)                 |
| Rate limiting              | ✅ 20/10s global, 3/10s endpoints sensibles                 |
| Hashing                    | ✅ scrypt + salt 16 bytes (natif Better Auth)               |
| Protection emails jetables | ✅ Liste locale + Disify + MailCheck + DNS MX               |
| Have I Been Pwned          | ✅ Plugin Better Auth (k-anonymity)                         |
| Anti-énumération email     | ✅ Proxy route fake 200 (OWASP)                             |
| Codes d'erreur             | ✅ Standardisés + traduction FR côté client                 |
| IDs nanoid                 | ✅ Better Auth + Prisma cohérents                           |
| 2FA / MFA                  | ❌ À faire                                                  |
| OAuth providers            | ❌ À faire                                                  |
| Middleware de routes       | ❌ À faire                                                  |

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

| Mesure                 | Statut                                |
| ---------------------- | ------------------------------------- |
| Headers CSP            | ✅ OK (mais `unsafe-eval`)            |
| X-Frame-Options        | ✅ DENY                               |
| X-Content-Type-Options | ✅ nosniff                            |
| Referrer-Policy        | ✅ strict-origin-when-cross-origin    |
| Permissions-Policy     | ✅ camera/micro/geo désactivés        |
| CSRF                   | ✅ Via Better Auth (sameSite cookies) |
| Rate limiting          | ✅ Natif Better Auth                  |
| Logging sécurité       | ❌ À faire                            |
