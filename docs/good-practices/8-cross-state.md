# Cross-Component State

Share reactive state between components that have no common parent, Context, or Provider — using `useSyncExternalStore` with a module-level store.

Unlike [Cookie State](./7-cookie-state.md) or [Query State](./6-query-state.md), cross-component state is **not persisted** — it lives in memory for the current session only. It's ideal for ephemeral UI state: sidebar open/close, modal visibility, runtime flags.

Reference implementation: `core/header/use-dev-sidebar.ts`

---

## Pattern

A single file exports a hook. The state lives at module level (outside React). All components importing the hook share the same state and react to changes.

```ts
"use client";

import { useSyncExternalStore } from "react";

// ─── Module-level store ─────────────────────────────────────

let open = false;

const listeners = new Set<() => void>();

function notify() {
    listeners.forEach((l) => l());
}

function subscribe(callback: () => void) {
    listeners.add(callback);
    return () => listeners.delete(callback);
}

function getSnapshot() {
    return open;
}

function getServerSnapshot() {
    return false; // SSR-safe default
}

// ─── Setters ────────────────────────────────────────────────

function setOpen(value: boolean) {
    open = value;
    notify();
}

function toggle() {
    open = !open;
    notify();
}

// ─── Hook ───────────────────────────────────────────────────

export default function useDevSidebar() {
    const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    return { open: state, setOpen, toggle };
}
```

---

## How it works

### `useSyncExternalStore`

React hook that subscribes to an external (non-React) data source:

| Parameter           | Purpose                                                   |
| ------------------- | --------------------------------------------------------- |
| `subscribe`         | Register a callback that React calls when store changes   |
| `getSnapshot`       | Return the current value — React re-renders if it changed |
| `getServerSnapshot` | Return a safe default for SSR (no `window`, no DOM)       |

### Reactivity flow

```
Component A (Header)              Component B (Sidebar)
────────────────────              ─────────────────────
toggle()
  └─ open = !open
  └─ notify()
       └─ listener A() ──→ React compares getSnapshot() → re-render
       └─ listener B() ──→ React compares getSnapshot() → re-render
```

Both components see the new value simultaneously. No prop drilling, no Context, no Provider in the tree.

### SSR safety

`getServerSnapshot` returns a static default (`false`). During SSR, `useSyncExternalStore` uses this value — no access to browser APIs. On the client, `getSnapshot` takes over and reads the actual module-level state.

---

## Real-world examples

### DevSidebar — trigger in Header, drawer in Layout

The trigger button lives in the Header (rendered on every page). The sidebar lives in the DevLayout (only `/dev/*` pages). They share state via `useDevSidebar()`:

```tsx
// core/header/dev-sidebar-trigger.tsx — in Header
export default function DevSidebarTrigger() {
    const { toggle } = useDevSidebar();
    return <Button onClick={toggle}>Toggle</Button>;
}

// app/dev/_components/sidebar.tsx — in DevLayout
export default function Sidebar() {
    const { open, setOpen } = useDevSidebar();
    return (
        <Drawer open={open} onOpenChange={setOpen}>
            ...
        </Drawer>
    );
}
```

### useBreakpoint — reactive viewport detection

```ts
// utils/use-breakpoint.ts
useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
// subscribe: window.resize listener
// getSnapshot: compute breakpoint from window.innerWidth
// getServerSnapshot: "mobile"
```

### useSystemTheme — OS theme preference

```ts
// core/theme/use-system-theme.ts
// subscribe: matchMedia("(prefers-color-scheme: dark)").addEventListener
// getSnapshot: return "light" | "dark"
// getServerSnapshot: undefined
```

---

## When to use what

| Need                                    | Solution                                 |
| --------------------------------------- | ---------------------------------------- |
| Persisted, visible in URL, shareable    | [Query State (nuqs)](./6-query-state.md) |
| Persisted, invisible, survives refresh  | [Cookie State](./7-cookie-state.md)      |
| Ephemeral, reactive, no Provider needed | **Cross-Component State** (this)         |
| Scoped to a subtree with Provider       | [Context](./4-context.md)                |

---

## Rules

1. **Module-level state** — declare the variable outside any function/component, at the top of the file
2. **`getServerSnapshot` must be static** — no browser APIs, no side effects. Return a safe default
3. **`notify()` after every mutation** — without it, React won't know the store changed
4. **One hook per concern** — `useDevSidebar`, `useBreakpoint`, `useSystemTheme` are separate files
5. **No Provider needed** — any component importing the hook participates in the shared state
6. **Not persisted** — refreshing the page resets to the initial value. If persistence is needed, use Cookie State or Query State instead
