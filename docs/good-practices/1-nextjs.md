# Next.js

## Page Architecture

- Each `page.tsx` is a Server Component
- The page contains other Server Components or Client Components

## Auth Guards

Layouts don't re-render when navigating between sibling pages — Next.js reuses the cached layout and only renders the new page. Auth checks in layouts are therefore unreliable: they only run on first load, not on subsequent navigations.

**Always place auth guards in `page.tsx`**, not in `layout.tsx`.

```tsx
// page.tsx — correct
export default async function Page() {
    await assertDevAccess();
    return <Main>...</Main>;
}
```

A layout can also include the guard as a first line of defense, but it does not replace per-page checks.

## File Structure Per Page

Page-specific files are organized in `_`-prefixed folders at the same level as `page.tsx`.

Available folders: `_components`, `_context`, `_lib`, `_utils`

The `_` prefix marks these files as private to the route — Next.js will not expose them as routes.

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
