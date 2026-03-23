# Cookie State

Persist client state in cookies for clean SSR hydration. The state survives refresh, browser close, and is readable server-side before render — **zero layout shift**.

Zero dependency — just `useState` + `document.cookie` + a synthetic event system for cross-component reactivity.

Complements [Query State (nuqs)](./6-query-state.md): both provide SSR with state persistence across refresh, but cookies are invisible in the URL (suited for UI preferences), while query params are bookmarkable and shareable (suited for filters, pagination, search).

Reference implementation: `app/dev/state/` (Cookie State section)

---

## Architecture

### Core (shared library)

| File                         | Role                                                       |
| ---------------------------- | ---------------------------------------------------------- |
| `lib/cookie-client.ts`       | Low-level `writeCookie`, `readCookie`, `deleteCookie`      |
| `lib/cookie-state-client.ts` | `useCookieState` hook + `removeCookieState` + event system |
| `lib/cookie-state-server.ts` | `getCookieState` — server-side reader with Zod validation  |

### Per-feature (in `_lib/` of each page/feature)

| File                   | Role                                               |
| ---------------------- | -------------------------------------------------- |
| `cookie-params.ts`     | Type, Zod schema & defaults (no `"use client"`)    |
| `use-cookie-params.ts` | Custom hook: exposes individual values and setters |

---

## How it works

### SSR hydration flow (zero layout shift)

```
Server                                    Client
──────                                    ──────
1. page.tsx (Server Component)
   └─ getCookieState("name", schema)
      └─ reads cookies() (Next.js)
      └─ parses + validates with Zod
      └─ returns T | undefined

2. passes value as prop
   └─ <MyComponent initialState={value} />

                                          3. useCookieState("name", initialState)
                                             └─ useState(initialState)  ← matches SSR
                                             └─ useLayoutEffect: reads document.cookie
                                             └─ if different → setState (rare)

                                          4. Result: HTML matches → no layout shift
```

### Cross-component sync

Multiple components using the same cookie name stay in sync via a synthetic event system:

```
Component A                    Component B                    Component C
───────────                    ───────────                    ───────────
setState(newValue)
  └─ writeCookie("name", val)
  └─ notify()
       └─ ─── listener ──→   callback()                     callback()
                               └─ readCookie("name")          └─ readCookie("name")
                               └─ setStateInternal(val)       └─ setStateInternal(val)
```

All components sharing the same cookie name re-render with the new value — no Context or Provider needed.

---

## Step-by-step

### 1. Define type, schema & defaults (`cookie-params.ts`)

No `"use client"` — must be importable from server components.

```ts
import { type ZodType, z } from "zod";

export type CounterState = {
    count: number;
};

export const counterSchema = z.object({
    count: z.number(),
}) satisfies ZodType<CounterState>;

export const defaultCounterState: CounterState = {
    count: 0,
};
```

### 2. Create a custom hook (`use-cookie-params.ts`)

Wrap `useCookieState` in a dedicated hook that exposes individual values and typed setters. One file = one cookie.

```ts
"use client";

import { useCookieState } from "@lib/cookie-state-client";
import { type CounterState, defaultCounterState } from "./cookie-params";

export default function useCounterCookieParams(initialState: CounterState | undefined) {
    const [state, setState] = useCookieState("demo-counter", initialState ?? defaultCounterState);

    const count = state.count;
    const increment = () => setState((prev) => ({ count: prev.count + 1 }));
    const decrement = () => setState((prev) => ({ count: prev.count - 1 }));

    return { count, increment, decrement };
}
```

### 3. Read cookie server-side

In `page.tsx`, read the cookie once and pass the raw value as prop (`T | undefined`). Wrap in `<Suspense>` because `cookies()` is async.

```tsx
import { getCookieState } from "@lib/cookie-state-server";
import { Suspense } from "react";
import { counterSchema } from "./_lib/cookie-params";

export default function Page() {
    return (
        <Suspense>
            <SuspendedContent />
        </Suspense>
    );
}

async function SuspendedContent() {
    const initialState = await getCookieState("demo-counter", counterSchema);

    return (
        <div className="flex items-center gap-6">
            <ButtonDown initialState={initialState} />
            <Counter initialState={initialState} />
            <ButtonUp initialState={initialState} />
        </div>
    );
}
```

### 4. Consume in client components

Each component receives `initialState` and calls the same custom hook. They share the cookie as source of truth.

```tsx
"use client";

import { CounterState } from "../_lib/cookie-params";
import useCounterCookieParams from "../_lib/use-cookie-params";

type CounterProps = {
    initialState: CounterState | undefined;
};

export default function Counter(props: CounterProps) {
    const { count } = useCounterCookieParams(props.initialState);

    return <span className="text-4xl font-bold">{count}</span>;
}
```

### 5. Remove a cookie (optional)

```ts
import { removeCookieState } from "@lib/cookie-state-client";

removeCookieState("demo-counter");
```

---

## Rules

1. **Type first, schema second** — define the type with precise values, validate the schema with `satisfies ZodType<T>`
2. **Schema in `cookie-params.ts` (no `"use client"`)** — must be importable from server components
3. **One hook per cookie** — `use-cookie-params.ts` wraps `useCookieState`, exposes individual values and typed setters
4. **Cookie name must match** — same string in `getCookieState(name)` and `useCookieState(name)`
5. **Fallback with `??` in the hook** — cookie may not exist (first visit), apply defaults in the custom hook
6. **`<Suspense>` for async cookies** — `cookies()` is async in Next.js, requires Suspense boundary
7. **Cookie expires in 30 days** — auto-renewed on every write
8. **Cookie size limit ~4KB** — only store UI preferences, not bulk data
9. **Referential stability** — `readCookie` caches parsed values to avoid new references on each read
