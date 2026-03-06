# Cookie State

### CETTE DOCS N'EST PAS à JOUR

### AJOUTER UN LAYOUT à la RACINE pour auto-hydrater les hooks ? En utilisant un prefix ?

Persist client state in cookies for clean SSR hydration. The state survives refresh, browser close, and is readable server-side before render. Zero dependency — just `useState` + `document.cookie`.

A single cookie stores a typed object with multiple states. Same pattern as query params: `cookie-params.ts` (server) + `use-cookie-params.ts` (client).

## Architecture

| File                         | Role                                                      |
| ---------------------------- | --------------------------------------------------------- |
| `lib/cookie-state-client.ts` | `useCookieState` hook + `removeCookieState` util          |
| `lib/cookie-state-server.ts` | Server-side cookie reader with Zod validation             |
| `_lib/cookie-params.ts`      | Types, Zod schema & defaults (importable server + client) |
| `_lib/use-cookie-params.ts`  | Client hook exposant values + setters individuels         |

## 1. Define Type, Schema & Defaults (`cookie-params.ts`)

No `"use client"` — importable from server components. Define the type with precise values, validate the schema with `satisfies ZodType<T>`.

```ts
import { type ZodType, z } from "zod";

export type PauseMs = 0 | 300 | 500 | 800 | 1200;

export type CubeSettings = {
    playbackSpeed: PlaybackSpeed;
    easingType: EasingType;
    splitDoubles: boolean;
    pauseMs: PauseMs;
};

export const cubeSettingsSchema = z.object({
    playbackSpeed: z.enum(["verySlow", "slow", "normal", "fast", "veryFast"]),
    easingType: z.enum(["linear", "easeOut", "easeInOut", "bounce"]),
    splitDoubles: z.boolean(),
    pauseMs: z.union([z.literal(0), z.literal(300), z.literal(500), z.literal(800), z.literal(1200)]),
}) satisfies ZodType<CubeSettings>;

export const defaultCubeSettings: CubeSettings = {
    playbackSpeed: "normal",
    easingType: "easeOut",
    splitDoubles: true,
    pauseMs: 500,
};
```

## 2. Create a Custom Hook (`use-cookie-params.ts`)

Wrap `useCookieState` in a dedicated hook that exposes individual values and typed setters. One file = one cookie.

```ts
"use client";

import { useCookieState } from "@lib/cookie-state-client";
import { type CubeSettings, type PauseMs, defaultCubeSettings } from "./cookie-params";

export function useCookieParams(initialSettings: CubeSettings | undefined) {
    const [settings, setSettings] = useCookieState("cube-settings", initialSettings ?? defaultCubeSettings);

    const setPlaybackSpeed = (speed: PlaybackSpeed) => setSettings((prev) => ({ ...prev, playbackSpeed: speed }));
    const setEasingType = (easing: EasingType) => setSettings((prev) => ({ ...prev, easingType: easing }));
    const setSplitDoubles = (split: boolean) => setSettings((prev) => ({ ...prev, splitDoubles: split }));
    const setPauseMs = (ms: PauseMs) => setSettings((prev) => ({ ...prev, pauseMs: ms }));

    return {
        playbackSpeed: settings.playbackSpeed,
        easingType: settings.easingType,
        splitDoubles: settings.splitDoubles,
        pauseMs: settings.pauseMs,
        setPlaybackSpeed,
        setEasingType,
        setSplitDoubles,
        setPauseMs,
    };
}
```

## 3. Read Cookie Server-Side

In `page.tsx`, read the cookie once and pass the raw value as prop (`T | undefined`). Wrap in `<Suspense>` because `cookies()` is async.

```tsx
import { getCookieState } from "@lib/cookie-state-server";
import { Suspense } from "react";
import { cubeSettingsSchema } from "./_lib/cookie-params";

export default function Page() {
    return (
        <Suspense>
            <SuspendedPage />
        </Suspense>
    );
}

async function SuspendedPage() {
    const settings = await getCookieState("cube-settings", cubeSettingsSchema);

    return <CubeEditor initialSettings={settings} />;
}
```

## 4. Consume in Client Component

Call the custom hook with the server-read value. Use the returned values and setters directly.

```tsx
"use client";

import { useCookieParams } from "./_lib/use-cookie-params";

type CubeEditorProps = {
    initialSettings: CubeSettings | undefined;
};

export default function CubeEditor(props: CubeEditorProps) {
    const { initialSettings } = props;
    const { playbackSpeed, setPlaybackSpeed, pauseMs, setPauseMs } = useCookieParams(initialSettings);

    return (
        <section>
            <SpeedSelector value={playbackSpeed} onChange={setPlaybackSpeed} />
            <PauseSelector value={pauseMs} onChange={setPauseMs} />
        </section>
    );
}
```

## 5. Remove a Cookie (optional)

```ts
import { removeCookieState } from "@lib/cookie-state-client";

removeCookieState("cube-settings");
```

## Rules

1. **Type first, schema second** — define the type with precise values, validate the schema with `satisfies ZodType<T>`
2. **Schema in `cookie-params.ts` (no `"use client"`)** — must be importable from server components
3. **One hook per cookie** — `use-cookie-params.ts` wraps `useCookieState`, exposes individual values and typed setters
4. **Cookie name must match** — same string in `getCookieState(name)` and `useCookieState(name)`
5. **Fallback with `??` dans le hook** — cookie may not exist (first visit), appliquer le default dans le hook custom
6. **`<Suspense>` for async cookies** — `cookies()` is async in Next.js, requires Suspense boundary
7. **Cookie expires in 30 days** — auto-renewed on every state change
8. **Cookie size limit ~4KB** — ne pas stocker de donnees volumineuses, uniquement des preferences UI
