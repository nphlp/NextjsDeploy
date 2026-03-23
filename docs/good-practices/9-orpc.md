# oRPC

Type-safe API layer using [oRPC](https://orpc.unnoq.com/) with Zod validation, Next.js Cache Components, and auto-generated OpenAPI documentation.

**Key design:** oRPC serves two paths from the same router definition:

- **Server-side** — direct function call, no HTTP overhead, cached with `"use cache"`
- **Client-side** — HTTP via `RPCLink` + `useFetch` hook (inspired by TanStack Query)

Reference implementations: `api/fruit/`, `app/fruits/`, `app/fruit/[id]/`

---

## Architecture

```
lib/
├── orpc.ts              # Smart client: server → direct call, client → HTTP
├── orpc-server.ts       # Server-side router client (globalThis.$client)
├── orpc-handler.ts      # HTTP handler + OpenAPI/Scalar plugin
├── orpc-hook.ts         # useFetch hook (client-side data fetching)

api/
├── router.ts            # Central router aggregating all domains
├── permission.ts        # Auth middleware (requiresSession)
├── cache.ts             # Cache tag generation (typed by Prisma model)
└── [domain]/
    ├── [domain]-schema.ts    # Zod input/output schemas
    ├── [domain]-cached.ts    # Cached Prisma queries ("use cache")
    ├── [domain]-query.ts     # GET operations (public or authenticated)
    ├── [domain]-mutation.ts  # POST/PUT/DELETE (delegates to actions)
    └── [domain]-action.ts    # Server actions with .actionable()

app/api/orpc/[...segments]/
└── route.ts             # Next.js route handler (1 line)
```

---

## Smart client (`lib/orpc.ts`)

A single import `oRPC` works everywhere:

```ts
import oRPC from "@lib/orpc";

// Server component → direct call (no HTTP, uses globalThis.$client)
const fruits = await oRPC.fruit.findMany({ take: 10 });

// Client component → HTTP call (RPCLink → /api/orpc)
const fruits = await oRPC.fruit.findMany({ take: 10 });
```

How it works:

- `lib/orpc-server.ts` sets `globalThis.$client` via `createRouterClient(apiRouter)` — available server-side only
- `lib/orpc.ts` checks: if `globalThis.$client` exists (server), use it directly. Otherwise (client), create an HTTP client via `RPCLink`

```ts
const oRPC: RouterClient<ApiRouter> = globalThis.$client ?? createORPCClient(link);
```

---

## Router (`api/router.ts`)

Aggregates queries and mutations per domain:

```ts
export const apiRouter = {
    user: { ...userQueries, ...userMutations },
    fruit: { ...fruitQueries, ...fruitMutations },
    basket: { ...basketQueries },
};

export type ApiRouter = typeof apiRouter;
```

---

## Defining routes

### Queries (GET, cached)

Each query defines an OpenAPI route, Zod input/output, and delegates to a cached function:

```ts
const findMany = os
    .route({
        method: "GET",
        path: "/fruits",
        summary: "FRUIT Find Many",
        description: "Permission: public",
    })
    .input(z.object({
        searchByName: z.string().optional(),
        orderByName: z.enum(Prisma.SortOrder).optional(),
        take: z.number().min(1).max(1000).optional(),
        skip: z.number().min(0).optional(),
        cacheTags: z.array(z.string()).optional(),
    }).optional())
    .output(z.array(fruitOutputSchema))
    .handler(async ({ input }) => {
        return await fruitFindManyCached(
            { take: input?.take, skip: input?.skip, ... },
            [tag("fruit"), tag("fruit", "findMany"), tag("fruit", "findMany", input)],
        );
    });
```

### Cached functions (`"use cache"`)

Wrap Prisma operations with Next.js Cache Components:

```ts
const fruitFindManyCached = async (props, tags: string[]) => {
    "use cache";
    cacheTag(...tags);
    cacheLife("hours");
    return await PrismaInstance.fruit.findMany(props);
};
```

### Mutations (POST/PUT/DELETE)

Mutations are thin wrappers that delegate to server actions:

```ts
export const create = os
    .route({ method: "POST", path: "/fruits", summary: "FRUIT Create" })
    .input(fruitCreateInputSchema)
    .output(fruitOutputSchema)
    .handler(async ({ input }) => {
        const [error, data] = await fruitCreate(input);
        if (error) throw error;
        return data;
    });
```

### Server actions (`.actionable()`)

The actual business logic. Uses `"use server"` + `.actionable()` to expose as a Next.js Server Action:

```ts
"use server";

export const fruitCreate = os
    .input(fruitCreateInputSchema)
    .output(fruitOutputSchema)
    .use(requiresSession)
    .handler(async ({ input, context }) => {
        const { session } = context;

        const fruit = await PrismaInstance.fruit.create({
            data: { name: input.name, description: input.description, userId: session.user.id },
        });

        // Invalidate caches
        revalidateTag(tag("fruit"), { expire: 0 });
        revalidateTag(tag("fruit", "findMany"), { expire: 0 });

        // Caller-provided invalidation
        input.updateTags?.map((t) => revalidateTag(t, { expire: 0 }));
        input.revalidateTags?.map((t) => revalidateTag(t, "max"));
        input.revalidatePaths?.map((p) => revalidatePath(p));

        return fruit;
    })
    .actionable();
```

---

## Permissions (`api/permission.ts`)

Middleware that injects session context and permission helpers:

```ts
const requiresSession = os.middleware(async ({ next }) => {
    const session = await getSession();
    if (!session) throw new NextResponse("Unauthorized", { status: 401 });

    const isAdmin = session.user.role === "ADMIN";
    const isOwner = (userToCheck: string) => session.user.id === userToCheck;
    const isOwnerOrAdmin = (userToCheck: string) => isAdmin || isOwner(userToCheck);

    return next({ context: { session, isAdmin, isOwner, isOwnerOrAdmin } });
});
```

Usage in handlers:

```ts
const findUnique = os.use(requiresSession).handler(async ({ input, context }) => {
    if (!context.isOwnerOrAdmin(input.id)) unauthorized();
    return user;
});
```

---

## Cache strategy (`api/cache.ts`)

### Tag generation

Tags are typed by Prisma model and operation:

```ts
tag("fruit"); // "fruit"
tag("fruit", "findMany"); // "fruit-findMany"
tag("fruit", "findMany", input); // "fruit-findMany-{sorted-input}"
tag("fruit", "findUnique", "abc"); // "fruit-findUnique-abc"
```

### Invalidation patterns

```ts
// Immediate invalidation
revalidateTag(tag("fruit", "findMany"), { expire: 0 });

// Stale-while-revalidate
revalidateTag(tag("fruit", "findMany"), "max");

// Path refresh
revalidatePath("/fruits");
```

### Caller-provided invalidation

Schemas include optional invalidation fields so callers can control cache:

```ts
const fruitCreateInputSchema = z.object({
    name: z.string(),
    description: z.string(),
    updateTags: z.array(z.string()).optional(), // expire: 0
    revalidateTags: z.array(z.string()).optional(), // stale-while-revalidate
    revalidatePaths: z.array(z.string()).optional(), // path refresh
});
```

---

## Zod schemas (`[domain]-schema.ts`)

Shared between queries, mutations, and actions. Used for runtime validation AND OpenAPI spec generation:

```ts
const fruitOutputSchema: ZodType<Fruit> = z.object({
    id: z.string().describe("Unique ID (nanoid)"),
    name: z.string().describe("Name of the fruit"),
    description: z.string().describe("Description"),
    userId: z.string().describe("Creator user ID"),
    createdAt: z.date().describe("Creation date"),
    updatedAt: z.date().describe("Last update date"),
});
```

`.describe()` annotations flow into the OpenAPI spec automatically.

---

## Client-side: `useFetch` hook (`lib/orpc-hook.ts`)

Custom hook for client-side data fetching, inspired by TanStack Query:

```ts
const { data, isFetching, error, refetch, setDataBypass } = useFetch({
    client: oRPC.fruit.findMany, // oRPC method
    args: { take: 10, skip: 0 }, // Request arguments
    keys: [page, search], // Re-fetch when keys change
    initialData, // SSR hydration data
    debounce: 250, // Delay before re-fetch (ms)
    fetchOnFirstRender: false, // Skip first render (SSR default)
});
```

### Props

| Prop                 | Required | Default | Purpose                                           |
| -------------------- | -------- | ------- | ------------------------------------------------- |
| `client`             | Yes      | —       | oRPC method (e.g. `oRPC.fruit.findMany`)          |
| `args`               | No       | —       | Arguments passed to the client method             |
| `keys`               | Yes      | —       | Re-fetch triggers (like query keys)               |
| `initialData`        | No       | —       | Server-rendered data for hydration                |
| `debounce`           | No       | `0`     | Delay in ms before fetching (useful for search)   |
| `fetchOnFirstRender` | No       | `false` | If false, skip fetch on mount (use `initialData`) |

### Return values

| Value           | Type                          | Purpose                                |
| --------------- | ----------------------------- | -------------------------------------- |
| `data`          | `T \| undefined`              | Fetched data                           |
| `isFetching`    | `boolean`                     | Loading state                          |
| `error`         | `string \| undefined`         | Error message                          |
| `refetch`       | `(offsetTime?) => void`       | Manually trigger a re-fetch            |
| `setDataBypass` | `Dispatch<SetStateAction<T>>` | Set data without fetching (optimistic) |

### Features

- **AbortController** — cancels stale requests when keys change
- **Debounce** — delays re-fetch for search inputs
- **SSR hydration** — `initialData` prevents flash on first render
- **Dev logging** — logs args and keys in development
- **Refetch** — manual trigger with optional delay

### Example: paginated list with search

```tsx
"use client";

import oRPC from "@lib/orpc";
import { useFetch } from "@lib/orpc-hook";

export default function FruitsGrid({ initialData, initialTotalCount }) {
    const { order, page, search } = useQueryParams();

    const { data: fruits, isFetching } = useFetch({
        client: oRPC.fruit.findMany,
        args: {
            searchByName: search || undefined,
            orderByName: order,
            take: ITEMS_PER_PAGE,
            skip: (page - 1) * ITEMS_PER_PAGE,
        },
        keys: [order, page, search],
        initialData,
        debounce: 250,
    });

    if (isFetching) return <Skeleton />;

    return fruits?.map((fruit) => <FruitCard key={fruit.id} fruit={fruit} />);
}
```

### Example: async combobox

```tsx
"use client";

export default function ComboboxAsyncDemo() {
    const [search, setSearch] = useState("");

    const { data, isFetching } = useFetch({
        client: oRPC.fruit.findMany,
        args: { searchByName: search || undefined, take: 10 },
        keys: [search],
        fetchOnFirstRender: true, // No SSR data, fetch immediately
        debounce: 250,
    });

    return <ComboboxAsync items={data?.map((f) => f.name) ?? []} isFetching={isFetching} onSearchChange={setSearch} />;
}
```

---

## Server-side: direct calls

In server components and pages, `oRPC` calls go directly to the router (no HTTP):

```tsx
// app/fruit/[id]/page.tsx
"use cache";

export async function generateMetadata({ params }): Promise<Metadata> {
    const { id } = await params;
    const fruit = await oRPC.fruit.findUnique({ id });
    return { title: fruit?.name ?? "Fruit" };
}

export default async function Page({ params }) {
    const { id } = await params;
    return (
        <Suspense fallback={<Skeleton />}>
            <FruitDetail id={id} />
        </Suspense>
    );
}
```

---

## OpenAPI & Scalar

Auto-generated from Zod schemas. Available at `/api/orpc/` (Scalar UI) and `/api/orpc/spec.json` (OpenAPI spec).

Configuration in `lib/orpc-handler.ts`:

```ts
new OpenAPIReferencePlugin({
    docsProvider: "scalar",
    docsPath: "/",
    specPath: "/spec.json",
    schemaConverters: [new ZodToJsonSchemaConverter()],
});
```

`.route()` metadata (`method`, `path`, `summary`, `description`) and `.describe()` on Zod fields flow directly into the spec.

---

## File structure per domain

```
api/[domain]/
├── [domain]-schema.ts    # Zod schemas (input + output)
├── [domain]-cached.ts    # "use cache" wrapped Prisma queries
├── [domain]-query.ts     # GET routes → cached functions
├── [domain]-mutation.ts  # POST/PUT/DELETE routes → actions
└── [domain]-action.ts    # "use server" + .actionable() handlers
```

### Flow summary

```
Client component                    Server component
────────────────                    ────────────────
useFetch({ client: oRPC.x })       await oRPC.x()
  │                                   │
  ▼ HTTP (RPCLink)                    ▼ Direct call (globalThis.$client)
  │                                   │
  └──────────┬────────────────────────┘
             ▼
         api/router.ts
             │
     ┌───────┼───────┐
     ▼       ▼       ▼
  query   mutation  action
     │       │       │
     ▼       ▼       ▼
  cached   action  Prisma + revalidate
     │       │
     ▼       ▼
   Prisma  Prisma
```
