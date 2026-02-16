# Import Base-UI Component

Reference: https://base-ui.com/react/components
Model component: `alert-dialog/`

---

## Patterns

### Standard pattern (this guide)

Faithful wrappers around Base-UI sub-components. Styles copied from the docs, props split into explicit + legacy + BaseUI-specific.

Components: `alert-dialog`, `dialog`, `collapsible`, `tabs`, `switch`, `drawer`, `tooltip`, `slider`, `combobox`.

### Project-specific overrides (not covered)

Custom API with transformed props, renamed callbacks, discriminated unions, project logic (FormContext, variant system, etc.). These are case-by-case.

Components: `select`, `menu`, `toast`, `button`, `input`, `form/field`.

See [INVENTORY.md](./INVENTORY.md) for the full per-atom typing breakdown of every component.

---

## File structure

```
components/atoms/
├── types.ts                   # Shared utility types (LegacyProps, BaseUiProps, etc.)
└── [component]/
    ├── atoms.tsx              # Styled Base-UI wrappers (shared across variants)
    ├── [component].tsx        # "use client" + conditional children (main variant)
    ├── [component]-[variant].tsx  # Additional variant (optional, e.g. select-multiple.tsx)
    ├── utils.tsx              # Shared helpers (optional, e.g. renderValue for select)
    └── index.ts               # export { default } + export * from "./atoms" + optional utils
```

**Examples of variants:**

- `select/` → `select.tsx` + `select-multiple.tsx` (share `atoms.tsx`)
- `input/` → `input.tsx` + `input-password.tsx` + `input-otp.tsx` + `text-area.tsx` (share `atoms.tsx`)

**Examples of utils:**

- `select/utils.tsx` → `renderValue()` formatting helpers
- `toast/utils.tsx` → `useToast` hook re-export

---

## Utility types (`types.ts`)

| Type                 | Purpose                                                           |
| -------------------- | ----------------------------------------------------------------- |
| `StandardAttributes` | `HTMLAttributes<HTMLElement>` — for div, heading, paragraph atoms |
| `ButtonAttributes`   | `ButtonHTMLAttributes<HTMLButtonElement>` — for button atoms      |
| `LegacyProps<T, K>`  | All native props except `className`, `children`, and keys in `K`  |
| `BaseUiProps<C, T>`  | `ComponentProps<C>` minus `keyof T` — only BaseUI-specific props  |

---

## Atom categories

Every atom falls into one of 3 categories based on what it renders:

### Behavior-only (Root, Portal)

No HTML element, no autocomplete noise. Full `ComponentProps` spread.

```tsx
export type AlertDialogProps = {
    children?: ReactNode;
} & ComponentProps<typeof AlertDialogBaseUi.Root>;

export const Root = (props: AlertDialogProps) => {
    const { children, ...otherProps } = props;

    return <AlertDialogBaseUi.Root {...otherProps}>{children}</AlertDialogBaseUi.Root>;
};
```

### Button atom (Trigger, Close)

Renders `<button>`. Explicit props for common usage + `LegacyProps` escape hatch + `BaseUiProps` for BaseUI-specific props (e.g. `render`).

```tsx
type AlertDialogTriggerProps = {
    className?: string;
    children?: ReactNode;

    // Event props
    onClick?: MouseEventHandler<HTMLButtonElement>;

    // Legacy props
    legacyProps?: LegacyProps<ButtonAttributes, "onClick">;
} & BaseUiProps<typeof AlertDialogBaseUi.Trigger, ButtonAttributes>;

export const Trigger = (props: AlertDialogTriggerProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <AlertDialogBaseUi.Trigger className={cn("...", className)} {...legacyProps} {...otherProps}>
            {children}
        </AlertDialogBaseUi.Trigger>
    );
};
```

- `className`, `children`, `onClick` → clean autocomplete
- `onClick` flows through `...otherProps` (no need to destructure separately)
- `legacyProps` → aria-\*, id, style, tabIndex, disabled, etc.
- `BaseUiProps` → `render` and other BaseUI-specific props via `...otherProps`

### Container atom (Backdrop, Popup, Title, Description)

Renders `<div>`, `<h2>`, `<p>`, etc. Same pattern but with `StandardAttributes`.

```tsx
type AlertDialogPopupProps = {
    className?: string;
    children?: ReactNode;

    // Legacy props
    legacyProps?: LegacyProps<StandardAttributes>;
} & BaseUiProps<typeof AlertDialogBaseUi.Popup, StandardAttributes>;

export const Popup = (props: AlertDialogPopupProps) => {
    const { className, children, legacyProps, ...otherProps } = props;

    return (
        <AlertDialogBaseUi.Popup className={cn("...", className)} {...legacyProps} {...otherProps}>
            {children}
        </AlertDialogBaseUi.Popup>
    );
};
```

---

## Step-by-step

### 1. Copy the Tailwind example

Go to `https://base-ui.com/react/components/[component]` and copy the **Tailwind CSS** hero example.

### 2. Create `atoms.tsx`

One named export per Base-UI sub-component. Import pattern:

