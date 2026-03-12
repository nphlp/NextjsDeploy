# Theme

Static-compatible dark mode with zero flash — no SSR cookie read, no dynamic rendering.

## Architecture

```
public/theme-script.js          # Blocking script (runs before first paint)
public/globals.css               # CSS icon visibility rules

core/theme/
├── _context/
│   ├── context.ts               # ThemeContext + types
│   ├── provider.tsx             # Provider (cookie state, system theme, CSS sync)
│   └── use-theme.ts             # useTheme() hook
├── theme-client.ts              # setThemeClass(), getSystemTheme()
├── theme-script.tsx             # <ThemeScript /> component
├── theme-utils.ts               # Types, cookie name, schema
└── use-system-theme.ts          # useSystemTheme() (matchMedia)
```

## How it works

The system solves two problems with static layouts:

1. **CSS flash** — page loads with light background then switches to dark
2. **Icon flash** — theme icon (Sun/Moon/SunMoon) renders the default before React hydrates

### Layer 1: Blocking script (CSS flash)

`public/theme-script.js` is loaded as a synchronous `<script>` in `<head>`. It runs before the browser paints anything.

```
Browser receives HTML
  → parses <head>
  → executes theme-script.js (synchronous, blocking)
  → reads cookie "theme-preference" from document.cookie
  → adds "dark" or "light" class to <html>
  → sets data-theme-preference="dark|light|system" on <html>
  → browser paints (with correct background)
```

The script reads the cookie (JSON: `{ theme, systemTheme }`), resolves `"system"` via `matchMedia`, and applies both the CSS class and the data attribute before any rendering occurs.

### Layer 2: CSS icon visibility (icon flash)

Icons in `MenuTheme` are all rendered in the server HTML simultaneously:

```tsx
<SunMoon data-theme-icon="system" />
<Moon data-theme-icon="dark" />
<Sun data-theme-icon="light" />
```

CSS rules in `globals.css` control which icon is visible, driven by the `data-theme-preference` attribute set by the blocking script:

```css
[data-theme-icon] {
    display: none;
}
html[data-theme-preference="dark"] [data-theme-icon="dark"] {
    display: inline;
}
html[data-theme-preference="light"] [data-theme-icon="light"] {
    display: inline;
}
html[data-theme-preference="system"] [data-theme-icon="system"] {
    display: inline;
}
html:not([data-theme-preference]) [data-theme-icon="system"] {
    display: inline;
}
```

The correct icon is visible from the first paint. No JavaScript needed.

### Layer 3: React hydration (interactivity)

After React loads, the `ThemeProvider` takes over:

1. `useCookieState` reads the cookie via `useLayoutEffect` (updates state before paint)
2. `useSystemTheme` tracks `matchMedia("prefers-color-scheme: dark")` changes via `useSyncExternalStore`
3. `setThemeClass` updates the CSS class + `data-theme-preference` on theme change (with transition disabling)

## Timeline

```
1. HTML received          → <html class="min-h-dvh"> (no theme)
2. Blocking script        → <html class="min-h-dvh dark" data-theme-preference="dark">
3. First paint            → correct background + correct icon (via CSS)
4. React hydrates         → ThemeProvider mounts, useLayoutEffect reads cookie
5. setThemeClass fires    → syncs class + data attribute (no-op if already correct)
6. Interactive            → user can toggle theme
```

## Files

### `public/theme-script.js`

Blocking script that runs before first paint. Sets:

- CSS class (`dark` or `light`) on `<html>` for background/colors
- `data-theme-preference` attribute on `<html>` for icon visibility

### `public/globals.css`

CSS rules matching `data-theme-preference` to `data-theme-icon` attributes. Controls icon visibility without JavaScript.

### `core/theme/theme-script.tsx`

Server component wrapping the synchronous `<script>` tag. Placed in `<head>` of the root layout.

### `core/theme/_context/provider.tsx`

Client component providing theme state via React context. Uses:

- `useCookieState` for persistence (cookie `theme-preference`)
- `useSystemTheme` for tracking OS preference changes
- `setThemeClass` for syncing DOM on theme change

### `core/theme/theme-client.ts`

`setThemeClass(theme, systemTheme)` — updates CSS class and `data-theme-preference` on `<html>`. Temporarily disables transitions to avoid animation artifacts during theme switch.

### `core/theme/use-system-theme.ts`

`useSystemTheme()` — tracks `prefers-color-scheme` via `useSyncExternalStore`. Returns `"light"` or `"dark"`.

### `components/molecules/menu-theme.tsx`

Theme toggle menu. Renders all three icons with `data-theme-icon` attributes. CSS controls visibility. `useTheme()` provides `setTheme()` for user interaction.

## Cookie format

Name: `theme-preference`

```json
{ "theme": "light" | "dark" | "system", "systemTheme": "light" | "dark" }
```

- `theme` — user's explicit choice
- `systemTheme` — last known OS preference (used by blocking script to resolve `"system"`)

## Why not next-themes?

next-themes returns `theme = undefined` until mount, requiring a `mounted` state check and causing either a missing icon or a skeleton flash. This system provides the correct value from the first paint via CSS, with no hydration mismatch.

## Key constraints

- `suppressHydrationWarning` is required on `<html>` because the blocking script modifies `className` before React hydrates. This only suppresses warnings on `<html>` attributes, not on children.
- The `<script>` tag triggers ESLint `@next/next/no-sync-scripts` — disabled with an inline comment. Synchronous loading is intentional and required.
- `useLayoutEffect` in `useCookieState` ensures state updates before the browser paints, minimizing visual shifts during hydration.
