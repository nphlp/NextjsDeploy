# PLAN — Audit Sécurité & Conformité Légale

## Contexte

Audit du boilerplate NextjsDeploy suite aux retours sur l'authentification et la conformité légale.
Références : OWASP, CNIL, RGPD, ANSSI.

---

## Phase 1 — Audit & Recherche

> Comprendre les exigences avant d'implémenter.

- [ ] Lire les recommandations OWASP pour l'authentification (ASVS)
- [ ] Lire les exigences CNIL / RGPD pour un site web français
- [ ] Lire les recommandations ANSSI pour la sécurité des applications web
- [ ] Vérifier ce que Better Auth supporte nativement (plugins disponibles)
- [ ] Définir les solutions techniques pour chaque point

---

## Phase 2 — Renforcement Authentification

### 2.1 Inscription

- [ ] **Règles de mot de passe** — minuscule, majuscule, chiffre, spécial, 12+ chars
    - Validation Zod côté client ET serveur
    - Indicateur de force visuel
- [ ] **Confirmation de mot de passe** — second champ password
- [ ] **CAPTCHA** — Cloudflare Turnstile (gratuit, RGPD-friendly)
    - Sur inscription et reset password
- [ ] **Protection emails jetables** — liste noire ou API de vérification
- [ ] **Vérification email améliorée** — bloquer l'accès tant que non vérifié

### 2.2 Connexion

- [ ] **Rate limiting** — plugin Better Auth ou custom middleware
    - Limiter par IP et par email
    - Lockout temporaire après X tentatives
- [ ] **CAPTCHA** — après N tentatives échouées
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

| Fonctionnalité             | Statut                        |
| -------------------------- | ----------------------------- |
| Email/Password             | ✅ OK                         |
| Vérification email         | ✅ OK (envoi à l'inscription) |
| Reset password             | ✅ OK (email + token)         |
| Sessions multi-devices     | ✅ OK (visible sur /profile)  |
| Règles mot de passe        | ❌ 8 chars min seulement      |
| Confirmation mot de passe  | ❌ Absent                     |
| CAPTCHA                    | ❌ Absent                     |
| Rate limiting              | ❌ Absent                     |
| 2FA / MFA                  | ❌ Absent                     |
| OAuth providers            | ❌ Absent                     |
| Protection emails jetables | ❌ Absent                     |
| Middleware de routes       | ❌ Absent                     |

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
| Rate limiting          | ❌ Absent                             |
| Logging sécurité       | ❌ Absent                             |