```tsx
import { BaseUiProps, ButtonAttributes, LegacyProps, StandardAttributes } from "@atoms/types";
import { AlertDialog as AlertDialogBaseUi } from "@base-ui/react/alert-dialog";
import cn from "@lib/cn";
import { ComponentProps, MouseEventHandler, ReactNode } from "react";
```

### 3. Type each atom

Identify the category (behavior-only / button / container) and apply the corresponding pattern from the section above. Add explicit props for commonly used native attributes (e.g. `onClick` on buttons).

### 4. Organize `cn()` classes

Sort classes by category with comments:

```tsx
className={cn(
    // Layout      — position, display, flex, size, spacing
    // Border      — rounded, border, outline
    // Background  — bg-*
    // Text        — text-*, font-*, select-none
    // Shadow      — shadow-*
    // Animation   — transition, duration, data-*-style
    // State       — hover, active, focus-visible, disabled
    // Overrides   — className (always last)
)}
```

### 5. Theme substitutions

Replace Base-UI doc classes with theme tokens:

| Base-UI docs                 | Theme token        |
| ---------------------------- | ------------------ |
| `bg-gray-50` / `bg-[canvas]` | `bg-background`    |
| `text-gray-900`              | `text-foreground`  |
| `text-red-800`               | `text-destructive` |
| `outline-blue-800`           | `outline-outline`  |

**Exceptions** (keep as-is):

- `bg-black` — overlays (Backdrop)
- `dark:opacity-70` — dark mode opacity adjustment
- `dark:outline-gray-300` — dark mode border adjustment
- `gray-*` classes (100–800) — already adaptive via `globals.css`

Use `ide getDiagnostics` after writing classes to detect deprecated Tailwind classes and convert them to modern equivalents.

### 6. Focus outline offset

Focus outlines must sit **outside** the border (like `input/atoms.tsx`). Use `outline-offset-0`, never `-outline-offset-1`:

```tsx
// Correct — outline outside the border
"focus-visible:outline-outline focus-visible:outline-2 focus-visible:outline-offset-0";
"focus:outline-outline focus:outline-2 focus:outline-offset-0";
"focus-within:outline-outline focus-within:outline-2 focus-within:outline-offset-0";

// Wrong — outline inside the border
"focus-visible:outline-2 focus-visible:-outline-offset-1";
```

This applies to all focus variants (`focus:`, `focus-visible:`, `focus-within:`, `has-[:focus-visible]:`, `before:` pseudo-elements).

> Note: `dark:-outline-offset-1` on Popup containers is a static border style, not a focus ring — this is fine.

### 7. Tailwind v4 migration

Convert v3 syntax from Base-UI docs to v4:

| v3 (Base-UI docs)                               | v4                             |
| ----------------------------------------------- | ------------------------------ |
| `data-[ending-style]:opacity-0`                 | `data-ending-style:opacity-0`  |
| `data-[starting-style]:scale-90`                | `data-starting-style:scale-90` |
| `outline outline-1`                             | `outline-1`                    |
| `focus-visible:outline focus-visible:outline-2` | `focus-visible:outline-2`      |

### 8. Replace SVG icons

Base-UI examples define inline SVG components (e.g. `CheckIcon`, `ChevronDownIcon`). Replace them with Lucide React imports:

```tsx
// Before (Base-UI example)
function CheckIcon(props: React.ComponentProps<'svg'>) { ... }

// After
import { Check, ChevronDown } from "lucide-react";
```

### 9. Create `[component].tsx`

Pattern: `"use client"` + conditional children.

```tsx
"use client";

import { AlertDialogProps, Backdrop, Close, Description, Popup, Portal, Root, Title, Trigger } from "./atoms";

export default function AlertDialog(props: AlertDialogProps) {
    const { children, ...otherProps } = props;

    // Composable usage
    if (children) {
        return <Root {...otherProps}>{children}</Root>;
    }

    // Composable demo
    return (
        <Root {...otherProps}>
            <Trigger>Discard draft</Trigger>
            <Portal>
                <Backdrop />
                <Popup>
                    <Title>Discard draft?</Title>
                    <Description>You can&apos;t undo this action.</Description>
                    <div className="flex justify-end gap-4">
                        <Close>Cancel</Close>
                        <Close className="text-destructive">Discard</Close>
                    </div>
                </Popup>
            </Portal>
        </Root>
    );
}
```

### 10. Create `index.ts`

```tsx
export { default } from "./alert-dialog";
export * from "./atoms";
```

### 11. Verify

```bash
pnpm checks
```

---

## Usage

```tsx
import AlertDialog, { Backdrop, Close, Description, Popup, Portal, Title } from "@atoms/alert-dialog";

<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
    <Portal>
        <Backdrop />
        <Popup>
            <Title>My title</Title>
            <Description>My description</Description>
            <div className="flex justify-end gap-4">
                <Close>Cancel</Close>
                <Close className="text-destructive">Confirm</Close>
            </div>
        </Popup>
    </Portal>
</AlertDialog>;
```
