# Components

## Single Component Per File

Each file contains a single component.

## Props Structure

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

## Atoms (Base-UI Components)

Shared types and helpers (e.g. `LegacyProps`, `BaseUiProps`, `buttonVariants`) live in `components/atoms/_core/`.

Each Base-UI component lives in `components/atoms/[component]/` with 3 files:

- `atoms.tsx` — Styled wrappers around Base-UI sub-components (named exports)
- `[component].tsx` — `"use client"` composable component with conditional children (default export)
- `index.ts` — Re-exports: `export { default } from "./[component]"` + `export * from "./atoms"`

**Import pattern** — Always import via the `index.ts` barrel:

```tsx
// Default = composable component, named = individual atoms
import Popover, { Arrow, Popup, Portal, Positioner, Title, Trigger } from "@atoms/popover";
```

See `docs/good-practices/10-base-ui.md` for the full guide (patterns, typing, step-by-step, component inventory).

## JSX — Avoid Complex Conditions

Avoid complex conditions in JSX. Prefer assigning a constant in JS, then use it in JSX.

```tsx
// Bad
{
    session?.user.role === "ADMIN" && <Button />;
}

// Good
const isAdmin = session?.user.role === "ADMIN";

return <div>{isAdmin && <Button />}</div>;
```
