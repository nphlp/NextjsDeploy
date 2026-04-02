# PR 3 — `docs/lifecycle-callbacks`

## 🇫🇷 Français

**Titre :** `docs(email): document beforeEmailVerification and onExistingUserSignUp callbacks`

### Résumé

Deux callbacks existants dans `emailVerification` et `emailAndPassword` n'étaient pas documentés :

- **`beforeEmailVerification`** — se déclenche juste avant qu'un email soit marqué comme vérifié. Utile pour de la validation ou de la préparation de données.
- **`onExistingUserSignUp`** — se déclenche quand quelqu'un tente de s'inscrire avec un email déjà existant. Utile pour notifier l'utilisateur existant. Uniquement appelé quand `requireEmailVerification: true` ou `autoSignIn: false`.

Les deux callbacks existaient dans le code et les types (`init-options.ts`) mais n'apparaissaient pas dans la documentation conceptuelle.

### Documentation ajoutée

- **`email.mdx`** : section "Callback before email verification" avec exemple, section "Callback on duplicate sign-up attempt" avec exemple et Callout sur les conditions d'activation

### Fichiers modifiés (2 fichiers, +44)

- `docs/content/docs/concepts/email.mdx` — 2 nouvelles sections
- `.gitignore` — ajout `docs/.source/` et `landing/.source/` (fichiers générés après le merge `landing` → `docs`)

---

## 🇬🇧 English

**Title:** `docs(email): document beforeEmailVerification and onExistingUserSignUp callbacks`

### Summary

Two existing callbacks in `emailVerification` and `emailAndPassword` were undocumented:

- **`beforeEmailVerification`** — triggered just before a user's email is marked as verified. Useful for validation or data preparation.
- **`onExistingUserSignUp`** — triggered when someone tries to sign up with an email that already exists. Useful for notifying the existing user. Only called when `requireEmailVerification: true` or `autoSignIn: false`.

Both callbacks existed in the code and types (`init-options.ts`) but were missing from the conceptual documentation.

### Added documentation

- **`email.mdx`**: new "Callback before email verification" section with example, new "Callback on duplicate sign-up attempt" section with example and Callout on activation conditions

### Changed files (2 files, +44)

- `docs/content/docs/concepts/email.mdx` — 2 new sections
- `.gitignore` — add `docs/.source/` and `landing/.source/` (generated files after `landing` → `docs` merge)
