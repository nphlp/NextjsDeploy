# Security & Legal Reference

> What a developer needs to know about OWASP, RGPD/CNIL, and ANSSI.
> Compiled from official sources — see [Sources](#sources) at the bottom.

---

## 1. OWASP — Web Application Security

OWASP = Open Web Application Security Project. Standards de référence mondiale pour la sécurité des apps web.

### 1.1 Top 10 (items pertinents pour l'auth)

| #   | Vulnérabilité              | Risque pour nous                                               |
| --- | -------------------------- | -------------------------------------------------------------- |
| A01 | **Broken Access Control**  | Accès aux données d'autres users, escalade de privilèges, CSRF |
| A02 | **Cryptographic Failures** | Mots de passe mal hashés, tokens faibles, pas de HTTPS         |
| A03 | **Injection**              | SQL injection dans les formulaires, XSS volant les sessions    |
| A07 | **Auth Failures**          | Brute force, credential stuffing, sessions mal gérées          |

### 1.2 Mots de passe (ASVS V2.1)

| Règle                   | Détail                                                       |
| ----------------------- | ------------------------------------------------------------ |
| Longueur min            | **12 caractères** (8 avec protections supplémentaires)       |
| Longueur max            | Pas de limite — permettre 64+ chars                          |
| Complexité              | **Pas de règles de composition obligatoires** (NIST 800-63b) |
| Unicode                 | Autoriser tous les caractères                                |
| Copier-coller           | Autoriser (pour les gestionnaires de mots de passe)          |
| Mots de passe compromis | **Vérifier contre les listes breachées** (Have I Been Pwned) |
| Renouvellement forcé    | **Non** (sauf compromission)                                 |

> OWASP dit : **longueur > complexité**. Un mot de passe long est plus sûr qu'un court avec des règles.

### 1.3 Rate Limiting (ASVS V2.2)

- Max **100 tentatives/heure** par compte
- **Délais progressifs** entre tentatives
- **CAPTCHA** après N échecs
- Rate limiting par **IP + email**

### 1.4 MFA (ASVS V2.7-2.8)

- Niveau 1 : non requis
- Niveau 2 : recommandé
- Niveau 3 : **obligatoire**
- MFA bloque **99,9%** des compromissions (source: Microsoft)
- Préférer TOTP/FIDO2 à SMS

### 1.5 Sessions (ASVS V3)

| Paramètre              | Valeur                                            |
| ---------------------- | ------------------------------------------------- |
| Timeout inactivité     | 15-30 min (faible risque) / 2-5 min (haut risque) |
| Timeout absolu         | 12h max                                           |
| Invalidation au login  | Oui (anti-fixation)                               |
| Invalidation au logout | Oui (côté serveur)                                |
| Session ID dans l'URL  | **Jamais**                                        |

### 1.6 Hashing (ASVS V2.4)

Par ordre de préférence :

1. **Argon2id** — 19 MiB mémoire, 2 itérations, parallélisme=1
2. **scrypt** — coût ≥ 2^17, bloc=8
3. **bcrypt** — work factor ≥ 10 (limite 72 bytes)

Toujours avec un **sel unique** (≥ 32 bits) par utilisateur.

### 1.7 Tokens (ASVS V6)

- Entropie ≥ **128 bits**
- Expiration courte : **15-60 min** (reset password)
- Usage unique
- Générés avec CSPRNG (crypto random)

---

## 2. RGPD / CNIL — Conformité Légale

RGPD = Règlement Général sur la Protection des Données (européen).
CNIL = Commission Nationale de l'Informatique et des Libertés (France).

### 2.1 Les 7 principes RGPD (Article 5)

| Principe                         | En pratique                                                                        |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| **Licéité**                      | Avoir une base légale (consentement, contrat, obligation légale, intérêt légitime) |
| **Limitation des finalités**     | Collecter pour un objectif précis et déclaré                                       |
| **Minimisation**                 | Ne collecter que le strict nécessaire                                              |
| **Exactitude**                   | Données à jour, possibilité de rectification                                       |
| **Limitation de conservation**   | Durées définies, suppression automatique                                           |
| **Intégrité et confidentialité** | Chiffrement, accès restreint, logs                                                 |
| **Responsabilité**               | Documenter et prouver la conformité                                                |

### 2.2 Consentement (Article 7)

Le consentement doit être :

- **Libre** — pas de cases pré-cochées, refus aussi facile qu'acceptation
- **Spécifique** — un consentement par finalité
- **Éclairé** — expliquer qui, quoi, pourquoi, combien de temps
- **Univoque** — action positive (clic, case à cocher)

Retrait du consentement = aussi facile que de le donner.

### 2.3 Cookies — Règles CNIL

#### Cookies exemptés de consentement

- Session / authentification
- Panier d'achat
- Préférences (langue, thème)
- Load balancing
- Analytics **si** : anonymisés, pas de transfert hors UE, durée ≤ 13 mois, éditeur seul

#### Cookies nécessitant le consentement

- Analytics non anonymisés (Google Analytics standard)
- Publicité / ciblage
- Réseaux sociaux (like, share)
- Tracking cross-site

#### Bannière cookies — Exigences

| Exigence                                              | Obligatoire     |
| ----------------------------------------------------- | --------------- |
| Bouton "Tout refuser" même taille que "Tout accepter" | **Oui**         |
| Personnalisation par finalité                         | **Oui**         |
| Pas de cookies non essentiels avant consentement      | **Oui**         |
| Lien permanent pour modifier son choix (footer)       | **Oui**         |
| Durée du consentement                                 | **13 mois max** |
| Information claire sur les finalités                  | **Oui**         |

> Les "dark patterns" (bannières trompeuses) sont sanctionnés par la CNIL.

### 2.4 Pages légales obligatoires

#### Mentions légales (LCEN — Loi n°2004-575, Article 6)

Obligatoire pour **tout** site web.

**Personne morale** : dénomination, forme juridique, siège social, capital, SIREN/SIRET, TVA, directeur de publication.
**Personne physique** : nom, prénom, adresse.
**Tous** : hébergeur (nom, adresse, téléphone), contact (email, téléphone).

Sanction : jusqu'à **375 000 €** (personne morale).

#### Politique de confidentialité (RGPD — Articles 13-14)

Obligatoire dès qu'il y a traitement de données personnelles.

Contenu requis :

- Identité du responsable de traitement
- Finalités et base légale de chaque traitement
- Destinataires des données
- Transferts hors UE (pays, garanties)
- Durées de conservation
- Droits des utilisateurs + comment les exercer
- Droit de réclamation auprès de la CNIL
- Décisions automatisées / profilage (si applicable)

#### Politique de cookies

Obligatoire si utilisation de cookies :

- Liste de chaque cookie (nom, finalité, durée, catégorie)
- Comment accepter / refuser
- Lien vers la bannière de gestion

#### CGU / CGV

- **CGU** : non obligatoires mais recommandées
- **CGV** : obligatoires si e-commerce (B2C strict, B2B sur demande)

### 2.5 Droits des utilisateurs (Chapitre III)

| Droit         | Article | Description                        | Délai  |
| ------------- | ------- | ---------------------------------- | ------ |
| Accès         | 15      | Obtenir copie de ses données       | 1 mois |
| Rectification | 16      | Corriger des données               | 1 mois |
| Effacement    | 17      | Supprimer ses données              | 1 mois |
| Portabilité   | 20      | Export format structuré (JSON/CSV) | 1 mois |
| Limitation    | 18      | Geler le traitement                | 1 mois |
| Opposition    | 21      | S'opposer au traitement            | 1 mois |

Délai prolongeable de +2 mois si demande complexe.

### 2.6 Durées de conservation (CNIL)

| Données                  | Durée max                         |
| ------------------------ | --------------------------------- |
| Comptes actifs           | Tant que le compte est actif      |
| Comptes inactifs         | **3 ans** après dernière activité |
| Logs de connexion        | **1 an**                          |
| Adresses IP              | **1 an**                          |
| Cookies analytics        | **13 mois**                       |
| Données analytics brutes | **25 mois**                       |

Après expiration : **supprimer ou anonymiser**.

### 2.7 Violation de données (Article 33)

1. **Notifier la CNIL sous 72h** (téléservice CNIL)
2. **Informer les utilisateurs** si risque élevé
3. Documenter : nature, nombre de personnes, données impactées, mesures prises

Non-notification : jusqu'à **10 M€ ou 2% du CA mondial**.

### 2.8 Sanctions

| Niveau                                                              | Amende max         |
| ------------------------------------------------------------------- | ------------------ |
| Violations techniques (pas de registre, sous-traitance)             | **10 M€ ou 2% CA** |
| Violations des principes (pas de base légale, droits non respectés) | **20 M€ ou 4% CA** |

Exemples récents : Free 42 M€, France Travail 5 M€.

---

## 3. ANSSI — Sécurité des Systèmes

ANSSI = Agence nationale de la sécurité des systèmes d'information.

### 3.1 Guides de référence

- **Guide d'hygiène informatique** — 42 mesures pratiques
- **Sécurisation des sites web** — 10 bonnes pratiques
- **Authentification et mots de passe** (ANSSI-PG-078)
- **Sécurité TLS** — cipher suites, protocoles
- **Journalisation** (ANSSI-PA-012)
- **Docker** (ANSSI-FT-082) — 16 recommandations

### 3.2 Mots de passe (ANSSI vs OWASP)

ANSSI raisonne en **entropie** (≥ 80 bits) :

| Approche        | Longueur min  | Jeu de caractères                             |
| --------------- | ------------- | --------------------------------------------- |
| Classique       | **12 chars**  | Majuscules + minuscules + chiffres + spéciaux |
| Étendu          | **14 chars**  | Majuscules + minuscules + chiffres            |
| Phrase de passe | **7 mots**    | Mots du dictionnaire                          |
| Accès critiques | **16+ chars** | Tous                                          |

Points communs OWASP/ANSSI :

- **Longueur > complexité**
- **Pas de renouvellement périodique** (sauf compromission)
- Hachage robuste (Argon2id, bcrypt) + sel unique
- MFA fortement recommandé

### 3.3 TLS

| Règle           | Valeur                                             |
| --------------- | -------------------------------------------------- |
| Version min     | **TLS 1.2** (TLS 1.3 recommandé)                   |
| Interdit        | SSL v2, SSL v3, TLS 1.0, TLS 1.1                   |
| PFS             | **Obligatoire** (ECDHE)                            |
| Cipher suite    | AES-256-GCM (TLS 1.3 : `TLS_AES_256_GCM_SHA384`)   |
| Compression TLS | **Désactivée** (attaque CRIME)                     |
| HSTS            | **Activé** (`max-age=31536000; includeSubDomains`) |

### 3.4 Headers de sécurité

| Header                      | Valeur recommandée                             |
| --------------------------- | ---------------------------------------------- |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains`          |
| `X-Frame-Options`           | `DENY`                                         |
| `X-Content-Type-Options`    | `nosniff`                                      |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`              |
| `Permissions-Policy`        | `camera=(), microphone=(), geolocation=()`     |
| `Content-Security-Policy`   | Le plus strict possible (éviter `unsafe-eval`) |

### 3.5 Journalisation (ANSSI-PA-012)

#### Quoi logger

- Authentification : succès, échecs, MFA, changements de droits
- Accès : consultation/modification de données sensibles
- Administration : changements de config, déploiements
- Sécurité : injections détectées, rate limiting déclenché

#### Format

Chaque log doit contenir : timestamp, user ID, action, ressource, résultat, IP source, User-Agent.

#### Conservation

- CNIL : **6 mois à 1 an**
- OIV/OSE : **6 mois minimum** obligatoire
- Rotation automatique + suppression après expiration

### 3.6 Docker (ANSSI-FT-082)

Les points clés des 16 recommandations :

- **Images minimales** (Alpine, Distroless)
- **User non-root** dans les conteneurs
- **Pas de secrets dans les images**
- **Capabilities réduites** (`--cap-drop=ALL`)
- **Volumes read-only** quand possible
- **Limites ressources** (CPU, RAM)
- **Scanner les images** (Trivy)
- **Réseau cloisonné**

### 3.7 Contexte français

- **SecNumCloud** : obligatoire pour données sensibles secteur public (350+ exigences, hébergement France, capitaux EU ≥76%)
- **NIS2** (2024) : exigences cybersécurité renforcées pour secteurs critiques
- **HDS** : certification obligatoire si données de santé
- Hébergeurs qualifiés : OVHcloud, Scaleway, Outscale...

---

## Synthèse — Impact sur le projet

### Ce qu'on a déjà

| Élément                               | Conforme ?                          |
| ------------------------------------- | ----------------------------------- |
| Headers sécurité (CSP, X-Frame, etc.) | Partiel (`unsafe-eval` à retirer)   |
| HTTPS                                 | Via Traefik/Dokploy                 |
| Hashing mots de passe                 | Via Better Auth (bcrypt par défaut) |
| Sessions sécurisées                   | Oui (httpOnly, secure, sameSite)    |
| Email verification                    | Oui                                 |
| Docker non-root                       | À vérifier                          |

### Ce qu'il faut ajouter

**Auth (OWASP + ANSSI)** :

- Password policy : 12+ chars, vérif breached passwords
- Rate limiting : 100 tentatives/h max
- CAPTCHA : après N échecs
- MFA : TOTP (authenticator app)
- OAuth : Google, GitHub

**Légal (RGPD + CNIL)** :

- Cookie banner conforme (refus 1 clic, pas de dark patterns)
- Mentions légales
- Politique de confidentialité
- Politique de cookies
- Durées de conservation définies
- Mécanisme d'exercice des droits (accès, suppression, export)

**Infra (ANSSI)** :

- HSTS header (manquant)
- CSP plus strict
- Logging sécurité (auth events)
- Rotation des logs

---

## Sources

### OWASP

- [Top 10:2021](https://owasp.org/Top10/)
- [ASVS v4.0 — Authentication](https://github.com/OWASP/ASVS/blob/master/4.0/en/0x11-V2-Authentication.md)
- [Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Have I Been Pwned API](https://haveibeenpwned.com/Passwords)

### CNIL / RGPD

- [Guide RGPD du développeur](https://www.cnil.fr/fr/guide-rgpd-du-developpeur)
- [Règles cookies](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies)
- [Analytics exemptés](https://www.cnil.fr/fr/cookies-solutions-pour-les-outils-de-mesure-daudience)
- [Mentions légales — Service Public](https://entreprendre.service-public.fr/vosdroits/F31228)
- [Information des personnes (Articles 13-14)](https://www.cnil.fr/fr/conformite-rgpd-information-des-personnes-et-transparence)
- [Droits des personnes](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre3)
- [Durées de conservation](https://www.cnil.fr/fr/passer-laction/les-durees-de-conservation-des-donnees)
- [Notification violation](https://www.cnil.fr/fr/services-en-ligne/notifier-une-violation-de-donnees-personnelles)

### ANSSI

- [Guide d'hygiène informatique](https://messervices.cyber.gouv.fr/documents-guides/guide_hygiene_informatique_anssi.pdf)
- [Authentification et mots de passe (PG-078)](https://messervices.cyber.gouv.fr/guides/recommandations-relatives-lauthentification-multifacteur-et-aux-mots-de-passe)
- [Sécurité TLS](https://cyber.gouv.fr/publications/recommandations-de-securite-relatives-tls)
- [Journalisation (PA-012)](https://cyber.gouv.fr/publications/recommandations-de-securite-pour-larchitecture-dun-systeme-de-journalisation)
- [Docker (FT-082)](https://cyber.gouv.fr/publications/recommandations-de-securite-relatives-au-deploiement-de-conteneurs-docker)
- [SecNumCloud](https://cyber.gouv.fr/actualites/lanssi-actualise-le-referentiel-secnumcloud)

### Outils de test

- [Mozilla Observatory](https://observatory.mozilla.org/) — headers de sécurité
- [SSL Labs](https://www.ssllabs.com/ssltest/) — configuration TLS
- [EntroCalc ANSSI](https://acceis.github.io/EntroCalc/) — entropie des mots de passe
- [Trivy](https://github.com/aquasecurity/trivy) — scan vulnérabilités Docker
