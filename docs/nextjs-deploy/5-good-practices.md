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
