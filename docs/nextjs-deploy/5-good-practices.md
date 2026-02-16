[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **Good Practices**

[← Fixtures](./4-fixtures.md) | [MCP Servers →](./6-mcp-servers.md)

---

# Good Practices

## Components

1. Each file contains a single component.

2. Props structure:
    - Type is defined above the component
    - Type is used in the component signature
    - Props are destructured on the first line of the component

```tsx
type MyComponentProps = {
    title: string;
    count: number;
};

export default function MyComponent(props: MyComponentProps) {
    const { title, count } = props;

    return (
        <div>
            {title}: {count}
        </div>
    );
}
```

3. Page architecture:
    - Each `page.tsx` is a Server Component
    - The page contains other Server Components or Client Components

4. File structure per page:
    - Page-specific files are organized in `_`-prefixed folders at the same level as `page.tsx`
    - Available folders: `_components`, `_context`, `_lib`, `_utils`
    - The `_` prefix marks these files as private to the route — Next.js will not expose them as routes

```
app/
├── page.tsx
├── _components/
│   ├── my-component.tsx
│   └── other-component.tsx
├── _context/
│   ├── context.ts
│   ├── provider.tsx
│   └── use-my-context.ts
├── _lib/
│   └── utils.ts
└── _utils/
    └── helpers.ts
```

5. Context structure:
    - When Client Components share state, use a context with 3 separate files:
    - `context.ts` — contains `createContext` and types
    - `provider.tsx` — contains the provider with logic (hooks, state, callbacks)
    - `use-{context-name}.ts` — contains the custom hook to consume the context
    - This separation preserves React fast refresh

## Query Parameters (nuqs)

1. Query parameters are managed with [nuqs](https://nuqs.47ng.com/) using two files in `_lib/`:
    - `query-params.ts` — server-side parsers, cache, serializer
    - `use-query-params.ts` — client-side hook

2. `query-params.ts` — defines parsers with Zod validation, the cached parser, and the URL serializer:

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

3. `use-query-params.ts` — client hook that wraps `useQueryState` for each parameter:

```ts
"use client";

import { useQueryState } from "nuqs";
import { queryParams } from "./query-params";

export function useQueryParams() {
    const [tab, setTab] = useQueryState("tab", queryParams.tab);
    return { tab, setTab };
}
```

4. Server-side usage in `page.tsx`:

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

5. Client-side usage in components:

```tsx
export default function MyComponent() {
    const { tab, setTab } = useQueryParams();
    // ...
}
```

6. URL generation with serializer: `queryUrlSerializer({ tab: "security" })`

## TypeScript

1. Avoid `as` castings. Prefer finding the correct type or restructuring the code to satisfy TypeScript.

## JSX

1. Avoid complex conditions in JSX. Prefer assigning a constant in JS, then use it in JSX.

```tsx
// Bad
{
    session?.user.role === "ADMIN" && <Button />;
}

// Good
const isAdmin = session?.user.role === "ADMIN";

return <div>{isAdmin && <Button />}</div>;
```

---

[← Fixtures](./4-fixtures.md) | [MCP Servers →](./6-mcp-servers.md)

[README](../../README.md) > [NextJS Deploy](./1-setup-local.md) > **Good Practices**
