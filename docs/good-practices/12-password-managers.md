[README](../../README.md) > [Good Practices](./1-nextjs.md) > **Password Managers**

[← Theme](./11-theme.md)

---

# Password Managers — Autocomplete Compatibility

Guide for proper `autocomplete` attributes to ensure compatibility with all major password managers.

## Recommended Autocomplete Values

### Login Form

```html
<input type="email" autocomplete="username webauthn" name="email" />
<input type="password" autocomplete="current-password webauthn" name="password" />
```

- Use `username` (not `email`) for the identifier field, even if the field expects an email. Password managers use `username` to associate the field with saved credentials. `email` is treated as a generic address field.
- `webauthn` is a complementary token for passkey conditional UI (not a standalone value).

### Register Form

```html
<input type="text" autocomplete="given-name" name="firstName" />
<input type="text" autocomplete="family-name" name="lastName" />
<input type="email" autocomplete="email" name="email" />
<input type="password" autocomplete="new-password" name="password" />
<input type="password" autocomplete="new-password" name="confirmPassword" />
```

- `new-password` triggers the built-in password generator in most password managers.
- `email` is appropriate for registration (new account, not an existing credential).

### Change Password Form

```html
<input type="password" autocomplete="current-password" name="currentPassword" />
<input type="password" autocomplete="new-password" name="newPassword" />
<input type="password" autocomplete="new-password" name="confirmPassword" />
```

### TOTP / 2FA Code

```html
<input type="text" inputmode="numeric" autocomplete="one-time-code" name="code" />
```

### Identity Fields

```html
<input type="text" autocomplete="given-name" name="firstName" />
<input type="text" autocomplete="family-name" name="lastName" />
```

## Compatibility Matrix

### Credential Autofill

| Manager                  | `username` | `current-password` | `new-password`  | `email` vs `username`          |
| ------------------------ | ---------- | ------------------ | --------------- | ------------------------------ |
| Chrome                   | Yes        | Yes                | Yes + generator | `username` preferred for login |
| Safari / iCloud Keychain | Yes        | Yes                | Yes + generator | `username` preferred for login |
| 1Password                | Yes        | Yes                | Yes + generator | Strict distinction             |
| Bitwarden                | Yes        | Yes                | Yes + generator | Less strict, heuristics        |
| Dashlane                 | Yes        | Yes                | Yes + generator | Heuristics-first               |
| Proton Pass              | Yes        | Yes                | Yes + generator | Heuristics-first               |
| NordPass                 | Yes        | Yes                | Yes + generator | Basic                          |
| LastPass                 | Yes        | Yes                | Yes + generator | Heuristics-first               |
| Enpass                   | Yes        | Yes                | Yes + generator | Basic                          |
| Windows Hello / Edge     | Yes        | Yes                | Yes + generator | Same as Chrome (Chromium)      |

### TOTP Autofill (`one-time-code`)

| Manager        | TOTP Storage | Autofill `one-time-code` | Notes                              |
| -------------- | ------------ | ------------------------ | ---------------------------------- |
| Apple Keychain | Yes          | Excellent                | SMS + stored TOTP                  |
| 1Password      | Yes          | Excellent                | Seamless autofill                  |
| Dashlane       | Yes          | Good                     | Built-in TOTP                      |
| Proton Pass    | Yes          | Good                     | TOTP on free plan                  |
| Bitwarden      | Premium      | Fair                     | Improved recently                  |
| Enpass         | Yes          | Fair                     | Built-in TOTP                      |
| Chrome         | SMS only     | SMS only                 | No TOTP vault                      |
| NordPass       | Yes          | Partial                  | Less reliable                      |
| LastPass       | Separate app | Limited                  | LastPass Authenticator is separate |
| Windows Hello  | No           | No                       | No TOTP support                    |

### Passkey Support (`webauthn`)

| Manager                  | Passkey Storage | Conditional UI | Notes                               |
| ------------------------ | --------------- | -------------- | ----------------------------------- |
| Chrome                   | Yes             | Yes            | Leader in passkeys                  |
| Safari / iCloud Keychain | Yes             | Yes            | Synced via iCloud                   |
| Windows Hello            | Device-bound    | Yes            | Not synced (platform authenticator) |
| 1Password                | Yes             | Yes            | Cross-platform sync                 |
| Dashlane                 | Yes             | Yes            | Early adopter                       |
| Bitwarden                | Yes             | Yes            | Since 2024                          |
| NordPass                 | Yes             | Yes            | Since 2024                          |
| Proton Pass              | Partial         | Partial        | Still maturing                      |
| LastPass                 | Yes             | Yes            | Late adopter (2024)                 |
| Enpass                   | Limited         | No             | Behind on passkeys                  |

### Identity Fields

| Manager                  | `given-name` | `family-name` | Notes                           |
| ------------------------ | ------------ | ------------- | ------------------------------- |
| Chrome                   | Yes          | Yes           | Via Chrome Autofill (addresses) |
| Safari / iCloud Keychain | Yes          | Yes           | Via Contacts                    |
| 1Password                | Yes          | Yes           | Identity section                |
| Bitwarden                | Yes          | Yes           | Identity section                |
| Dashlane                 | Yes          | Yes           | Personal info                   |
| Proton Pass              | Limited      | Limited       | Less developed                  |
| NordPass                 | Yes          | Yes           | Personal info                   |
| LastPass                 | Yes          | Yes           | Form Fills section              |
| Enpass                   | Yes          | Yes           | Identity templates              |
| Windows Hello / Edge     | Yes          | Yes           | Via Edge Autofill               |

## Known Quirks

| Manager   | Quirk                                                                                      |
| --------- | ------------------------------------------------------------------------------------------ |
| All       | `autocomplete="off"` is **ignored** for credential fields (industry-wide decision)         |
| Safari    | Strictest on `<form>` structure. May not save credentials if `action` attribute is missing |
| 1Password | Ignores `autocomplete="off"`. Can conflict with other extensions                           |
| Dashlane  | Injects iframes and icons in the DOM, can break tight layouts                              |
| LastPass  | Heavy extension, can slow down pages with many form fields                                 |
| NordPass  | May miss dynamically injected fields in SPAs                                               |
| Enpass    | Extension communicates with desktop app, can cause delays                                  |
| Bitwarden | "Auto-fill on page load" is disabled by default for phishing protection                    |

## Form Structure Best Practices

1. **Always wrap fields in a `<form>` element** — Safari requires it for credential saving
2. **Use semantic `name` attributes** — `name="email"`, `name="password"` reinforce heuristic detection
3. **Always use `type="password"`** — most universal signal, even stronger than `autocomplete`
4. **SPA forms must have a `<form>` element** — even with `onSubmit` + `preventDefault`
5. **Keep `name` and `id` stable** — no randomly generated values

---

[← Theme](./11-theme.md)

[README](../../README.md) > [Good Practices](./1-nextjs.md) > **Password Managers**
