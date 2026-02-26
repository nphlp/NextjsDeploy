# Query Parameters (nuqs)

Query parameters are managed with [nuqs](https://nuqs.47ng.com/) using two files in `_lib/`.

## Server-Side — `query-params.ts`

Defines parsers with Zod validation, the cached parser, and the URL serializer:

```ts
import { createParser, createSearchParamsCache, createSerializer } from "nuqs/server";
import { z } from "zod";

const tabValues = ["profile", "edition", "security"] as const;

const tabParser = createParser({
    parse: (value: string) => z.enum(tabValues).parse(value),
    serialize: (value: string) => value,
});

export const queryParams = {
    tab: tabParser.withDefault("profile"),
};

export const queryParamsCached = createSearchParamsCache(queryParams);
export type QueryParamsCachedType = Awaited<ReturnType<typeof queryParamsCached.parse>>;
export const queryUrlSerializer = createSerializer(queryParams);
```

## Client-Side — `use-query-params.ts`

Client hook that wraps `useQueryState` for each parameter:

```ts
"use client";

import { useQueryState } from "nuqs";
import { queryParams } from "./query-params";

export function useQueryParams() {
    const [tab, setTab] = useQueryState("tab", queryParams.tab);
    return { tab, setTab };
}
```

## Usage in `page.tsx` (Server)

```tsx
type PageProps = {
    searchParams: Promise<QueryParamsCachedType>;
};

export default async function Page(props: PageProps) {
    const { searchParams } = props;
    const { tab } = await queryParamsCached.parse(searchParams);
    // ...
}
```

## Usage in Components (Client)

```tsx
export default function MyComponent() {
    const { tab, setTab } = useQueryParams();
    // ...
}
```

## URL Serializer

```ts
queryUrlSerializer({ tab: "security" });
```
