# Next.js

## Page Architecture

- Each `page.tsx` is a Server Component
- The page contains other Server Components or Client Components

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
