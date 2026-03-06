# Query Parameters (nuqs)

Query parameters are managed with [nuqs](https://nuqs.47ng.com/).

The URL is the shared state — multiple client components read/write the same params without needing a custom context provider.

`NuqsAdapter` (in root layout) connects nuqs to the Next.js router. It lets `useQueryState` read and update the URL without full page reloads. No hydration logic — the URL is naturally available on both server and client.

## File Structure

Each page that uses query params has two files in `_lib/`:

```
app/fruits/
├── page.tsx
├── _lib/
│   ├── query-params.ts       # Parsers, cache, types, serializer (server)
│   └── use-query-params.ts   # useQueryState hook (client)
└── _components/
    ├── search-filter.tsx      # Uses useQueryParams()
    └── select-order.tsx       # Uses useQueryParams()
```

## 1. Server — `_lib/query-params.ts`

Defines parsers, cached parser, types, and optionally a URL serializer.

```ts
import { createParser, createSearchParamsCache, parseAsInteger, parseAsString } from "nuqs/server";
import { z } from "zod";

const orderValues = ["asc", "desc"] as const;
export type OrderValue = (typeof orderValues)[number];

const orderParser = createParser({
    parse: (value: string) => z.enum(orderValues).parse(value),
    serialize: (value: OrderValue) => value,
});

export const queryParams = {
    search: parseAsString.withDefault(""),
    order: orderParser.withDefault("asc"),
    page: parseAsInteger.withDefault(1),
};

export const queryParamsCached = createSearchParamsCache(queryParams);
export type QueryParamsCachedType = Awaited<ReturnType<typeof queryParamsCached.parse>>;
```

## 2. Client — `_lib/use-query-params.ts`

Wraps `useQueryState` for each parameter. Reuses the same parsers from `query-params.ts`.

```ts
"use client";

import { useQueryState } from "nuqs";
import { queryParams } from "./query-params";

export function useQueryParams() {
    const [order, setOrder] = useQueryState("order", queryParams.order);
    const [page, setPage] = useQueryState("page", queryParams.page);
    const [search, setSearch] = useQueryState("search", queryParams.search);

    return { order, setOrder, page, setPage, search, setSearch };
}
```

## 3. Server Usage — `page.tsx`

Parse `searchParams` to hydrate the nuqs cache, then pass values to server components.

```tsx
type PageProps = {
    searchParams: Promise<QueryParamsCachedType>;
};

export default async function Page(props: PageProps) {
    const { searchParams } = props;
    const { search, order, page } = await queryParamsCached.parse(searchParams);

    return (
        <Main>
            <SearchFilter />
            <SelectOrder />
            <Suspense fallback={<FruitsGridSkeleton />}>
                <FruitsGridLoader order={order} page={page} search={search} />
            </Suspense>
        </Main>
    );
}
```

## 4. Client Usage — components

Any client component calls `useQueryParams()` to read/write. Multiple components share the same URL state without a provider.

```tsx
"use client";

import { useQueryParams } from "../_lib/use-query-params";

export default function SearchFilter() {
    const { search, setSearch } = useQueryParams();

    return <Input value={search} onChange={(e) => setSearch(e.target.value || null)} placeholder="Search..." />;
}
```

## URL Serializer

For server-side redirects. Add `createSerializer` to `query-params.ts`:

```ts
import { createSerializer } from "nuqs/server";

export const queryUrlSerializer = createSerializer(queryParams);
```

Usage — build URLs with typed params:

```ts
// Server-side redirect with params
redirect(queryUrlSerializer("/login", { redirect: "/baskets" }));

// Client-side navigation
router.push(queryUrlSerializer("/verify-2fa", { redirect }));
```

### Custom Parser — Security Example

The auth `redirect` parser rejects open redirects:

```ts
const redirectParser = createParser({
    parse: (value: string) => (value.startsWith("/") && !value.startsWith("//") ? value : ""),
    serialize: (value: string) => value,
});
```

## Rules

1. **JSDoc each section in `query-params.ts`** — constants, parsers, queryParams, cache, type, serializer. This file is dense and benefits from clear separation
2. **Custom parsers for enums** — use `createParser` + Zod validation for constrained values
3. **Built-in parsers for primitives** — `parseAsString`, `parseAsInteger` for simple types
4. **`setSearch(null)` to clear** — passing `null` removes the param from the URL
5. **Serializer is optional** — only needed when building URLs server-side (redirects, links)
6. **Serializer is cross-page** — any page can import another page's serializer to build links to it
