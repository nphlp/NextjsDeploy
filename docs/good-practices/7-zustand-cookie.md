# Zustand Cookie Store

Persist Zustand state in cookies for clean SSR hydration. The state survives refresh, browser close, and is readable server-side before render.

## Architecture

| File                           | Role                                                    |
| ------------------------------ | ------------------------------------------------------- |
| `lib/zustand-cookie-client.ts` | Cookie storage adapter for Zustand `persist` middleware |
| `lib/zustand-cookie-server.ts` | Server-side cookie reader with Zod validation           |

## Flow

```
Server (page.tsx)                    Client (component.tsx)
─────────────────                    ──────────────────────
getZustandCookie(name, schema)  →    initialValue prop
         ↓                                    ↓
   Render with SSR value             useStore(initialValue)
                                              ↓
                                     persist middleware syncs
                                     state ↔ cookie
```

## 1. Define Store

Factory pattern when multiple instances are needed. `partialize` persists only state (not actions).

```ts
import { zustandCookieStorage } from "@lib/zustand-cookie-client";
import z from "zod";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Schema for server-side validation
export const collapsibleSchema = z.object({ isOpen: z.boolean() });

type CollapsibleStore = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
};

function createCollapsibleStore(name: string, defaultOpen: boolean) {
    return create<CollapsibleStore>()(
        persist(
            (set) => ({
                isOpen: defaultOpen,
                setIsOpen: (isOpen) => set({ isOpen }),
            }),
            {
                name,
                storage: createJSONStorage(() => zustandCookieStorage),
                partialize: (state) => ({ isOpen: state.isOpen }),
            },
        ),
    );
}

export const useControlsStore = (initial: boolean) => createCollapsibleStore("cube-controls", initial)();
export const useScrambleStore = (initial: boolean) => createCollapsibleStore("cube-scramble", initial)();
```

## 2. Read Cookie Server-Side

In `page.tsx`, read cookies and pass initial values as props. Wrap in `<Suspense>` because `cookies()` is async.

```tsx
import { getZustandCookie } from "@lib/zustand-cookie-server";
import { Suspense } from "react";
import { collapsibleSchema } from "./_lib/use-collapsible-store";

export default async function Page(props: PageProps) {
    return (
        <Suspense>
            <SuspendedPage {...props} />
        </Suspense>
    );
}

const SuspendedPage = async (props: PageProps) => {
    const cubeScrambleCookie = await getZustandCookie("cube-scramble", collapsibleSchema);
    const cubeControlsCookie = await getZustandCookie("cube-controls", collapsibleSchema);

    return (
        <section>
            <ScrambleInput initialOpen={cubeScrambleCookie?.isOpen ?? false} />
            <Controls initialOpen={cubeControlsCookie?.isOpen ?? false} />
        </section>
    );
};
```

## 3. Hydrate in Client Component

The component receives the server-read value and uses the store. On first render, SSR matches the cookie value — no hydration mismatch.

```tsx
"use client";

import { useScrambleStore } from "../_lib/use-collapsible-store";

type ScrambleInputProps = {
    initialOpen: boolean;
};

export default function ScrambleInput(props: ScrambleInputProps) {
    const { initialOpen } = props;
    const { isOpen, setIsOpen } = useScrambleStore(initialOpen);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            {/* ... */}
        </Collapsible>
    );
}
```

## Rules

1. **Zod schema required** — `getZustandCookie` validates the cookie shape, returns `undefined` on invalid/missing
2. **`partialize` required** — persist only state, never actions
3. **Cookie name = store name** — must match between `persist({ name })` and `getZustandCookie(name)`
4. **Fallback with `??`** — cookie may not exist (first visit), always provide a default
5. **`<Suspense>` for async cookies** — `cookies()` is async in Next.js, requires Suspense boundary
